module.exports = {

    extends: [
        '@commitlint/config-conventional'
    ],

    rules: {
        'type-enum': [2, 'always', [
            'feat', 'fix', 'refactor', 'docs', 'chore', 'style', 'revert', 'release'
        ]],
        'type-case': [2, 'always', 'lower-case'],
        'type-empty': [2, 'never'],
        'scope-enum': [2, 'always', [
            'docs', 'parser', 'plaground', 'vscode-plugin', 'webpack-loader'
        ]],
        'subject-empty': [2, 'never'],
        
    }


};
