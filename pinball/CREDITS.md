# PINBALL WORKSHOP - credits

All artwork, sounds and music in this game are made by code at runtime:

- **Playfield artwork** (space, haunted, candy, ocean, jungle, robot factory) is painted procedurally on a canvas (`src/art_a.js`, `src/art_b.js`).
- **3D models** (flippers, bumpers, slingshots, ramps, rails, cabinet) are built from Three.js primitives and extrusions.
- **Reflections** come from a procedurally drawn studio environment map (`src/r3_init.js`), not an HDRI file.
- **Sounds and music** are synthesised with the Web Audio API (`src/audio_a.js`, `src/audio_b.js`).
- **Dot-matrix font** is an original 5x7 pixel font (`src/dmd_font.js`).

No files are stored in `assets/` - there are no third-party asset files to credit.

Libraries and fonts loaded at runtime:

- [three.js](https://threejs.org/) r128 from cdnjs - MIT licence.
- [Bungee](https://fonts.google.com/specimen/Bungee) and [Nunito](https://fonts.google.com/specimen/Nunito) from Google Fonts - SIL Open Font License 1.1.
