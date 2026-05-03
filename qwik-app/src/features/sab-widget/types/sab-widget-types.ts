export const SabWidgetView = {
    Rounded: "rounded",
    Square: "square",
    Tabs: "tabs",
} as const;

export type SabWidgetView = (typeof SabWidgetView)[keyof typeof SabWidgetView];

export type SabWidgetDevice = "desktop" | "mobile";

type SabWidgetBaseProps = {
    device?: SabWidgetDevice;
    itemsQuantity?: number;
};

export type SabWidgetTabsProps = {
    view: typeof SabWidgetView.Tabs;
    maxRowsDesktop?: number;
    maxRowsMobile?: number;
} & SabWidgetBaseProps;

export type SabWidgetProps =
    | SabWidgetTabsProps
    | ({
          view: typeof SabWidgetView.Rounded | typeof SabWidgetView.Square;
      } & SabWidgetBaseProps);

export type SabWidgetItemData = {
    title: string;
    imageSrc: string;
};

export type SabWidgetItemProps = SabWidgetItemData;
