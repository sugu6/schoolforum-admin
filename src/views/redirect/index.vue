<template>
  <div></div>
</template>

<script lang="ts" setup>
  import { useRouter, useRoute } from 'vue-router';

  const router = useRouter();
  const route = useRoute();

  const gotoPath = route.params.path as string;

  // 仅允许内部路径，防止开放重定向到外部 URL
  const isInternalPath = (path: string): boolean => {
    if (!path || typeof path !== 'string') return false;
    if (
      path.startsWith('http://') ||
      path.startsWith('https://') ||
      path.startsWith('//')
    )
      return false;
    return true;
  };

  router.replace({
    path: isInternalPath(gotoPath) ? gotoPath : '/dashboard/workplace',
  });
</script>

<style scoped lang="less"></style>
