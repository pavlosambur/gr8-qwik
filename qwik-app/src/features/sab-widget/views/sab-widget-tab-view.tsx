import { component$ } from "@builder.io/qwik";
import { SabWidget } from "../sab-widget";
import { SabWidgetView } from "../types/sab-widget-types";
import type { SabWidgetDevice } from "../types/sab-widget-types";

type SabWidgetTabViewProps = {
    device?: SabWidgetDevice;
};

const itemQuantities = [5, 10, 15, 20, 25];
const maxRowsOptions = [1, 2, 3];

export const SabWidgetTabView = component$<SabWidgetTabViewProps>((props) => {
    return (
        <div class="space-y-6 p-4">
            <div class="space-y-1">
                <h1 class="text-2xl font-semibold text-(--text-title)">
                    SAB Widget layout demo
                </h1>
                <p class="text-sm text-(--text-body)">
                    Device: {props.device ?? "desktop"} | item step: 5 | max
                    rows: 1-3 | row fill target: 80%
                </p>
            </div>

            <div class="space-y-8">
                {maxRowsOptions.map((maxRows) => (
                    <section key={maxRows} class="space-y-3">
                        <div>
                            <h2 class="text-xl font-semibold text-(--text-title)">
                                Max rows: {maxRows}
                            </h2>
                            <p class="text-sm text-(--text-body)">
                                maxRowsDesktop={maxRows}, maxRowsMobile=
                                {maxRows}
                            </p>
                        </div>

                        <div class="space-y-4">
                            {itemQuantities.map((itemsQuantity) => (
                                <div
                                    key={`${maxRows}-${itemsQuantity}`}
                                    class="space-y-2"
                                >
                                    <p class="text-xs font-semibold tracking-wide text-(--text-subtitle) uppercase">
                                        itemsQuantity={itemsQuantity}
                                    </p>
                                    <SabWidget
                                        view={SabWidgetView.Tabs}
                                        device={props.device}
                                        itemsQuantity={itemsQuantity}
                                        maxRowsDesktop={maxRows}
                                        maxRowsMobile={maxRows}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
});
