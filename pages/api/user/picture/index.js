import nextConnect from 'next-connect'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import middleware from '@middlewares/middleware'
import { extractUser } from '@lib/api-helpers'

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
    res.status(402).end()
    return
  }

  let profilePicture
  console.log(req.file)
  if (req.file) {
    const image = await cloudinary.uploader.upload(req.file.path, {
      width: 512,
      height: 512,
      crop: 'fill',
    })
    profilePicture = image.public_id
    const { user, currentProfilePicture } = req.body
    await req.db.collection('users').updateOne(
      { _id: req.user._id },
      { $set: {profilePicture: profilePicture} }
    ).then(cloudinary.uploader.destroy(currentProfilePicture))
    res.json({ profilePicture: profilePicture })
  } else {
    res.status(401).end()
    return
  }
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler
