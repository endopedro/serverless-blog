import nextConnect from 'next-connect'
// import database from '@middlewares/database'
import middleware from '@middlewares/middleware'
import { extractPosts, extractUser } from '@lib/api-helpers'
import mongodb from 'mongodb'
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

handler.get(async (req, res) => {
  if(req.query.slug) {
      // const post = await req.db.collection('posts').findOneAndUpdate({"slug": req.query.slug },{ $inc: { "clicks": 1 } })
      const post = await req.db.collection('posts').findOne({ slug: req.query.slug })
      const author = await req.db.collection('users').findOne({ _id: post.author_id })
      if(post) req.db.collection('posts').updateOne( { "_id": post._id }, { $inc: { "clicks": 1 }})
      res.json({post: post, author: extractUser(author)})

  } else if(req.query.pages) {
    const pages = await req.db.collection('pages').find().toArray()
    return res.json(pages)

  } else {
    const posts = await req.db.collection('posts').aggregate([
      {
        $lookup:
          {
            from: "users",
            localField: "author_id",
            foreignField: "_id",
            as: "author"
          }
      }
    ]).toArray()
    res.json(extractPosts(posts))
  }
})

handler.post(upload.single('thumb'), async (req, res) => {
  if (!req.user) {
    res.status(403).send('Not logged.')
    return
  }

  const {
    title,
    slug,
    category,
    content,
    tags,
  } = req.body

  if (!slug) {
    res.status(403).send('Slug is missing.')
    return
  }

  if ((await req.db.collection('posts').countDocuments({ slug })) > 0) {
    res.status(403).send('The slug has already been used.')
    return
  }

  let thumb

  if (req.file) {
    const image = await cloudinary.uploader.upload(req.file.path)
    thumb = image.public_id
  }

  const post = await req.db
    .collection('posts')
    .insertOne({
      author_id: mongodb.ObjectId(req.user._id),
      date: new Date(),
      title,
      slug,
      category,
      content: JSON.parse(content),
      clicks: 0,
      thumb: thumb ? thumb : null,
      tags: JSON.parse(tags),
    })
    .then(({ ops }) => ops[0])

  res.status(201).json(post)
})

handler.patch(upload.single('thumb'),async (req, res) => {
  if (!req.user) {
    res.status(403).send('Not logged.')
    return
  }

  const {
    _id,
    title,
    currentThumb,
    slug,
    category,
    content,
    tags,
  } = req.body

  if (!slug) {
    res.status(403).send('Slug is missing.')
    return
  }

  const currentPost = await req.db.collection('posts').findOne({ _id: mongodb.ObjectId(_id) })

  if ((currentPost.slug != slug) && (await req.db.collection('posts').countDocuments({ slug })) > 0) {
    res.status(403).send('The slug has already been used.')
    return
  }

  let thumb

  if (req.file) {
    const image = await cloudinary.uploader.upload(req.file.path)
    thumb = image.public_id
  }

  const post = await req.db.collection('posts').updateOne(
    { _id: mongodb.ObjectId(_id) },
    {
      $set: {
        author_id: mongodb.ObjectId(req.user._id),
        ...(title && { title }),
        ...(slug && { slug }),
        ...(category && { category }),
        content: JSON.parse(content),
        ...(thumb && { thumb }),
        tags: JSON.parse(tags),
      },
    },
  ).then(cloudinary.uploader.destroy(currentThumb))

  res.status(201).json(post)
})

handler.delete(async (req, res) => {
  if (!req.user) {
    res.status(403).send('Not logged.')
    return
  }

  const {_id, thumb} = req.query

  const post = await req.db.collection('posts').deleteOne(
    { _id: mongodb.ObjectId(_id) }
  ).then(cloudinary.uploader.destroy(thumb))

  res.status(201).json(post)
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler