<template>
  <div class="AddTaskButton" @click="onClick">
    <svg width="20" height="20" viewBox="0 0 20 20">
      <path d="M2 10H18" stroke="#000000" stroke-width="2"/>
      <path d="M10 2L10 18" stroke="#000000" stroke-width="2"/>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AddTaskButton',
  props: ['onClick'],
})
</script>

<style scoped lang="scss">
.AddTaskButton {
  width: 100%;
  height: 68px;
  border-radius: 12px;
  border: 2px solid #000000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  margin: 4px 0;
}
</style>
