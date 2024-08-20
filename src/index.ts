import type { CheckboxOption, Script, ScriptContext } from "@run-slicer/script";
import { analyze } from "@run-slicer/poke";

// replaced by Rollup
declare var __SCRIPT_VERSION__: string;

const optimize: CheckboxOption = {
    id: "optimize",
    type: "checkbox",
    label: "Optimize",
    checked: true,
};

const verify: CheckboxOption = {
    id: "verify",
    type: "checkbox",
    label: "Verify",
    checked: true,
};

const inline: CheckboxOption = {
    id: "inline",
    type: "checkbox",
    label: "Inline",
    checked: false,
};

export default {
    name: "poke",
    description: "A script binding for the poke bytecode normalization and generic deobfuscation library.",
    version: __SCRIPT_VERSION__,
    options: [optimize, verify],
    load(context: ScriptContext): void | Promise<void> {
        context.addEventListener("preload", async (event) => {
            event.data = await analyze(event.data, {
                passes: 1,
                optimize: optimize.checked,
                verify: verify.checked,
                inline: inline.checked,
            });
        });
    },
    unload(_context: ScriptContext): void | Promise<void> {},
} satisfies Script;
