import Task from '@/models/Task'
import Collection from '@/models/Collection'

enum LocalStorageKeyTypes {
  TASKS = 'TASKS',
}

export interface LocalStorageTypes {
  [LocalStorageKeyTypes.TASKS]: Collection<typeof Task>;
}

export default LocalStorageKeyTypes
