module.exports = {
  extends: ['stylelint-config-recommended-vue/scss'],
  defaultSeverity: 'warning',
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['plugin', 'use', 'forward', 'import'],
      },
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep'],
      },
    ],
  },
};
