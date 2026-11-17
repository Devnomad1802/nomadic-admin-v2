import { Fragment } from "react";

// Safe limited-Markdown renderer: **bold**, *italic*, "- " bullets,
// preserved line breaks. React nodes only — no dangerouslySetInnerHTML.
function renderInline(text, keyBase) {
  const nodes = [];
  String(text).split(/(\*\*[^*]+\*\*)/g).forEach((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      nodes.push(<strong key={`${keyBase}-b${i}`}>{part.slice(2, -2)}</strong>);
      return;
    }
    part.split(/(\*[^*]+\*)/g).forEach((ip, j) => {
      if (/^\*[^*]+\*$/.test(ip)) nodes.push(<em key={`${keyBase}-i${i}-${j}`}>{ip.slice(1, -1)}</em>);
      else if (ip) nodes.push(<Fragment key={`${keyBase}-t${i}-${j}`}>{ip}</Fragment>);
    });
  });
  return nodes;
}

export default function RichMessage({ text }) {
  const lines = String(text ?? "").replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let bullets = [];
  const flush = () => {
    if (!bullets.length) return;
    const items = bullets, base = blocks.length;
    blocks.push(
      <ul key={`ul-${base}`} style={{ margin: "4px 0", paddingLeft: 20 }}>
        {items.map((b, i) => <li key={i}>{renderInline(b, `li-${base}-${i}`)}</li>)}
      </ul>
    );
    bullets = [];
  };
  lines.forEach((line, i) => {
    const m = line.match(/^\s*[-*]\s+(.*)$/);
    if (m) { bullets.push(m[1]); return; }
    flush();
    if (line.trim() === "") blocks.push(<div key={`sp-${i}`} style={{ height: 8 }} aria-hidden />);
    else blocks.push(<p key={`p-${i}`} style={{ margin: 0, whiteSpace: "pre-wrap", overflowWrap: "anywhere", lineHeight: 1.45 }}>{renderInline(line, `p-${i}`)}</p>);
  });
  flush();
  return <div>{blocks}</div>;
}
