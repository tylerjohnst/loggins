const database = {}

if (process.env.POSTGRES_URL) {
   database.url = POSTGRES_URL
} else {
   database.host = 'localhost'
   database.username = 'postgres'
   database.database = 'loggins_dev'
}

module.exports = {
   // Disable once really deployed
   "synchronize": true,

   "type": "postgres",

   ...database,

   "logging": true,
   "entities": [
      "src/entity/**/*.ts"
   ],
   "migrations": [
      "src/migration/**/*.ts"
   ],
   "subscribers": [
      "src/subscriber/**/*.ts"
   ],
   "cli": {
      "entitiesDir": "src/entity",
      "migrationsDir": "src/migration",
      "subscribersDir": "src/subscriber"
   }
}
