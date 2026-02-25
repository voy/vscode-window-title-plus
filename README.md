# Git Worktree Window Title

A VS Code extension to show the current git worktree in the window title. Useful when working with multiple worktrees of the same repository.

## Variables

| Variable            | Description                                                             | Example                                   |
| ------------------- | ----------------------------------------------------------------------- | ----------------------------------------- |
| `${worktreeName}`   | The folder name of the git worktree                                     | `feature-auth`                            |
| `${repositoryName}` | The parent folder name (repository). Only set inside a linked worktree. | `my-project`                              |
| `${worktreePath}`   | The full path to the git worktree                                       | `/Users/you/projects/my-project/feature-auth` |

## Usage

Add variables to your VS Code `window.title` setting:

```json
{
  "window.title": "${dirty}${activeEditorShort}${separator}${repositoryName}${separator}${worktreeName}"
}
```

This supports layouts where worktrees live as subdirectories of a repository folder:

```
my-project/
├── .bare/
├── main/
├── feature-auth/
└── bugfix-login/
```

With this setup, each window title shows the repository, worktree, and file at a glance — so you always know which repo and branch you're editing:

```
server.py — my-project — main
server.py — my-project — feature-auth
```

`${repositoryName}` is only populated inside a linked worktree. In a plain repository it is empty, so separators around it collapse automatically — the extension works fine without worktrees too.

## Installation

1. Install from the VS Code Marketplace (search for "Git Worktree Window Title")
2. Or install the `.vsix` file directly: `code --install-extension vscode-worktree-window-title-1.0.4.vsix`

## How It Works

The extension uses `git rev-parse --show-toplevel` to determine the worktree root and detects linked worktrees by comparing `--git-dir` with `--git-common-dir`. Variables are exposed via VS Code's `registerWindowTitleVariable` API.

## License

MIT
