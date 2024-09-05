import type { CheckboxOption, Script, ScriptContext } from "@run-slicer/script";
import { analyze } from "@run-slicer/poke";

// replaced by Rollup
declare var __SCRIPT_VERSION__: string;

const root = "poke.options";
const readBool = (key: string, def: boolean): boolean => (localStorage.getItem(key) ?? def.toString()) === "true";
const writeBool = (key: string, val: boolean) => localStorage.setItem(key, val.toString());

const optimize: CheckboxOption = {
    id: "poke-optimize",
    type: "checkbox",
    label: "Optimize",
    checked: readBool(`${root}.optimize`, true),
};

const verify: CheckboxOption = {
    id: "poke-verify",
    type: "checkbox",
    label: "Verify",
    checked: readBool(`${root}.verify`, true),
};

const inline: CheckboxOption = {
    id: "poke-inline",
    type: "checkbox",
    label: "Inline",
    checked: readBool(`${root}.inline`, false),
};

const refreshClasses = async (context: ScriptContext) => {
    for (const tab of context.editor.tabs()) {
        if (tab.entry?.type === "class") {
            await context.editor.refresh(tab.id, true /* we need it to reload the entry */);
        }
    }
};

export default {
    name: "poke",
    description: "A script binding for the poke bytecode normalization and generic deobfuscation library.",
    version: __SCRIPT_VERSION__,
    options: [optimize, verify, inline],
    async load(context: ScriptContext) {
        context.addEventListener("option_change", async (event, context) => {
            if (event.option.id.startsWith("poke-")) {
                await refreshClasses(context);

                const id = event.option.id.substring(5);
                switch (event.option.type) {
                    case "checkbox": {
                        const checkbox = event.option as CheckboxOption;

                        writeBool(`${root}.${id}`, checkbox.checked);
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

        await refreshClasses(context); // has to be last
    },
    async unload(context: ScriptContext) {
        await refreshClasses(context);
    },
} satisfies Script;
