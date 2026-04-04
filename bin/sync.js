#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const DEFAULT_EXCLUDES = new Set(["node_modules", ".git"]);

function printHelp() {
  console.log(`
Usage:
  sync -t <target-folder> [-m "commit message"]

Options:
  -t, --target   Target folder path
  -m, --message  Git commit message (commit in target folder after sync)
  -h, --help     Show help

Default excludes:
  node_modules, .git

Example:
  sync -t ../target-folder -m "git first commit"
`);
}

function parseArgs(argv) {
  const args = {
    target: "",
    message: "",
    help: false
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === "-t" || arg === "--target") {
      args.target = argv[i + 1];
      i++;
    } else if (arg === "-m" || arg === "--message") {
      args.message = argv[i + 1];
      i++;
    } else if (arg === "-h" || arg === "--help") {
      args.help = true;
    } else {
      console.warn(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function exists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function isSubPath(parent, child) {
  const relative = path.relative(parent, child);
  return !!relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function shouldExclude(name) {
  return DEFAULT_EXCLUDES.has(name);
}

function copyCurrentFolderContentsToTarget(sourceDir, targetDir) {
  if (!exists(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const items = fs.readdirSync(sourceDir, { withFileTypes: true });

  for (const item of items) {
    if (shouldExclude(item.name)) {
      continue;
    }

    const srcPath = path.join(sourceDir, item.name);
    const destPath = path.join(targetDir, item.name);

    // 避免把目标目录自己再拷贝进去
    if (path.resolve(srcPath) === path.resolve(targetDir)) {
      continue;
    }

    fs.cpSync(srcPath, destPath, {
      recursive: true,
      force: true
    });
  }
}

function runGitCommit(targetDir, message) {
  const gitDir = path.join(targetDir, ".git");
  if (!exists(gitDir)) {
    throw new Error(`Target folder is not a git repository: ${targetDir}`);
  }

  const addResult = spawnSync("git", ["add", "-A"], {
    cwd: targetDir,
    stdio: "inherit",
    shell: process.platform === "win32"
  });

  if (addResult.status !== 0) {
    throw new Error("git add failed");
  }

  const commitResult = spawnSync("git", ["commit", "-m", message], {
    cwd: targetDir,
    stdio: "inherit",
    shell: process.platform === "win32"
  });

  if (commitResult.status !== 0) {
    throw new Error("git commit failed");
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  if (!args.target) {
    console.error("Error: target folder is required.");
    printHelp();
    process.exit(1);
  }

  const sourceDir = process.cwd();
  const targetDir = path.resolve(sourceDir, args.target);

  if (path.resolve(sourceDir) === path.resolve(targetDir)) {
    console.error("Error: source and target cannot be the same folder.");
    process.exit(1);
  }

  if (isSubPath(sourceDir, targetDir)) {
    console.error("Error: target folder cannot be inside current source folder.");
    process.exit(1);
  }

  try {
    console.log(`Source: ${sourceDir}`);
    console.log(`Target: ${targetDir}`);
    console.log(`Excludes: ${Array.from(DEFAULT_EXCLUDES).join(", ")}`);
    console.log("Syncing files...");

    copyCurrentFolderContentsToTarget(sourceDir, targetDir);

    console.log("Sync completed.");

    if (args.message) {
      console.log("Running git commit in target folder...");
      runGitCommit(targetDir, args.message);
      console.log("Git commit completed.");
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();