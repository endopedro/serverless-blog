import nextConnect from 'next-connect'
import isEmail from 'validator/lib/isEmail'
import normalizeEmail from 'validator/lib/normalizeEmail'
import bcrypt from 'bcryptjs'
import middleware from '@middlewares/middleware'
import { extractUser } from '@lib/api-helpers'
import mongodb from 'mongodb'
// import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'

// const upload = multer({ dest: '/tmp' })

const handler = nextConnect()

const {
  hostname: cloud_name,
  username: api_key,
  password: api_secret,
} = new URL(process.env.CLOUDINARY_URL)

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
})

handler.use(middleware)

handler.get(async (req, res) => {
  if (req.query.all) {
    const users = await req.db.collection('users').find().toArray()
    return res.json(users.reverse().map(user=>extractUser(user)))
  }

  if (req.query.id) {
    const user = await req.db.collection('users').findOne({ _id: mongodb.ObjectId(req.query.id) })
    return res.json(extractUser(user))
  }

  if (req.query.count) {
    const count = await req.db.collection('users').countDocuments()
    return res.json(count)
  }

  return res.json({ user: extractUser(req.user) })
})

handler.patch(async (req, res) => {
  if (!req.user || req.user.role!='admin') {
    res.status(403).send('Not logged.')
    return
  }

  const { _id, name, password } = req.body
  const email = normalizeEmail(req.body.email)

  if (!isEmail(email)) {
    res.status(400).send('The email you entered is invalid.')
    return
  }
  if (!name) {
    res.status(400).send('Informe um nome')
    return
  }
  const currentUserInfo = await req.db.collection('users').findOne({ _id: mongodb.ObjectId(_id) })
  if (currentUserInfo.email!=email && (await req.db.collection('users').countDocuments({ email })) > 0) {
    res.status(403).send('The email has already been used.')
  }

  const hashedPassword = password ? (await bcrypt.hash(password, 10)) : null

  const user = await req.db.collection('users').updateOne(
    { _id: mongodb.ObjectId(_id) },
    {
      $set: {
        ...(name && { name }),
        ...(email && { email }),
        ...(hashedPassword && { password: hashedPassword }),
      },
    },
  )

  res.status(201).json(extractUser(user))
})

handler.post(async (req, res) => {
  const countUsers = await req.db.collection('users').countDocuments()
  
  if (!req.user && countUsers > 0) {
    res.status(403).send('Not logged.')
    return
  }

  const role = req.query.editor ? 'editor' : 'admin'
  const { name, password } = req.body
  const email = normalizeEmail(req.body.email)
  if (!isEmail(email)) {
    res.status(400).send('The email you entered is invalid.')
    return
  }
  if (!password || !name) {
    res.status(400).send('Missing field(s)')
    return
  }
  if ((await req.db.collection('users').countDocuments({ email })) > 0) {
    res.status(403).send('The email has already been used.')
  }
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await req.db
    .collection('users')
    .insertOne({ email, password: hashedPassword, name, role })
    .then(({ ops }) => ops[0])
  if (!req.user) {
    req.logIn(user, (err) => {
      if (err) throw err
      res.status(201).json({
        user: extractUser(req.user),
      })
    })
  } else {
    res.status(201).json(extractUser(user))
  }
})

handler.delete(async (req, res) => {
  if (!req.user || req.user.role!='admin') {
    res.status(401).end()
    return
  }

  const { editor } = req.body

  if(editor.role == 'admin') {
    res.status(401).end()
    return
  }

  const user = await req.db
    .collection('users')
    .deleteOne({ _id: mongodb.ObjectId(editor._id) })

  if (user) {
    cloudinary.uploader.destroy(editor.profilePicture)
    req.db.collection('posts').update(
      { author_id: mongodb.ObjectId(editor._id) },
      {
        $set: {
          author_id: mongodb.ObjectId(req.user._id),
        }
      }
    )
  }
  res.status(201).json(extractUser(user))
})

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }

export default handler
