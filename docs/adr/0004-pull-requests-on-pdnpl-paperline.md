# ADR 0004: Pull requests on pdnpl/paperline

## Status

Accepted

## Context

The game lives in the Polish Developer Network GitHub organization (`pdnpl`). Work should land through pull requests, with review completed in the same unattended flow.

## Decision

The repository is `pdnpl/paperline`. `main` is protected by a ruleset that requires a pull request. Continuous integration runs the puzzle verifier and the production build. The agent opens the implementation pull request, reviews it, and merges it.

The product name Paperline was chosen by Rafał from a short list. Other product decisions in these ADRs were made without a further prompt.

## Consequences

Direct pushes to `main` fail once the ruleset is active. A solo author may need a repository admin merge if GitHub rejects a self-approval.
