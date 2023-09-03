'use strict'

const path = require('path'),
    MiniCssExtractPlugin = require('mini-css-extract-plugin')

// import 'idempotent-babel-polyfill'

const PATHS = {
    src: path.join(__dirname, './src'),
    build: path.join(__dirname, '/dist')
};

const mode = process.env.NODE_ENV || 'development'
const target = process.env.NODE_ENV === 'production' ? 'browserslist' : 'web'

module.exports = {
    entry: [
        // `${PATHS.src}/scripts/index.js`,
        `${PATHS.src}/styles/index.scss`
    ],
    output: {
        path: path.join(__dirname, './dist/public/static'),
        filename: 'script.bundle.js'
    },
    devtool: 'source-map',
    mode: mode,
    target: target,
    node: {
        global: true,
        __filename: true,
        __dirname: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.(s[ac]|c)ss$/i,
                use: [
                    'style-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            sourceMap: true
                        }
                    },
                    'sass-loader'
                ]
            }
        ]
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.scss']
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: `style.bundle.css`,
        }),
    ]
}