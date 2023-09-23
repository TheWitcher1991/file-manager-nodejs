module.exports = {
    root: true,
    env: {
        browser: true,
        node: true,
        commonjs: true,
        es2021: true
    },
    extends: 'standard',
    overrides: [
        {
            env: {
                node: true
            },
            files: [
                '.eslintrc.{js,cjs}'
            ],
            parserOptions: {
                sourceType: 'script'
            }
        }
    ],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    rules: {
        indent: ['error', 4]
    }
}
