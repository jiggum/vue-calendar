<template>
  <section ref="section">
    <header>
      <div class="year">{{ dateData.year }}</div>
      <div class="dateText">{{ dateText }}</div>
      <svg width="20" height="20" viewBox="0 0 20 20" class="navigate left" @click="navigateLeft">
        <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" stroke="#000000" fill="none"/>
        {{ /* eslint-disable-next-line max-len */ }}
        <path d="M3.57574 9.57574C3.34142 9.81005 3.34142 10.1899 3.57574 10.4243L7.39411 14.2426C7.62843 14.477 8.00833 14.477 8.24264 14.2426C8.47696 14.0083 8.47696 13.6284 8.24264 13.3941L4.84853 10L8.24264 6.60589C8.47696 6.37157 8.47696 5.99167 8.24264 5.75736C8.00833 5.52304 7.62843 5.52304 7.39411 5.75736L3.57574 9.57574ZM17 9.4L4 9.4V10.6L17 10.6V9.4Z" fill="#000000"/>
      </svg>
      <svg width="20" height="20" viewBox="0 0 20 20" class="navigate right" @click="navigateRight">
        <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" stroke="#000000" fill="none"/>
        {{ /* eslint-disable-next-line max-len */ }}
        <path d="M16.4243 10.4243C16.6586 10.1899 16.6586 9.81005 16.4243 9.57574L12.6059 5.75736C12.3716 5.52304 11.9917 5.52304 11.7574 5.75736C11.523 5.99167 11.523 6.37157 11.7574 6.60589L15.1515 10L11.7574 13.3941C11.523 13.6284 11.523 14.0083 11.7574 14.2426C11.9917 14.477 12.3716 14.477 12.6059 14.2426L16.4243 10.4243ZM3 10.6H16V9.4H3V10.6Z" fill="black"/>
      </svg>
    </header>
    <div class="body">
      <div class="taskSection">
        <div class="title">{{ taskTodoText }}</div>
        <div class="taskContainer">
          <AddTaskButton :onClick="initTask" />
          <template v-for="(task, index) in todoTasks">
            <TaskBlock
              :key="task.getKey()"
              :task="task"
              :endPriroity="endedTasks.length > 0 ? endedTasks[0].priority - 1 : 0"
              :moveUpPriority="
                index > 1 ?
                  (todoTasks[index - 1].priority + todoTasks[index - 2].priority) / 2 :
                  (index === 1 ? todoTasks[0].priority - 1 : undefined)"
              :moveDownPriority="
                index < todoTasks.length - 2 ?
                  (todoTasks[index + 1].priority + todoTasks[index + 2].priority) / 2 :
                  (index === todoTasks.length - 2 ?
                    todoTasks[todoTasks.length - 1].priority + 1 :
                    undefined)"
              :getSectionRef="getSectionRef"
              :dragging="state.dragging"
              :setDragging="setDragging"
              :index="index"
              :resetInit="resetInit"
            />
          </template>
          <TaskBlock
            v-if="state.init"
            :edit="true"
            :resetInit="resetInit"
            :task="newTask"
            :createPriority="
              todoTasks.length > 0 ?
                todoTasks[todoTasks.length - 1].priority + 1 : 0"
            :getSectionRef="getSectionRef"
          />
        </div>
      </div>
      <div class="taskSection">
        <div class="title">{{ taskEndedText }}</div>
        <div class="taskContainer">
          <template v-for="(task, index) in endedTasks">
            <TaskBlock
              :key="task.getKey()"
              :task="task"
              :moveUpPriority="
                index > 1 ?
                  (endedTasks[index - 1].priority + endedTasks[index - 2].priority) / 2 :
                  (index === 1 ? endedTasks[0].priority - 1 : undefined)"
              :moveDownPriority="
                index < endedTasks.length - 2 ?
                  (endedTasks[index + 1].priority + endedTasks[index + 2].priority) / 2 :
                  (index === endedTasks.length - 2 ?
                    endedTasks[endedTasks.length - 1].priority + 1 :
                    undefined)"
              :getSectionRef="getSectionRef"
              :dragging="state.dragging"
              :setDragging="setDragging"
              :index="index"
              :resetInit="resetInit"
            />
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import I18nService from '@/services/I18nService'
import DayOfTheWeekTypes, { DayOfTheWeekI18nMap } from '@/consts/DayOfTheWeekTypes'
import AddTaskButton from '@/components/AddTaskButton.vue'
import TaskBlock from '@/components/TaskBlock.vue'
import Task from '@/models/Task'
import {
  dateToTimestamp,
  timestampToDate,
  getDate,
  getYear,
  getMonth,
} from '@/utils/dateUtils'
import store from '@/store'
import RouteService from '@/services/RouteService'

export default Vue.extend({
  name: 'DayView',
  props: ['date', 'now'],
  computed: {
    dateData() {
      return timestampToDate(this.date)
    },
    dateText() {
      const dayText = I18nService.t(DayOfTheWeekI18nMap[this.dateData.day as DayOfTheWeekTypes])
      // @ts-ignore
      return `${this.dateData.month}${I18nService.t('time.month')} ${this.dateData.date}${I18nService.t('time.day')} (${dayText})`
    },
    todoTasks() {
      return this
        // @ts-ignore
        .store
        .tasks
        .filter((task: Task) => {
          const { year, month, date } = timestampToDate(task.date)
          return !task.ended && year === this.dateData.year
            && month === this.dateData.month
            && date === this.dateData.date
        })
        .values()
        .sort((left: Task, right: Task) => {
          if (left.priority === right.priority) return left.updatedTime - right.updatedTime
          return left.priority - right.priority
        })
    },
    endedTasks() {
      return this
        // @ts-ignore
        .store
        .tasks
        .filter((task: Task) => {
          const { year, month, date } = timestampToDate(task.date)
          return task.ended && year === this.dateData.year
            && month === this.dateData.month
            && date === this.dateData.date
        })
        .values()
        .sort((left: Task, right: Task) => {
          if (left.priority === right.priority) return right.updatedTime - left.updatedTime
          return left.priority - right.priority
        })
    },
    taskTodoText() {
      // @ts-ignore
      return `${I18nService.t('word.taskTodo')} (${this.todoTasks.length})`
    },
    taskEndedText() {
      // @ts-ignore
      return `${I18nService.t('word.taskEnded')} (${this.endedTasks.length})`
    },
    newTask() {
      return new Task({
        date: dateToTimestamp({
          // @ts-ignore
          year: this.dateData.year,
          // @ts-ignore
          month: this.dateData.month,
          // @ts-ignore
          date: this.dateData.date,
        }),
      }, true)
    },
  },
  components: {
    AddTaskButton,
    TaskBlock,
  },
  data() {
    return {
      state: {
        init: false,
        dragging: false,
      },
      store: store.state,
    }
  },
  methods: {
    initTask() {
      this.state.init = true
    },
    resetInit() {
      this.state.init = false
    },
    getSectionRef(): HTMLElement {
      return this.$refs.section as HTMLElement
    },
    navigateLeft() {
      const today = new Date(this.now)
      const yesterday = today.setDate(today.getDate() - 1).valueOf()
      RouteService.navigate(`${getYear(yesterday)}/${getMonth(yesterday)}/${getDate(yesterday)}`)
    },
    navigateRight() {
      const today = new Date(this.now)
      const tomorrow = today.setDate(today.getDate() + 1).valueOf()
      RouteService.navigate(`${getYear(tomorrow)}/${getMonth(tomorrow)}/${getDate(tomorrow)}`)
    },
    setDragging(dragging: boolean) {
      this.state.dragging = dragging
    },
  },
})
</script>

<style scoped lang="scss">
section {
  position: relative;
  width: calc(100% - 48px);
  height: 100%;
  padding: 0 24px;
  overflow-y: auto;
  overflow-x: hidden;
  max-width: 375px;

  &:not(:first-child) {
    &::before {
      content: '';
      position: fixed;
      top: 64px;
      bottom: 36px;
      margin-left: -24px;
      width: 1px;
      background-color: #000000;
    }

    header .navigate.left {
      display: none;
    }
  }

  &:not(:last-child) {
    header .navigate.right {
      display: none;
    }
  }

  header {
    position: sticky;
    z-index: 1;
    top: 0;
    background-color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 60px;

    .year {
      font-size: 15px;
      white-space: nowrap;
    }

    .dateText {
      font-size: 17px;
      white-space: nowrap;
    }

    .navigate {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;

      &.left {
        left: 0;
      }

      &.right {
        right: 0;
      }
    }
  }

  .body {
    .taskSection {
      margin-top: 60px;

      &:first-child {
        margin-top: 20px;
      }

      .title {
        font-size: 17px;
        margin-bottom: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .taskContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }
  }
}
</style>
