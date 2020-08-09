import { TBaseModel, TBaseModelFields } from '@/utils/modelUtils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TModelFields<T extends new (...args: any) => any> = ConstructorParameters<
  T
>[0] &
  Partial<TBaseModelFields>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class Collection<T extends new (...args: any) => any> {
  Model: T

  emptyModel: InstanceType<T>

  data: Map<string, InstanceType<T>>

  private static getModelKey = (model: TBaseModel) => model.getKey()

  // eslint-disable-next-line max-len
  private static merger = <T extends TBaseModel>(oldModel: T, newModel: T) => (oldModel && oldModel.compareLatest(newModel) ? oldModel : newModel)

  constructor(Model: T, elements: TModelFields<T>[] | null = null) {
    this.Model = Model
    this.emptyModel = new Model({}, true)
    this.data = this.createMap(elements || [])
  }

  private toModel = (element: TModelFields<T>) => new this.Model(element)

  private createMap = (elements: TModelFields<T>[]) => new Map(
    elements.map(this.toModel).map((e) => [Collection.getModelKey(e), e]),
  )

  private clone(newCollection: Map<string, InstanceType<T>>) {
    if (this.data === newCollection) {
      return this
    }
    const collection = new Collection(this.Model)
    collection.data = newCollection
    return collection
  }

  toArray() {
    return Array.from(this.data)
  }

  values() {
    return this.toArray().map(([, e]) => e)
  }

  map(mapper: (model: InstanceType<T>) => InstanceType<T>) {
    const collection = new Map<string, InstanceType<T>>(
      this.toArray().map(([key, e]) => [key, mapper(e)]),
    )
    return this.clone(collection)
  }

  some(predicate: (model: InstanceType<T>, key?: string) => boolean) {
    return this.toArray().some(([key, model]) => predicate(model, key))
  }

  filter(predicate: (model: InstanceType<T>, key?: string) => boolean) {
    const collection = new Map(
      this.toArray().filter(([key, model]) => predicate(model, key)),
    )
    return this.clone(collection)
  }

  get(key?: string) {
    if (!key) return this.emptyModel
    return this.data.get(key) || this.emptyModel
  }

  delete(key: string) {
    const collection = new Map(this.data)
    collection.delete(key)
    return this.clone(collection)
  }

  clear() {
    return new Collection(this.Model)
  }

  upsert(element: TModelFields<T>) {
    const model = this.toModel(element)
    const key = Collection.getModelKey(model)
    const collection = new Map(this.data)
    collection.set(key, Collection.merger(this.data.get(key), model))
    return this.clone(collection)
  }
}

export default Collection
