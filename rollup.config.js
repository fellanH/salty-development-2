import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: 'js/widget/index.js',
  output: [
    {
      file: 'dist/widget.js',
      format: 'iife',
      name: 'MapWidget',
      sourcemap: !isProduction,
      banner: `
/* 
 * Webflow Map Widget v1.0.0
 * Self-contained JavaScript widget for Webflow with Mapbox integration
 * Built: ${new Date().toISOString()}
 */
      `.trim()
    },
    {
      file: 'dist/widget.esm.js',
      format: 'es',
      sourcemap: !isProduction
    }
  ],
  plugins: [
    nodeResolve({
      browser: true,
      preferBuiltins: false
    }),
    ...(isProduction ? [
      terser({
        compress: {
          drop_console: false, // Keep console logs for debugging
          drop_debugger: true
        },
        format: {
          comments: false
        }
      })
    ] : [])
  ],
  external: [
    // Mark Mapbox as external since it should be loaded separately
    'mapbox-gl'
  ]
};