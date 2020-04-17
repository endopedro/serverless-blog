import nextConnect from 'next-connect'
import isEmail from 'validator/lib/isEmail'
import normalizeEmail from 'validator/lib/normalizeEmail'
import bcrypt from 'bcryptjs'

import middleware from '@middlewares/middleware'
import { extractUser } from '@lib/api-helpers'

const handler = nextConnect()

handler.use(middleware)

// POST /api/users
handler.post(async (req, res) => {
  const { name, password } = req.body
  const email = normalizeEmail(req.body.email) 
  if (!isEmail(email)) {
    res.status(400).send('E-mail inválido.')
    return
  }
  if (!password || !name) {
    res.status(400).send('Existem campos não preenchidos')
    return
  }
  if ((await req.db.collection('users').countDocuments({ email })) > 0) {
    res.status(403).send('Este e-mail já está sendo utilizado.')
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await req.db
    .collection('users')
    .insertOne({ email, password: hashedPassword, name })
    .then(({ ops }) => ops[0])
  req.logIn(user, (err) => {
    if (err) throw err
    res.status(201).json({
      user: extractUser(req),
    })
  })
})

export default handler