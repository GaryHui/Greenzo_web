import { Check, Copy, Share2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { KnowledgeArticle } from '../content/articles';
import type { Language } from '../translations';

type ShareActionsProps = {
  article: KnowledgeArticle;
  language: Language;
};

const labels = {
  share: { zh: '转发', hk: '轉發', en: 'Share', ja: '共有' },
  copy: { zh: '复制链接', hk: '複製連結', en: 'Copy Link', ja: 'リンクをコピー' },
  copied: { zh: '已复制', hk: '已複製', en: 'Copied', ja: 'コピー済み' },
  wechat: {
    zh: '微信内可点右上角转发',
    hk: '微信內可點右上角轉發',
    en: 'In WeChat, use the top-right menu',
    ja: 'WeChat内では右上メニューから共有',
  },
};

export function ShareActions({ article, language }: ShareActionsProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return `/articles/${article.slug}`;
    return new URL(`/articles/${article.slug}`, window.location.origin).toString();
  }, [article.slug]);
  const title = article.title[language] || article.title.zh;
  const text = article.summary[language] || article.summary.zh;
  const canNativeShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';
  const isWechat =
    typeof navigator !== 'undefined' && /MicroMessenger/i.test(navigator.userAgent);

  const copyLink = async () => {
    await navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const share = async () => {
    if (!canNativeShare) {
      await copyLink();
      return;
    }

    try {
      await navigator.share({ title, text, url: shareUrl });
    } catch {
      // The user can cancel the native share sheet.
    }
  };

  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={share}
        className="inline-flex items-center gap-2 px-4 py-2.5 border border-black/10 bg-white/80 text-[11px] uppercase tracking-[0.2em] font-bold text-black/65 hover:bg-brand-green hover:text-white hover:border-brand-green transition-all"
      >
        <Share2 className="w-4 h-4" />
        {labels.share[language]}
      </button>
      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-2 px-4 py-2.5 border border-black/10 bg-white/80 text-[11px] uppercase tracking-[0.2em] font-bold text-black/65 hover:bg-brand-green hover:text-white hover:border-brand-green transition-all"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? labels.copied[language] : labels.copy[language]}
      </button>
      {isWechat && (
        <span className="text-[11px] tracking-[0.12em] text-black/45">
          {labels.wechat[language]}
        </span>
      )}
    </div>
  );
}
