import { computeDiff, applyBlockCopy, toUnifiedDiff, DiffOptions } from './diffEngine';

describe('diffEngine', () => {
  it('should compute line-based diff', () => {
    const left = 'a\nb\nc';
    const right = 'a\nb\nd';
    const diff = computeDiff(left, right, {});
    expect(diff.length).toBe(1);
    expect(diff[0].kind).toBe('change');
  });

  it('should apply block copy left to right', () => {
    const left = 'a\nb\nc';
    const right = 'a\nb\nd';
    const diff = computeDiff(left, right, {});
    const result = applyBlockCopy('right', diff[0], left, right);
    expect(result.right).toContain('c');
  });

  it('should export unified diff', () => {
    const left = 'a\nb\nc';
    const right = 'a\nb\nd';
    const diff = toUnifiedDiff(left, right);
    expect(diff).toContain('--- A.txt');
    expect(diff).toContain('+++ B.txt');
    expect(diff).toContain('- c');
    expect(diff).toContain('+ d');
  });
});
