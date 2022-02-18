import typescript from '@rollup/plugin-typescript';
import copy from 'rollup-plugin-copy';

export default {
    input: 'src/pagination.ts',
    output: [
        {
            file: 'dist/pagination.esm.js',
            format: 'es',
        },
        {
            file: 'dist/pagination.js',
            format: 'umd',
            name: 'Pagination',
            exports: 'default'
        },
    ],
    plugins: [
        typescript({tsconfig: './tsconfig.json'}),
        copy({
            targets: [
                {src: 'src/css/pagination.css', dest: 'dist'}
            ]
        })
    ],
};