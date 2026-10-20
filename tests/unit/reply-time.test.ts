import { afterEach, describe, expect, it } from 'vitest'
import { claims } from '@/data/claims'
import { rfqConfig } from '@/lib/rfq-config'
import type { Claim } from '@/types/claims'

const f16 = claims['F-16'] as Claim<number>
const original = { ...f16 }

afterEach(() => {
  Object.assign(f16, original)
})

describe('reply time (F-16) has one source', () => {
  it('follows the claim value', () => {
    f16.value = 3
    expect(rfqConfig('preview').replyPromise).toBe('3 working days')
  })
  it('is dropped in production if the claim is ever unconfirmed', () => {
    f16.label = 'VERIFY'
    expect(rfqConfig('production').replyPromise).toBeUndefined()
  })
})
