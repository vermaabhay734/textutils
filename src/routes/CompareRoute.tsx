import React, { useState, useRef } from "react";
import Pane from "../components/Compare/Pane.tsx";
import Toolbar from "../components/Compare/Toolbar.tsx";
import Settings from "../components/Compare/Settings.tsx";
import { computeDiff, DiffOptions, DiffBlock } from "../utils/diffEngine.ts";

export default function CompareRoute() {
  // Initial state: load from localStorage or URL hash (to be implemented)
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [options, setOptions] = useState<DiffOptions>({ wordLevelInsideChanges: true });
  const [diffBlocks, setDiffBlocks] = useState<DiffBlock[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [currentDiffIndex, setCurrentDiffIndex] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [lineWrap, setLineWrap] = useState(false);
  const [exportedDiff, setExportedDiff] = useState("");
  const leftPaneRef = useRef<HTMLDivElement>(null);
  const rightPaneRef = useRef<HTMLDivElement>(null);

  // Track if user requested comparison
  const [hasCompared, setHasCompared] = useState(false);

  // Only compute diff when Compare button is clicked (prod UX)
  React.useEffect(() => {
    if (hasCompared) {
      setDiffBlocks(computeDiff(left, right, options));
    }
  }, [left, right, options, hasCompared]);

  // Build highlights for left and right panes from diffBlocks
  const leftHighlights: Record<number, { kind: "add"|"remove"|"change", inner?: Array<{ type: "eq"|"ins"|"del", text: string }> }> = {};
  const rightHighlights: Record<number, { kind: "add"|"remove"|"change", inner?: Array<{ type: "eq"|"ins"|"del", text: string }> }> = {};
  diffBlocks.forEach(block => {
    block.leftLines.forEach(line => {
      leftHighlights[line] = { kind: block.kind, inner: block.inner };
    });
    block.rightLines.forEach(line => {
      rightHighlights[line] = { kind: block.kind, inner: block.inner };
    });
  });

  // Scroll to diff block in pane
  const scrollToDiff = (index: number) => {
    if (diffBlocks.length === 0) return;
    const block = diffBlocks[index];
    if (!block) return;
    // Scroll left pane
    if (leftPaneRef.current && block.leftLines.length > 0) {
      const line = block.leftLines[0];
      const el = leftPaneRef.current.querySelector(`[data-line='${line}']`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    // Scroll right pane
    if (rightPaneRef.current && block.rightLines.length > 0) {
      const line = block.rightLines[0];
      const el = rightPaneRef.current.querySelector(`[data-line='${line}']`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: "2rem auto", padding: "2rem", borderRadius: 20, background: "var(--surface-light)", boxShadow: "var(--shadow-md)" }}>
      <h2 style={{ fontWeight: 700, fontSize: "2rem", marginBottom: "1.5rem" }}>Compare &amp; Merge Text</h2>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <input type="file" accept=".txt" style={{ display: "none" }} id="leftFileInput" onChange={e => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = ev => setLeft(ev.target?.result as string || "");
            reader.readAsText(file);
          }
        }} />
        <label htmlFor="leftFileInput" className="btn btn-outline-secondary">Load Left File</label>
        <input type="file" accept=".txt" style={{ display: "none" }} id="rightFileInput" onChange={e => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = ev => setRight(ev.target?.result as string || "");
            reader.readAsText(file);
          }
        }} />
        <label htmlFor="rightFileInput" className="btn btn-outline-secondary">Load Right File</label>
        <button className="btn btn-outline-secondary" onClick={() => navigator.clipboard.writeText(left)}>Copy Left</button>
        <button className="btn btn-outline-secondary" onClick={() => navigator.clipboard.writeText(right)}>Copy Right</button>
        <button className="btn btn-outline-secondary" onClick={() => exportedDiff && navigator.clipboard.writeText(exportedDiff)}>Copy Diff Output</button>
      </div>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", justifyContent: "center" }}>
        <button
          className="btn btn-primary"
          style={{ fontWeight: 600, fontSize: "1.1rem", padding: "0.75rem 2.5rem", borderRadius: 12, boxShadow: "var(--shadow-sm)" }}
          onClick={() => {
            setHasCompared(true);
            setCurrentDiffIndex(0);
            setTimeout(() => scrollToDiff(0), 200);
          }}
          disabled={!left.trim() || !right.trim()}
        >
          Compare
        </button>
      </div>
      <Toolbar
        onPrev={() => {
          if (diffBlocks.length === 0) return;
          setCurrentDiffIndex(i => {
            const next = Math.max(0, i - 1);
            scrollToDiff(next);
            return next;
          });
        }}
        onNext={() => {
          if (diffBlocks.length === 0) return;
          setCurrentDiffIndex(i => {
            const next = Math.min(diffBlocks.length - 1, i + 1);
            scrollToDiff(next);
            return next;
          });
        }}
        onCopyLeft={() => {
          if (diffBlocks.length === 0) return;
          const block = diffBlocks[currentDiffIndex];
          if (!block) return;
          const result = require("../utils/diffEngine.ts").applyBlockCopy("right", block, left, right);
          setRight(result.right);
        }}
        onCopyRight={() => {
          if (diffBlocks.length === 0) return;
          const block = diffBlocks[currentDiffIndex];
          if (!block) return;
          const result = require("../utils/diffEngine.ts").applyBlockCopy("left", block, left, right);
          setLeft(result.left);
        }}
        onSwap={() => { if (diffBlocks.length === 0) return; const tmp = left; setLeft(right); setRight(tmp); }}
        onCollapse={() => { if (diffBlocks.length === 0) return; setCollapsed(c => !c); }}
        onWrap={() => setLineWrap(w => !w)}
        onSettings={() => setShowSettings(true)}
        onExport={() => { if (diffBlocks.length === 0) return; setExportedDiff(require("../utils/diffEngine.ts").toUnifiedDiff(left, right)); }}
        disabled={diffBlocks.length === 0}
      />
  <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
        <div ref={leftPaneRef} style={{ flex: 1, whiteSpace: lineWrap ? "pre-wrap" : "pre" }}>
          <Pane
            lines={collapsed ? left.split(/\r?\n/).filter((_, i) => leftHighlights[i]) : left.split(/\r?\n/)}
            highlights={leftHighlights}
            lineNumbers={true}
            value={left}
            onChange={e => setLeft(e.target.value)}
            contentEditable={true}
            minimapMarkers={[]}
          />
        </div>
        <div ref={rightPaneRef} style={{ flex: 1, whiteSpace: lineWrap ? "pre-wrap" : "pre" }}>
          <Pane
            lines={collapsed ? right.split(/\r?\n/).filter((_, i) => rightHighlights[i]) : right.split(/\r?\n/)}
            highlights={rightHighlights}
            lineNumbers={true}
            value={right}
            onChange={e => setRight(e.target.value)}
            contentEditable={true}
            minimapMarkers={[]}
          />
        </div>
      </div>
      {showSettings && <Settings options={options} setOptions={setOptions} onClose={() => setShowSettings(false)} />}
      {exportedDiff && (
        <div style={{ marginTop: "2rem", background: "#f8f8f8", border: "1px solid #eee", padding: "1rem", borderRadius: 8 }}>
          <h5>Unified Diff Output</h5>
          <pre style={{ fontFamily: "monospace", fontSize: "0.95rem" }}>{exportedDiff}</pre>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => setExportedDiff("")}>Close</button>
        </div>
      )}
      <div style={{ marginTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/" className="btn btn-secondary">Back to TextUtils</a>
        <div style={{ fontSize: "0.95rem", color: "#888" }}>
          {diffBlocks.length} difference{diffBlocks.length !== 1 ? "s" : ""} | Showing diff {currentDiffIndex+1} of {diffBlocks.length}
        </div>
      </div>
    </div>
  );
}
