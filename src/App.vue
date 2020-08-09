<template>
  <div class="App">
    <DayView v-if="windowWidth >= 1269" :date="yesterday" :now="today" />
    <DayView :date="today" :now="today" />
    <DayView v-if="windowWidth >= 1269" :date="tomorrow" :now="today"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import DayView from '@/containers/DayView.vue'
import { dateToTimestamp } from '@/utils/dateUtils'
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
    today() {
      const match = RouteService.match(':year/:month/:date', this.currentRoute) as {
            year: number;
            month: number;
            date: number;
          } | null
      // @ts-ignore
      return match ? dateToTimestamp(match) : this.now
    },
    yesterday() {
      // @ts-ignore
      const date = new Date(this.today)
      return date.setDate(date.getDate() - 1).valueOf()
    },
    tomorrow() {
      // @ts-ignore
      const date = new Date(this.today)
      return date.setDate(date.getDate() + 1).valueOf()
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
