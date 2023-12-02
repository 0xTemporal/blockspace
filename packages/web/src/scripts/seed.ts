import { db } from '../db'
import * as schema from '../db/schema'

await db
  .insert(schema.users)
  .values([
    { publicKey: '59kn9rBRJv5n3ZJ6KCTZUJTNw6pd8iKdcVAXg6VnaGQn' },
    { publicKey: 'HNBVuFiGCaodA62WhKzjhnT6V87MWv596MDriyqUbsLG' },
  ])
