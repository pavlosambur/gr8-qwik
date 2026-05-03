import { component$ } from "@builder.io/qwik";
import type { SabWidgetItemProps } from "../types/sab-widget-types";

export const SabWidgetItem = component$<SabWidgetItemProps>(
    ({ title, imageSrc }) => {
        return (
            <div class="inline-flex shrink-0 items-center gap-2 rounded-full bg-(--background-main) px-3 py-1.5 select-none">
                <img
                    src={imageSrc}
                    width={24}
                    height={24}
                    alt={title}
                    class="h-6 w-6 shrink-0 object-contain"
                />
                <span class="text-base leading-6 text-nowrap text-(--text-title)">
                    {title}
                </span>
            </div>
        );
    },
);
