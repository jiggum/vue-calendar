import { createModel } from '@/utils/modelUtils'

class SampleCounter extends createModel(
  {
    count: 0,
  },
  'SampleCounter',
) {}

export default SampleCounter
