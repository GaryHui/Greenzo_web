from __future__ import annotations

from dataclasses import dataclass
from datetime import date
import json
from pathlib import Path
import re
import shutil
import subprocess
from typing import Dict, List

from deep_translator import GoogleTranslator
from opencc import OpenCC


LANGS = ("zh", "hk", "en", "ja")
LINK_LABEL = {
    "zh": "官方来源（点击查看）",
    "hk": "官方來源（點擊查看）",
    "en": "Official Source (Click To View)",
    "ja": "公式ソース（クリックして表示）",
}


class EditorError(Exception):
    pass


def _ensure_http_or_root_path(url: str) -> str:
    value = url.strip()
    if not value:
        raise EditorError("链接不能为空。")
    if value.startswith("http://") or value.startswith("https://") or value.startswith("/"):
        return value
    raise EditorError("链接格式不正确，仅支持 http(s):// 或 / 开头路径。")


TEXT_EXTENSIONS = {
    ".md",
    ".txt",
    ".json",
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".css",
    ".scss",
    ".html",
    ".yml",
    ".yaml",
}

IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif", ".svg"}


@dataclass
class ArticleInput:
    project_root: Path
    slug: str
    title_zh: str
    summary_zh: str
    markdown_zh: str
    published_at: str


def normalize_slug(text: str) -> str:
    slug = text.strip().lower()
    slug = re.sub(r"\s+", "-", slug)
    slug = re.sub(r"[^a-z0-9\-]", "-", slug)
    slug = re.sub(r"-{2,}", "-", slug).strip("-")
    if not slug:
        raise EditorError("Slug 不能为空，且需包含英文字母或数字。")
    return slug


def default_project_root(tools_dir: Path) -> Path:
    candidate = tools_dir.parents[1] / "greenzo---premium-incontinence-care"
    return candidate.resolve()


def validate_project_root(project_root: Path) -> None:
    if not project_root.exists():
        raise EditorError(f"项目路径不存在: {project_root}")
    marker = project_root / "src" / "content" / "articles.ts"
    if not marker.exists():
        raise EditorError("未找到 src/content/articles.ts，请确认项目路径。")


def _translate_text(text: str, source: str, target: str) -> str:
    if not text.strip():
        return text
    translator = GoogleTranslator(source=source, target=target)
    translated = translator.translate(text)
    if not translated:
        return text
    return translated


def _convert_simplified_to_traditional(markdown_zh: str) -> str:
    converter = OpenCC("s2t")
    return converter.convert(markdown_zh)


def _ensure_text(value: object, fallback: str) -> str:
    if isinstance(value, str) and value.strip():
        return value.strip()
    return fallback


def _ts_str(value: str) -> str:
    # Always emit deterministic ASCII-safe TS string literals.
    return json.dumps(value, ensure_ascii=True)


def _normalize_url(url: str) -> str:
    return re.sub(r"\s+", "", url.strip())


def _safe_asset_filename(original_name: str, index: int) -> str:
    ext = Path(original_name).suffix.lower()
    if ext not in {".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"}:
        ext = ".png"
    return f"img-{index:03d}{ext}"


def _safe_relpath(project_root: Path, rel_path_text: str) -> Path:
    rel_path = Path(rel_path_text.strip().replace("\\", "/"))
    abs_path = (project_root / rel_path).resolve()
    root = project_root.resolve()
    try:
        abs_path.relative_to(root)
    except ValueError as exc:
        raise EditorError(f"路径越界，不允许访问项目外文件: {rel_path_text}") from exc
    return abs_path


def _mask_urls(markdown: str, lang: str) -> str:
    label = LINK_LABEL.get(lang, LINK_LABEL["en"])
    lines = markdown.splitlines()
    out: List[str] = []

    for line in lines:
        current = line

        if re.search(r"\[[^\]]+\]\((https?://[^)]+)\)", current):
            out.append(current)
            continue

        def replace_angle_url(match: re.Match[str]) -> str:
            url = _normalize_url(match.group(1))
            return f"[{label}]({url})"

        current = re.sub(r"<(https?://[^>]+)>", replace_angle_url, current)

        def replace_plain_url(match: re.Match[str]) -> str:
            url = _normalize_url(match.group(1))
            return f"[{label}]({url})"

        current = re.sub(r"(?<!\()(?<!\[)(https?://[^\s)]+)", replace_plain_url, current)
        out.append(current)

    return "\n".join(out)


def _protect_markdown_image_lines(content: str) -> tuple[str, Dict[str, str]]:
    token_map: Dict[str, str] = {}
    lines = content.splitlines()
    protected: List[str] = []
    counter = 0
    for line in lines:
        if re.fullmatch(r"\s*!\[[^\]]*\]\((https?://[^)\s]+|/[^)\s]+)\)\s*", line):
            counter += 1
            token = f"__GREENZO_IMG_{counter}__"
            token_map[token] = line
            protected.append(token)
        else:
            protected.append(line)
    return "\n".join(protected), token_map


def _restore_protected_tokens(content: str, token_map: Dict[str, str]) -> str:
    restored = content
    for token, line in token_map.items():
        restored = restored.replace(token, line)
    return restored


def translate_article_fields(title_zh: str, summary_zh: str) -> Dict[str, Dict[str, str]]:
    title_zh = title_zh.strip()
    summary_zh = summary_zh.strip()
    if not title_zh or not summary_zh:
        raise EditorError("中文标题和中文摘要不能为空。")

    title_hk = _ensure_text(_translate_text(title_zh, "zh-CN", "zh-TW"), title_zh)
    title_en = _ensure_text(_translate_text(title_zh, "zh-CN", "en"), title_zh)
    title_ja = _ensure_text(_translate_text(title_zh, "zh-CN", "ja"), title_zh)

    summary_hk = _ensure_text(_translate_text(summary_zh, "zh-CN", "zh-TW"), summary_zh)
    summary_en = _ensure_text(_translate_text(summary_zh, "zh-CN", "en"), summary_zh)
    summary_ja = _ensure_text(_translate_text(summary_zh, "zh-CN", "ja"), summary_zh)

    return {
        "title": {"zh": title_zh, "hk": title_hk, "en": title_en, "ja": title_ja},
        "summary": {"zh": summary_zh, "hk": summary_hk, "en": summary_en, "ja": summary_ja},
    }


def translate_markdown(markdown_zh: str) -> Dict[str, str]:
    content = markdown_zh.strip()
    if not content:
        raise EditorError("正文不能为空。")

    protected, token_map = _protect_markdown_image_lines(content)

    markdown_hk = _ensure_text(_convert_simplified_to_traditional(protected), protected)
    markdown_en = _ensure_text(_translate_text(protected, "zh-CN", "en"), protected)
    markdown_ja = _ensure_text(_translate_text(protected, "zh-CN", "ja"), protected)

    markdown_hk = _restore_protected_tokens(markdown_hk, token_map)
    markdown_en = _restore_protected_tokens(markdown_en, token_map)
    markdown_ja = _restore_protected_tokens(markdown_ja, token_map)

    zh_masked = _mask_urls(content, "zh")
    hk_masked = _mask_urls(markdown_hk.strip(), "hk")
    en_masked = _mask_urls(markdown_en.strip(), "en")
    ja_masked = _mask_urls(markdown_ja.strip(), "ja")

    return {
        "zh": zh_masked + "\n",
        "hk": hk_masked + "\n",
        "en": en_masked + "\n",
        "ja": ja_masked + "\n",
    }


def write_markdown_files(article: ArticleInput, markdown_by_lang: Dict[str, str]) -> List[Path]:
    articles_dir = article.project_root / "src" / "content" / "articles"
    articles_dir.mkdir(parents=True, exist_ok=True)

    written_files: List[Path] = []
    for lang in LANGS:
        body = markdown_by_lang.get(lang, "").strip()
        if not body:
            raise EditorError(f"{lang} 语言正文为空，无法写入。")
        file_path = articles_dir / f"{article.slug}.{lang}.md"
        file_path.write_text(body + "\n", encoding="utf-8")
        written_files.append(file_path)

    return written_files


def copy_article_images_to_public(
    project_root: Path,
    slug_text: str,
    selected_images: List[Path],
) -> List[str]:
    validate_project_root(project_root)
    slug = normalize_slug(slug_text)
    if not selected_images:
        raise EditorError("未选择任何图片。")

    target_dir = project_root / "public" / "article-media" / slug
    target_dir.mkdir(parents=True, exist_ok=True)

    copied_urls: List[str] = []
    for idx, src_path in enumerate(selected_images, start=1):
        if not src_path.exists():
            raise EditorError(f"图片不存在: {src_path}")
        dst_name = _safe_asset_filename(src_path.name, idx)
        dst_path = target_dir / dst_name
        while dst_path.exists():
            idx += 1
            dst_name = _safe_asset_filename(src_path.name, idx)
            dst_path = target_dir / dst_name
        shutil.copy2(src_path, dst_path)
        copied_urls.append(f"/article-media/{slug}/{dst_name}")
    return copied_urls


def _slug_to_import_base(slug: str) -> str:
    pieces = [p for p in slug.split("-") if p]
    if not pieces:
        raise EditorError("无效 slug，无法生成变量名。")
    first = pieces[0]
    rest = "".join(p.capitalize() for p in pieces[1:])
    return f"{first}{rest}"


def update_articles_index(
    article: ArticleInput,
    translated_fields: Dict[str, Dict[str, str]],
    upsert: bool = True,
) -> Path:
    index_path = article.project_root / "src" / "content" / "articles.ts"
    text = index_path.read_text(encoding="utf-8")

    slug = article.slug
    if not upsert and f"slug: '{slug}'" in text:
        raise EditorError(f"articles.ts 已存在 slug: {slug}")

    import_base = _slug_to_import_base(slug)
    import_block = (
        f"import {import_base}Zh from './articles/{slug}.zh.md?raw';\n"
        f"import {import_base}Hk from './articles/{slug}.hk.md?raw';\n"
        f"import {import_base}En from './articles/{slug}.en.md?raw';\n"
        f"import {import_base}Ja from './articles/{slug}.ja.md?raw';\n"
    )

    # Remove old imports for the same slug to keep imports idempotent.
    text = re.sub(
        rf"\nimport {re.escape(import_base)}Zh from '\./articles/{re.escape(slug)}\.zh\.md\?raw';"
        rf"\nimport {re.escape(import_base)}Hk from '\./articles/{re.escape(slug)}\.hk\.md\?raw';"
        rf"\nimport {re.escape(import_base)}En from '\./articles/{re.escape(slug)}\.en\.md\?raw';"
        rf"\nimport {re.escape(import_base)}Ja from '\./articles/{re.escape(slug)}\.ja\.md\?raw';\n",
        "\n",
        text,
        flags=re.S,
    )

    insert_anchor = "export type KnowledgeArticle = {"
    if insert_anchor not in text:
        raise EditorError("articles.ts 结构异常：未找到类型定义锚点。")
    text = text.replace(insert_anchor, import_block + "\n" + insert_anchor, 1)

    title = translated_fields["title"]
    summary = translated_fields["summary"]
    article_block = (
        "  {\n"
        f"    slug: '{slug}',\n"
        "    title: {\n"
        f"      zh: {_ts_str(_ensure_text(title.get('zh'), article.title_zh))},\n"
        f"      hk: {_ts_str(_ensure_text(title.get('hk'), article.title_zh))},\n"
        f"      en: {_ts_str(_ensure_text(title.get('en'), article.title_zh))},\n"
        f"      ja: {_ts_str(_ensure_text(title.get('ja'), article.title_zh))},\n"
        "    },\n"
        "    summary: {\n"
        f"      zh: {_ts_str(_ensure_text(summary.get('zh'), article.summary_zh))},\n"
        f"      hk: {_ts_str(_ensure_text(summary.get('hk'), article.summary_zh))},\n"
        f"      en: {_ts_str(_ensure_text(summary.get('en'), article.summary_zh))},\n"
        f"      ja: {_ts_str(_ensure_text(summary.get('ja'), article.summary_zh))},\n"
        "    },\n"
        "    markdown: {\n"
        f"      zh: {import_base}Zh,\n"
        f"      hk: {import_base}Hk,\n"
        f"      en: {import_base}En,\n"
        f"      ja: {import_base}Ja,\n"
        "    },\n"
        f"    publishedAt: '{article.published_at}',\n"
        "  },\n"
    )

    # Remove old article block with same slug before writing the new one.
    text = re.sub(
        rf"\n  \{{\n    slug: '{re.escape(slug)}',[\s\S]*?\n  \}},\n",
        "\n",
        text,
        flags=re.S,
    )

    array_end = "\n];"
    idx = text.rfind(array_end)
    if idx == -1:
        raise EditorError("articles.ts 结构异常：未找到文章数组结束位置。")
    text = text[:idx] + article_block + text[idx:]

    index_path.write_text(text, encoding="utf-8")
    return index_path


def run_git_commit_push(
    project_root: Path,
    files_to_add: List[Path],
    commit_message: str,
    push_remote: str = "origin",
    push_branch: str = "main",
) -> str:
    if not commit_message.strip():
        raise EditorError("提交信息不能为空。")

    rel_files = [str(path.resolve().relative_to(project_root.resolve())) for path in files_to_add]
    if not rel_files:
        raise EditorError("没有可提交文件。")

    logs: List[str] = []
    for cmd in (
        ["git", "add", *rel_files],
        ["git", "commit", "-m", commit_message.strip()],
        ["git", "push", push_remote, push_branch],
    ):
        result = subprocess.run(
            cmd,
            cwd=str(project_root),
            capture_output=True,
            text=True,
            check=False,
            encoding="utf-8",
            errors="replace",
        )
        logs.append(f"$ {' '.join(cmd)}\n{result.stdout}{result.stderr}".strip())
        if result.returncode != 0:
            raise EditorError("\n\n".join(logs))

    return "\n\n".join(logs)


def run_git_commit_all_push(
    project_root: Path,
    commit_message: str,
    push_remote: str = "origin",
    push_branch: str = "main",
) -> str:
    if not commit_message.strip():
        raise EditorError("提交信息不能为空。")

    logs: List[str] = []
    for cmd in (
        ["git", "add", "-A"],
        ["git", "commit", "-m", commit_message.strip()],
        ["git", "push", push_remote, push_branch],
    ):
        result = subprocess.run(
            cmd,
            cwd=str(project_root),
            capture_output=True,
            text=True,
            check=False,
            encoding="utf-8",
            errors="replace",
        )
        logs.append(f"$ {' '.join(cmd)}\n{result.stdout}{result.stderr}".strip())
        if result.returncode != 0:
            raise EditorError("\n\n".join(logs))
    return "\n\n".join(logs)


def collect_existing_article_files(project_root: Path, slug_text: str) -> List[Path]:
    validate_project_root(project_root)
    slug = normalize_slug(slug_text)

    files: List[Path] = []
    articles_dir = project_root / "src" / "content" / "articles"
    for lang in LANGS:
        path = articles_dir / f"{slug}.{lang}.md"
        if not path.exists():
            raise EditorError(f"未找到已生成文件: {path}")
        files.append(path)

    index_path = project_root / "src" / "content" / "articles.ts"
    index_text = index_path.read_text(encoding="utf-8")
    if f"slug: '{slug}'" in index_text:
        files.append(index_path)

    image_dir = project_root / "public" / "article-media" / slug
    if image_dir.exists():
        for path in sorted(image_dir.glob("*")):
            if path.is_file():
                files.append(path)

    return files


def _read_json_file(path: Path, fallback):
    if not path.exists():
        return fallback
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        raise EditorError(f"JSON 解析失败: {path}\n{exc}") from exc


def _write_json_file(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def update_home_visual_image_link(project_root: Path, link: str, action: str) -> Path:
    validate_project_root(project_root)
    value = _ensure_http_or_root_path(link)
    file_path = project_root / "src" / "homeVisualMedia.json"
    data = _read_json_file(file_path, {"images": []})
    images = data.get("images")
    if not isinstance(images, list):
        images = []

    if action == "add":
        if value not in images:
            images.append(value)
    elif action == "remove":
        if value not in images:
            raise EditorError(f"图片链接不存在，无法删除: {value}")
        images = [x for x in images if x != value]
    else:
        raise EditorError(f"不支持的动作: {action}")

    data["images"] = images
    _write_json_file(file_path, data)
    return file_path


def update_home_visual_video_link(project_root: Path, link: str, action: str) -> Path:
    validate_project_root(project_root)
    value = _ensure_http_or_root_path(link)
    file_path = project_root / "src" / "videoList.json"
    data = _read_json_file(file_path, [])
    if not isinstance(data, list):
        raise EditorError("videoList.json 格式错误，应为数组。")

    items: List[Dict[str, str]] = []
    for item in data:
        if isinstance(item, dict) and isinstance(item.get("src"), str):
            items.append({"src": item["src"]})

    existing = [x["src"] for x in items]
    if action == "add":
        if value not in existing:
            items.append({"src": value})
    elif action == "remove":
        if value not in existing:
            raise EditorError(f"视频链接不存在，无法删除: {value}")
        items = [x for x in items if x["src"] != value]
    else:
        raise EditorError(f"不支持的动作: {action}")

    _write_json_file(file_path, items)
    return file_path


def build_article_input(
    project_root_text: str,
    slug_text: str,
    title_zh: str,
    summary_zh: str,
    markdown_zh: str,
    published_at: str,
) -> ArticleInput:
    project_root = Path(project_root_text).resolve()
    validate_project_root(project_root)

    slug = normalize_slug(slug_text)

    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", published_at.strip()):
        raise EditorError("发布日期格式必须为 YYYY-MM-DD。")

    return ArticleInput(
        project_root=project_root,
        slug=slug,
        title_zh=title_zh.strip(),
        summary_zh=summary_zh.strip(),
        markdown_zh=markdown_zh.strip(),
        published_at=published_at.strip() or date.today().isoformat(),
    )


def list_existing_article_slugs(project_root: Path) -> List[str]:
    validate_project_root(project_root)
    articles_dir = project_root / "src" / "content" / "articles"
    slugs: List[str] = []
    for path in sorted(articles_dir.glob("*.zh.md")):
        name = path.name
        if name.endswith(".zh.md"):
            slugs.append(name[:-6])
    return slugs


def _decode_ts_string(value: str) -> str:
    raw = value.strip()
    if raw.startswith("'") and raw.endswith("'") and len(raw) >= 2:
        raw = '"' + raw[1:-1].replace("\\'", "'").replace('"', '\\"') + '"'
    try:
        return json.loads(raw)
    except Exception:
        return value.strip().strip("'").strip('"')


def load_existing_article(project_root: Path, slug_text: str) -> Dict[str, str]:
    validate_project_root(project_root)
    slug = normalize_slug(slug_text)
    article_path = project_root / "src" / "content" / "articles" / f"{slug}.zh.md"
    if not article_path.exists():
        raise EditorError(f"未找到文章文件: {article_path}")

    markdown_zh = article_path.read_text(encoding="utf-8")
    title_zh = ""
    summary_zh = ""
    published_at = date.today().isoformat()

    index_path = project_root / "src" / "content" / "articles.ts"
    text = index_path.read_text(encoding="utf-8")
    block_match = re.search(
        rf"\{{\s*slug:\s*'{re.escape(slug)}',[\s\S]*?publishedAt:\s*'[^']+'\s*,\s*\}},",
        text,
        flags=re.S,
    )
    if block_match:
        block = block_match.group(0)
        title_match = re.search(
            r"title:\s*\{[\s\S]*?zh:\s*(\"(?:\\.|[^\"])*\"|'(?:\\.|[^'])*')",
            block,
            flags=re.S,
        )
        if title_match:
            title_zh = _decode_ts_string(title_match.group(1))
        summary_match = re.search(
            r"summary:\s*\{[\s\S]*?zh:\s*(\"(?:\\.|[^\"])*\"|'(?:\\.|[^'])*')",
            block,
            flags=re.S,
        )
        if summary_match:
            summary_zh = _decode_ts_string(summary_match.group(1))
        date_match = re.search(r"publishedAt:\s*'([^']+)'", block)
        if date_match:
            published_at = date_match.group(1).strip()

    return {
        "slug": slug,
        "title_zh": title_zh,
        "summary_zh": summary_zh,
        "published_at": published_at,
        "markdown_zh": markdown_zh,
    }


def list_project_text_files(project_root: Path) -> List[str]:
    validate_project_root(project_root)
    allow_roots = [project_root / "src", project_root / "api", project_root / "public"]
    fixed_files = [project_root / "README.md", project_root / "README_ASSETS.md"]

    paths: List[Path] = []
    for root in allow_roots:
        if not root.exists():
            continue
        for path in root.rglob("*"):
            if not path.is_file():
                continue
            if path.suffix.lower() in TEXT_EXTENSIONS:
                paths.append(path)

    for path in fixed_files:
        if path.exists():
            paths.append(path)

    unique = sorted({str(p.resolve().relative_to(project_root.resolve())).replace("\\", "/") for p in paths})
    return unique


def read_project_text_file(project_root: Path, rel_path_text: str) -> str:
    validate_project_root(project_root)
    path = _safe_relpath(project_root, rel_path_text)
    if not path.exists():
        raise EditorError(f"文件不存在: {rel_path_text}")
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError as exc:
        raise EditorError(f"文件不是 UTF-8 文本或编码异常: {rel_path_text}") from exc


def write_project_text_file(project_root: Path, rel_path_text: str, content: str) -> Path:
    validate_project_root(project_root)
    path = _safe_relpath(project_root, rel_path_text)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")
    return path


def list_project_images(project_root: Path) -> List[str]:
    validate_project_root(project_root)
    allow_roots = [project_root / "src", project_root / "public"]
    paths: List[str] = []
    for root in allow_roots:
        if not root.exists():
            continue
        for path in root.rglob("*"):
            if not path.is_file():
                continue
            if path.suffix.lower() in IMAGE_EXTENSIONS:
                rel = str(path.resolve().relative_to(project_root.resolve())).replace("\\", "/")
                paths.append(rel)
    return sorted(set(paths))


def replace_project_image(
    project_root: Path,
    target_rel_path_text: str,
    source_image_file: Path,
) -> Path:
    validate_project_root(project_root)
    target_path = _safe_relpath(project_root, target_rel_path_text)
    if target_path.suffix.lower() not in IMAGE_EXTENSIONS:
        raise EditorError(f"目标文件不是图片类型: {target_rel_path_text}")
    if not source_image_file.exists():
        raise EditorError(f"替换源图片不存在: {source_image_file}")
    if source_image_file.suffix.lower() not in IMAGE_EXTENSIONS:
        raise EditorError(f"替换源文件不是支持的图片类型: {source_image_file}")
    target_path.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source_image_file, target_path)
    return target_path
