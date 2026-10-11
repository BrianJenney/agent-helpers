---
description: Install or update the paved-path starting rules in the user's global ~/.claude/CLAUDE.md, so every new session decides whether to use paved-path (a must for non-technical founders, offered first for new and contract projects). Use when the user says "set up global", "add this to my global CLAUDE.md", or after installing or updating the plugin.
disable-model-invocation: true
---

# Set up the global starting rules

The block to install is `global-claude.md`, next to this file. It sits between the markers `<!-- paved-path:start -->` and `<!-- paved-path:end -->`.

1. Read `global-claude.md` from this skill's folder.
2. Find the user's global file: `$CLAUDE_CONFIG_DIR/CLAUDE.md` if that variable is set, otherwise `~/.claude/CLAUDE.md`. Create the folder and the file if they do not exist.
3. If the file already has a block between those markers, replace only that block. Otherwise append the block at the end, after one blank line. Never change anything outside the markers.
4. Show the user the result: the file path and a diff of what changed.
5. Tell them it takes effect in new sessions.

This only changes the machine you are running on. In a cloud session the home folder is temporary, so say that the user should run this skill on their own computer to keep it.
