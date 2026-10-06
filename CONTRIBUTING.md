# Contributing to satteri-reladraw

Thank you for your interest in contributing to `satteri-reladraw`! This guide explains how to set up the development environment, make changes, run tests, and submit pull requests.

## Code of Conduct & AI Policy

Please review these policies before contributing:

1. **[Code of Conduct](CODE_OF_CONDUCT.md)**: We strive to provide a welcoming, respectful, and safe community.
2. **[AI Contribution Policy](AI_POLICY.md)**: All contributions must be your own work. Submissions from automated accounts, bots, or unverified AI generation are not accepted. Ensure all code, PR descriptions, and discussions reflect your personal understanding.

## Development Setup

This project uses [Bun](https://bun.com) as the package manager and test runner, along with [TypeScript](https://www.typescriptlang.org/), [oxlint](https://oxc.rs/), [oxfmt](https://oxc.rs/), and [hk](https://hk.jdx.dev/) for Git hooks.

### Prerequisites

- [Bun](https://bun.com) v1.2+
- [Git](https://git-scm.com)
- Optional: [hk](https://hk.jdx.dev) CLI for local Git hook execution

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/t128n/satteri-reladraw.git
cd satteri-reladraw

# Install root dependencies
bun install

# Install docs dependencies
cd docs && bun install && cd ..
```

## Development Commands

All standard scripts are defined in `package.json`:

| Command | Description |
| : | : |
| `bun test` | Runs test suites with Bun's native test runner |
| `bun run typecheck` | Checks TypeScript types with `tsc --noEmit` |
| `bun run lint` | Lints the codebase with `oxlint` |
| `bun run lint:fix` | Fixes lint errors with `oxlint --fix` |
| `bun run format` | Formats source files with `oxfmt` |
| `bun run format:check` | Verifies code formatting with `oxfmt --check` |
| `bun run build` | Builds distribution bundles to `dist/` |
| `bun run docs:dev` | Runs documentation dev server at `localhost:4321` |
| `bun run docs:build` | Compiles documentation site |
| `bun run changeset` | Prompts to create a release changeset entry |

## Pre-Commit Hooks

Git hooks are powered by `hk` and run automatically on `git commit`. They verify:

- Trailing whitespace
- Final newlines
- `oxlint` lint rules
- `oxfmt` code style formatting

To run all checks across all repo files locally:

```bash
hk check --all
```

## Submitting Pull Requests

### 1. Issue First

Please ensure there is an open issue discussing the bug or proposed feature before opening a pull request.

### 2. Conventional Commits

We follow [Conventional Commits](https://www.conventionalcommits.org/). PR titles should use the standard format:

`type(scope): description`

- **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- **Examples**:
  - `feat(theming): add synthwave theme preset`
  - `fix(render): resolve background fill for transparent diagrams`
  - `docs: update Astro integration guide`

### 3. Changesets for Releases

If your PR introduces a feature, bugfix, or breaking change intended for release to npm, generate a changeset:

```bash
bun run changeset
```

Follow the interactive prompts to choose the semver bump type (`patch`, `minor`, `major`) and enter a human-readable summary.

### 4. Verification Checklist

Before opening your pull request, ensure:

- [ ] All unit and integration tests pass: `bun test`
- [ ] TypeScript type checks pass: `bun run typecheck`
- [ ] Code is formatted and linted: `bun run format:check && bun run lint`
- [ ] The build succeeds: `bun run build`
- [ ] Documentation site builds without errors: `bun run docs:build`

## Credits & Acknowledgements

- **[npmx.dev](https://github.com/npmx-dev/npmx.dev)**: General FOSS guidance, contributor workflow inspiration, and the design of the GitHub Issue Forms and Pull Request templates.
- **[reladraw](https://reladraw.dev)**: The relative constraint-based diagramming engine.
- **[Sätteri](https://satteri.bruits.org)**: The modern Markdown and MDX content compiler.

## License

By contributing to `satteri-reladraw`, you agree that your contributions will be licensed under the [MIT License](LICENSE).
