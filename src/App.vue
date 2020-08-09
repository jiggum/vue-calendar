<template>
  <div class="App">
    <DayView v-if="windowWidth >= 1269" :year="year" :month="month" :date="date - 1" :now="ts"/>
    <DayView :year="year" :month="month" :date="date" :now="ts"/>
    <DayView v-if="windowWidth >= 1269" :year="year" :month="month" :date="date + 1" :now="ts"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import DayView from '@/containers/DayView.vue'
import {
  getDate, getMonth, getYear, dateToTimestamp,
} from '@/utils/dateUtils'
import RouteService from '@/services/RouteService'

export default Vue.extend({
  name: 'App',
  components: {
    DayView,
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      currentRoute: window.location.hash,
      now: Date.now(),
    }
  },
  computed: {
    ts() {
      const match = RouteService.match(':year/:month/:date', this.currentRoute) as {
            year: number;
            month: number;
            date: number;
          } | null
      return match ? dateToTimestamp(match) : this.now
    },
    year() {
      return getYear(this.ts)
    },
    month() {
      return getMonth(this.ts)
    },
    date() {
      return getDate(this.ts)
    },
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
      window.addEventListener('hashchange', this.onHashChange)
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize)
    window.removeEventListener('hashchange', this.onHashChange)
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth
    },
    onHashChange() {
      this.currentRoute = window.location.hash
    },
  },
})
</script>

<style lang="scss">
  @import 'assets/reset.scss';

  body {
    height: 100vh;
    display: flex;
    justify-content: center;
  }

  .App {
    display: flex;
    justify-content: center;
    width: 100%;
  }
</style>
