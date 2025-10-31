module.exports = {
    root: true,
    ignorePatterns: ['**/dist/**'],
    plugins: ['prettier'],
    extends: ['prettier'],
    rules: {
        'padding-line-between-statements': [
            'error',
            { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
            { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
            { blankLine: 'any', prev: ['case', 'default'], next: 'break' },
            { blankLine: 'any', prev: 'case', next: 'case' },
            { blankLine: 'always', prev: '*', next: 'return' },
            { blankLine: 'always', prev: 'block', next: '*' },
            { blankLine: 'always', prev: '*', next: 'block' },
            { blankLine: 'always', prev: 'block-like', next: '*' },
            { blankLine: 'always', prev: '*', next: 'block-like' },
            { blankLine: 'always', prev: ['import'], next: ['const', 'let', 'var'] }
        ]
    },
    overrides: [
        {
            files: ['*.ts'],
            processor: '@angular-eslint/template/extract-inline-html',
            parser: '@typescript-eslint/parser',
            parserOptions: {
                project: ['tsconfig.json', 'e2e/tsconfig.json'],
                createDefaultProgram: true
            },
            extends: [
                'eslint:recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:@angular-eslint/recommended',
                'plugin:@angular-eslint/template/process-inline-templates',
                'prettier'
            ],
            rules: {
                '@angular-eslint/component-selector': [
                    'error',
                    {
                        type: 'element',
                        prefix: 'p',
                        style: 'kebab-case'
                    }
                ],
                '@angular-eslint/directive-selector': [
                    'error',
                    {
                        type: 'attribute',
                        prefix: 'p',
                        style: 'camelCase'
                    }
                ],
                '@angular-eslint/component-class-suffix': [
                    'error',
                    {
                        suffixes: ['']
                    }
                ],
                '@angular-eslint/no-host-metadata-property': 'off',
                '@angular-eslint/no-output-on-prefix': 'off',
                '@typescript-eslint/ban-types': 'off',
                '@typescript-eslint/no-explicit-any': 'warn',
                '@typescript-eslint/no-inferrable-types': 'off',
                '@typescript-eslint/explicit-function-return-type': 'warn',
                '@typescript-eslint/no-unused-vars': [
                    'warn',
                    {
                        argsIgnorePattern: '^_',
                        varsIgnorePattern: '^_'
                    }
                ],
                'arrow-body-style': ['error', 'as-needed'],
                curly: ['error', 'all'],
                '@typescript-eslint/member-ordering': [
                    'error',
                    {
                        default: [
                            'public-static-field',
                            'static-field',
                            'instance-field',
                            'public-instance-method',
                            'public-static-field'
                        ]
                    }
                ],
                'no-console': [
                    'error',
                    {
                        allow: ['warn', 'error', 'info']
                    }
                ],
                'prefer-const': 'warn',
                'no-var': 'error',
                eqeqeq: ['error', 'always', { null: 'ignore' }],
                'no-debugger': 'error'
            }
        },
        {
            files: ['*.html'],
            parser: '@angular-eslint/template-parser',
            extends: ['plugin:@angular-eslint/template/recommended', 'prettier'],
            rules: {
                '@angular-eslint/template/eqeqeq': [
                    'error',
                    {
                        allowNullOrUndefined: true
                    }
                ]
            }
        },
        {
            files: ['*.js'],
            parserOptions: {
                allowImportExportEverywhere: true
            }
        }
    ]
};
