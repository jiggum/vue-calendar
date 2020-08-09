<template>
  <div class="Button" @click="onClick">
    <slot />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Button',
  props: ['onClick'],
})
</script>

<style scoped lang="scss">
.Button {
  width: 100px;
  height: 44px;
  font-size : 15px;
  background-color: #eeeeee;
  color: #007AFF;
  border-radius: 8px;
  cursor: pointer;
  line-height: 44px;
  text-align: center;
}
</style>
