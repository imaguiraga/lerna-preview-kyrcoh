module.exports = {
    "env": {
        "browser": true,
        "es2015": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        //"plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 7,
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint"
    ],
    "rules": {
        '@typescript-eslint/no-this-alias': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-function': 'warn',
        'no-unused-vars': 'off'
    }
};
