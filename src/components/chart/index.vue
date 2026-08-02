<template>
  <VCharts
    v-if="renderChart"
    :option="options"
    :autoresize="autoResize"
    :style="{ width, height }"
  />
</template>

<script lang="ts" setup>
import { ref, nextTick } from "vue";
import VCharts from "vue-echarts";
import type { EChartsOption } from "echarts";

defineProps<{
  options: EChartsOption;
  autoResize?: boolean;
  width?: string;
  height?: string;
}>();

const renderChart = ref(false);
// wait container expand
nextTick(() => {
  renderChart.value = true;
});
</script>

<style scoped lang="scss"></style>
