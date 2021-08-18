import Dexie from 'dexie'

export const db = new Dexie('todos')

db.version(1).stores({
  tasks: "++id,title,done"
})

db.open()
