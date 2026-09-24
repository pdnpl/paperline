# ADR 0002: Unique 5×5 line puzzles

## Status

Accepted

## Context

Each card is a 5×5 picture. Every row and every column has one number, or two. A number is the length of one black run. Two numbers are two runs with at least one empty cell between them, ordered from the left or from the top. The series must start with pictures that use only single numbers, then introduce two-run lines. Each clue set must describe exactly one picture.

## Decision

Pictures are stored as ink masks. Clues are derived from those masks. `scripts/verify.ts` exhaustively counts solutions and fails the build check unless every card has exactly one solution, lines never have more than two runs, and two-run clues begin at Frame. The set is sixteen cards: Line, Bar, Plus, Corner, Steps, Tee, Diamond, Arrow, Tree, House, Boat, Heart, Frame, Flag, Coffee, Cat.

A tap cycles a square through ink, a pencil cross, and blank. The cross is only a note. The card is complete when the ink matches the picture. Undo restores the previous grid, including a clear. There is no clock and no score. The next card follows a short pause. The last card offers Again.

## Consequences

New pictures have to pass the verifier before they ship. Ambiguous masks are rejected instead of being patched with extra rules.
