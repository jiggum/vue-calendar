import LocalStorageKeyTypes, {
  LocalStorageTypes,
} from '@/consts/LocalStorageKeyTypes'
import Collection from '@/models/Collection'
import models from '@/models'

type TStorageData = {
  isCollection?: true;
  model?: keyof typeof models;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

class LocalStoragService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static serialize = (value: any) => {
    if (value instanceof Collection) {
      return JSON.stringify({
        isCollection: true,
        model: value.Model.className,
        value: value.values(),
      })
    }
    return JSON.stringify({ value })
  }

  private static deserialize = (jsonStr: string | null) => {
    if (jsonStr) {
      const json: TStorageData | undefined = JSON.parse(jsonStr)
      if (!json) return undefined
      if (json.isCollection && json.model) return new Collection(models[json.model], json.value)
      return json.value
    }
    return undefined
  }

  get = <T extends LocalStorageKeyTypes>(
    key: T,
    postFix?: string,
  ): LocalStorageTypes[T] | undefined => LocalStoragService.deserialize(
    localStorage.getItem(`${key}${postFix}`),
  )

  set = <T extends LocalStorageKeyTypes>(
    key: T,
    value: LocalStorageTypes[T],
    postFix?: string,
  ) => localStorage.setItem(
    `${key}${postFix}`,
    LocalStoragService.serialize(value),
  )

  del = (key: LocalStorageKeyTypes, postFix?: string) => localStorage.removeItem(`${key}${postFix}`)
}

export default new LocalStoragService()
