import { createModel } from './modelUtils'

describe('modelUtils', () => {
  describe('createModel', () => {
    const SampleCounter = createModel(
      {
        id: '',
        count: 0,
        updatedTime: 0,
      },
      'SampleCounter',
    )
    const defaultSampleCounter = new SampleCounter({}, true)
    const sampleCounter = new SampleCounter({
      id: 'sampleId',
      count: 3,
      updatedTime: 12345,
    })

    test('with default values', () => {
      expect(defaultSampleCounter.getKey()).toBe('')
      expect(defaultSampleCounter.getClassKey()).toBe('SampleCounter:')
      expect(defaultSampleCounter.isEmpty()).toBeTruthy()
      expect(defaultSampleCounter.getLatest()).toBe(0)
      expect(defaultSampleCounter.compareLatest(sampleCounter)).toBeFalsy()
    })

    test('with input values', () => {
      expect(sampleCounter.getKey()).toBe('sampleId')
      expect(sampleCounter.getClassKey()).toBe('SampleCounter:sampleId')
      expect(sampleCounter.isEmpty()).toBeFalsy()
      expect(sampleCounter.getLatest()).toBe(12345)
      expect(sampleCounter.compareLatest(defaultSampleCounter)).toBeTruthy()
    })
  })
})
