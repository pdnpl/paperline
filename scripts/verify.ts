import { countSolutions, SIZE } from "../src/nonogram.ts";
import { FIRST_DOUBLE_ID, puzzles } from "../src/puzzles.ts";

const required = ["Arrow", "Heart", "Coffee", "Cat"];
const titles = new Set(puzzles.map((puzzle) => puzzle.title));
const missing = required.filter((title) => !titles.has(title));
if (missing.length) throw new Error(`Missing pictures: ${missing.join(", ")}`);
if (puzzles.length < 12 || puzzles.length > 19) {
  throw new Error(`Expected a dozen-odd cards, found ${puzzles.length}`);
}

const seen = new Set<string>();
let doublesStarted = false;

for (const puzzle of puzzles) {
  if (puzzle.cells.length !== SIZE) throw new Error(`${puzzle.id} is not 5 rows`);
  const key = puzzle.cells.map((row) => row.join("")).join("");
  if (seen.has(key)) throw new Error(`Duplicate picture: ${puzzle.id}`);
  seen.add(key);

  for (const row of puzzle.cells) {
    if (row.length !== SIZE || row.some((cell) => cell !== 0 && cell !== 1)) {
      throw new Error(`${puzzle.id} has a cell outside 0 or 1`);
    }
  }

  const single = [...puzzle.rows, ...puzzle.columns].every((clue) => clue.length === 1);
  if (puzzle.id === FIRST_DOUBLE_ID) doublesStarted = true;
  if (!doublesStarted && !single) {
    throw new Error(`${puzzle.id} uses two runs before the second half`);
  }
  if (doublesStarted && puzzle.id === FIRST_DOUBLE_ID && single) {
    throw new Error("Frame should introduce a two-run line");
  }

  const solutions = countSolutions(puzzle.rows, puzzle.columns);
  if (solutions !== 1) {
    throw new Error(`${puzzle.id} has ${solutions} solutions`);
  }
  console.log(
    `${puzzle.title.padEnd(8)} rows ${format(puzzle.rows)}  cols ${format(puzzle.columns)}`,
  );
}

if (!doublesStarted) throw new Error("Series never introduces two-run lines");
console.log(`ok ${puzzles.length} unique cards`);

function format(clues: readonly (readonly number[])[]): string {
  return clues.map((clue) => clue.join("+")).join(" ");
}
