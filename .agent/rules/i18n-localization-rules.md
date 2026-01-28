---
trigger: always_on
---

# I18N & LOCALIZATION RULES

## 1. Zero Hard-coding Policy
- NEVER use raw strings inside `<template>` or `script` for user-facing text.
- ALL text must be retrieved using the `vue-i18n` composable.

## 2. Naming Convention (SNAKE_CASE & NESTED)
- Keys must be semantic and hierarchical based on the folder/component structure.
- Format: `page_name.component_name.element_context`
- Example:
  - ❌ Bad: `t('submit')`, `t('header_text')`
  - ✅ Good: `t('auth.login_form.submit_btn')`, `t('landing.hero.headline')`

## 3. Implementation Syntax (Vue 3 Composition API)
- Import useI18n: `import { useI18n } from 'vue-i18n'`
- Destructure: `const { t } = useI18n()`
- Usage in Template: `{{ t('path.to.key') }}`
- Usage in Script: `t('path.to.key')`

## 4. File Synchronization (CRITICAL)
- Whenever you generate a new i18n key, you MUST immediately append it to the default language file (e.g., `src/locales/vi.json` or `en.json`).
- Do not ask for permission to update the JSON file; consider it part of the coding task.
- Preserve the JSON nesting structure.

## 5. Attributes Handling
- For attributes like `placeholder` or `title`, always use binding:
  - `::placeholder="t('contact.form.email_placeholder')"`

## 6. Styling Strategy (Tailwind CSS)
- PRIMARY: Use Tailwind CSS utility classes directly in the `class` attribute.
- SECONDARY: Only use `<style scoped>` for complex animations or highly specific overrides that Tailwind cannot handle.
- FORBIDDEN: Do not invent arbitrary class names (e.g., `.container-wrapper`, `.my-button`) unless you are creating a reusable component with `@apply`.