import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sistema_examenes',
  password: 'tu_password',
  port: 5432,
});

export default pool;