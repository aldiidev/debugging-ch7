require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Sentry = require('@sentry/node')
const { PORT = 3000, DSN_SENTRY, ENV } = process.env

Sentry.init({
    dsn: DSN_SENTRY,
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Sentry.Integrations.Express({ app })
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0,
    environment: ENV
})

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res) => {
    console.log(name)
    return res.json({
        status: true,
        message: 'hii develop gg bet',
        err: null,
        data: null
    })
})

const user = require('./routes/user.routes')
const profile = require('./routes/profile.routes')

app.use('/api/v1/users', user)
app.use('/api/v1/profiles', profile)


// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

app.use((req, res, next) => {
    res.status(404).json({
        status: false,
        message: 'bad request',
        err: 'Page Not Found!',
        data: null
    })
})

app.listen(PORT, () => console.log("app listening on port : ", PORT))