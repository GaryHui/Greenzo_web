import type { ReactNode } from 'react';

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const chunks = text
    .split(/(\*\*[^*]+\*\*|\[[^\]]+\]\((https?:\/\/[^)\s]+)\))/g)
    .filter(Boolean);
  return chunks.map((chunk, index) => {
    const linkMatch = chunk.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={`${keyPrefix}-link-${index}`}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-green hover:underline underline-offset-4"
        >
          {linkMatch[1]}
        </a>
      );
    }

    if (chunk.startsWith('**') && chunk.endsWith('**') && chunk.length > 4) {
      return (
        <strong key={`${keyPrefix}-strong-${index}`} className="font-semibold text-brand-dark">
          {chunk.slice(2, -2)}
        </strong>
      );
    }
    return <span key={`${keyPrefix}-text-${index}`}>{chunk}</span>;
  });
}

function flushList(listItems: string[], keyBase: string): ReactNode | null {
  if (listItems.length === 0) return null;
  return (
    <ul key={`${keyBase}-ul`} className="list-disc pl-6 space-y-2 text-black/70 leading-8 text-[15px] md:text-base">
      {listItems.map((item, i) => (
        <li key={`${keyBase}-li-${i}`}>{renderInline(item, `${keyBase}-li-${i}`)}</li>
      ))}
    </ul>
  );
}

export function MarkdownRenderer({ markdown }: { markdown: string }) {
  const lines = markdown.split(/\r?\n/);
  const blocks: ReactNode[] = [];
  let listBuffer: string[] = [];

  const pushListIfNeeded = (keyBase: string) => {
    const listNode = flushList(listBuffer, keyBase);
    if (listNode) blocks.push(listNode);
    listBuffer = [];
  };

  lines.forEach((rawLine, lineIndex) => {
    const line = rawLine.trim();
    const keyBase = `line-${lineIndex}`;

    if (!line) {
      pushListIfNeeded(`${keyBase}-empty`);
      return;
    }

    if (line.startsWith('- ')) {
      listBuffer.push(line.replace(/^- /, '').trim());
      return;
    }

    pushListIfNeeded(`${keyBase}-before-block`);

    if (line.startsWith('### ')) {
      blocks.push(
        <h3 key={`${keyBase}-h3`} className="text-lg md:text-xl font-serif text-brand-dark mt-6 mb-2">
          {renderInline(line.slice(4), `${keyBase}-h3`)}
        </h3>,
      );
      return;
    }

    if (line.startsWith('## ')) {
      blocks.push(
        <h2 key={`${keyBase}-h2`} className="text-xl md:text-2xl font-serif text-brand-dark mt-10 mb-3">
          {renderInline(line.slice(3), `${keyBase}-h2`)}
        </h2>,
      );
      return;
    }

    if (line.startsWith('# ')) {
      blocks.push(
        <h1 key={`${keyBase}-h1`} className="text-3xl md:text-4xl font-serif text-brand-dark leading-tight mb-6">
          {renderInline(line.slice(2), `${keyBase}-h1`)}
        </h1>,
      );
      return;
    }

    blocks.push(
      <p key={`${keyBase}-p`} className="text-black/70 leading-8 text-[15px] md:text-[17px] font-light">
        {renderInline(line, `${keyBase}-p`)}
      </p>,
    );
  });

  pushListIfNeeded('tail');

  return <div className="space-y-4">{blocks}</div>;
}
