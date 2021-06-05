import pkg from './package.json';
import config from './rollup.config.common';
import html from 'rollup-plugin-generate-html-template';
import browsersync from 'rollup-plugin-browsersync';
import replace from '@rollup/plugin-replace';

const { plugins, banner } = config();

export default {
  input: 'src/index.dev.ts',
  output: {
    name: pkg.name,
    file: pkg.main,
    format: 'umd',
    banner,
  },
  plugins: [
    replace({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    ...plugins,
    html({
      template: 'index.html',
      target: 'dist/index.html',
    }),
    browsersync({ server: 'dist', open: true, port: 8090 }),
  ],
};
