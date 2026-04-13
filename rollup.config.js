import json from '@rollup/plugin-json'

export default {
  input: 'index.js',
  external: (id) => !id.startsWith('.') && !id.startsWith('/') && !id.startsWith('\0'),
  output: [
    {
      file: 'dist/botium-connector-copilot-es.js',
      format: 'es',
      sourcemap: true
    },
    {
      file: 'dist/botium-connector-copilot-cjs.cjs',
      format: 'cjs',
      sourcemap: true
    }
  ],
  plugins: [
    json()
  ]
}
