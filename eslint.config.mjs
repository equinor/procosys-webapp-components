import js from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import react from 'eslint-plugin-react';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: ['dist/**', 'node_modules/**', '*.js'],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    react.configs.flat.recommended,
    {
        files: ['**/*.{ts,tsx,js,jsx}'],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
            globals: {
                ...globals.browser,
                ...globals.jest,
                ...globals.es2021,
                Atomics: 'readonly',
                SharedArrayBuffer: 'readonly',
            },
        },
        settings: {
            react: { version: 'detect' },
        },
        rules: {
            'require-atomic-updates': 'off',
            '@typescript-eslint/explicit-function-return-type': 'warn',
            // Intentional short-circuit/ternary statements are used throughout.
            '@typescript-eslint/no-unused-expressions': [
                'error',
                { allowShortCircuit: true, allowTernary: true },
            ],
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            // ESLint doesn't understand interfaces properly; TSC handles unused vars.
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/ban-ts-comment': [
                'error',
                { 'ts-ignore': 'allow-with-description' },
            ],
            // Not needed with the React 17+ automatic JSX runtime (jsx: react-jsx).
            'react/jsx-uses-react': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/jsx-uses-vars': 'error',
            'react/jsx-filename-extension': [
                'error',
                { extensions: ['.tsx', '.jsx'] },
            ],
            'react/display-name': 'off',
        },
    },
    eslintPluginPrettierRecommended
);
