import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default [
  // Main bundle
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/sudoku.js',
        format: 'es',
        sourcemap: true,
        exports: 'named'
      }
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        sourceMap: true,
        inlineSources: true,
        declaration: false,
        declarationMap: false,
        outDir: undefined
      })
    ]
  },
  // Type definitions bundle
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es'
    },
    plugins: [
      dts({
        tsconfig: './tsconfig.json'
      })
    ]
  }
]; 