import type { CheckboxOption, Script, ScriptContext } from "@run-slicer/script";
import { analyze } from "@run-slicer/poke";

// replaced by Rollup
declare var __SCRIPT_VERSION__: string;

const optimize: CheckboxOption = {
    id: "poke-optimize",
    type: "checkbox",
    label: "Optimize",
    checked: true,
};

const verify: CheckboxOption = {
    id: "poke-verify",
    type: "checkbox",
    label: "Verify",
    checked: true,
};

const inline: CheckboxOption = {
    id: "poke-inline",
    type: "checkbox",
    label: "Inline",
    checked: false,
};

export default {
    name: "poke",
    description: "A script binding for the poke bytecode normalization and generic deobfuscation library.",
    version: __SCRIPT_VERSION__,
    options: [optimize, verify, inline],
    load(context: ScriptContext): void | Promise<void> {
        context.addEventListener("option_change", (event, context) => {
            if (event.option.id.startsWith("poke-")) {
                for (const tab of context.editor.tabs()) {
                    if (tab.entry?.type === "class") {
                        context.editor.refresh(tab.id);
                    }
                }
            }
        });
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
