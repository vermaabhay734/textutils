// Diff engine for WinMerge-like compare/merge
// Types
export type DiffBlock = {
  id: string;
  leftStart: number;
  leftLines: number[];
  rightStart: number;
  rightLines: number[];
  kind: "add" | "remove" | "change";
  inner?: Array<{ type: "eq" | "ins" | "del"; text: string }>;
};

export type DiffOptions = {
  ignoreWhitespace?: "none" | "trim" | "all";
  ignoreCase?: boolean;
  normalizeEOL?: boolean;
  wordLevelInsideChanges?: boolean;
};

// Core diff function (uses diff-match-patch if available, fallback to JS)
export function computeDiff(left: string, right: string, opts: DiffOptions = {}): DiffBlock[] {
  // Placeholder: line-based diff, word-level inside changes
  // TODO: Replace with diff-match-patch or diff npm if available
  const leftLines = left.split(/\r?\n/);
  const rightLines = right.split(/\r?\n/);
  // Simple line diff
  let blocks: DiffBlock[] = [];
  let l = 0, r = 0, id = 0;
  while (l < leftLines.length || r < rightLines.length) {
    if (l < leftLines.length && r < rightLines.length && leftLines[l] === rightLines[r]) {
      l++; r++;
      continue;
    }
    // Find changed block
    let lStart = l, rStart = r;
    let lBlock: number[] = [], rBlock: number[] = [];
    while (l < leftLines.length && (r >= rightLines.length || leftLines[l] !== rightLines[r])) {
      lBlock.push(l);
      l++;
    }
    while (r < rightLines.length && (l >= leftLines.length || leftLines[l] !== rightLines[r])) {
      rBlock.push(r);
      r++;
    }
    // Word-level diff inside changed lines
    let inner: Array<{ type: "eq" | "ins" | "del"; text: string }> = [];
    if (lBlock.length && rBlock.length && opts.wordLevelInsideChanges !== false) {
      // Compare first lines
      const lw = leftLines[lBlock[0]]?.split(/(\s+)/) || [];
      const rw = rightLines[rBlock[0]]?.split(/(\s+)/) || [];
      let li = 0, ri = 0;
      while (li < lw.length || ri < rw.length) {
        if (li < lw.length && ri < rw.length && lw[li] === rw[ri]) {
          inner.push({ type: "eq", text: lw[li] });
          li++; ri++;
        } else if (ri < rw.length && (!lw.includes(rw[ri]) || li >= lw.length)) {
          inner.push({ type: "ins", text: rw[ri] });
          ri++;
        } else if (li < lw.length && (!rw.includes(lw[li]) || ri >= rw.length)) {
          inner.push({ type: "del", text: lw[li] });
          li++;
        } else {
          inner.push({ type: "eq", text: lw[li] });
          li++; ri++;
        }
      }
    }
    blocks.push({
      id: `diff-${id++}`,
      leftStart: lStart,
      leftLines: lBlock,
      rightStart: rStart,
      rightLines: rBlock,
      kind: lBlock.length === 0 ? "add" : rBlock.length === 0 ? "remove" : "change",
      inner: inner.length ? inner : undefined,
    });
  }
  return blocks;
}

export function applyBlockCopy(target: "left" | "right", block: DiffBlock, leftText: string, rightText: string) {
  const leftLines = leftText.split(/\r?\n/);
  const rightLines = rightText.split(/\r?\n/);
  if (target === "right") {
    block.rightLines.forEach((rIdx, i) => {
      rightLines[rIdx] = leftLines[block.leftLines[i]] || "";
    });
    return { left: leftText, right: rightLines.join("\n") };
  } else {
    block.leftLines.forEach((lIdx, i) => {
      leftLines[lIdx] = rightLines[block.rightLines[i]] || "";
    });
    return { left: leftLines.join("\n"), right: rightText };
  }
}

export function toUnifiedDiff(leftText: string, rightText: string, fileA = "A.txt", fileB = "B.txt") {
  // Simple unified diff output
  const leftLines = leftText.split(/\r?\n/);
  const rightLines = rightText.split(/\r?\n/);
  let diff = `--- ${fileA}\n+++ ${fileB}\n`;
  let l = 0, r = 0;
  while (l < leftLines.length || r < rightLines.length) {
    if (l < leftLines.length && r < rightLines.length && leftLines[l] === rightLines[r]) {
      l++; r++;
      continue;
    }
    if (l < leftLines.length) diff += `- ${leftLines[l++]}` + "\n";
    if (r < rightLines.length) diff += `+ ${rightLines[r++]}` + "\n";
  }
  return diff;
}
