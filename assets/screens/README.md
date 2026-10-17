# RISK THE WIN — Screen Artwork Map

This is the source of truth for screen-specific artwork. Keep each screen's background and buttons in that screen's folder. Do not move files without updating every code reference in the same change.

## Screen folders
- `welcome/backgrounds/`: welcome screen background.
- `welcome/buttons/`: Create Game, Join Game, Settings, Settings menu, and How to Play artwork.
- `lobby/backgrounds/`: shared host/waiting lobby background.
- `lobby/buttons/`: lobby button artwork.
- `lobby/ui/`: lobby panels and other non-button interface artwork.
- `main-game/backgrounds/`: gameplay table background.
- `main-game/buttons/`: gameplay controls, including wake-up, emoji, draw, sort/straighten, and push-to-talk artwork.
- `winter/backgrounds/` and `winter/buttons/`: final/winter screen artwork.

Host and guests use the same lobby screen with role-specific controls.

## Shared assets (not duplicated per screen)
- `assets/characters/`: shared character portraits; use these on both lobby and gameplay screens.
- `assets/cards/`: card artwork grouped by card type.
- `assets/logo/`: game logo.
- `assets/audio/`: sound and music assets.

Use lowercase, hyphenated filenames and the correct extension. Existing card and character art is preserved. Missing artwork is not fabricated or renamed during folder cleanup.
