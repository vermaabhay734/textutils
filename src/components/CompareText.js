import React, { useState } from "react";

// Utility: compareText(original, modified)
function compareText(original, modified) {
  // Simple word-level diff (can be improved)
  const oWords = original.split(/(\s+)/);
  const mWords = modified.split(/(\s+)/);
  let oIdx = 0, mIdx = 0;
  let html = "";
  let additions = 0, deletions = 0;

  while (oIdx < oWords.length || mIdx < mWords.length) {
    if (oIdx < oWords.length && mIdx < mWords.length && oWords[oIdx] === mWords[mIdx]) {
      html += `<span>${oWords[oIdx]}</span>`;
      oIdx++; mIdx++;
    } else if (mIdx < mWords.length && (!oWords.includes(mWords[mIdx]) || oIdx >= oWords.length)) {
      html += `<span style='background:#d4f8e8;color:#1b5e20;'>${mWords[mIdx]}</span>`;
      additions++;
      mIdx++;
    } else if (oIdx < oWords.length && (!mWords.includes(oWords[oIdx]) || mIdx >= mWords.length)) {
      html += `<span style='background:#ffd6d6;color:#b71c1c;text-decoration:line-through;'>${oWords[oIdx]}</span>`;
      deletions++;
      oIdx++;
    } else {
      html += `<span>${oWords[oIdx]}</span>`;
      oIdx++; mIdx++;
    }
  }

  return { html, additions, deletions };
}

export default function CompareText({ showAlert }) {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [result, setResult] = useState(null);

  const handleCompare = () => {
    const diff = compareText(original, modified);
    setResult(diff);
    if (diff.additions + diff.deletions > 0) {
      showAlert("Comparison complete!", "success");
    } else {
      showAlert("No differences found.", "info");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 900, margin: "2rem auto", padding: "2rem", border: "1px solid #eee", borderRadius: 20, background: "var(--surface-light)" }}>
      <h2 style={{ fontWeight: 700, marginBottom: "2rem" }}>Compare Text</h2>
      <div className="row" style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
        <div className="col" style={{ flex: 1, minWidth: 250 }}>
          <label htmlFor="original" style={{ fontWeight: 600 }}>Original Text</label>
          <textarea id="original" className="form-control" style={{ height: 120, marginBottom: 16 }} value={original} onChange={e => setOriginal(e.target.value)} />
        </div>
        <div className="col" style={{ flex: 1, minWidth: 250 }}>
          <label htmlFor="modified" style={{ fontWeight: 600 }}>Modified Text</label>
          <textarea id="modified" className="form-control" style={{ height: 120, marginBottom: 16 }} value={modified} onChange={e => setModified(e.target.value)} />
        </div>
      </div>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
        <button className="btn btn-primary" onClick={handleCompare}>Compare Now</button>
        <a href="/" className="btn btn-secondary">Back to TextUtils</a>
      </div>
      {result && (
        <div className="mt-4" style={{ border: "1px solid #ccc", borderRadius: 12, padding: "1.5rem", background: "#fafafa", maxHeight: 300, overflowY: "auto" }}>
          <h4 style={{ fontWeight: 600, marginBottom: 12 }}>Differences</h4>
          <div style={{ fontSize: "1.1rem", lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: result.html }} />
          <div style={{ marginTop: 16, fontWeight: 500 }}>
            Total Additions: <span style={{ color: "#1b5e20" }}>{result.additions}</span> &nbsp;|&nbsp; Total Deletions: <span style={{ color: "#b71c1c" }}>{result.deletions}</span>
          </div>
        </div>
      )}
    </div>
  );
}
