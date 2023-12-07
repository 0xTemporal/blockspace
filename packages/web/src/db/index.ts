import * as schema from './schema'
import { drizzle } from 'drizzle-orm/d1'

export const db = drizzle(process.env.DB!, { schema })
// bun

// // better-sqlite3
// import Database from 'better-sqlite3'
// import { drizzle } from 'drizzle-orm/better-sqlite3'

// const sqlite = new Database('sqlite.db')

// export const db = drizzle(sqlite, { schema })
