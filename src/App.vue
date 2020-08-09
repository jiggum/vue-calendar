<template>
  <DayView year="2020" month="8" day="SUN" date="3"/>
</template>

<script lang="ts">
import Vue from 'vue'
import DayView from '@/containers/DayView.vue'

export default Vue.extend({
  name: 'App',
  components: {
    DayView,
  },
})
</script>

<style lang="scss">
  @import 'assets/reset.scss';

  body {
    height: 100vh;
  }
</style>
