import Collection from './Collection'
import SampleCounter from './SampleCounter'

describe('Collection', () => {
  let sampleCounters: Collection<typeof SampleCounter>
  const sampleCountersData = [
    {
      id: 'id1',
      count: 1,
      updatedTime: 1,
    },
    {
      id: 'id2',
      count: 2,
      updatedTime: 1,
    },
  ]

  beforeEach(() => {
    sampleCounters = new Collection(SampleCounter, sampleCountersData)
  })
  test('toArray', () => {
    expect(sampleCounters.toArray()).toEqual([
      [
        'id1',
        new SampleCounter({
          id: 'id1',
          count: 1,
          updatedTime: 1,
        }),
      ],
      [
        'id2',
        new SampleCounter({
          id: 'id2',
          count: 2,
          updatedTime: 1,
        }),
      ],
    ])
  })
  test('values', () => {
    expect(sampleCounters.values()).toEqual([
      new SampleCounter({
        id: 'id1',
        count: 1,
        updatedTime: 1,
      }),
      new SampleCounter({
        id: 'id2',
        count: 2,
        updatedTime: 1,
      }),
    ])
  })
  test('map', () => {
    const mapResult = sampleCounters.map(
      (sampleCounter) => new SampleCounter({ ...sampleCounter, count: sampleCounter.count + 1 }),
    )
    expect(mapResult).not.toBe(sampleCounters)
    expect(mapResult.data).toEqual(
      new Collection(SampleCounter, [
        {
          id: 'id1',
          count: 2,
          updatedTime: 1,
        },
        {
          id: 'id2',
          count: 3,
          updatedTime: 1,
        },
      ]).data,
    )
  })
  test('some', () => {
    expect(
      sampleCounters.some((sampleCounter) => sampleCounter.count === 2),
    ).toBeTruthy()
    expect(
      sampleCounters.some((sampleCounter) => sampleCounter.count === 0),
    ).toBeFalsy()
  })
  test('filter', () => {
    const filterResult = sampleCounters.filter(
      (sampleCounter) => sampleCounter.count >= 2,
    )
    expect(filterResult).not.toBe(sampleCounters)
    expect(filterResult.data).toEqual(
      new Collection(SampleCounter, [
        {
          id: 'id2',
          count: 2,
          updatedTime: 1,
        },
      ]).data,
    )
  })
  test('get', () => {
    const target = sampleCounters.data.get('id1')
    expect(sampleCounters.get('id1')).toBe(target)
  })
  test('delete', () => {
    expect(sampleCounters.delete('id1').data).toEqual(
      new Collection(SampleCounter, [
        {
          id: 'id2',
          count: 2,
          updatedTime: 1,
        },
      ]).data,
    )
  })
  test('clear', () => {
    expect(sampleCounters.clear().data.size).toBe(0)
  })
  test('upsert', () => {
    expect(
      sampleCounters.upsert({
        id: 'id3',
        count: 3,
        updatedTime: 1,
      }).data,
    ).toEqual(
      new Collection(SampleCounter, [
        {
          id: 'id1',
          count: 1,
          updatedTime: 1,
        },
        {
          id: 'id2',
          count: 2,
          updatedTime: 1,
        },
        {
          id: 'id3',
          count: 3,
          updatedTime: 1,
        },
      ]).data,
    )
    expect(
      sampleCounters.upsert({
        id: 'id2',
        count: 3,
        updatedTime: -1,
      }).data,
    ).toEqual(
      new Collection(SampleCounter, [
        {
          id: 'id1',
          count: 1,
          updatedTime: 1,
        },
        {
          id: 'id2',
          count: 2,
          updatedTime: 1,
        },
      ]).data,
    )
    expect(
      sampleCounters.upsert({
        id: 'id2',
        count: 3,
        updatedTime: 1,
      }).data,
    ).toEqual(
      new Collection(SampleCounter, [
        {
          id: 'id1',
          count: 1,
          updatedTime: 1,
        },
        {
          id: 'id2',
          count: 3,
          updatedTime: 1,
        },
      ]).data,
    )
  })
})
