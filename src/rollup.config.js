import { uglify } from "rollup-plugin-uglify";

export default [
    {
        input: './src/txcd.max.mjs',
        output: {
            file: './build/txcd.min.js',
            name: "Texticide",
            format: 'umd'
        },
        plugins: [ uglify({
			ie8: true
	  }) ]
    },
    {
        input: './src/txcd.max.mjs',
        output: {
            file: './build/txcd.min.mjs',
            format: 'es'
        },
        plugins: [ uglify() ]
    }
];