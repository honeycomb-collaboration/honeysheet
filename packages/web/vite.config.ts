import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    resolve: {
        alias: [
            {
                find: 'src',
                replacement: resolve(__dirname, 'src'),
            },
            {
                find: 'test',
                replacement: resolve(__dirname, 'test'),
            },
        ],
    },
    test: {
        environment: 'jsdom',
    },
})
