import nextConnect from 'next-connect'
import middleware from '@middlewares/middleware'
import mongodb from 'mongodb'

const handler = nextConnect()

handler.use(middleware)

handler.post(async (req, res) => {
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