module.exports = {
    configureWebpack: {
        rules: [
            {
                test: /\.vdest$/,
                use: [
                    {
                        loader: "webpack-loader-vdes-template",
                    },
                ],
            },
        ],
    },
};
