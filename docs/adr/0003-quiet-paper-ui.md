# ADR 0003: Quiet paper UI

## Status

Accepted

## Context

The game should feel like one finished drawing on a phone: quiet, no opponent, about a minute or two. Visual quality and performance come before extra features.

## Decision

The screen is a paper card on a warm desk. Type is a serif already installed on the system, so the first paint does not wait on a font download. Ink, crosses, and the picture name are CSS transitions. Motion is skipped when the visitor asks for reduced motion. Controls are text buttons at least 44px tall. Progress is a row of dots, not a score. There is no sound.

The board is DOM rather than canvas so each square is a button with a name. Keyboard undo is Ctrl or Command Z.

Player-facing copy is English, matching the product name. Notes to the author stay separate from the repository language.

## Consequences

The page stays small and static. A darker theme, audio, or a tutorial flow would be a new decision.
