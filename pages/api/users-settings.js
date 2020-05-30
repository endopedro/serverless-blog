import nextConnect from 'next-connect'
// import isEmail from 'validator/lib/isEmail'
// import normalizeEmail from 'validator/lib/normalizeEmail'
// import bcrypt from 'bcryptjs'
import middleware from '@middlewares/middleware'
// import { extractUser } from '@lib/api-helpers'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'

const upload = multer({ dest: '/tmp' })

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

handler.patch(upload.single('profilePicture'), async (req, res) => {
  if (!req.user) {
    res.status(401).end()
    return
  }

  let profilePicture

  if (req.file) {
    const image = await cloudinary.uploader.upload(req.file.path, {
      width: 512,
      height: 512,
      crop: 'fill',
    })
    profilePicture = image.public_id
  }

  const { name, bio } = req.body
  const currentProfilePicture = req.file ? req.body.currentProfilePicture : null

  await req.db.collection('users').updateOne(
    { _id: req.user._id },
    {
      $set: {
        ...(name && { name }),
        bio: bio || '',
        ...(profilePicture && { profilePicture }),
      },
    },
  ).then(cloudinary.uploader.destroy(currentProfilePicture))

  res.json({ user: { name, bio, profilePicture } })
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler