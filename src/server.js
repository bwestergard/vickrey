/* @flow */
import 'babel-polyfill';

const db = require('./db')

import express from 'express'
import bodyParser from 'body-parser'
import Router from 'express-promise-router'

const router = new Router()

const app = express()
app.use(bodyParser.json())

const port = 1234

const helloHandler = async (req, res) => {
  const { rows: [result] } = await db.query(`SELECT 5 + $1::int;`, [req.query.interval])
  res.json(result)
}

router.get('/hello', helloHandler)
app.use('/', router)

app.listen(port, () => console.log(`Vickrey exchange listening on port ${port}!`))
