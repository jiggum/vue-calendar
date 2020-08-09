<template>
  <div class="Task" ref="wrapper">
    <div
      class="presenter"
      :class="{
        active: editState,
        focus,
        disabled: this.task.ended,
        dragging: mouseDiffX || mouseDiffY
      }"
      :style="{
        transform:
          `translate(
            ${Math.abs(mouseDiffX) >= Math.abs(mouseDiffY) &&
                this.index === this.initIndex ? mouseDiffX : 0}px,
            ${Math.abs(mouseDiffX) < Math.abs(mouseDiffY) ||
                this.index !== this.initIndex ? mouseDiffY : 0 }px
          )`,
        opacity,
        backgroundColor,
      }"
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
  props: [
    'edit',
    'resetInit',
    'task',
    'endPriroity',
    'createPriority',
    'moveUpPriority',
    'moveDownPriority',
    'getSectionRef',
    'dragging',
    'setDragging',
    'index',
  ],
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
      if (this.resetInit) this.resetInit()
    },
    setEnded() {
      store.upsertTask({
        title: this.title,
        ended: true,
        id: this.task.id,
        date: this.task.date,
        priority: this.endPriroity,
      })
    },
    handleComplete() {
      if (this.editState) {
        if (!this.task.getKey()) {
          store.upsertTask({
            title: this.title,
            date: this.task.date,
            priority: this.createPriority,
          })
        } else {
          store.upsertTask({
            title: this.title,
            id: this.task.id,
            date: this.task.date,
            priority: this.task.priority,
            ended: this.task.ended,
          })
        }
      } else {
        this.setEnded()
      }
      this.handleCancel()
    },
    handleMoveEnd() {
      if (this.mouseDiffX === 0 && this.mouseDiffY === 0) { this.handleClick() }
      this.mouseDiffX = 0
      this.mouseDiffY = 0
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
      this.setDragging(false)
    },
    handleMouseUp() {
      document.removeEventListener('mousemove', this.handleMouseMove)
      document.removeEventListener('mouseup', this.handleMouseUp)
      this.handleMoveEnd()
    },
    handleTouchEnd() {
      document.removeEventListener('touchmove', this.handleTouchMove)
      document.removeEventListener('touchend', this.handleTouchEnd)
      this.handleMoveEnd()
    },
    handleMove(e: MouseEvent | TouchEvent, clientX: number, clientY: number) {
      this.mouseDiffX = clientX - this.originMouseClientX
      this.mouseDiffY = clientY - this.originMouseClientY
      this.setDragging(true)
      if (Math.abs(this.mouseDiffX) >= Math.abs(this.mouseDiffY) && this.index === this.initIndex) {
        this.backgroundColor = undefined
        if ((this.task.ended || this.mouseDiffX <= 0) && e.target) {
          this.opacity = Math.max(1 - Math.abs(this.mouseDiffX) / (e.target.clientWidth / 2), 0)
        } else if (this.mouseDiffX >= 0 && e.target) {
          const ratio = Math.min(this.mouseDiffX / (e.target.clientWidth / 2), 1)
          this.backgroundColor = mixColor('#5AAAFA', ENDED_COLOR, ratio)
        }
      } else {
        this.opacity = 1
        this.backgroundColor = '#081F5C'
        if (this.$refs.wrapper) {
          if (Math.abs(this.mouseDiffY) > this.$refs.wrapper.clientHeight * 0.6) {
            if (this.mouseDiffY >= 0 && this.moveDownPriority) {
              store.upsertTask({
                title: this.task.title,
                id: this.task.id,
                date: this.task.date,
                priority: this.moveDownPriority,
                ended: this.task.ended,
              })
              this.originMouseClientY = clientY + this.$refs.wrapper.clientHeight * 0.4
              this.mouseDiffY = -this.$refs.wrapper.clientHeight * 0.4
            } else if (this.mouseDiffY < 0 && this.moveUpPriority) {
              store.upsertTask({
                title: this.task.title,
                id: this.task.id,
                date: this.task.date,
                priority: this.moveUpPriority,
                ended: this.task.ended,
              })
              this.originMouseClientY = clientY - this.$refs.wrapper.clientHeight * 0.4
              this.mouseDiffY = this.$refs.wrapper.clientHeight * 0.4
            }
          }
        }
      }
    },
    handleMouseMove(e: MouseEvent) {
      this.handleMove(e, e.clientX, e.clientY)
    },
    handleTouchMove(e: TouchEvent) {
      this.handleMove(e, e.touches[0].clientX, e.touches[0].clientY)
    },
    handleMouseDown(e: MouseEvent) {
      if (this.editState || this.focus) return
      this.originMouseClientX = e.clientX
      this.originMouseClientY = e.clientY
      this.initIndex = this.index
      document.addEventListener('mousemove', this.handleMouseMove)
      document.addEventListener('mouseup', this.handleMouseUp)
    },
    handleTouchstart(e: TouchEvent) {
      if (this.editState || this.focus) return
      this.originMouseClientX = e.touches[0].clientX
      this.originMouseClientY = e.touches[0].clientY
      this.initIndex = this.index
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
      originMouseClientY: 0,
      initIndex: this.index,
      mouseDiffX: 0,
      mouseDiffY: 0,
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
    dragging(val) {
      if (val) {
        this.focus = false
        this.handleCancel()
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
    user-select: none;

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

    &.dragging {
      position: relative;
      z-index: 1;
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
