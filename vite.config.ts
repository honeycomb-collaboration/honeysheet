import { renameSync } from 'fs'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            formats: ['es', 'umd'],
            fileName: '[name]',
            name: 'fedBusinessLib',
        },
    },
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
    plugins: [
        dts({
            afterBuild() {
                renameSync(resolve(__dirname, 'dist/src'), resolve(__dirname, 'dist/types'))
            },
        }),
    ],
})
