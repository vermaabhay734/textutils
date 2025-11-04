import React from "react";
export type ToolbarProps = {
  onPrev: () => void;
  onNext: () => void;
  onCopyLeft: () => void;
  onCopyRight: () => void;
  onSwap: () => void;
  onCollapse: () => void;
  onWrap: () => void;
  onSettings: () => void;
  onExport: () => void;
  disabled?: boolean;
};

export default function Toolbar({ onPrev, onNext, onCopyLeft, onCopyRight, onSwap, onCollapse, onWrap, onSettings, onExport, disabled }: ToolbarProps) {
  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
      <button className="btn btn-outline-primary" title="Prev Difference (Shift+F7)" onClick={onPrev} disabled={disabled}>⏮ Prev</button>
      <button className="btn btn-outline-primary" title="Next Difference (F7)" onClick={onNext} disabled={disabled}>⏭ Next</button>
      <button className="btn btn-outline-success" title="Copy Left → Right (Alt+→)" onClick={onCopyLeft} disabled={disabled}>⬅️ Copy Left→Right</button>
      <button className="btn btn-outline-success" title="Copy Right → Left (Alt+←)" onClick={onCopyRight} disabled={disabled}>➡️ Copy Right→Left</button>
      <button className="btn btn-outline-secondary" title="Swap Sides" onClick={onSwap} disabled={disabled}>🔄 Swap</button>
      <button className="btn btn-outline-secondary" title="Collapse Unchanged (Ctrl+Shift+.)" onClick={onCollapse} disabled={disabled}>➖ Collapse</button>
      <button className="btn btn-outline-secondary" title="Wrap Lines (Ctrl+W)" onClick={onWrap} disabled={disabled}>↩️ Wrap</button>
      <button className="btn btn-outline-secondary" title="Settings" onClick={onSettings}>⚙️ Settings</button>
      <button className="btn btn-outline-secondary" title="Export" onClick={onExport} disabled={disabled}>📤 Export</button>
    </div>
  );
}
