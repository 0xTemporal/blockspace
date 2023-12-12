import * as schema from './schema'
// import Database from 'bun:sqlite'
// import { drizzle } from 'drizzle-orm/bun-sqlite'
import { drizzle } from 'drizzle-orm/d1'

export const db = drizzle(process.env.DB!, { schema })

// const sqlite = new Database('sqlite.db')
// export const db = drizzle(sqlite, { schema })
