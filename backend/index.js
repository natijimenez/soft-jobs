const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { registrarUsuario, obtenerUsuarioPorEmail } = require('./consultas')
const { verificarCredenciales, validarToken } = require('./middlewares')

const app = express()
const PORT = 3000
const SECRET_KEY = 'mi_secreto'


app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
})


app.post('/usuarios', verificarCredenciales, async (req, res) => {
  try {
    const { email, password, rol, lenguage } = req.body
    const nuevoUsuario = await registrarUsuario({ email, password, rol, lenguage })
    res.status(201).json(nuevoUsuario)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al registrar usuario' })
  }
})

app.post('/login', verificarCredenciales, async (req, res) => {
  try {
    const { email, password } = req.body
    const usuario = await obtenerUsuarioPorEmail(email)

    if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }

    const token = jwt.sign({ email: usuario.email }, SECRET_KEY, { expiresIn: '1h' })
    res.status(200).json({ token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
})

app.get('/usuarios', validarToken, async (req, res) => {
  try {
    const usuario = await obtenerUsuarioPorEmail(req.email)
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }
    res.status(200).json(usuario)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al obtener usuario' })
  }
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})