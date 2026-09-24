/** A line clue is one run, or two runs separated by at least one empty cell. */
export type Clue = readonly [number] | readonly [number, number];

export const SIZE = 5;

export function clueFromLine(line: readonly number[]): Clue {
  const runs: number[] = [];
  let count = 0;
  for (const cell of line) {
    if (cell) count += 1;
    else if (count) {
      runs.push(count);
      count = 0;
    }
  }
  if (count) runs.push(count);
  if (runs.length === 0) return [0];
  if (runs.length === 1) return [runs[0]];
  if (runs.length === 2) return [runs[0], runs[1]];
  throw new Error(`Line has ${runs.length} runs; Paperline allows one or two.`);
}

/** Bitmasks of every legal placement of a clue on a line of SIZE. */
export function placements(clue: Clue): number[] {
  if (clue[0] === 0) return [0];
  const masks: number[] = [];
  const place = (index: number, start: number, mask: number): void => {
    if (index === clue.length) {
      masks.push(mask);
      return;
    }
    const length = clue[index];
    let reserved = 0;
    for (let next = index + 1; next < clue.length; next += 1) {
      reserved += clue[next] + 1;
    }
    const lastStart = SIZE - length - reserved;
    for (let cursor = start; cursor <= lastStart; cursor += 1) {
      let next = mask;
      for (let bit = 0; bit < length; bit += 1) next |= 1 << (cursor + bit);
      place(index + 1, cursor + length + 1, next);
    }
  };
  place(0, 0, 0);
  return masks;
}

export function columnClues(grid: readonly (readonly number[])[]): Clue[] {
  return Array.from({ length: SIZE }, (_, column) =>
    clueFromLine(grid.map((row) => row[column])),
  );
}

export function rowClues(grid: readonly (readonly number[])[]): Clue[] {
  return grid.map((row) => clueFromLine(row));
}

/** How many grids satisfy the clues. Paperline puzzles must return 1. */
export function countSolutions(rows: readonly Clue[], columns: readonly Clue[]): number {
  const rowMasks = rows.map((clue) => placements(clue));
  const columnNeed = columns.map((clue) => placements(clue));
  let found = 0;

  const walk = (row: number, cols: number[]): void => {
    if (found > 1) return;
    if (row === SIZE) {
      for (let column = 0; column < SIZE; column += 1) {
        if (!columnNeed[column].includes(cols[column])) return;
      }
      found += 1;
      return;
    }
    for (const mask of rowMasks[row]) {
      const next = cols.slice();
      for (let column = 0; column < SIZE; column += 1) {
        if (mask & (1 << column)) next[column] |= 1 << row;
      }
      walk(row + 1, next);
    }
  };

  walk(0, Array.from({ length: SIZE }, () => 0));
  return found;
}
