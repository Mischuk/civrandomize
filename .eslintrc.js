module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: ["eslint:recommended", "airbnb-base", "prettier"],
    plugins: ["prettier"],
    parserOptions: {
        ecmaVersion: 12,
    },
    rules: {
        "prettier/prettier": [0],
        quotes: [1, "double"],
        "no-console": [0, { allow: ["warn", "error", "log"] }],
        "no-unused-vars": [1],
        "consistent-return": [0]
    }
}
