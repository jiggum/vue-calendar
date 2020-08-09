import LocalStorageKeyTypes from '@/consts/LocalStorageKeyTypes'
import Task from '@/models/Task'
import Collection from '@/models/Collection'
import LocalStorageService from './LocalStorageService'

describe('LocalStorageService', () => {
  const task = new Task()
  const collection = new Collection(Task, [task])

  test('default', () => {
    LocalStorageService.set(LocalStorageKeyTypes.TASKS, collection)
    expect(LocalStorageService.get(LocalStorageKeyTypes.TASKS)?.data).toEqual(
      collection.data,
    )
  })

  test('with postFix', () => {
    LocalStorageService.set(LocalStorageKeyTypes.TASKS, collection, '1')
    expect(
      LocalStorageService.get(LocalStorageKeyTypes.TASKS, '1')?.data,
    ).toEqual(collection.data)
  })
})
