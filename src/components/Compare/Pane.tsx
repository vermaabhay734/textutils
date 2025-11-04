
export type PaneProps = {
  lines: string[];
  highlights: Record<number, { kind: "add"|"remove"|"change", inner?: Array<{ type: "eq"|"ins"|"del", text: string }> }>;
  lineNumbers: boolean;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  contentEditable?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value?: string;
  minimapMarkers?: Array<{ line: number, kind: string }>;
};

export default function Pane({ lines, highlights, lineNumbers, onScroll, contentEditable, onChange, value, minimapMarkers }: PaneProps) {
  // lines: string[]
  // highlights: { [line: number]: { type: "add"|"remove"|"change", inner?: Array<{ type: "eq"|"ins"|"del", text: string }> } }
  // lineNumbers: boolean
  // minimapMarkers: Array<{ line: number, kind: string }>
  // ...other props
  return (
    <div style={{ position: "relative", flex: 1, minWidth: 200, background: "var(--surface-light)", borderRadius: 12, border: "1px solid #eee", overflow: "auto" }}>
      <div style={{ position: "absolute", right: 0, top: 0, width: 8, height: "100%", background: "#f5f5f5" }}>
        {/* Minimap markers */}
        {minimapMarkers?.map((m, i) => (
          <div key={i} style={{ position: "absolute", top: `${(m.line/lines.length)*100}%`, height: 4, width: "100%", background: m.kind === "add" ? "#d4f8e8" : m.kind === "remove" ? "#ffd6d6" : "#ffe9b3" }} />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {lineNumbers && (
          <div style={{ background: "#f0f0f0", color: "#888", textAlign: "right", padding: "8px 4px", userSelect: "none" }}>
            {lines.map((_, i) => (
              <div key={i} style={{ height: 24 }}>{i+1}</div>
            ))}
          </div>
        )}
        <div style={{ flex: 1, padding: 8 }}>
          {contentEditable ? (
            <textarea
              style={{ width: "100%", height: "calc(100vh - 220px)", fontFamily: "monospace", fontSize: "1rem", resize: "vertical" }}
              value={value}
              onChange={onChange}
              placeholder="Paste or type your text here..."
            />
          ) : (
            <div style={{ fontFamily: "monospace", fontSize: "1rem", whiteSpace: "pre", wordBreak: "break-word" }}>
              {lines.map((line, i) => {
                const hl = highlights?.[i];
                if (!hl) return <div key={i} data-line={i}>{line}</div>;
                if (hl.inner) {
                  return <div key={i} data-line={i} style={{ background: hl.kind === "add" ? "#d4f8e8" : hl.kind === "remove" ? "#ffd6d6" : "#ffe9b3" }}>
                    {hl.inner.map((w, j) => (
                      <span key={j} style={{ background: w.type === "ins" ? "#b9f6ca" : w.type === "del" ? "#ffcdd2" : undefined }}>{w.text}</span>
                    ))}
                  </div>;
                }
                return <div key={i} data-line={i} style={{ background: hl.kind === "add" ? "#d4f8e8" : hl.kind === "remove" ? "#ffd6d6" : "#ffe9b3" }}>{line}</div>;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
