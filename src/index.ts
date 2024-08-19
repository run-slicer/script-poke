import type { Script, ScriptContext } from "@run-slicer/script";

// replaced by Rollup
declare var __SCRIPT_VERSION__: string;

export default {
    name: "script-template",
    description: "A Rollup+TypeScript template for a project based on the slicer scripting API.",
    version: __SCRIPT_VERSION__,
    load(_context: ScriptContext): void | Promise<void> {},
    unload(_context: ScriptContext): void | Promise<void> {},
} satisfies Script;
