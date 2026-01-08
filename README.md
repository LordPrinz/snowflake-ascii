# 3D ASCII Snowflake Generator

Procedural 3D snowflake generator rendered in ASCII, running in the browser.

[**Live Demo**](https://lordprinz.github.io/snowflake-ascii/dist/)

## How to Run

### Requirements (Optional)
*   [Bun](https://bun.sh) (for running from source / building)

### Building and Running without Bun (Standalone)
You can build the project into static HTML/JS/CSS files that can be opened in any modern browser without needing to install Bun. (For convenience, a built version is included by default).

1.  Build the project:
    ```bash
    bun run build
    ```
2.  A `dist` folder will be created.
3.  Open the `dist/index.html` file directly in your browser.

### Running from Source
With Bun installed, you can instantly run the project with the command:
```bash
bun run index.html
```

## Mechanics Description

### Snowflake Generation
Snowflakes are procedurally generated in `src/core/SnowflakeGenerator.ts` using recursive algorithms.
*   **Symmetry:** Based on 6-fold rotational symmetry. One arm is generated, then replicated and rotated every 60 degrees.
*   **Styles:** The program randomizes style parameters (e.g., Dendrite, Plate, Prism) defined in `src/core/constants.ts`. These affect branching probability, thickness, and shape.
*   **Vectors:** All geometry is based on 3D vector operations (`Vector3`), allowing for easy shape and rotation manipulation.

### ASCII Rendering
The display is handled by `src/rendering/AsciiRenderer.ts`.
*   **Projection:** 3D points are projected onto a 2D screen plane with perspective.
*   **Z-Buffer:** A depth buffer algorithm ensures points closer to the camera occlude those further away.
*   **Shading:** Point brightness is calculated based on the angle of the vector normal relative to the light source (dot product). Brightness is mapped to an ASCII character set (from darkest to brightest): `.,-~:;=!*#$@`.

## Controls
*   **Mouse:** Drag to manually rotate the snowflake.
*   **Space:** Generate a new, unique snowflake.
*   **'C' Key:** Copy the current ASCII view to the clipboard (great for pasting into messengers!).
*   **Sliders:**
    *   *Density:* Changes rendering density.
    *   *Size:* Zooms the view in/out.
