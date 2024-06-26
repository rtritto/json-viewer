/// <reference types="node" />
import { basename, resolve } from 'node:path'

import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import type {
  ModuleFormat,
  OutputOptions,
  RollupCache,
  RollupOptions
} from 'rollup'
import dts from 'rollup-plugin-dts'
import { defineRollupSwcOption, swc } from 'rollup-plugin-swc3'
import { fileURLToPath } from 'url'

let cache: RollupCache

const dtsOutput = new Set<[string, string]>()

const outputDir = fileURLToPath(new URL('dist', import.meta.url))

const external = [
  '@mui/material',
  '@mui/material/styles',
  'copy-to-clipboard',
  'zustand',
  'react',
  'react/jsx-runtime',
  'react-dom',
  'react-dom/client'
]
const outputMatrix = (
  name: string, format: ModuleFormat[]): OutputOptions[] => {
  const baseName = basename(name)
  return format.flatMap(format => ({
    file: resolve(outputDir, `${baseName}.${format === 'es' ? 'm' : ''}js`),
    sourcemap: false,
    name: 'JsonViewer',
    format,
    banner: `/// <reference types="./${baseName}.d.ts" />`,
    globals: external.reduce((object, module) => {
      object[module] = module
      return object
    }, {} as Record<string, string>)
  }))
}

const buildMatrix = (input: string, output: string, config: {
  format: ModuleFormat[]
  browser: boolean
  dts: boolean
}): RollupOptions => {
  if (config.dts) {
    dtsOutput.add([input, output])
  }
  return {
    input,
    output: outputMatrix(output, config.format),
    cache,
    external: config.browser ? [] : external,
    plugins: [
      config.browser && replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
        'typeof window': JSON.stringify('object')
      }),
      commonjs(),
      nodeResolve(),
      swc(defineRollupSwcOption({
        jsc: {
          externalHelpers: true,
          parser: {
            syntax: 'typescript',
            tsx: true
          },
          transform: {
            react: {
              runtime: 'automatic'
            }
          }
        },
        env: {
          // we have to copy this configuration because swc is not handling `.browserslistrc` properly
          // see https://github.com/swc-project/swc/issues/3365
          targets: 'and_chr 91,and_ff 89,and_qq 10.4,and_uc 12.12,android 91,baidu 7.12,chrome 90,edge 91,firefox 78,ios_saf 12.2,kaios 2.5,op_mini all,op_mob 76'
        },
        tsconfig: false
      }))
    ],
    /**
     * Ignore "use client" waning
     * @see {@link https://github.com/TanStack/query/pull/5161#issuecomment-1477389761 Preserve 'use client' directives}
     */
    onwarn (warning, warn) {
      if (
        warning.code === 'MODULE_LEVEL_DIRECTIVE' &&
        warning.message.includes('"use client"')
      ) {
        return
      }
      warn(warning)
    }
  }
}

const dtsMatrix = (): RollupOptions[] => {
  return [...dtsOutput.values()].flatMap(([input, output]) => ({
    input,
    cache,
    output: {
      file: resolve(outputDir, `${output}.d.ts`),
      format: 'es'
    },
    plugins: [
      dts()
    ]
  }))
}

const build: RollupOptions[] = [
  buildMatrix('./src/index.tsx', 'index', {
    format: ['es', 'umd'],
    browser: false,
    dts: true
  }),
  buildMatrix('./src/browser.tsx', 'browser', {
    format: ['es', 'umd'],
    browser: true,
    dts: true
  }),
  ...dtsMatrix()
]

export default build
