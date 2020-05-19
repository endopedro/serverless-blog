import nextConnect from 'next-connect'
import middleware from '@middlewares/middleware'
import mongodb from 'mongodb'

const handler = nextConnect()

handler.use(middleware)

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

export default handler