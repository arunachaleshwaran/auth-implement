module.exports = /** @type {import("prettier").Config} */ {
  arrowParens: 'avoid',
  bracketSpacing: true,
  singleQuote: true,
  jsxSingleQuote: true,
  printWidth: 70,
  semi: true,
  trailingComma: 'none',
  bracketSameLine: true,
  tabWidth: 2,
  useTabs: false,
  singleAttributePerLine: false,
  embeddedLanguageFormatting: 'off',
  endOfLine: 'lf',
  overrides: [
    {
      files: '*.cjs',
      options: { parser: 'babel', trailingComma: 'es5' },
    },
    {
      files: ['*.tsx', '*.ts'],
      options: { parser: 'typescript', trailingComma: 'es5' },
    },
    { files: '.svg', options: { parser: 'html' } },
    { files: '*.md', options: { parser: 'markdown' } },
    { files: '*.json', options: { parser: 'json' } },
    { files: '*.css', options: { parser: 'css' } },
  ],
};
