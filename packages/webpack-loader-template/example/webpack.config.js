const path = require('path');

module.exports = {
    entry: {
        'include': path.join(__dirname, 'include', 'index.js')
    },
    mode: "development",
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        library: 'template',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {   
                test: /\.vdest$/,
                use: [
                    {
                        loader: require.resolve('../'),
                    }
                ]
            }
        ]
    }

}