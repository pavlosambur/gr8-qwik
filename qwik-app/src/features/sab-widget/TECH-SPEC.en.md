# SAB Widget: Technical Specification

## Purpose

SAB Widget is a horizontal sports-item widget. This prototype validates how the item list behaves with different content sizes, different maximum row counts, and different device types.

The current implementation uses Qwik, TypeScript, and Tailwind CSS. The layout logic is separated from the UI so the same behavior can be reimplemented in another environment.

## Feature Structure

- `sab-widget.tsx` - main widget component.
- `ui/sab-widget-item.tsx` - single item UI.
- `lib/sab-widget-layout.ts` - row calculation and item distribution logic.
- `types/sab-widget-types.ts` - widget props, item types, and view types.
- `data/sab-widget-items.json` - mock data.
- `views/sab-widget-tab-view.tsx` - demo view with multiple scenarios.
- `index.ts` - public feature exports.

## Data

Each item uses the minimal shape:

```ts
type SabWidgetItemData = {
    title: string;
    imageSrc: string;
};
```

The prototype reads items from `data/sab-widget-items.json`. In production, the same shape can come from an API, CMS, or another data source.

## Component API

```ts
type SabWidgetProps =
    | {
          view: "tabs";
          device?: "desktop" | "mobile";
          itemsQuantity?: number;
          maxRowsDesktop?: number;
          maxRowsMobile?: number;
      }
    | {
          view: "rounded" | "square";
          device?: "desktop" | "mobile";
          itemsQuantity?: number;
      };
```

The current prototype implements the behavior for `view: "tabs"`. The `rounded` and `square` variants are reserved in the type model for future development.

Parameters:

- `view` - widget variant.
- `device` - device type. Defaults to `desktop`.
- `itemsQuantity` - number of items to render in demo/prototype mode.
- `maxRowsDesktop` - maximum row count on desktop, defaults to `1`.
- `maxRowsMobile` - maximum row count on mobile, defaults to `1`.

## Device Detection

The demo route detects the device on the server from the `user-agent` header:

- mobile: if the user-agent contains `android`, `iphone`, `ipad`, `ipod`, or `mobile`;
- desktop: fallback.

This is an approximate SSR heuristic. In production, it can be replaced with backend logic, edge middleware, or an explicit platform-provided value.

## Width Estimation

Because the server has no real DOM layout, item width is estimated:

```ts
estimatedWidth =
    itemHorizontalPadding +
    itemImageWidth +
    itemContentGap +
    title.length * averageTitleCharacterWidth;
```

Current constants:

- horizontal padding: `24px`;
- icon width: `24px`;
- icon/text gap: `8px`;
- item gap: `8px`;
- average character width: `8px`;
- desktop max container width: `1440px`;
- mobile max container width: `425px`;
- minimum shortest-row fill: `80%`.

This is not a pixel-perfect measurement. It is a server-side heuristic that provides a stable first render.

## Row Count Calculation

Algorithm:

1. Select the requested item count.
2. Estimate each item width.
3. Calculate the total estimated item width.
4. Select the base container width:
    - `1440px` for desktop;
    - `425px` for mobile.
5. Calculate the row count:

```ts
rowsByFill = Math.floor(totalWidth / (containerWidth * 0.8));
rowsCount = clamp(rowsByFill, 1, maxRows);
```

If there are no items or `maxRows <= 0`, the row count is `0`.

## Item Distribution

Items are not split into equal chunks. To preserve the JSON ordering while keeping rows visually balanced, the implementation uses a greedy algorithm:

1. Create the required number of empty rows.
2. Iterate items in their original order.
3. Add each next item to the currently shortest row.
4. Update that row's estimated width.

This keeps the source order deterministic while producing more balanced visual rows.

## Scroll and Interaction

The widget container has horizontal overflow. The visible scrollbar is hidden with the `scrollbar-none` CSS class.

On mobile, horizontal swipe works natively. On desktop, mouse drag-scroll is implemented with Pointer Events:

- `pointerdown` stores the start position;
- `pointermove` updates `scrollLeft`;
- `pointerup`, `pointercancel`, and `pointerleave` stop the drag.

Drag-scroll is applied only for `pointerType === "mouse"` so it does not interfere with native mobile behavior.

## Styling

The UI is built with Tailwind CSS. Colors are read from CSS custom properties:

- `--background-main`;
- `--text-title`;
- `--text-body`;
- `--text-subtitle`.

This keeps the widget theme-ready without rewriting component styles.

## Demo View

`SabWidgetTabView` generates a scenario matrix:

- `itemsQuantity`: `5`, `10`, `15`, `20`, `25`;
- `maxRows`: `1`, `2`, `3`;
- the active device is shown in the description.

The goal of the demo view is to make widget behavior easy to inspect in the browser without reading the source code.

## Prototype Limitations

- Item width measurement is approximate because it runs without DOM.
- `itemsQuantity` exists for testing and is not required as a production API.
- Production items should have a stable `id` instead of using `title` as the render key.
- `rounded` and `square` are modeled in types but their UI behavior is not implemented yet.
- SSR device detection through user-agent is a heuristic, not a guarantee.

## Production Recommendations

- Keep the layout algorithm as a pure module independent from the UI framework.
- Keep theme support based on design tokens and CSS variables.
- Add unit tests for:
    - item quantity clamping;
    - row count calculation;
    - shortest-row item distribution;
    - edge cases with `0` items.
- Add a production item model with `id`, `title`, `imageSrc`, and optional metadata.
