import { readFile } from "node:fs/promises";
import type { RollupOptions } from "rollup";
import typescript from "@rollup/plugin-typescript";
import replace from "@rollup/plugin-replace";

const { version } = JSON.parse(await readFile("./package.json", "utf8"));

export default {
    input: "src/index.ts",
    output: {
        dir: "dist",
        format: "esm",
    },
    plugins: [
        typescript(),
        replace({
            preventAssignment: true,
            __SCRIPT_VERSION__: JSON.stringify(version),
        }),
    ],
} satisfies RollupOptions;
