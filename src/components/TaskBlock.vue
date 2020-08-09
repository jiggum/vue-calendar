<template>
  <div class="Task">
    <div class="presenter" :class="{ active: edit, focus }" @click="!edit && !focus && handleClick">
      <input v-if="edit" v-model="title" ref="input" />
      <template v-else>{{ task.title }}</template>
    </div>
    <div class="actions" v-if="edit">
      <Button :on-click="handleDelete" v-if="focus">{{ deleteText }}</Button>
      <Button :on-click="handleEdit" v-if="focus">{{ editText }}</Button>
      <Button :on-click="handleCancel" v-if="edit">{{ cancelText }}</Button>
      <Button :on-click="handleComplete" v-if="focus || edit">{{ completeText }}</Button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Button from '@/components/Button.vue'
import I18nService from '@/services/I18nService'
import store from '@/store'

export default Vue.extend({
  name: 'AddTaskButton',
  props: ['edit', 'onCancel', 'task'],
  methods: {
    handleClick() {
      console.log('handle click')
    },
    handleDelete() {
      console.log('handleDelete')
    },
    handleEdit() {
      console.log('handleEdit')
    },
    handleCancel() {
      this.editState = false
      this.onCancel()
    },
    handleComplete() {
      this.handleCancel()
      store.createTask({
        title: this.title,
        date: this.task.date,
        priority: this.task.priority,
      })
    },
  },
  data() {
    return {
      title: '',
      focus: false,
      editState: this.edit,
      deleteText: I18nService.t('word.delete'),
      editText: I18nService.t('word.edit'),
      cancelText: I18nService.t('word.cancel'),
      completeText: I18nService.t('word.complete'),
    }
  },
  components: {
    Button,
  },
  mounted() {
    if (this.edit && this.$refs.input) this.$refs.input.focus()
  },
})
</script>

<style scoped lang="scss">
.Task {
  width: 100%;

  .presenter {
    width: 100%;
    height: 68px;
    border-radius: 12px;
    font-size : 17px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    background-color: #5AAAFA;
    margin: 4px 0;
    color: #ffffff;

    &.active {
      background-color: #081F5C;
    }

    input {
      background: transparent;
      color: #ffffff;
      border: none;
      outline: none;
      width: 100%;
      text-align: center;
      padding: 0 16px;
    }
  }

  .actions {
    width: 100%;
    display: flex;
    margin-top: 8px;
    justify-content: center;

    .Button {
      margin: 0 6px;
    }
  }
}
</style>
