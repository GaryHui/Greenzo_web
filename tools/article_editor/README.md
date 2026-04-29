# Greenzo Article Editor

Standalone desktop editor for creating multilingual article files (`zh/hk/en/ja`) and pushing to `origin/main`.

## What It Does

- Input one Chinese Markdown article (`zh`).
- Auto-generate `hk/en/ja` versions.
- Auto-convert exposed official URLs into clickable markdown links (no raw URL display).
- Write 4 markdown files into:
  - `src/content/articles/<slug>.zh.md`
  - `src/content/articles/<slug>.hk.md`
  - `src/content/articles/<slug>.en.md`
  - `src/content/articles/<slug>.ja.md`
- Optionally auto-update `src/content/articles.ts` with imports + article metadata.
- Existing slug can be overwritten safely (upsert mode) to support direct regenerate + push.
- One-click `git add`, `git commit`, `git push origin main`.

## Quick Start (Windows)

1. Open PowerShell in this folder.
2. Run setup:

```powershell
.\setup.ps1
```

3. Run editor:

```powershell
.\run.ps1
```

## Build EXE (Optional)

```powershell
.\build_exe.ps1
```

Generated executable:

- `dist\GreenzoArticleEditor\GreenzoArticleEditor.exe`

## Required Conditions

- Python 3.10+ installed and available as `python`.
- Network access is required for translation.
- Local git auth for push must already be valid.

## Notes / Risks

- Machine translation may produce style errors or wording drift. Review generated `hk/en/ja` files before push.
- Existing slug updates are overwritten in place; review content before push.
- `git commit` fails when no file changes exist; check the log panel in the app.
