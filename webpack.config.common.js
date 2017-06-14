const path = require('path');
const package = require('./package.json');
const rmdir = require('xfs/rmdir.js');
const copy = require('xfs/copy.js');
const DTSBundlePlugin = require('xwebpack/DTSBundlePlugin.js');
const CopyPlugin = require('xwebpack/CopyPlugin.js');

var

    outputDirName = 'dist',

    folders = {
        demo: path.resolve(__dirname, 'demo'),
        src: path.resolve(__dirname, 'src'),
        output: path.resolve(__dirname, outputDirName),
        build: path.resolve(__dirname, outputDirName + '/build'),
        bin: path.resolve(__dirname, outputDirName + '/bin')
    },

    prepack = function() {

        console.log("removing \"" + folders.output + "\"");
        rmdir.sync(folders.output);

        console.log("copying \"" + folders.src + "\" to \"" + folders.build + "\"");
        copy.sync(folders.src, folders.build);
    },

    getEntry = function(entry) {

        if (entry)
            return entry;

        return folders.build + '/index.ts';
    },

    getOutput = function() {
        return {
            filename: package.main || 'index.js',
            path: folders.bin,
            library: package.name || 'unknown',
            libraryTarget: "umd"
        };
    },

    getModule = function(settings) {
        return {
            rules: [{
                    test: /\.tsx?$/,
                    use: [
                        'awesome-typescript-loader?configFileName=' + settings.tsconfig
                    ]
                },
                // {
                //   test: /\.ts$/,
                //   loader: 'tslint-loader',
                //   options: {
                //     configFileName: tsconfig
                //   }
                // },
                // {
                //   test: /\.html$/,
                //   use: "html-loader"
                // },
                // {
                //   test: /\.s?css$/,
                //   use: [
                //     "to-string-loader",
                //     "style-loader",
                //     "css-loader",
                //     "sass-loader"
                //   ]
                // },
                // {
                //   test: /\.s?css$/,
                //   use: ExtractTextPlugin.extract({
                //     fallback: "to-string-loader",
                //     use: [
                //       {
                //         loader: "css-loader",
                //         options: {
                //           sourceMap: true,
                //           importLoaders: true
                //         }
                //       },
                //       {
                //         loader: 'resolve-url-loader',
                //         options: {
                //           sourceMap: true,
                //           keepQuery: true
                //         }
                //       },
                //       {
                //         loader: "sass-loader",
                //         options: {
                //           sourceMap: true
                //         }
                //       }
                //     ]
                //   })
                // },
                // {
                //   test: /\.(gif|png|jpe?g|svg)$/i,
                //   use: [
                //     'url-loader?name=/assets/images/[hash].[ext]',
                //     'image-webpack-loader?{optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}, mozjpeg: {quality: 65}}'
                //   ]
                // },
                // {
                //   test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                //   use: 'url-loader?limit=10000&mimetype=application/font-woff&name=/assets/fonts/[name].[ext]'
                // },
                // {
                //   test: /\.(ttf|eot|otf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                //   use: 'url-loader?name=/assets/fonts/[name].[ext]'
                // }
            ]
        };
    },

    getResolve = function() {
        return {
            extensions: [".ts", ".js", ".css", ".scss", ".html"],
            modules: [
                path.resolve(__dirname, 'node_modules')
            ],
            descriptionFiles: ["package.json"]
        };
    },

    getPlugins = function(plugins) {

        if (plugins)
            return plugins;

        return [
            new DTSBundlePlugin({
                targetDirPath: folders.build,
                dtsBundlePath: folders.bin + '/index.d.ts'
            }),
            new CopyPlugin({
                from: "./package.json",
                to: folders.bin + '/package.json'
            }),
            new CopyPlugin({
                from: folders.bin + '/index.js',
                to: folders.demo + '/index.js'
            })
        ]
    };

prepack();

module.exports = {
    package: package,
    getEntry: getEntry,
    getOutput: getOutput,
    getModule: getModule,
    getResolve: getResolve,
    getPlugins: getPlugins
};