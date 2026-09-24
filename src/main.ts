import { puzzles, type Puzzle } from "./puzzles.ts";
import { SIZE } from "./nonogram.ts";

const EMPTY = 0;
const FILLED = 1;
const MARKED = 2;

const board = must<HTMLElement>("#board");
const caption = must<HTMLElement>("#caption");
const card = must<HTMLElement>("#card");
const dots = must<HTMLOListElement>("#dots");
const undoButton = must<HTMLButtonElement>("#undo");
const clearButton = must<HTMLButtonElement>("#clear");
const againButton = must<HTMLButtonElement>("#again");
const hint = must<HTMLElement>("#hint");

let index = 0;
let grid: number[] = [];
let history: number[][] = [];
let locked = false;
let advanceTimer = 0;

undoButton.addEventListener("click", () => {
  if (locked || history.length === 0) return;
  grid = history.pop() ?? grid;
  paint();
});

clearButton.addEventListener("click", () => {
  if (locked || grid.every((cell) => cell === EMPTY)) return;
  history.push(grid.slice());
  grid = blank();
  paint();
});

againButton.addEventListener("click", () => {
  index = 0;
  againButton.hidden = true;
  hint.hidden = false;
  startCard(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "z" || (!event.metaKey && !event.ctrlKey)) return;
  event.preventDefault();
  undoButton.click();
});

renderDots();
startCard(false);

function startCard(animate: boolean): void {
  window.clearTimeout(advanceTimer);
  locked = false;
  history = [];
  grid = blank();
  const puzzle = current();
  caption.textContent = "";
  card.classList.remove("is-solved", "is-leaving");
  againButton.hidden = true;
  hint.hidden = index > 0;
  drawBoard(puzzle);
  paint();
  if (animate) {
    card.classList.add("is-leaving");
    requestAnimationFrame(() => card.classList.remove("is-leaving"));
  }
}

function drawBoard(puzzle: Puzzle): void {
  board.replaceChildren();
  board.append(element("div", "corner"));
  for (const clue of puzzle.columns) board.append(clueNode(clue));
  puzzle.rows.forEach((clue, row) => {
    board.append(clueNode(clue));
    for (let column = 0; column < SIZE; column += 1) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "cell";
      cell.dataset.index = String(row * SIZE + column);
      cell.addEventListener("click", onTap);
      board.append(cell);
    }
  });
}

function onTap(event: Event): void {
  if (locked) return;
  const cell = event.currentTarget;
  if (!(cell instanceof HTMLButtonElement)) return;
  const at = Number(cell.dataset.index);
  history.push(grid.slice());
  grid[at] = (grid[at] + 1) % 3;
  paint();
  if (matches(current())) finish();
}

function paint(): void {
  const puzzle = current();
  const cells = board.querySelectorAll<HTMLButtonElement>(".cell");
  cells.forEach((cell, at) => {
    const value = grid[at];
    cell.classList.toggle("is-filled", value === FILLED);
    cell.classList.toggle("is-marked", value === MARKED);
    cell.disabled = locked;
    const row = Math.floor(at / SIZE) + 1;
    const column = (at % SIZE) + 1;
    const name = value === FILLED ? "inked" : value === MARKED ? "marked empty" : "blank";
    cell.setAttribute("aria-label", `Row ${row}, column ${column}, ${name}`);
  });
  undoButton.disabled = locked || history.length === 0;
  clearButton.disabled = locked;
  dots.querySelectorAll("li").forEach((dot, dotIndex) => {
    const state = dotIndex < index ? "done" : dotIndex === index ? "now" : "ahead";
    dot.dataset.state = state;
  });
  board.setAttribute("aria-label", `${puzzle.title} card, ${index + 1} of ${puzzles.length}`);
}

function finish(): void {
  locked = true;
  caption.textContent = current().title;
  card.classList.add("is-solved");
  paint();
  const last = index === puzzles.length - 1;
  const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 720;
  advanceTimer = window.setTimeout(() => {
    if (last) {
      againButton.hidden = false;
      hint.hidden = true;
      locked = true;
      return;
    }
    index += 1;
    startCard(true);
  }, delay);
}

function matches(puzzle: Puzzle): boolean {
  for (let row = 0; row < SIZE; row += 1) {
    for (let column = 0; column < SIZE; column += 1) {
      const inked = grid[row * SIZE + column] === FILLED;
      if (inked !== Boolean(puzzle.cells[row][column])) return false;
    }
  }
  return true;
}

function renderDots(): void {
  dots.replaceChildren();
  for (const puzzle of puzzles) {
    const item = document.createElement("li");
    item.dataset.state = "ahead";
    item.setAttribute("aria-label", puzzle.title);
    dots.append(item);
  }
}

function current(): Puzzle {
  return puzzles[index];
}

function blank(): number[] {
  return Array.from({ length: SIZE * SIZE }, () => EMPTY);
}

function clueNode(clue: readonly number[]): HTMLElement {
  const node = element("div", "clue");
  for (const number of clue) {
    const part = document.createElement("span");
    part.textContent = String(number);
    node.append(part);
  }
  return node;
}

function element(tag: string, className: string): HTMLElement {
  const node = document.createElement(tag);
  node.className = className;
  return node;
}

function must<T extends Element>(selector: string): T {
  const node = document.querySelector<T>(selector);
  if (!node) throw new Error(`Missing ${selector}`);
  return node;
}
