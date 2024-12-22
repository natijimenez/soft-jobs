const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'softjobs',
  password: '******',
  port: 5432,
})

const registrarUsuario = async ({ email, password, rol, lenguage }) => {
  const hashedPassword = await bcrypt.hash(password, 10)
  const query = `
    INSERT INTO usuarios (email, password, rol, lenguage)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `
  const values = [email, hashedPassword, rol, lenguage]
  const result = await pool.query(query, values)
  return result.rows[0]
}

const obtenerUsuarioPorEmail = async (email) => {
  const query = 'SELECT * FROM usuarios WHERE email = $1'
  const result = await pool.query(query, [email])
  return result.rows[0]
}

module.exports = {
  registrarUsuario,
  obtenerUsuarioPorEmail,
}