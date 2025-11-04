import React from "react";
import { DiffOptions } from "../../utils/diffEngine";

export type SettingsProps = {
  options: DiffOptions;
  setOptions: (opts: DiffOptions) => void;
  onClose: () => void;
};

export default function Settings({ options, setOptions, onClose }: SettingsProps) {
  return (
    <div style={{ position: "fixed", top: 0, right: 0, width: 320, height: "100%", background: "#fff", boxShadow: "-2px 0 12px rgba(0,0,0,0.08)", zIndex: 1000, padding: "2rem" }}>
      <h3 style={{ fontWeight: 700 }}>Settings</h3>
      <div style={{ margin: "1.5rem 0" }}>
        <label>Ignore Whitespace:</label>
        <select value={options.ignoreWhitespace || "none"} onChange={e => setOptions({ ...options, ignoreWhitespace: e.target.value as "none"|"trim"|"all" })} className="form-select">
          <option value="none">None</option>
          <option value="trim">Trim</option>
          <option value="all">All</option>
        </select>
      </div>
      <div style={{ margin: "1rem 0" }}>
        <label>Ignore Case:</label>
        <input type="checkbox" checked={!!options.ignoreCase} onChange={e => setOptions({ ...options, ignoreCase: e.target.checked })} />
      </div>
      <div style={{ margin: "1rem 0" }}>
        <label>Normalize EOL:</label>
        <input type="checkbox" checked={!!options.normalizeEOL} onChange={e => setOptions({ ...options, normalizeEOL: e.target.checked })} />
      </div>
      <div style={{ margin: "1rem 0" }}>
        <label>Word-level inside changes:</label>
        <input type="checkbox" checked={!!options.wordLevelInsideChanges} onChange={e => setOptions({ ...options, wordLevelInsideChanges: e.target.checked })} />
      </div>
      <button className="btn btn-secondary" onClick={onClose} style={{ marginTop: "2rem" }}>Close</button>
      <div style={{ margin: "1.5rem 0" }}>
        <label>Ignore Case:</label>
        <input type="checkbox" checked={!!options.ignoreCase} onChange={e => setOptions({ ...options, ignoreCase: e.target.checked })} />
      </div>
      <div style={{ margin: "1.5rem 0" }}>
        <label>Normalize Line Endings:</label>
        <input type="checkbox" checked={!!options.normalizeEOL} onChange={e => setOptions({ ...options, normalizeEOL: e.target.checked })} />
      </div>
      <div style={{ margin: "1.5rem 0" }}>
        <label>Word-level inside changes:</label>
        <input type="checkbox" checked={options.wordLevelInsideChanges !== false} onChange={e => setOptions({ ...options, wordLevelInsideChanges: e.target.checked })} />
      </div>
      <button className="btn btn-secondary" onClick={onClose} style={{ marginTop: "2rem" }}>Close</button>
    </div>
  );
}
