import nextConnect from 'next-connect'
import database from '@middlewares/database'

const handler = nextConnect()

handler.use(database)

handler.get(async (req, res) => {
  const post = await req.db.collection('posts').findOne({ slug: req.query.slug })
  res.json(post)
})

export default handler