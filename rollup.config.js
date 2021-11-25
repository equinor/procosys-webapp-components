import image from '@rollup/plugin-image';
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

const external = Object.keys(pkg.peerDependencies)

export default {
    input: 'src/index.tsx',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            exports: 'named',
            sourcemap: true,
            strict: false,
        },
    ],
    plugins: [typescript(), image(), nodeResolve()],
    external,
};
