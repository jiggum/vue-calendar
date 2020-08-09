<template>
  <div class="Task" ref="wrapper">
    <div
      class="presenter"
      :class="{ active: editState, focus, disabled: this.task.ended }"
      :style="{ transform: `translateX(${swipeDiff}px)`, opacity, backgroundColor }"
      ref="presenter"
    >
      <template v-if="editState">
        <input
          v-model="title"
          @keyup.enter="handleComplete"
          ref="input"
          :class="{ error }"
        />
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
import { mixColor } from '@/utils/colorUtils'

const ENDED_COLOR = '#969DAB'

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
    setEnded() {
      store.upsertTask({
        title: this.title,
        ended: true,
        id: this.task.id,
        date: this.task.date,
        priority: this.task.priority,
      })
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
        this.setEnded()
      }
      this.handleCancel()
    },
    handleMouseUp() {
      if (this.swipeDiff === 0) { this.handleClick() }
      this.swipeDiff = 0
      document.removeEventListener('mousemove', this.handleMouseMove)
      document.removeEventListener('mouseup', this.handleMouseUp)
      if (this.opacity === 0) {
        this.handleDelete()
      } else {
        this.opacity = 1
      }
      if (this.backgroundColor === ENDED_COLOR) {
        this.setEnded()
      } else {
        this.backgroundColor = undefined
      }
    },
    handleTouchEnd() {
      if (this.swipeDiff === 0) { this.handleClick() }
      this.swipeDiff = 0
      document.removeEventListener('touchmove', this.handleTouchMove)
      document.removeEventListener('touchend', this.handleTouchEnd)
      if (this.opacity === 0) {
        this.handleDelete()
      } else {
        this.opacity = 1
      }
      if (this.backgroundColor === ENDED_COLOR) {
        this.setEnded()
      } else {
        this.backgroundColor = undefined
      }
    },
    handleMouseMove(e: MouseEvent) {
      this.swipeDiff = e.clientX - this.originMouseClientX
      if (this.swipeDiff <= 0 && e.target) {
        this.opacity = Math.max(1 + this.swipeDiff / (e.target.clientWidth / 2), 0)
      }
      if (this.swipeDiff >= 0 && e.target) {
        const ratio = Math.min(this.swipeDiff / (e.target.clientWidth / 2), 1)
        this.backgroundColor = mixColor('#5AAAFA', ENDED_COLOR, ratio)
      }
    },
    handleTouchMove(e: TouchEvent) {
      this.swipeDiff = e.touches[0].clientX - this.originMouseClientX
      if (this.swipeDiff <= 0 && e.target) {
        this.opacity = Math.max(1 + this.swipeDiff / (e.target.clientWidth / 2), 0)
      }
      if (this.swipeDiff >= 0 && e.target) {
        const ratio = Math.min(this.swipeDiff / (e.target.clientWidth / 2), 1)
        this.backgroundColor = mixColor('#5AAAFA', ENDED_COLOR, ratio)
      }
    },
    handleMouseDown(e: MouseEvent) {
      if (this.editState || this.focus) return
      this.originMouseClientX = e.clientX
      document.addEventListener('mousemove', this.handleMouseMove)
      document.addEventListener('mouseup', this.handleMouseUp)
    },
    handleTouchstart(e: TouchEvent) {
      if (this.editState || this.focus) return
      this.originMouseClientX = e.touches[0].clientX
      document.addEventListener('touchmove', this.handleTouchMove)
      document.addEventListener('touchend', this.handleTouchEnd)
    },
  },
  data() {
    return {
      title: this.task.title,
      focus: false,
      error: false,
      editState: this.edit,
      originMouseClientX: 0,
      swipeDiff: 0,
      opacity: 1,
      backgroundColor: undefined,
      deleteText: I18nService.t('word.delete'),
      editText: I18nService.t('word.edit'),
      cancelText: I18nService.t('word.cancel'),
      completeText: I18nService.t('word.complete'),
    }
  },
  watch: {
    title(val) {
      if (val.length > 20) {
        this.title = val.slice(0, 20)
        this.error = true
      }
      if (val.length < 20) {
        this.error = false
      }
    },
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
    if (this.$refs.presenter) {
      this.$refs.presenter.addEventListener('mousedown', this.handleMouseDown)
      this.$refs.presenter.addEventListener('touchstart', this.handleTouchstart)
    }
  },
  beforeDestroy() {
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
    document.removeEventListener('touchmove', this.handleTouchMove)
    document.removeEventListener('touchend', this.handleTouchEnd)
    if (this.$refs.presenter) {
      this.$refs.presenter.removeEventListener('mousedown', this.handleMouseDown)
      this.$refs.presenter.removeEventListener('touchstart', this.handleTouchstart)
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
    cursor: pointer;

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

      &.error {
        color: #FF0000;
      }
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
