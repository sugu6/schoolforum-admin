<template>
  <div v-if="html" class="markdown-body" v-html="html" />
  <slot v-else />
</template>

<script lang="ts" setup>
import renderMarkdown from "@/utils/markdown";

const props = withDefaults(
  defineProps<{
    content: string;
  }>(),
  {
    content: "",
  },
);

const html = computed(() => renderMarkdown(props.content));
</script>

<style scoped lang="scss">
.markdown-body {
  line-height: 1.8;
  word-break: break-word;

  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4),
  :deep(h5),
  :deep(h6) {
    margin: 16px 0 8px;
    font-weight: 600;
    line-height: 1.4;
  }

  :deep(h1) {
    font-size: 1.5em;
  }

  :deep(h2) {
    font-size: 1.3em;
  }

  :deep(h3) {
    font-size: 1.15em;
  }

  :deep(p) {
    margin: 4px 0;
  }

  :deep(ul),
  :deep(ol) {
    margin: 4px 0;
    padding-left: 20px;
  }

  :deep(li) {
    margin: 2px 0;
  }

  :deep(blockquote) {
    margin: 8px 0;
    padding: 4px 12px;
    color: var(--color-text-2);
    border-left: 3px solid var(--color-border-2);
  }

  :deep(code) {
    padding: 2px 6px;
    font-size: 0.9em;
    background: var(--color-fill-2);
    border-radius: 3px;
  }

  :deep(pre) {
    margin: 8px 0;
    padding: 12px;
    overflow-x: auto;
    background: var(--color-fill-2);
    border-radius: 6px;

    code {
      padding: 0;
      background: transparent;
    }
  }

  :deep(table) {
    width: 100%;
    margin: 8px 0;
    border-collapse: collapse;
  }

  :deep(th),
  :deep(td) {
    padding: 6px 12px;
    text-align: left;
    border: 1px solid var(--color-border-2);
  }

  :deep(th) {
    font-weight: 600;
    background: var(--color-fill-2);
  }

  :deep(a) {
    color: rgb(var(--primary-6));
  }

  :deep(img) {
    max-width: 100%;
    height: auto;
  }

  :deep(hr) {
    margin: 12px 0;
    border: none;
    border-top: 1px solid var(--color-border-2);
  }
}
</style>
