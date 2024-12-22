const jwt = require('jsonwebtoken')
const SECRET_KEY = 'mi_secreto'


const verificarCredenciales = (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' })
  }
  next()
}

const validarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' })
  }

  try {
    const payload = jwt.verify(token, SECRET_KEY)
    req.email = payload.email
    next()
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido' })
  }
}

module.exports = {
  verificarCredenciales,
  validarToken,
}