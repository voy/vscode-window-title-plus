import * as vscode from "vscode";
const log = (message: string) => output.appendLine(message);
import { execSync } from "child_process";
import { basename, dirname } from "path";

const prefix = "vscode-worktree-window-title:";
const output = vscode.window.createOutputChannel("Worktree Window Title");

function getWorktreePath(workingDir: string): string | undefined {
  try {
    const result = execSync("git rev-parse --show-toplevel", {
      cwd: workingDir,
      encoding: "utf8",
    }).trim();
    log(`getWorktreePath: workingDir="${workingDir}" result="${result}"`);
    return result;
  } catch (e) {
    log(`getWorktreePath: workingDir="${workingDir}" error="${e}"`);
    return undefined;
  }
}

function isLinkedWorktree(workingDir: string): boolean {
  try {
    const gitDir = execSync("git rev-parse --git-dir", {
      cwd: workingDir,
      encoding: "utf8",
    }).trim();
    const commonDir = execSync("git rev-parse --git-common-dir", {
      cwd: workingDir,
      encoding: "utf8",
    }).trim();
    const result = gitDir !== commonDir;
    log(
      `isLinkedWorktree: workingDir="${workingDir}" gitDir="${gitDir}" commonDir="${commonDir}" result=${result}`
    );
    return result;
  } catch (e) {
    log(`isLinkedWorktree: workingDir="${workingDir}" error="${e}"`);
    return false;
  }
}

function getWorktreeDir(): string | undefined {
  const folders = vscode.workspace.workspaceFolders;
  log(`getWorktreeDir: folders=${folders?.length ?? 0}`);
  if (folders && folders.length > 0) {
    const dir = folders[0]!.uri.fsPath;
    log(`getWorktreeDir: dir="${dir}"`);
    return dir;
  }
  log(`getWorktreeDir: no workspace folders`);
  return undefined;
}

const keys = {
  worktreeName: () => {
    const worktreeDir = getWorktreeDir();
    if (!worktreeDir) return undefined;
    const worktreePath = getWorktreePath(worktreeDir);
    return worktreePath ? basename(worktreePath) : undefined;
  },
  worktreePath: () => {
    const worktreeDir = getWorktreeDir();
    if (!worktreeDir) return undefined;
    return getWorktreePath(worktreeDir);
  },
  repositoryName: () => {
    const worktreeDir = getWorktreeDir();
    if (!worktreeDir || !isLinkedWorktree(worktreeDir)) return undefined;
    const worktreePath = getWorktreePath(worktreeDir);
    return worktreePath ? basename(dirname(worktreePath)) : undefined;
  },
} as const satisfies Record<string, () => string | undefined>;

const updateValues = async () =>
  await Promise.all(
    Object.entries(keys).map(([key, get]) => {
      const value = get();
      log(`${prefix} ${key}: ${value}`);
      return vscode.commands.executeCommand("setContext", `${prefix}${key}`, value);
    })
  );

export const activate = async (context: vscode.ExtensionContext) => {
  log(`${prefix} activated`);
  await updateValues();

  await Promise.all(
    Object.keys(keys).map((key) =>
      vscode.commands.executeCommand("registerWindowTitleVariable", key, `${prefix}${key}`)
    )
  );

  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(updateValues),
    vscode.window.onDidChangeActiveTextEditor(updateValues),
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("window.title")) {
        const title = vscode.workspace.getConfiguration("window").get<string>("title");
        log(`${prefix} window.title changed: ${title}`);
      }
    })
  );
};

export const deactivate = async () => {
  log(`${prefix} deactivated`);
  await Promise.all(
    Object.keys(keys).map((key) =>
      vscode.commands.executeCommand("setContext", `${prefix}${key}`, undefined)
    )
  );
};
