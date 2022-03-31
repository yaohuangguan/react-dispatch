import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import del from 'rollup-plugin-delete'

const bundle = config => ({
  ...config,
  input: 'src/main.ts',
})

export default [
  bundle({
    plugins: [
      del({
        targets: ['./dist/'],
      }),
      esbuild(),
      peerDepsExternal()
    ],
    output: [
      {
        file: 'dist/cjs/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/esm/index.js',
        format: 'es',
        sourcemap: true,
      },
    ],
  }),
  bundle({
    plugins: [dts()],
    output: [
      {
        file: 'dist/cjs/index.d.ts',
        format: 'cjs',
      },
      {
        file: 'dist/esm/index.d.ts',
        format: 'es',
      },
    ],
  }),
]
