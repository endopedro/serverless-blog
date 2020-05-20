import nextConnect from 'next-connect'
import database from '@middlewares/database'
import { extractPosts, extractUser2 } from '@lib/api-helpers'
import mongodb from 'mongodb'

const handler = nextConnect()

handler.use(database)

handler.get(async (req, res) => {
  if(req.query.slug) {
      // const post = await req.db.collection('posts').findOneAndUpdate({"slug": req.query.slug },{ $inc: { "clicks": 1 } })
      const post = await req.db.collection('posts').findOne({ slug: req.query.slug })
      const author = await req.db.collection('users').findOne({ _id: post.author_id })
      if(post) req.db.collection('posts').updateOne( { "_id": post._id }, { $inc: { "clicks": 1 }})
      res.json({post: post, author: extractUser2(author)})
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

handler.post(async (req, res) => {
  const {
    user,
    title,
    slug,
    category,
    content,
    clicks,
    thumb,
    tags,
  } = req.body

  const user_id = user._id
  const author = await req.db.collection('users').findOne({ _id: user_id })

  if (!user && author.length > 0) {
    res.status(403).send('Not logged.')
    return
  }

  if (!slug) {
    res.status(400).send('Slug is missing.')
    return
  }

  if ((await req.db.collection('posts').countDocuments({ slug })) > 0) {
    res.status(403).send('The slug has already been used.')
    return
  }

  const post = await req.db
    .collection('posts')
    .insertOne({
      author_id: mongodb.ObjectId(user_id),
      date: new Date(),
      title,
      slug,
      category,
      content,
      clicks,
      thumb,
      tags
    })
    .then(({ ops }) => ops[0])

  res.status(201).json(post)
})

handler.patch(async (req, res) => {
  const {
    id,
    user,
    title,
    slug,
    category,
    content,
    clicks,
    thumb,
    tags
  } = req.body

  if (!user) {
    res.status(403).send('Not logged.')
    return
  }

  if (!slug) {
    res.status(400).send('Slug is missing.')
    return
  }

  const oldPost = await req.db.collection('posts').findOne({ _id: mongodb.ObjectId(id) })

  if (oldPost.slug != slug && (await req.db.collection('posts').countDocuments({ slug })) > 0) {
    res.status(403).send('The slug has already been used.')
    return
  }

  const post = await req.db
    .collection('posts')
    .updateOne(
      {
       "_id": mongodb.ObjectId(id)
      },
      {
        $set: {
          updated: new Date(),
          title,
          slug,
          category,
          content,
          clicks,
          thumb,
          tags
        }
      }
    )

  res.status(201).json(post)
})

export default handler