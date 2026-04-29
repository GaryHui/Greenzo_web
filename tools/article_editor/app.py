from __future__ import annotations

from datetime import date
from pathlib import Path
import threading
import tkinter as tk
from tkinter import filedialog, messagebox
from tkinter.scrolledtext import ScrolledText

from editor_core import (
    EditorError,
    LANGS,
    build_article_input,
    default_project_root,
    run_git_commit_push,
    translate_article_fields,
    translate_markdown,
    update_articles_index,
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
        self.markdown_text = ScrolledText(body, height=18, undo=True)
        self.markdown_text.pack(fill="both", expand=True)

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
        tk.Button(btn_row, text="2) 生成并提交推送", command=self.generate_and_push).pack(side="left")

        log_frame = tk.LabelFrame(container, text="日志", padx=8, pady=8)
        log_frame.pack(fill="both", expand=True, pady=(10, 0))
        self.log_text = ScrolledText(log_frame, height=10, state="disabled")
        self.log_text.pack(fill="both", expand=True)

        self._log("就绪：填写内容后点击“生成四语 MD”或“生成并提交推送”。")
        self._log(f"默认项目路径: {self.project_root_var.get()}")
        self._log(f"语言集合: {', '.join(LANGS)}")

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


def main() -> None:
    root = tk.Tk()
    app = ArticleEditorApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
