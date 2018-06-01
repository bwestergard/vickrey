/* @flow */

const { Pool } = require('pg')

const pool = new Pool({
  user: 'bjorn.westergard',
  host: 'localhost',
  database: 'vickrey',
  password: '',
  port: 5432,
})

export const query = (text: string, params: Array<any>) => pool.query(text, params)
