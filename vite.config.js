import { build } from "vite"

export default {
  server: {
    proxy: {
      '/geoserver': {
        target: 'http://geoictacademy.nl',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/geoserver/, '/geoserver')
      }
    }
  },
  build: {
    sourcemap: true
  }
}

