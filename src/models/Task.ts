import { createModel } from '@/utils/modelUtils'

export default class Task extends createModel(
  {
    title: '',
    date: 0,
    priority: 0,
  },
  'Task',
) {}
