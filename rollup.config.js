const json = require('rollup-plugin-json')
const resolve = require('rollup-plugin-node-resolve')
const commentjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const multidest = require('rollup-plugin-multi-dest')
const uglify = require('rollup-plugin-uglify')

const { version } = require('./package.json')
let production = /^production/.test(process.env.BUILD)

module.exports = {
  entry: 'src/wxmlify.js',
  dest: `${production ? '' : 'example/'}wxmlify/wxmlify.js`,
  format: 'cjs',
  moduleName: 'Wxmlify',
  banner: `\
/*
 * Wxmlify v${version}
 * https://github.com/zhanziyang/wxmlify
 * 
 * Copyright (c) ${new Date().getFullYear()} zhanziyang
 * Released under the ISC license
 */
  `,
  plugins: [
    commentjs(),
    resolve(),
    json(),
    babel({
      babelrc: false,
      presets: [
        [
          'es2015',
          {
            'modules': false
          }
        ]
      ],
      plugins: [
        'external-helpers'
      ]
    }),
    (production && uglify({
      output: {
        comments: /zhanziyang/
      }
    })),
    (production && multidest([
      {
        dest: 'wxmlify/wxmlify.js'
      }, {
        dest: 'example/wxmlify/wxmlify.js'
      }
    ]))
  ]
}