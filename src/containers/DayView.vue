<template>
  <section ref="section">
    <header>
      <div class="year">{{ year }}</div>
      <div class="dateText">{{ dateText }}</div>
    </header>
    <div class="body">
      <div class="taskSection">
        <div class="title">{{ taskTodoText }}</div>
        <div class="taskContainer">
          <AddTaskButton :onClick="initTask" />
          <template v-for="task in todoTasks">
            <TaskBlock :key="task.getKey()" :task="task" :getSectionRef="getSectionRef"/>
          </template>
          <TaskBlock
            v-if="state.init"
            :edit="true"
            :onCancel="resetInit"
            :task="newTask"
            :getSectionRef="getSectionRef"
          />
        </div>
      </div>
      <div class="taskSection">
        <div class="title">{{ taskEndedText }}</div>
        <div class="taskContainer">
          <AddTaskButton :onClick="initTask" />
          <template v-for="task in endedTasks">
            <TaskBlock :key="task.getKey()" :task="task" :getSectionRef="getSectionRef"/>
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
import { dateToTimestamp } from '@/utils/dateUtils'
import store from '@/store'

export default Vue.extend({
  name: 'DayView',
  props: ['year', 'month', 'date', 'day'],
  computed: {
    dateText() {
      const dayText = I18nService.t(DayOfTheWeekI18nMap[this.day as DayOfTheWeekTypes])
      return `${this.month}${I18nService.t('time.month')} ${this.date}${I18nService.t('time.day')} (${dayText})`
    },
    todoTasks() {
      return this
        .store
        .tasks
        .filter((task: Task) => !task.ended)
        .values()
        .sort((left: Task, right: Task) => left.updatedTime - right.updatedTime)
    },
    endedTasks() {
      return this
        .store
        .tasks
        .filter((task: Task) => task.ended)
        .values()
        .sort((left: Task, right: Task) => right.updatedTime - left.updatedTime)
    },
    taskTodoText() {
      return `${I18nService.t('word.taskTodo')} (${this.todoTasks.length})`
    },
    taskEndedText() {
      return `${I18nService.t('word.taskEnded')} (${this.endedTasks.length})`
    },
    newTask() {
      return new Task({
        date: dateToTimestamp({
          year: this.year,
          month: this.month,
          date: this.date,
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
  },
})
</script>

<style scoped lang="scss">
section {
  width: calc(100% - 48px);
  height: 100%;
  padding: 0 24px;
  overflow: auto;
  max-width: 375px;

  header {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 60px;

    .year {
      font-size: 15px;
    }

    .dateText {
      font-size: 17px;
    }
  }

  .body {
    margin: 0 24px;

    .taskSection {
      margin-top: 60px;

      &:first-child {
        margin-top: 20px;
      }

      .title {
        font-size: 17px;
        margin-bottom: 12px;
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
