import LocalStorageKeyTypes from '@/consts/LocalStorageKeyTypes'
import LocalStorageService from '@/services/LocalStorageService'
import Task from '@/models/Task'
import Collection from '@/models/Collection'

export default {
  debug: true,
  state: {
    tasks: LocalStorageService.get(LocalStorageKeyTypes.TASKS) || new Collection(Task, []),
  },
  createTask(task: Partial<Task>) {
    this.state.tasks = this.state.tasks.upsert(task)
    LocalStorageService.set(LocalStorageKeyTypes.TASKS, this.state.tasks)
  }
}
