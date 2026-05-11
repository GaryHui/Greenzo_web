from __future__ import annotations

from datetime import date
from pathlib import Path
import threading
import tkinter as tk
from tkinter import ttk
from tkinter import filedialog, messagebox
from tkinter.scrolledtext import ScrolledText

from editor_core import (
    collect_existing_article_files,
    copy_article_images_to_public,
    EditorError,
    LANGS,
    build_article_input,
    default_project_root,
    list_existing_article_slugs,
    list_project_images,
    list_project_text_files,
    load_existing_article,
    read_project_text_file,
    replace_project_image,
    run_git_commit_all_push,
    run_git_commit_push,
    translate_article_fields,
    translate_markdown,
    update_home_visual_image_link,
    update_home_visual_video_link,
    update_articles_index,
    write_project_text_file,
    write_markdown_files,
)


class ArticleEditorApp:
    def __init__(self, root: tk.Tk) -> None:
        self.root = root
        self.root.title("Greenzo 文章编辑器")
        self.root.geometry("1080x760")

        tools_dir = Path(__file__).resolve().parent
        default_root = default_project_root(tools_dir)

        self.project_root_var = tk.StringVar(value=str(default_root))
        self.slug_var = tk.StringVar()
        self.title_zh_var = tk.StringVar()
        self.summary_zh_var = tk.StringVar()
        self.published_at_var = tk.StringVar(value=date.today().isoformat())
        self.commit_msg_var = tk.StringVar(value="feat: add new multilingual article")
        self.update_index_var = tk.BooleanVar(value=True)
        self.existing_slug_var = tk.StringVar()
        self.article_image_link_var = tk.StringVar()
        self.home_image_link_var = tk.StringVar()
        self.home_video_link_var = tk.StringVar()
        self.edit_article_slug_var = tk.StringVar()
        self.project_file_var = tk.StringVar()
        self.image_target_var = tk.StringVar()

        self._generated_files: list[Path] = []
        self._index_file: Path | None = None

        self._build_ui()

    def _build_ui(self) -> None:
        container = tk.Frame(self.root, padx=12, pady=10)
        container.pack(fill="both", expand=True)

        top = tk.LabelFrame(container, text="基础信息", padx=8, pady=8)
        top.pack(fill="x")

        self._add_labeled_entry(top, "项目路径", self.project_root_var, 0, with_browse=True)
        self._add_labeled_entry(top, "文章 slug", self.slug_var, 1)
        self._add_labeled_entry(top, "中文标题", self.title_zh_var, 2)
        self._add_labeled_entry(top, "中文摘要", self.summary_zh_var, 3)
        self._add_labeled_entry(top, "发布日期", self.published_at_var, 4)

        body = tk.LabelFrame(container, text="中文 Markdown 正文", padx=8, pady=8)
        body.pack(fill="both", expand=True, pady=(10, 0))
        body_toolbar = tk.Frame(body)
        body_toolbar.pack(fill="x", pady=(0, 8))
        tk.Button(body_toolbar, text="插入本地配图", command=self.insert_local_images).pack(side="left", padx=(0, 8))
        tk.Entry(body_toolbar, textvariable=self.article_image_link_var, width=48).pack(side="left", padx=(0, 8))
        tk.Button(body_toolbar, text="插入网络配图链接", command=self.insert_remote_image).pack(side="left")
        self.markdown_text = ScrolledText(body, height=18, undo=True)
        self.markdown_text.pack(fill="both", expand=True)

        edit_existing = tk.LabelFrame(container, text="编辑历史文章", padx=8, pady=8)
        edit_existing.pack(fill="x", pady=(10, 0))
        tk.Label(edit_existing, text="选择 slug").grid(row=0, column=0, sticky="w")
        self.article_slug_combo = ttk.Combobox(
            edit_existing,
            textvariable=self.edit_article_slug_var,
            values=[],
            width=42,
            state="readonly",
        )
        self.article_slug_combo.grid(row=0, column=1, sticky="w", padx=(8, 8))
        self.article_slug_combo.bind("<<ComboboxSelected>>", lambda _event: self.load_selected_article())
        tk.Button(edit_existing, text="刷新列表", command=self.refresh_article_slugs).grid(row=0, column=2)
        tk.Button(edit_existing, text="加载到编辑器", command=self.load_selected_article).grid(row=0, column=3, padx=(8, 0))

        ops = tk.LabelFrame(container, text="生成与提交", padx=8, pady=8)
        ops.pack(fill="x", pady=(10, 0))

        tk.Checkbutton(
            ops,
            text="自动更新 src/content/articles.ts（同 slug 自动覆盖）",
            variable=self.update_index_var,
        ).grid(row=0, column=0, sticky="w")

        tk.Label(ops, text="提交信息").grid(row=1, column=0, sticky="w", pady=(8, 0))
        tk.Entry(ops, textvariable=self.commit_msg_var).grid(
            row=1, column=1, sticky="ew", padx=(8, 0), pady=(8, 0)
        )
        ops.grid_columnconfigure(1, weight=1)

        btn_row = tk.Frame(ops)
        btn_row.grid(row=2, column=0, columnspan=2, sticky="w", pady=(10, 0))
        tk.Button(btn_row, text="1) 生成四语 MD", command=self.generate_only).pack(side="left", padx=(0, 8))
        tk.Button(btn_row, text="2) 生成并提交推送", command=self.generate_and_push).pack(side="left", padx=(0, 8))

        existing_row = tk.Frame(ops)
        existing_row.grid(row=3, column=0, columnspan=2, sticky="ew", pady=(10, 0))
        tk.Label(existing_row, text="已有文章 slug").pack(side="left")
        tk.Entry(existing_row, textvariable=self.existing_slug_var, width=36).pack(side="left", padx=(8, 8))
        tk.Button(existing_row, text="3) 提交已生成文章", command=self.push_existing_article).pack(side="left")
        tk.Button(existing_row, text="4) 更新旧文并推送", command=self.update_existing_article_and_push).pack(side="left", padx=(8, 0))

        proj_editor = tk.LabelFrame(container, text="项目文字编辑 / 图片替换 / 提交推送", padx=8, pady=8)
        proj_editor.pack(fill="x", pady=(10, 0))

        tk.Label(proj_editor, text="项目文字文件").grid(row=0, column=0, sticky="w")
        self.project_file_combo = ttk.Combobox(
            proj_editor,
            textvariable=self.project_file_var,
            values=[],
            width=58,
        )
        self.project_file_combo.grid(row=0, column=1, sticky="ew", padx=(8, 8))
        tk.Button(proj_editor, text="刷新文件列表", command=self.refresh_project_files).grid(row=0, column=2)
        tk.Button(proj_editor, text="加载", command=self.load_project_file).grid(row=0, column=3, padx=(8, 0))

        self.project_file_text = ScrolledText(proj_editor, height=8, undo=True)
        self.project_file_text.grid(row=1, column=0, columnspan=4, sticky="ew", pady=(8, 0))

        tk.Button(proj_editor, text="保存文件", command=self.save_project_file).grid(row=2, column=0, sticky="w", pady=(8, 0))

        tk.Label(proj_editor, text="替换项目图片").grid(row=3, column=0, sticky="w", pady=(10, 0))
        self.image_target_combo = ttk.Combobox(
            proj_editor,
            textvariable=self.image_target_var,
            values=[],
            width=58,
        )
        self.image_target_combo.grid(row=3, column=1, sticky="ew", padx=(8, 8), pady=(10, 0))
        tk.Button(proj_editor, text="刷新图片列表", command=self.refresh_project_images).grid(row=3, column=2, pady=(10, 0))
        tk.Button(proj_editor, text="选择新图片并替换", command=self.replace_selected_image).grid(
            row=3, column=3, padx=(8, 0), pady=(10, 0)
        )

        tk.Button(proj_editor, text="提交全部改动并推送", command=self.commit_all_and_push).grid(
            row=4, column=0, columnspan=4, sticky="w", pady=(10, 0)
        )
        proj_editor.grid_columnconfigure(1, weight=1)

        visual_ops = tk.LabelFrame(container, text="主页视觉资源管理", padx=8, pady=8)
        visual_ops.pack(fill="x", pady=(10, 0))

        tk.Label(visual_ops, text="主页图片链接").grid(row=0, column=0, sticky="w")
        tk.Entry(visual_ops, textvariable=self.home_image_link_var).grid(
            row=0, column=1, sticky="ew", padx=(8, 8)
        )
        tk.Button(visual_ops, text="新增图片链接", command=self.add_home_image_link).grid(row=0, column=2)
        tk.Button(visual_ops, text="删除图片链接", command=self.remove_home_image_link).grid(row=0, column=3, padx=(8, 0))

        tk.Label(visual_ops, text="主页视频链接").grid(row=1, column=0, sticky="w", pady=(8, 0))
        tk.Entry(visual_ops, textvariable=self.home_video_link_var).grid(
            row=1, column=1, sticky="ew", padx=(8, 8), pady=(8, 0)
        )
        tk.Button(visual_ops, text="新增视频链接", command=self.add_home_video_link).grid(row=1, column=2, pady=(8, 0))
        tk.Button(visual_ops, text="删除视频链接", command=self.remove_home_video_link).grid(
            row=1, column=3, padx=(8, 0), pady=(8, 0)
        )
        tk.Button(visual_ops, text="提交主页视觉配置并推送", command=self.push_home_visual_config).grid(
            row=2, column=0, columnspan=4, sticky="w", pady=(10, 0)
        )
        visual_ops.grid_columnconfigure(1, weight=1)

        log_frame = tk.LabelFrame(container, text="日志", padx=8, pady=8)
        log_frame.pack(fill="both", expand=True, pady=(10, 0))
        self.log_text = ScrolledText(log_frame, height=10, state="disabled")
        self.log_text.pack(fill="both", expand=True)

        self._log("就绪：填写内容后点击“生成四语 MD”或“生成并提交推送”。")
        self._log(f"默认项目路径: {self.project_root_var.get()}")
        self._log(f"语言集合: {', '.join(LANGS)}")
        self._log("支持插图：可插入本地配图或网络图片链接。")
        self.refresh_article_slugs()
        self.refresh_project_files()
        self.refresh_project_images()

    def _add_labeled_entry(
        self,
        parent: tk.Widget,
        label: str,
        var: tk.StringVar,
        row: int,
        with_browse: bool = False,
    ) -> None:
        tk.Label(parent, text=label).grid(row=row, column=0, sticky="w", pady=4)
        entry = tk.Entry(parent, textvariable=var)
        entry.grid(row=row, column=1, sticky="ew", padx=(8, 0), pady=4)
        parent.grid_columnconfigure(1, weight=1)
        if with_browse:
            tk.Button(parent, text="浏览", command=self._browse_project).grid(
                row=row, column=2, padx=(8, 0), pady=4
            )

    def _browse_project(self) -> None:
        selected = filedialog.askdirectory(initialdir=self.project_root_var.get() or ".")
        if selected:
            self.project_root_var.set(selected)

    def _log(self, text: str) -> None:
        self.log_text.configure(state="normal")
        self.log_text.insert("end", text + "\n")
        self.log_text.see("end")
        self.log_text.configure(state="disabled")

    def _collect_input(self):
        return build_article_input(
            project_root_text=self.project_root_var.get(),
            slug_text=self.slug_var.get(),
            title_zh=self.title_zh_var.get(),
            summary_zh=self.summary_zh_var.get(),
            markdown_zh=self.markdown_text.get("1.0", "end"),
            published_at=self.published_at_var.get(),
        )

    def generate_only(self) -> None:
        self._run_async(self._generate_files_only)

    def generate_and_push(self) -> None:
        self._run_async(self._generate_files_and_push)

    def push_existing_article(self) -> None:
        self._run_async(self._push_existing_article)

    def update_existing_article_and_push(self) -> None:
        self._run_async(self._update_existing_article_and_push)

    def insert_local_images(self) -> None:
        self._safe_run(self._insert_local_images)

    def insert_remote_image(self) -> None:
        self._safe_run(self._insert_remote_image)

    def add_home_image_link(self) -> None:
        self._run_async(self._add_home_image_link)

    def remove_home_image_link(self) -> None:
        self._run_async(self._remove_home_image_link)

    def add_home_video_link(self) -> None:
        self._run_async(self._add_home_video_link)

    def remove_home_video_link(self) -> None:
        self._run_async(self._remove_home_video_link)

    def push_home_visual_config(self) -> None:
        self._run_async(self._push_home_visual_config)

    def refresh_article_slugs(self) -> None:
        self._safe_run(self._refresh_article_slugs)

    def load_selected_article(self) -> None:
        self._safe_run(self._load_selected_article)

    def refresh_project_files(self) -> None:
        self._safe_run(self._refresh_project_files)

    def load_project_file(self) -> None:
        self._safe_run(self._load_project_file)

    def save_project_file(self) -> None:
        self._safe_run(self._save_project_file)

    def refresh_project_images(self) -> None:
        self._safe_run(self._refresh_project_images)

    def replace_selected_image(self) -> None:
        self._safe_run(self._replace_selected_image)

    def commit_all_and_push(self) -> None:
        self._run_async(self._commit_all_and_push)

    def _run_async(self, fn) -> None:
        threading.Thread(target=self._safe_run, args=(fn,), daemon=True).start()

    def _safe_run(self, fn) -> None:
        try:
            fn()
        except EditorError as exc:
            self._log(f"[ERROR] {exc}")
            messagebox.showerror("执行失败", str(exc))
        except Exception as exc:  # pragma: no cover
            self._log(f"[UNEXPECTED] {exc}")
            messagebox.showerror("执行失败", f"未知异常: {exc}")

    def _generate_files_only(self) -> None:
        article = self._collect_input()
        self._log(f"开始生成：slug={article.slug}")

        translated_fields = translate_article_fields(article.title_zh, article.summary_zh)
        markdown_by_lang = translate_markdown(article.markdown_zh)
        files = write_markdown_files(article, markdown_by_lang)
        self._generated_files = files
        self._index_file = None

        if self.update_index_var.get():
            index_file = update_articles_index(article, translated_fields)
            self._index_file = index_file
            self._log(f"已更新索引：{index_file}")

        for path in files:
            self._log(f"已写入：{path}")
        self._log("四语生成完成。")
        messagebox.showinfo("成功", "四语 Markdown 文件已生成。")

    def _generate_files_and_push(self) -> None:
        self._generate_files_only()

        article = self._collect_input()
        files_to_add = list(self._generated_files)
        if self._index_file is not None:
            files_to_add.append(self._index_file)

        self._log("开始执行 git add/commit/push ...")
        logs = run_git_commit_push(
            project_root=article.project_root,
            files_to_add=files_to_add,
            commit_message=self.commit_msg_var.get(),
            push_remote="origin",
            push_branch="main",
        )
        self._log(logs)
        self._log("提交并推送完成。")
        messagebox.showinfo("成功", "已提交并推送到 origin/main。")

    def _push_existing_article(self) -> None:
        project_root = Path(self.project_root_var.get()).resolve()
        slug = self.existing_slug_var.get().strip() or self.slug_var.get().strip()
        if not slug:
            raise EditorError("请填写“已有文章 slug”或“文章 slug”。")

        files_to_add = collect_existing_article_files(project_root, slug)
        commit_message = self.commit_msg_var.get().strip() or f"chore: push existing article {slug}"

        self._log(f"开始提交已生成文章：slug={slug}")
        for path in files_to_add:
            self._log(f"待提交：{path}")

        logs = run_git_commit_push(
            project_root=project_root,
            files_to_add=files_to_add,
            commit_message=commit_message,
            push_remote="origin",
            push_branch="main",
        )
        self._log(logs)
        self._log("已生成文章提交并推送完成。")
        messagebox.showinfo("成功", f"已提交并推送文章：{slug}")

    def _update_existing_article_and_push(self) -> None:
        target_slug = self.edit_article_slug_var.get().strip() or self.slug_var.get().strip()
        if not target_slug:
            raise EditorError("请先选择历史文章 slug。")

        # Force update against selected old slug to avoid creating a new article by mistake.
        self.slug_var.set(target_slug)
        original_update_index = self.update_index_var.get()
        self.update_index_var.set(True)
        try:
            self._generate_files_and_push()
            self._log(f"旧文已更新并推送：{target_slug}")
        finally:
            self.update_index_var.set(original_update_index)

    def _insert_local_images(self) -> None:
        project_root = Path(self.project_root_var.get()).resolve()
        slug = self.slug_var.get().strip()
        if not slug:
            raise EditorError("请先填写文章 slug，再插入本地配图。")

        selected = filedialog.askopenfilenames(
            title="选择配图",
            filetypes=(
                ("Image files", "*.png *.jpg *.jpeg *.webp *.gif *.avif"),
                ("All files", "*.*"),
            ),
        )
        if not selected:
            return

        urls = copy_article_images_to_public(
            project_root=project_root,
            slug_text=slug,
            selected_images=[Path(x) for x in selected],
        )
        for idx, url in enumerate(urls, start=1):
            block = f"\n![段落配图{idx}]({url})\n"
            self.markdown_text.insert("insert", block)
            self._log(f"已插入配图：{url}")
        self._log("已完成本地配图插入。")

    def _insert_remote_image(self) -> None:
        link = self.article_image_link_var.get().strip()
        if not link:
            raise EditorError("请先在正文工具栏输入网络图片 URL。")
        block = f"\n![段落配图]({link})\n"
        self.markdown_text.insert("insert", block)
        self._log(f"已插入网络配图：{link}")

    def _refresh_article_slugs(self) -> None:
        project_root = Path(self.project_root_var.get()).resolve()
        slugs = list_existing_article_slugs(project_root)
        self.article_slug_combo.configure(values=slugs)
        self._log(f"已刷新文章列表：{len(slugs)} 篇")
        if slugs and not self.edit_article_slug_var.get():
            self.edit_article_slug_var.set(slugs[0])

    def _load_selected_article(self) -> None:
        project_root = Path(self.project_root_var.get()).resolve()
        slug = self.edit_article_slug_var.get().strip()
        if not slug:
            raise EditorError("请先选择要加载的文章 slug。")
        data = load_existing_article(project_root, slug)
        self.slug_var.set(data["slug"])
        self.title_zh_var.set(data.get("title_zh", ""))
        self.summary_zh_var.set(data.get("summary_zh", ""))
        self.published_at_var.set(data.get("published_at", date.today().isoformat()))
        self.markdown_text.delete("1.0", "end")
        self.markdown_text.insert("1.0", data.get("markdown_zh", ""))
        self._log(f"已加载文章：{slug}")

    def _refresh_project_files(self) -> None:
        project_root = Path(self.project_root_var.get()).resolve()
        files = list_project_text_files(project_root)
        self.project_file_combo.configure(values=files)
        self._log(f"已刷新项目文字文件列表：{len(files)} 个")
        if files and not self.project_file_var.get():
            self.project_file_var.set(files[0])

    def _load_project_file(self) -> None:
        project_root = Path(self.project_root_var.get()).resolve()
        rel = self.project_file_var.get().strip()
        if not rel:
            raise EditorError("请先选择要加载的项目文字文件。")
        content = read_project_text_file(project_root, rel)
        self.project_file_text.delete("1.0", "end")
        self.project_file_text.insert("1.0", content)
        self._log(f"已加载文件：{rel}")

    def _save_project_file(self) -> None:
        project_root = Path(self.project_root_var.get()).resolve()
        rel = self.project_file_var.get().strip()
        if not rel:
            raise EditorError("请先选择要保存的项目文字文件。")
        content = self.project_file_text.get("1.0", "end")
        path = write_project_text_file(project_root, rel, content)
        self._log(f"已保存文件：{path}")
        messagebox.showinfo("成功", f"已保存：{rel}")

    def _refresh_project_images(self) -> None:
        project_root = Path(self.project_root_var.get()).resolve()
        images = list_project_images(project_root)
        self.image_target_combo.configure(values=images)
        self._log(f"已刷新项目图片列表：{len(images)} 个")
        if images and not self.image_target_var.get():
            self.image_target_var.set(images[0])

    def _replace_selected_image(self) -> None:
        project_root = Path(self.project_root_var.get()).resolve()
        target = self.image_target_var.get().strip()
        if not target:
            raise EditorError("请先选择要替换的目标图片。")
        selected = filedialog.askopenfilename(
            title="选择新图片文件",
            filetypes=(
                ("Image files", "*.png *.jpg *.jpeg *.webp *.gif *.avif *.svg"),
                ("All files", "*.*"),
            ),
        )
        if not selected:
            return
        path = replace_project_image(project_root, target, Path(selected))
        self._log(f"已替换图片：{target} <= {selected}")
        self._log(f"写入路径：{path}")
        messagebox.showinfo("成功", f"已替换：{target}")

    def _commit_all_and_push(self) -> None:
        project_root = Path(self.project_root_var.get()).resolve()
        commit_message = self.commit_msg_var.get().strip() or "chore: update site content"
        self._log("开始提交全部改动并推送...")
        logs = run_git_commit_all_push(
            project_root=project_root,
            commit_message=commit_message,
            push_remote="origin",
            push_branch="main",
        )
        self._log(logs)
        self._log("已提交全部改动并推送完成。")
        messagebox.showinfo("成功", "已提交全部改动并推送到 origin/main。")

    def _add_home_image_link(self) -> None:
        project_root = Path(self.project_root_var.get()).resolve()
        link = self.home_image_link_var.get().strip()
        path = update_home_visual_image_link(project_root, link, "add")
        self._log(f"已新增主页图片链接：{link}")
        self._log(f"配置文件已更新：{path}")

    def _remove_home_image_link(self) -> None:
        project_root = Path(self.project_root_var.get()).resolve()
        link = self.home_image_link_var.get().strip()
        path = update_home_visual_image_link(project_root, link, "remove")
        self._log(f"已删除主页图片链接：{link}")
        self._log(f"配置文件已更新：{path}")

    def _add_home_video_link(self) -> None:
        project_root = Path(self.project_root_var.get()).resolve()
        link = self.home_video_link_var.get().strip()
        path = update_home_visual_video_link(project_root, link, "add")
        self._log(f"已新增主页视频链接：{link}")
        self._log(f"配置文件已更新：{path}")

    def _remove_home_video_link(self) -> None:
        project_root = Path(self.project_root_var.get()).resolve()
        link = self.home_video_link_var.get().strip()
        path = update_home_visual_video_link(project_root, link, "remove")
        self._log(f"已删除主页视频链接：{link}")
        self._log(f"配置文件已更新：{path}")

    def _push_home_visual_config(self) -> None:
        project_root = Path(self.project_root_var.get()).resolve()
        files_to_add = [
            project_root / "src" / "homeVisualMedia.json",
            project_root / "src" / "videoList.json",
        ]
        existing_files = [path for path in files_to_add if path.exists()]
        if not existing_files:
            raise EditorError("未找到主页视觉配置文件，无法提交。")
        commit_message = self.commit_msg_var.get().strip() or "chore: update homepage visual links"
        self._log("开始提交主页视觉配置...")
        logs = run_git_commit_push(
            project_root=project_root,
            files_to_add=existing_files,
            commit_message=commit_message,
            push_remote="origin",
            push_branch="main",
        )
        self._log(logs)
        self._log("主页视觉配置提交并推送完成。")
        messagebox.showinfo("成功", "主页视觉配置已提交并推送到 origin/main。")


def main() -> None:
    root = tk.Tk()
    app = ArticleEditorApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
