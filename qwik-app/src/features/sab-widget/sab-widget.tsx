import { $, component$, useSignal } from "@builder.io/qwik";
import sabWidgetItems from "./data/sab-widget-items.json";
import { getSabWidgetLayout } from "./lib/sab-widget-layout";
import type {
    SabWidgetItemData,
    SabWidgetProps,
} from "./types/sab-widget-types";
import { SabWidgetItem } from "./ui/sab-widget-item";

const items = sabWidgetItems as SabWidgetItemData[];

export const SabWidget = component$<SabWidgetProps>((props) => {
    const {
        device,
        itemsQuantity,
        maxRowsDesktop,
        maxRowsMobile,
        rows,
        rowsCount,
        totalEstimatedWidth,
    } = getSabWidgetLayout({ items, props });

    const isDragging = useSignal(false);
    const dragStartX = useSignal(0);
    const scrollStartX = useSignal(0);

    const startDrag$ = $((event: PointerEvent, element: HTMLDivElement) => {
        if (event.pointerType !== "mouse") {
            return;
        }

        isDragging.value = true;
        dragStartX.value = event.clientX;
        scrollStartX.value = element.scrollLeft;
        element.setPointerCapture(event.pointerId);
    });

    const drag$ = $((event: PointerEvent, element: HTMLDivElement) => {
        if (!isDragging.value) {
            return;
        }

        element.scrollLeft =
            scrollStartX.value - (event.clientX - dragStartX.value);
    });

    const stopDrag$ = $((event: PointerEvent, element: HTMLDivElement) => {
        if (!isDragging.value) {
            return;
        }

        isDragging.value = false;

        if (element.hasPointerCapture(event.pointerId)) {
            element.releasePointerCapture(event.pointerId);
        }
    });

    return (
        <div
            class="scrollbar-none w-full cursor-grab overflow-x-auto select-none active:cursor-grabbing"
            data-device={device}
            data-max-rows-desktop={maxRowsDesktop}
            data-max-rows-mobile={maxRowsMobile}
            data-items-quantity={itemsQuantity}
            data-rows={rowsCount}
            data-estimated-width={Math.round(totalEstimatedWidth)}
            onPointerDown$={startDrag$}
            onPointerMove$={drag$}
            onPointerUp$={stopDrag$}
            onPointerCancel$={stopDrag$}
            onPointerLeave$={stopDrag$}
        >
            <div class="flex w-max flex-col gap-2">
                {rows.map((row, rowIndex) => (
                    <div key={rowIndex} class="flex gap-2">
                        {row.map((item) => (
                            <SabWidgetItem
                                key={item.title}
                                title={item.title}
                                imageSrc={item.imageSrc}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
});
