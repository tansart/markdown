import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from "rollup-plugin-terser";

export default {
	input: 'src/index.js',
	output: [
		{
			file: './dist/markdown.js',
			format: 'iife',
			name: 'Markdown',
			globals: {
				react: 'React'
			}
		},
		{
			file: './dist/markdown.cjs.js',
			format: 'cjs',
		}
	],
	external: ['react'],
	plugins: [
		resolve(),
		babel({
			exclude: 'node_modules/**'
		}),
		terser()
	],
	watch: {
		include: 'src/**'
	}
};
