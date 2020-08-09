import { uuidv4 } from '@/utils/randomUtils'

describe('randomUtils', () => {
  test('uuidv4', () => {
    // eslint-disable-next-line no-self-compare
    expect(uuidv4() !== uuidv4()).toBeTruthy()
  })
})
