# RISK THE WIN — Screen Artwork Map

The game has exactly four screens. Put new screen-specific artwork in the matching screen folder below. Do not put screen-specific artwork in another screen's folder.

## Four screens

1. `welcome/` — welcome background and Create Game / Join Game / Settings artwork.
2. `lobby/` — shared host/waiting lobby background and lobby buttons. Host and guests use the same lobby screen with role-specific controls.
3. `main-game/` — card-playing table background, gameplay controls, and the walkie-talkie button artwork (visual only until voice is implemented).
4. `winter/` — final/winter screen artwork. This is the last screen in the game flow.

Each screen folder has `backgrounds/` and `buttons/` subfolders. Put full-screen art in `backgrounds/`; put individual button art in `buttons/`. Use lowercase, hyphenated filenames with clear names and the correct extension.

## Important existing files

Existing artwork is being preserved in its current paths for now; do not delete or rename it while adding new art:

- Welcome background: `assets/backgrounds/welcome-background.png`
- Lobby background/art: `assets/backgrounds/lobby-character-selection.png`
- Welcome buttons: `assets/buttons/create-game.png`, `assets/buttons/join-game.png`, `assets/buttons/settings-button.png`
- Other existing menu art: `assets/buttons/how-to-play-menu.png`, `assets/buttons/settings-menu.png`
- Main-game artwork folders: `assets/backgrounds/main-game/`, `assets/buttons/main-game/`

This map is the source of truth for where new artwork belongs. Existing files should only be moved later as a deliberate, verified cleanup so the app's image paths do not break.