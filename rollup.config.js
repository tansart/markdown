import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { terser } from "rollup-plugin-terser";

export default {
	input: 'src/index.js',
	output: [
		{
			file: './dist/markdown.js',
			format: 'iife',
			name: 'Markdown'
		},
		{
			file: './dist/markdown.cjs.js',
			format: 'cjs',
		}
	],
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
