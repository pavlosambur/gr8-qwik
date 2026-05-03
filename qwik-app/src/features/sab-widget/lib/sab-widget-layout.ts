import { SabWidgetView } from "../types/sab-widget-types";
import type {
    SabWidgetDevice,
    SabWidgetItemData,
    SabWidgetProps,
} from "../types/sab-widget-types";

const minShortestRowFillRatio = 0.8;
const desktopMaxContainerWidth = 1440;
const mobileMaxContainerWidth = 425;
const itemHorizontalPadding = 24;
const itemImageWidth = 24;
const itemContentGap = 8;
const itemGap = 8;
const averageTitleCharacterWidth = 8;

type EstimatedSabWidgetItem = SabWidgetItemData & {
    estimatedWidth: number;
};

type GetSabWidgetLayoutOptions = {
    items: SabWidgetItemData[];
    props: SabWidgetProps;
};

const clampItemsQuantity = (
    itemsLength: number,
    itemsQuantity: number | undefined,
) => {
    if (typeof itemsQuantity !== "number") {
        return itemsLength;
    }

    return Math.max(0, Math.min(itemsLength, Math.floor(itemsQuantity)));
};

const getTabsMaxRows = (props: SabWidgetProps) => {
    if (props.view !== SabWidgetView.Tabs) {
        return {
            maxRowsDesktop: 1,
            maxRowsMobile: 1,
        };
    }

    return {
        maxRowsDesktop: props.maxRowsDesktop ?? 1,
        maxRowsMobile: props.maxRowsMobile ?? 1,
    };
};

const estimateItemWidth = (item: SabWidgetItemData) =>
    itemHorizontalPadding +
    itemImageWidth +
    itemContentGap +
    item.title.length * averageTitleCharacterWidth;

const getRowsCount = (
    totalWidth: number,
    containerWidth: number,
    maxRows: number,
) => {
    if (totalWidth <= 0 || maxRows <= 0) {
        return 0;
    }

    const rowsByFill = Math.floor(
        totalWidth / (containerWidth * minShortestRowFillRatio),
    );

    return Math.max(1, Math.min(maxRows, rowsByFill));
};

const distributeItemsIntoRows = (
    itemsToDistribute: EstimatedSabWidgetItem[],
    rows: number,
) => {
    const rowItems = Array.from(
        { length: rows },
        () => [] as EstimatedSabWidgetItem[],
    );
    const rowWidths = Array.from({ length: rows }, () => 0);

    for (const item of itemsToDistribute) {
        const rowIndex = rowWidths.indexOf(Math.min(...rowWidths));

        rowItems[rowIndex].push(item);
        rowWidths[rowIndex] += item.estimatedWidth + itemGap;
    }

    return rowItems;
};

export const getSabWidgetLayout = ({
    items,
    props,
}: GetSabWidgetLayoutOptions) => {
    const device: SabWidgetDevice = props.device ?? "desktop";
    const itemsQuantity = clampItemsQuantity(items.length, props.itemsQuantity);
    const visibleItems = items.slice(0, itemsQuantity);
    const { maxRowsDesktop, maxRowsMobile } = getTabsMaxRows(props);
    const maxRows = device === "mobile" ? maxRowsMobile : maxRowsDesktop;
    const containerWidth =
        device === "mobile"
            ? mobileMaxContainerWidth
            : desktopMaxContainerWidth;
    const estimatedItems = visibleItems.map((item) => ({
        ...item,
        estimatedWidth: estimateItemWidth(item),
    }));
    const totalEstimatedWidth = estimatedItems.reduce(
        (total, item) => total + item.estimatedWidth + itemGap,
        0,
    );
    const rowsCount = getRowsCount(
        totalEstimatedWidth,
        containerWidth,
        maxRows,
    );

    return {
        device,
        itemsQuantity,
        maxRowsDesktop,
        maxRowsMobile,
        rows: distributeItemsIntoRows(estimatedItems, rowsCount),
        rowsCount,
        totalEstimatedWidth,
    };
};
