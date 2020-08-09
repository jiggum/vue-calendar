import { uuidv4 } from '@/utils/randomUtils'

export type TBaseModelFields = {
  readonly id: string;
  readonly updatedTime: number;
}

export type TBaseModel = {
  getKey: () => string;
  getClassKey: () => string;
  isEmpty: () => boolean;
  getLatest: () => number;
  compareLatest: (target: TBaseModel) => boolean;
} & TBaseModelFields

interface IBaseModel<T> {
  className: string;
  new (values?: Partial<T & TBaseModelFields>, empty?: boolean): TBaseModel & T;
}

export const createModel = <TValues>(
  defaultValues: TValues,
  className: string,
) => class BaseModel {
    static className = className

    readonly id: string

    readonly updatedTime: number

    constructor(values?: Partial<TValues & TBaseModelFields>, empty?: boolean) {
      this.id = empty ? '' : uuidv4()
      this.updatedTime = empty ? 0 : Date.now()
      const keys = [
          ...Object.keys(defaultValues),
        'id',
        'updatedTime',
      ] as (keyof TValues & TBaseModelFields)[]

      keys.forEach((key) => {
        Object.defineProperty(this, key, {
          value:
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (values && values[key]) || defaultValues[key] || (this as any)[key],
          writable: false,
          enumerable: true,
        })
      })
    }

    getKey() {
      return this.id
    }

    getClassKey() {
      return `${className}:${this.getKey()}`
    }

    isEmpty() {
      return !this.getKey()
    }

    getLatest(): number {
      return (this as TBaseModel).updatedTime
    }

    compareLatest(target: BaseModel) {
      return this.getLatest() >= target.getLatest()
    }
} as IBaseModel<TValues>
