<template>
  <div class="percent">
    <div class="bg" :style="{ width: this.percent + '%' }"></div>
  </div>
</template>

<script>
export default {
  name: 'Percent',
  props: {
    percent: { type: Number, default: 0 },
  },
};
</script>
