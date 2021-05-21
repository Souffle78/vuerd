import pkg from './package.json';
import config from './rollup.config.common';
import visualizer from 'rollup-plugin-visualizer';
import replace from '@rollup/plugin-replace';
import filesize from 'rollup-plugin-filesize';
import { terser } from 'rollup-plugin-terser';

const { plugins, banner } = config();

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.module,
        format: 'es',
        banner,
      },
      {
        name: pkg.name,
        file: pkg.main,
        format: 'umd',
        banner,
      },
      {
        name: pkg.name,
        file: pkg.browser,
        format: 'umd',
        banner,
        plugins: [terser()],
      },
    ],
    plugins: [
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      ...plugins,
      visualizer({
        filename: './dist/stats.html',
      }),
      filesize({
        showBrotliSize: true,
      }),
    ],
    external: ['vuerd'],
  },
];
