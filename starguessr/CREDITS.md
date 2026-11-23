# STARGUESSR - credits

## Star data: HYG Database (CC BY-SA 4.0)

Every star in the game comes from the **HYG Database v4.1** by David Nash (astronexus), which combines the Hipparcos,
Yale Bright Star and Gliese catalogues.

- Source: https://github.com/astronexus/HYG-Database (`hyg/CURRENT/hygdata_v41.csv`)
- Licence: **Creative Commons Attribution-ShareAlike 4.0 International** (https://creativecommons.org/licenses/by-sa/4.0/)
- Fetched by `tools/fetch_hyg.py` into `data_raw/` (the CSV, the licence file and the README). The script only downloads data.

### Changes made (the adapted database is shared under the same CC BY-SA 4.0 licence)

`tools/pack_stars.py` turns the CSV into `assets/stars.bin` (1.3 MB) and `assets/stars.json` (124 KB):

- **Kept:** the Sun, every star within 1,000 light-years that could look brighter than magnitude 8.7 from Earth or from any
  round's viewpoint, all named stars, every star used by a constellation line or a round, and very luminous stars
  (absolute magnitude below -2) out to 3,000 light-years. That is 78,440 of HYG's 119,626 rows.
- **Converted:** equatorial x/y/z (parsecs) to galactic coordinates in light-years, stored as a 16-bit unit vector plus a
  16-bit square-root-coded distance. Absolute magnitude is kept to 0.01 mag, the B-V colour index to about 0.012, and the
  spectral class as one byte.
- **Merged:** members of a multiple-star system (HYG `comp_primary`) are placed at their primary's position, so separate
  parallax measurements do not spread one binary over a light-year.
- **Names:** HYG proper names, plus readable Bayer / Flamsteed names ("Tau Ceti", "61 Cygni") built from the `bayer`,
  `flam` and `con` columns, plus Gliese numbers for stars within 120 light-years.

The game credits HYG and its licence on its About & credits screen.

## Constellation lines

Drawn for this game by hand (`tools/conlines.py`): simple stick figures for 40 constellations written as walks through
Bayer / Flamsteed designations, which `pack_stars.py` resolves to HYG stars. No third-party line data is used.

## Milky Way

Procedural: a GPU shader bakes the band, the bulge, dust lanes, star speckle, a few nebula glows and the Magellanic
Clouds into a texture at start-up (`src/milkyway.js`). No images are used.

## Fun facts

Written for this game from well-known astronomy facts. Stars without a hand-written fact get one generated from their
catalogue numbers (`src/famous2.js`).

## Code, fonts and sounds

- three.js r128, MIT licence, loaded from cdnjs.
- Orbitron and Exo 2 from Google Fonts, SIL Open Font Licence 1.1.
- All sounds are synthesised live with WebAudio; there are no audio files.
