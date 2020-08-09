<template>
  <div class="Task" ref="wrapper">
    <div
      class="presenter"
      :class="{ active: editState, focus, disabled: this.task.ended }"
      @click="handleClick"
    >
      <template v-if="editState">
        <input v-model="title" @keyup.enter="handleComplete" ref="input" />
      </template>
      <template v-else>
        <div class="title">{{ task.title }}</div>
      </template>
    </div>
    <div class="actions" v-if="editState || focus">
      <Button :on-click="handleDelete" v-if="focus">{{ deleteText }}</Button>
      <Button :on-click="handleEdit" v-if="focus">{{ editText }}</Button>
      <Button :on-click="handleCancel" v-if="editState">{{ cancelText }}</Button>
      <Button :on-click="handleComplete" v-if="focus || editState">{{ completeText }}</Button>
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
  props: ['edit', 'onCancel', 'task', 'getSectionRef'],
  methods: {
    autoScroll() {
      const sectionRef = this.getSectionRef()
      const wrapprRef = this.$refs.wrapper as HTMLDivElement
      if (sectionRef && wrapprRef) {
        const targetOffset = (sectionRef.clientHeight - wrapprRef.clientHeight) / 2
        sectionRef.scrollTop = wrapprRef.offsetTop - targetOffset
      }
    },
    handleClick() {
      if (this.editState || this.task.ended) return
      this.focus = !this.focus
    },
    handleDelete() {
      this.focus = false
      store.deleteTask(this.task.getKey())
    },
    handleEdit() {
      this.focus = false
      this.editState = true
    },
    handleCancel() {
      this.editState = false
      if (this.onCancel) this.onCancel()
    },
    handleComplete() {
      if (this.editState) {
        store.upsertTask({
          title: this.title,
          id: this.task.id,
          date: this.task.date,
          priority: this.task.priority,
          ended: this.task.ended,
        })
      } else {
        store.upsertTask({
          title: this.title,
          ended: true,
          id: this.task.id,
          date: this.task.date,
          priority: this.task.priority,
        })
      }
      this.handleCancel()
    },
  },
  data() {
    return {
      title: this.task.title,
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
  updated() {
    if (!this.prevEditState && this.editState && this.$refs.input) {
      this.$refs.input.focus()
      this.autoScroll()
    }
    this.prevEditState = this.editState
  },
  mounted() {
    if (this.editState && this.$refs.input) {
      this.$refs.input.focus()
      this.autoScroll()
    }
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
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    background-color: #5AAAFA;
    margin: 4px 0;
    padding: 0 16px;

    &.active {
      background-color: #081F5C;
    }

    &.focus {
      background-color: #007AFF;
    }

    &.disabled {
      background-color: #969DAB;
      text-decoration: line-through;
      text-decoration-color: #FFFFFF;
    }

    input {
      background: transparent;
      color: #FFFFFF;
      border: none;
      outline: none;
      width: 100%;
      text-align: center;
      font-family: inherit;
      font-size: 17px;
    }

    .title {
      font-size : 17px;
      color: #FFFFFF;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .actions {
    width: 100%;
    display: flex;
    margin: 8px 0 4px;
    justify-content: center;

    .Button {
      margin: 0 6px;
    }
  }
}
</style>
