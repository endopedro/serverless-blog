import nextConnect from 'next-connect'
import isEmail from 'validator/lib/isEmail'
import normalizeEmail from 'validator/lib/normalizeEmail'
import bcrypt from 'bcryptjs'
import middleware from '@middlewares/middleware'
import { extractUser } from '@lib/api-helpers'
// import multer from 'multer'
// import { v2 as cloudinary } from 'cloudinary'

// const upload = multer({ dest: '/tmp' })

const handler = nextConnect()

// const {
//   hostname: cloud_name,
//   username: api_key,
//   password: api_secret,
// } = new URL(process.env.CLOUDINARY_URL)

// cloudinary.config({
//   cloud_name,
//   api_key,
//   api_secret,
// })

handler.use(middleware)

handler.get(async (req, res) => {
  if (req.query.all) {
    const users = await req.db.collection('users').find().toArray()

    return res.json({ users: users.map(user=>extractUser(user)) })
  }

  return res.json({ user: extractUser(req.user) })
})

// handler.patch(upload.single('profilePicture'), async (req, res) => {
//   if (!req.user) {
//     res.status(401).end()
//     return
//   }

//   let profilePicture

//   if (req.file) {
//     const image = await cloudinary.uploader.upload(req.file.path, {
//       width: 512,
//       height: 512,
//       crop: 'fill',
//     })
//     profilePicture = image.public_id
//   }

//   const { name, bio } = req.body
//   const currentProfilePicture = req.file ? req.body.currentProfilePicture : null

//   await req.db.collection('users').updateOne(
//     { _id: req.user._id },
//     {
//       $set: {
//         ...(name && { name }),
//         bio: bio || '',
//         ...(profilePicture && { profilePicture }),
//       },
//     },
//   ).then(cloudinary.uploader.destroy(currentProfilePicture))

//   res.json({ user: { name, bio, profilePicture } })
// })

handler.post(async (req, res) => {
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

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// }

export default handler
