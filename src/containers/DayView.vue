<template>
  <section>
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
            <TaskBlock :key="task.getKey()" :task="task" />
          </template>
          <TaskBlock v-if="state.init" :edit="true" :onCancel="resetInit" :task="newTask"/>
        </div>
      </div>
      <div class="taskSection">
        <div class="title">{{ taskEndedText }}</div>
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
    taskTodoText() {
      return `${I18nService.t('word.taskTodo')} (1)`
    },
    taskEndedText() {
      return `${I18nService.t('word.taskEnded')} (1)`
    },
    todoTasks() {
      return this.store.tasks.filter((task: Task) => !task.ended).values()
    },
    newTask() {
      return new Task({
        date: dateToTimestamp({
          year: this.year,
          month: this.month,
          date: this.date,
        }),
      })
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
  },
})
</script>

<style scoped lang="scss">
section {
  width: 100%;
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
    margin-top: 24px;

    .taskSection {
      &:not(:first-child) {
        margin-top: 60px;
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
