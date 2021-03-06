import { Pool } from 'pg';
import debug from 'debug';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.NODE_ENV === 'test' ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;

export default class Model {
  constructor(table) {
    this.table = table;
    this.pool = new Pool({ connectionString });
    this.pool.on('error', (err) => {
      debug('dev')('Unexpected error on idle client', err);
      process.exit(-1);
    });
  }

  async select(columns, clause = '') {
    const query = `SELECT ${columns} FROM ${this.table} ${clause}`;
    const { rows } = await this.pool.query(query);
    return rows;
  }

  async insert(columns, values, queryData = '') {
    const query = `INSERT INTO ${this.table}(${columns}) VALUES (${values}) RETURNING ${queryData}`;
    const { rows } = await this.pool.query(query);
    return rows;
  }

  async update(column, value, clause, queryData = '') {
    const query = `UPDATE ${this.table} SET ${column}=${value} ${clause} RETURNING ${queryData}`;
    const { rows } = await this.pool.query(query);
    return rows;
  }

  async delete(clause) {
    const query = `DELETE FROM ${this.table} ${clause} RETURNING *`;
    const { rows } = await this.pool.query(query);
    return rows;
  }

  async truncate() {
    const query = `TRUNCATE TABLE ${this.table} CASCADE`;
    const { rows } = await this.pool.query(query);
    return rows;
  }
}
