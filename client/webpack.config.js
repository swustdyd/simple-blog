const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: 20 });
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const isDev = env === 'development';
const baseConfig = require('../configs/base');
const config = {
    entry: {
        admin: './src/entrys/admin',
        blog: './src/entrys/blog',
    },
    output: {
        filename: 'js/[name].bundle.js',
        path: path.resolve(__dirname, '../public/dist'),
        publicPath: '/dist/'
    },
    devtool: 'eval-source-map',
    devServer: {
        contentBase: '/dist/',
        host: 'localhost',
        port: baseConfig.clientDevPort,
        publicPath: '/dist/',
        hot: true,
        inline: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'happypack/loader?id=js',
                include: [path.resolve('src')],
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg)$/,
                use: 'url-loader?limit=8192&context=client&name=./images/[name].[ext]'
            },
            {
                test: /\.scss$/,
                use: isDev ? ['style-loader', 'happypack/loader?id=scss'] : ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'happypack/loader?id=scss'
                })
            },
            {
                test: /\.css$/,
                use: isDev ? ['style-loader', 'css-loader', 'resolve-url-loader'] : ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'resolve-url-loader']
                })
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)/,
                use: ['file-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: '博客后台管理',
            filename: 'admin.html',
            template: './src/template.html',
            favicon: './src/images/LOGO.png',
            chunks: ['admin']
        }),
        new HtmlWebpackPlugin({
            title: '博客',
            filename: 'blog.html',
            template: './src/template.html',
            favicon: './src/images/LOGO.png',
            chunks: ['blog']
        }),
        new HtmlWebpackIncludeAssetsPlugin({
            assets:[
                `${baseConfig.serverHost}:${baseConfig.serverPort}/dist/dll/vendor.dll.js`
            ],
            publicPath: false,
            append: false
        }),
        // new ExtractTextPlugin({
        //     filename: 'stylesheet/[name].css',
        //     allChunks: true
        // }),
        new webpack.DefinePlugin({
            __DEV__: isDev
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            /**
             * 在这里引入 manifest 文件
             */
            manifest: require('../public/dist/dll/vendor-manifest.json')
        }),
        new HappyPack({
            id: 'js',
            threadPool: happyThreadPool,
            loaders: ['babel-loader?cacheDirectory=true']
        }),
        new HappyPack({
            id: 'scss',
            threadPool: happyThreadPool,
            loaders: ['css-loader', 'resolve-url-loader', 'sass-loader']
        })
    ],
    resolve: {
        modules:[path.resolve(__dirname, 'src'), 'node_modules'],
        unsafeCache: true
    },
    cache: true,
    mode: env
};

if(!isDev){
    config.plugins.push(
        new CleanWebpackPlugin(
            'dist',
            {
                root: path.join(baseConfig.root, 'public'),
                exclude: ['dll'],
                verbose: true,
                dry: false
            }
        ),
        new ExtractTextPlugin({
            filename: 'stylesheet/[name].css',
            allChunks: true
        })
    );
}else{
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    );
}

module.exports = config;
