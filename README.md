# es-bueno

[![Build Status](https://travis-ci.org/galactic-filament/es-bueno.svg?branch=master)](https://travis-ci.org/galactic-filament/es-bueno)
[![Coverage Status](https://coveralls.io/repos/github/galactic-filament/es-bueno/badge.svg?branch=master)](https://coveralls.io/github/galactic-filament/es-bueno?branch=master)

## Libraries

Kind | Name
--- | ---
Web Framework | [Express](https://expressjs.com/)
SQL ORM | [Sequelize](http://docs.sequelizejs.com/)
Logging | [Winston](https://www.npmjs.com/package/winston)
Test Framework | [Mocha](https://mochajs.org/)
Test Coverage | [Istanbul](https://istanbul.js.org/)
Password encryption | NYI
User authentication | NYI
Linting | [tslint](https://github.com/palantir/tslint)

## Features Implemented

- [x] Hello world routes
- [x] CRUD routes for persisting posts
- [x] Database access
- [x] Request logging to /srv/app/log/app.log
- [x] Unit tests
- [x] Unit test coverage reporting
- [x] Automated testing using TravisCI
- [x] Automated coverage reporting using Coveralls
- [ ] CRUD routes for user management
- [ ] Password encryption using bcrypt
- [ ] Routes protected by cookie session
- [ ] Entities linked to logged in user
- [ ] Routes protected via HTTP authentication
- [ ] Routes protected via API key
- [x] Linting
- [x] Logging to file
- [ ] Logging to Logstash
- [ ] Routes protected via ACLs
- [ ] Migrations
- [ ] GraphQL endpoint
- [x] Validates environment (env vars, database host and port are accessible)
