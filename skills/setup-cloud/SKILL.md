---
description: Make paved-path work in Claude Code cloud sessions for the current repository. Adds a cloud-only SessionStart hook that installs the paved-path plugin and loads its starting rules, because cloud sessions only run hooks from the repository itself, never from the user's own machine. Use when the user says "set up cloud", "make this work in cloud sessions", or after running pave on a project that will be worked on in the cloud.
disable-model-invocation: true
---

# Set up paved-path for cloud sessions

Cloud sessions start in a fresh container. They do not see the user's `~/.claude`, and they do not install plugins listed in project settings. They do run SessionStart hooks from the repository's `.claude/settings.json`. So the setup has to live in the repository.

1. Copy `templates/paved-path.sh` from this skill's folder to `.claude/hooks/paved-path.sh` in the repository, and make it executable.
2. Copy `../setup-global/global-claude.md` from this skill's folder to `.claude/hooks/paved-path-rules.md`. The hook prints it, so the rules load even if the plugin cannot be installed.
3. Register the hook in `.claude/settings.json`. Merge with what is there; never drop existing hooks or settings:
   ```json
   {
     "hooks": {
       "SessionStart": [
         {
           "matcher": "startup|clear|compact",
           "hooks": [{ "type": "command", "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/paved-path.sh" }]
         }
       ]
     }
   }
   ```
4. Test it the way a cloud session runs it, with a throwaway config folder so the current setup is untouched:
   ```
   CLAUDE_CONFIG_DIR="$(mktemp -d)" CLAUDE_CODE_REMOTE=true CLAUDE_PROJECT_DIR="$PWD" .claude/hooks/paved-path.sh
   ```
   Expect the starting rules and one line saying whether the plugin installed. Then run it without `CLAUDE_CODE_REMOTE` and expect no output: on a local machine the plugin's own hook supplies the rules.
5. Commit the three files with a plain-language message, and push if the user wants it on the default branch. Hooks only take effect in cloud sessions once they are on the branch the session starts from.

How it behaves:
- Local sessions: does nothing.
- Cloud session where the plugin is already installed (a cached container): does nothing, because the plugin's own hook loads the rules.
- Otherwise: installs the plugin from `BrianJenney/agent-helpers`, prints the rules, and says whether the install worked. It never blocks the session from starting.

If the install keeps failing, the agent-helpers repo is not reachable from that cloud session. Either make the repo public or add it to the session's repositories.

To update the rules in a repository later, run this skill again.
