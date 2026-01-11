# Git Worktree Window Title

A VS Code extension to show the current git worktree in the window title. Useful when working with multiple worktrees of the same repository.

## Variables

This extension provides two variables for use in your `window.title` setting:

| Variable          | Description                         | Example                                   |
| ----------------- | ----------------------------------- | ----------------------------------------- |
| `${worktreeName}` | The folder name of the git worktree | `my-feature-worktree`                     |
| `${worktreePath}` | The full path to the git worktree   | `/Users/you/projects/my-feature-worktree` |

## Usage

This extension provides two variables:

- `${worktreeName}` - The folder name of the git worktree
- `${worktreePath}` - The full path to the git worktree

Add them to your VS Code `window.title` setting:

```json
{
  "window.title": "${dirty}${activeEditorShort}${separator}${worktreeName}"
}
```

## Installation

1. Install from the VS Code Marketplace (search for "Worktree Window Title")
2. Or install the `.vsix` file directly: `code --install-extension worktree-window-title-1.0.0.vsix`.

## How It Works

The extension uses `git rev-parse --show-toplevel` to determine the git worktree root directory, then exposes this as window title variables via VS Code's `registerWindowTitleVariable` API.

## License

MIT
