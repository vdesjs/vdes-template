module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "sourceType": "module",
    },
    "plugins": ["@typescript-eslint"],
    "rules": {
        "semi": [
            "error",
            "always"
        ],
        "no-console": "off",
        "max-classes-per-file": ["error", 2],
        "@typescript-eslint/explicit-function-return-type": 0,
        "no-cond-assign": 0,
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,
        "@typescript-eslint/ban-types": 0,
        "@typescript-eslint/no-unused-vars": 0,
        "@typescript-eslint/no-explicit-any": 0
       
    }
};
