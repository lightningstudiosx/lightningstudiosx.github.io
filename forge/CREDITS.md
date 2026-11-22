# THE FORGE - credits

Every photographed surface, sky and prop in THE FORGE comes from **Poly Haven** (polyhaven.com), released under **CC0 1.0**
(public domain, no attribution required - credited here anyway, with thanks). Originals are fetched into `assets_raw/` by
`tools/fetch_assets.py` and converted by `tools/optimise_assets.py` into the files in `assets/` (one .glb per model with
512 px - 1k JPEG textures, a few models decimated; 1k PBR texture sets; 1k HDRIs). Total `assets/` size: **13.7 MB**.

Everything else - the anvil, hearth, bellows, grindstone, quench barrel, tongs, the deformable workpiece and its steel shader
(glow, scale, temper colours, Damascus, hamon), fittings, targets, sparks, steam and all sounds - is made in code for this game.

The sledgehammer model was tried and dropped (modern fibreglass handle). No real brand names or characters are used.

## 3D models (Poly Haven, CC0)

| Asset | Author(s) | Licence | Source | Size in game |
|---|---|---|---|---|
| Bench Vice 01 | Yann Kervran, Antanas Kep | CC0 1.0 | [polyhaven.com/a/bench_vice_01](https://polyhaven.com/a/bench_vice_01) | 234 KB |
| Cross Pein Hammer | Tics | CC0 1.0 | [polyhaven.com/a/cross_pein_hammer](https://polyhaven.com/a/cross_pein_hammer) | 162 KB |
| Kite Shield | Ulan Cabanilla | CC0 1.0 | [polyhaven.com/a/kite_shield](https://polyhaven.com/a/kite_shield) | 327 KB |
| Lantern 01 | Rajil Jose Macatangay | CC0 1.0 | [polyhaven.com/a/Lantern_01](https://polyhaven.com/a/Lantern_01) | 300 KB |
| Tree Stump 01 | Rob Tuytel | CC0 1.0 | [polyhaven.com/a/tree_stump_01](https://polyhaven.com/a/tree_stump_01) | 941 KB |
| Wicker Basket 01 | Kuutti Siitonen | CC0 1.0 | [polyhaven.com/a/wicker_basket_01](https://polyhaven.com/a/wicker_basket_01) | 308 KB |
| Wine Barrel 01 | James Ray Cock | CC0 1.0 | [polyhaven.com/a/wine_barrel_01](https://polyhaven.com/a/wine_barrel_01) | 301 KB |
| Wooden Bucket 01 | James Ray Cock | CC0 1.0 | [polyhaven.com/a/wooden_bucket_01](https://polyhaven.com/a/wooden_bucket_01) | 293 KB |
| Wooden Crate 01 | James Ray Cock | CC0 1.0 | [polyhaven.com/a/wooden_crate_01](https://polyhaven.com/a/wooden_crate_01) | 313 KB |
| Wooden Hammer 01 | James Ray Cock | CC0 1.0 | [polyhaven.com/a/wooden_hammer_01](https://polyhaven.com/a/wooden_hammer_01) | 206 KB |
| Wooden Stool 01 | Kuutti Siitonen | CC0 1.0 | [polyhaven.com/a/wooden_stool_01](https://polyhaven.com/a/wooden_stool_01) | 427 KB |
| Wooden Table 03 | Gabriel Radić | CC0 1.0 | [polyhaven.com/a/WoodenTable_03](https://polyhaven.com/a/WoodenTable_03) | 561 KB |

## PBR textures (diffuse, normal, roughness at 1k) (Poly Haven, CC0)

| Asset | Author(s) | Licence | Source | Size in game |
|---|---|---|---|---|
| Bark Brown 02 | Rob Tuytel | CC0 1.0 | [polyhaven.com/a/bark_brown_02](https://polyhaven.com/a/bark_brown_02) | 708 KB |
| Brown Leather | Rob Tuytel | CC0 1.0 | [polyhaven.com/a/brown_leather](https://polyhaven.com/a/brown_leather) | 730 KB |
| Dirt Floor | eye-candy.xyz | CC0 1.0 | [polyhaven.com/a/dirt_floor](https://polyhaven.com/a/dirt_floor) | 545 KB |
| Monastery Stone Floor | Amal Kumar | CC0 1.0 | [polyhaven.com/a/monastery_stone_floor](https://polyhaven.com/a/monastery_stone_floor) | 518 KB |
| Red Brick 03 | Rob Tuytel | CC0 1.0 | [polyhaven.com/a/red_brick_03](https://polyhaven.com/a/red_brick_03) | 583 KB |
| Rough Wood | Rob Tuytel | CC0 1.0 | [polyhaven.com/a/rough_wood](https://polyhaven.com/a/rough_wood) | 472 KB |
| Rustic Stone Wall | Dimitrios Savva | CC0 1.0 | [polyhaven.com/a/rustic_stone_wall](https://polyhaven.com/a/rustic_stone_wall) | 625 KB |
| Rusty Metal 02 | Rob Tuytel | CC0 1.0 | [polyhaven.com/a/rusty_metal_02](https://polyhaven.com/a/rusty_metal_02) | 335 KB |
| Wood Table Worn | Dimitrios Savva, Rico Cilliers | CC0 1.0 | [polyhaven.com/a/wood_table_worn](https://polyhaven.com/a/wood_table_worn) | 417 KB |

## HDRIs (image-based lighting) (Poly Haven, CC0)

| Asset | Author(s) | Licence | Source | Size in game |
|---|---|---|---|---|
| Castle Zavelstein Cellar | Andreas Mischok | CC0 1.0 | [polyhaven.com/a/castle_zavelstein_cellar](https://polyhaven.com/a/castle_zavelstein_cellar) | 1673 KB |
| Kloofendal 48d Partly Cloudy (Pure Sky) | Greg Zaal, Jarod Guest | CC0 1.0 | [polyhaven.com/a/kloofendal_48d_partly_cloudy_puresky](https://polyhaven.com/a/kloofendal_48d_partly_cloudy_puresky) | 1513 KB |
| Studio Small 09 | Sergej Majboroda | CC0 1.0 | [polyhaven.com/a/studio_small_09](https://polyhaven.com/a/studio_small_09) | 1577 KB |

## Where each asset is used

- **Castle Zavelstein Cellar** HDRI: reflections and ambient light inside the forge.
- **Studio Small 09** HDRI: the inspection turntable (mapped on a dimmed dome under hand-placed softbox strips, then PMREM-baked).
- **Kloofendal 48d Partly Cloudy (Pure Sky)** HDRI: lighting and sky of the test yard.
- Rustic Stone Wall (walls), Red Brick 03 (hearth, hood), Monastery Stone Floor (floor), Rough Wood (beams, bellows, haft wood),
  Wood Table Worn (grinding rest, wooden grips), Brown Leather (bellows bag, leather grips and wraps), Rusty Metal 02 (wear on
  the anvil and tongs), Bark Brown 02 (wooden test post), Dirt Floor (test yard ground).
- Models: cross-pein hammer (the hammer you swing), wooden bucket (oil quench), tree stump (anvil block), wooden table (bench),
  bench vice, wooden stool, wooden crates, lantern, wine barrel, wicker basket (charcoal), kite shield (wall decoration),
  wooden mallet.

## Code libraries and fonts

- three.js r128 (MIT) from cdnjs, plus GLTFLoader, RGBELoader, OrbitControls and the post-processing examples from
  three@0.128.0 on jsdelivr.
- Fonts: Cinzel and Nunito Sans from Google Fonts (SIL Open Font License 1.1).
