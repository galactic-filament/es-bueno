'use strict'
const net = require('net')

// validating that env vars are available
const envVarNames = [
  'APP_PORT',
  'APP_LOG_DIR',
  'DATABASE_HOST'
]
const envVarPairs = envVarNames.map((v) => [v, process.env[v]])
const missingEnvVarPairs = envVarPairs.filter(([, v]) => {
  return typeof v === 'undefined' || v.length === 0
})
if (missingEnvVarPairs.length > 0) {
  for (const [key] of missingEnvVarPairs) {
    console.log(`${key} was missing`)
  }

  process.exit(1)
}
const envVars = envVarPairs.reduce((envVars, value) => {
  envVars[value[0]] = value[1]
  return envVars
}, {})

// validating that the database port is accessible
const dbPort = 5432
const client = net.connect({ host: envVars['DATABASE_HOST'], port: dbPort }, () => {
  console.log('connected!')
  process.exit(0)
})
client.on('error', (err) => {
  if (err.code === 'ENOTFOUND') {
    console.log(`Host ${envVars['DATABASE_HOST']} could not be found`)
    process.exit(1)
  } else if (err.code === 'ECONNREFUSED') {
    console.log(`${envVars['DATABASE_HOST']} was not accessible at ${dbPort}`)
    process.exit(1)
  }

  console.error(err)
  process.exit(1)
})