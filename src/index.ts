import type { CheckboxOption, Script, ScriptContext } from "@run-slicer/script";
import { analyze } from "@run-slicer/poke";

// replaced by Rollup
declare var __SCRIPT_VERSION__: string;

export default {
    name: "poke",
    description: "A script binding for the poke bytecode normalization and generic deobfuscation library.",
    version: __SCRIPT_VERSION__,
    options: [
        {
            id: "optimize",
            type: "checkbox",
            label: "Optimize",
            checked: true,
        } as CheckboxOption,
        {
            id: "verify",
            type: "checkbox",
            label: "Verify",
            checked: true,
        } as CheckboxOption,
    ],
    load(context: ScriptContext): void | Promise<void> {
        context.addEventListener("preload", async (event, context) => {
            event.data = await analyze(event.data, {
                passes: 5,
                optimize: (context.script.options[0] as CheckboxOption).checked,
                verify: (context.script.options[1] as CheckboxOption).checked,
            });
        });
    },
    unload(_context: ScriptContext): void | Promise<void> {},
} satisfies Script;
