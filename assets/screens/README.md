# Screen-by-screen asset map

The `assets/` folder has only two top-level folders: `screens/` and `shared/`.

## Screen-specific assets

- `screens/welcome/`: welcome background, Create Game and Join Game buttons, settings artwork, menus, logo, and welcome-screen audio.
- `screens/lobby/`: lobby background, lobby buttons, player UI panels, and lobby audio.
- `screens/main-game/`: game-screen backgrounds, controls, UI, all card artwork, and main-game audio.
- `screens/winner/`: winner-screen backgrounds, buttons, UI, and winner-screen audio.

Each screen owns its own `backgrounds/`, `buttons/`, `ui/`, and `audio/` folders as needed. Put card artwork in `screens/main-game/cards/`.

## Shared assets

- `shared/characters/`: character portraits used by both the Lobby and Main Game.

## Rules

1. Add new files to the screen that owns them, except character portraits shared by Lobby and Main Game.
2. Keep filenames lowercase and hyphenated, with the correct extension.
3. Whenever an asset moves or is renamed, update every code reference in the same change.
4. Do not add new files to old top-level categories such as `assets/audio/`, `assets/backgrounds/`, `assets/buttons/`, `assets/cards/`, `assets/characters/`, `assets/logo/`, or `assets/ui/`.
5. The current app code references welcome, lobby, and shared character assets. Main Game and Winner screen UI/logic still need to be built.
