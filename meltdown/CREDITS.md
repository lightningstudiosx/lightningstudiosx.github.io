# MELTDOWN. - credits

Everything not listed here (the ice cube and its face, all props - stoves, toasters, coolers, lava lamps, candles, the
snowman, etc. - every sound, the music, the UI, the pictogram signs, the checkered cloth, toast, brick, wallpaper and label
textures, the tile artwork) is made in code for this game.

All downloaded assets are from **Poly Haven** (polyhaven.com), released under **CC0 1.0** (public domain). Files live in
`assets/` (41 files, 6.4 MB). Most were copied unchanged from `../adventure/assets/` (already optimised there: 1k JPEG
textures, 1k-texture glTF models, LDR sky backdrops); `marble_01` and `dark_wooden_planks` were fetched from
api.polyhaven.com by `tools/fetch_assets.py` and shrunk to 512 px JPEG with Pillow.

## PBR textures (diffuse, normal, roughness)

| Asset | Author(s) | Licence | Source | Files | Used for |
|---|---|---|---|---|---|
| Wood Floor | Dimitrios Savva | CC0 1.0 | [polyhaven.com/a/wood_floor](https://polyhaven.com/a/wood_floor) | `tex_wood_floor_*.jpg` | kitchen counter, hall floor |
| Rounded Square Tiled Wall | Charlotte Baglioni | CC0 1.0 | [polyhaven.com/a/rounded_square_tiled_wall](https://polyhaven.com/a/rounded_square_tiled_wall) | `tex_rounded_square_tiled_wall_*.jpg` | backsplash, laundry floor |
| Concrete Pavement | Charlotte Baglioni | CC0 1.0 | [polyhaven.com/a/concrete_pavement](https://polyhaven.com/a/concrete_pavement) | `tex_concrete_pavement_*.jpg` | sidewalk, park path |
| Asphalt 02 | Rob Tuytel | CC0 1.0 | [polyhaven.com/a/asphalt_02](https://polyhaven.com/a/asphalt_02) | `tex_asphalt_02_*.jpg` | road |
| Snow 02 | Rob Tuytel | CC0 1.0 | [polyhaven.com/a/snow_02](https://polyhaven.com/a/snow_02) | `tex_snow_02_*.jpg` | park ground, drifts (normal map) |
| Leafy Grass | Charlotte Baglioni | CC0 1.0 | [polyhaven.com/a/leafy_grass](https://polyhaven.com/a/leafy_grass) | `tex_leafy_grass_*.jpg` | lawn under the picnic table |
| Weathered Plank Siding | Dimitrios Savva | CC0 1.0 | [polyhaven.com/a/weathered_plank_siding](https://polyhaven.com/a/weathered_plank_siding) | `tex_weathered_plank_siding_*.jpg` | picnic table, windowsill |
| Painted Plaster Wall | Amal Kumar | CC0 1.0 | [polyhaven.com/a/painted_plaster_wall](https://polyhaven.com/a/painted_plaster_wall) | `tex_painted_plaster_wall_*.jpg` | walls |
| Poly Wool Herringbone | colormass, Rico Cilliers | CC0 1.0 | [polyhaven.com/a/poly_wool_herringbone](https://polyhaven.com/a/poly_wool_herringbone) | `tex_poly_wool_herringbone_*.jpg` | lounge rug |
| Marble 01 | Rob Tuytel | CC0 1.0 | [polyhaven.com/a/marble_01](https://polyhaven.com/a/marble_01) | `tex_marble_01_*.jpg` | toaster-level counter |
| Dark Wooden Planks | Amal Kumar | CC0 1.0 | [polyhaven.com/a/dark_wooden_planks](https://polyhaven.com/a/dark_wooden_planks) | `tex_dark_wooden_planks_*.jpg` | dresser, cutting board, dinner room |

## Skies (tonemapped LDR backdrops)

| Asset | Author(s) | Licence | Source | File |
|---|---|---|---|---|
| Kloofendal 43d Clear (Pure Sky) | Greg Zaal | CC0 1.0 | [polyhaven.com/a/kloofendal_43d_clear_puresky](https://polyhaven.com/a/kloofendal_43d_clear_puresky) | `sky_kloofendal_43d_clear_puresky.jpg` |
| Kloofendal Overcast (Pure Sky) | Greg Zaal | CC0 1.0 | [polyhaven.com/a/kloofendal_overcast_puresky](https://polyhaven.com/a/kloofendal_overcast_puresky) | `sky_kloofendal_overcast_puresky.jpg` |
| Kloofendal 48d Partly Cloudy (Pure Sky) | Greg Zaal, Jarod Guest | CC0 1.0 | [polyhaven.com/a/kloofendal_48d_partly_cloudy_puresky](https://polyhaven.com/a/kloofendal_48d_partly_cloudy_puresky) | `sky_kloofendal_48d_partly_cloudy_puresky.jpg` |

## 3D models (glTF, scaled x40 to ice-cube scale)

| Asset | Author(s) | Licence | Source | File | Used for |
|---|---|---|---|---|---|
| Fire Hydrant | Gonçalo Felício | CC0 1.0 | [polyhaven.com/a/fire_hydrant](https://polyhaven.com/a/fire_hydrant) | `hydrant.glb` | Heatwave Sidewalk |
| Tea Set 01 | James Ray Cock, Rico Cilliers, Jurita Burger | CC0 1.0 | [polyhaven.com/a/tea_set_01](https://polyhaven.com/a/tea_set_01) | `teaset.glb` | Candlelit Dinner (background) |
| Strawberry Chocolate Cake | Kuutti Siitonen | CC0 1.0 | [polyhaven.com/a/strawberry_chocolate_cake](https://polyhaven.com/a/strawberry_chocolate_cake) | `cake.glb` | Candlelit Dinner |
| Potted Plant 04 | James Ray Cock | CC0 1.0 | [polyhaven.com/a/potted_plant_04](https://polyhaven.com/a/potted_plant_04) | `plant.glb` | Sunny Windowsill |
| Painted Wooden Bench | Kirill Sannikov | CC0 1.0 | [polyhaven.com/a/painted_wooden_bench](https://polyhaven.com/a/painted_wooden_bench) | `bench.glb` | Snowy Park |

## Libraries and fonts (loaded at runtime, not in `assets/`)

- three.js r128 (MIT) from cdnjs; GLTFLoader from three@0.128.0 examples (MIT) via jsdelivr.
- Lilita One and Nunito from Google Fonts (SIL Open Font License 1.1).
