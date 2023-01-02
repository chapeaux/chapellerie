import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function Anchor(props: JSX.HTMLAttributes<HTMLAnchorElement>) {
    return (
        <a
        {...props}
        disabled={!IS_BROWSER || props.disabled}
        />
    )
}