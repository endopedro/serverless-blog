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
  if(req.query.pages) {
    const pages = await req.db.collection('pages').find().sort({ $natural: -1 }).toArray()
    return res.json(pages)

  } else if(req.query.page) {
    const page = await req.db.collection('pages').findOne({ slug: req.query.page })
    if(page) res.json(page)
    else res.json({error: 'Página não encontrada.'})

  } else if(req.query.slug) {
    // const post = await req.db.collection('posts').findOneAndUpdate({"slug": req.query.slug },{ $inc: { "clicks": 1 } })
    const post = await req.db.collection('posts').findOne({ slug: req.query.slug })
    if(post) {
      post.author = extractUser(await req.db.collection('users').findOne({ _id: post.author_id }))
      const category = await req.db.collection('categories').findOne({_id: post.category})
      post.category = category.name
      // req.db.collection('posts').updateOne( { "_id": post._id }, { $inc: { "clicks": 1 }})
    } else {
      res.json({error: 'Post não encontrado.'})
    }
    res.json(post)

  } else {
    const categories = await req.db.collection('categories').find().toArray()
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

    res.json(extractPosts(posts.reverse(), categories))
  }
})

handler.post(upload.single('thumb'), async (req, res) => {
  if (!req.user) {
    res.status(403).send('Not logged.')
    return
  }

  if(req.query.page) {
    const {
      title,
      slug,
      content,
    } = req.body

    if (!slug) {
      res.status(403).send('A página precisa de um slug.')
      return
    }

    if ((await req.db.collection('pages').countDocuments({ slug })) > 0) {
      res.status(403).send('O Slug já está sendo utilizado.')
      return
    }
    let thumb

    if (req.file) {
      const image = await cloudinary.uploader.upload(req.file.path)
      thumb = image.public_id
    }

    const page = await req.db
      .collection('pages')
      .insertOne({
        date: new Date(),
        title,
        slug,
        content: JSON.parse(content),
        thumb: thumb ? thumb : null,
      }).then(({ ops }) => ops[0])

    res.status(201).json(page)
  } else {
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
        category: category ? mongodb.ObjectId(category) : null,
        content: JSON.parse(content),
        clicks: 0,
        thumb: thumb ? thumb : null,
        tags: JSON.parse(tags),
      })
      .then(({ ops }) => ops[0])

    post.author = extractUser(req.user)

    res.status(201).json(post)
  }
})

handler.patch(upload.single('thumb'),async (req, res) => {
  if (!req.user) {
    res.status(403).send('Not logged.')
    return
  }

  if(req.query.page) {
    const {
      _id,
      title,
      currentThumb,
      slug,
      content,
    } = req.body

    if (!slug) {
      res.status(403).send('A página precisa de um Slug.')
      return
    }

    const currentPage = await req.db.collection('pages').findOne({ _id: mongodb.ObjectId(_id) })

    if ((currentPage.slug != slug) && (await req.db.collection('pages').countDocuments({ slug })) > 0) {
      res.status(403).send('O Slug já está sendo utilizado.')
      return
    }

    let thumb

    if (req.file) {
      const image = await cloudinary.uploader.upload(req.file.path)
      thumb = image.public_id
      if(thumb) cloudinary.uploader.destroy(currentThumb)
    }

    const page = await req.db.collection('pages').updateOne(
      { _id: mongodb.ObjectId(_id) },
      {
        $set: {
          ...(title && { title }),
          ...(slug && { slug }),
          content: JSON.parse(content),
          ...(thumb && { thumb }),
        },
      },
    ).then()

    res.status(201).json(page)

  } else {
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
      if(thumb) cloudinary.uploader.destroy(currentThumb)
    }

    const post = await req.db.collection('posts').updateOne(
      { _id: mongodb.ObjectId(_id) },
      {
        $set: {
          author_id: mongodb.ObjectId(req.user._id),
          ...(title && { title }),
          ...(slug && { slug }),
          category: category ? mongodb.ObjectId(category) : null,
          content: JSON.parse(content),
          ...(thumb && { thumb }),
          tags: JSON.parse(tags),
        },
      },
    ).then()

    res.status(201).json(post)
  }
})

handler.delete(async (req, res) => {
  if (!req.user) {
    res.status(403).send('Not logged.')
    return
  }

  if(req.query.page) {
    const {_id, thumb} = req.query

    const post = await req.db.collection('pages').deleteOne(
      { _id: mongodb.ObjectId(_id) }
    ).then(cloudinary.uploader.destroy(thumb))

    res.status(201).json(post)

  } else {
    const {_id, thumb} = req.query

    const post = await req.db.collection('posts').deleteOne(
      { _id: mongodb.ObjectId(_id) }
    ).then(cloudinary.uploader.destroy(thumb))

    res.status(201).json(post)
  }
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default handler