import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { SabWidgetTabView } from "~/features/sab-widget";
import type { SabWidgetDevice } from "~/features/sab-widget";

export const useDevice = routeLoader$(({ request }): SabWidgetDevice => {
    const userAgent = request.headers.get("user-agent") ?? "";

    return /android|iphone|ipad|ipod|mobile/i.test(userAgent)
        ? "mobile"
        : "desktop";
});

export default component$(() => {
    const device = useDevice();

    return (
        <>
            <SabWidgetTabView device={device.value} />
        </>
    );
});

export const head: DocumentHead = {
    title: "SAB Widget Demo",
};
