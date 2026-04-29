from __future__ import annotations

from dataclasses import dataclass
from datetime import date
import json
from pathlib import Path
import re
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

    markdown_hk = _ensure_text(_convert_simplified_to_traditional(content), content)
    markdown_en = _ensure_text(_translate_text(content, "zh-CN", "en"), content)
    markdown_ja = _ensure_text(_translate_text(content, "zh-CN", "ja"), content)

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
