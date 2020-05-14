import nextConnect from 'next-connect'
import database from '@middlewares/database'
import { extractUser2 } from '@lib/api-helpers'

const handler = nextConnect()

handler.use(database)

handler.get(async (req, res) => {
  // const post = await req.db.collection('posts').findOneAndUpdate({"slug": req.query.slug },{ $inc: { "clicks": 1 } })
  const post = await req.db.collection('posts').findOne({ slug: req.query.slug })
  const author = await req.db.collection('users').findOne({ _id: post.author_id })
  if(post) req.db.collection('posts').updateOne( { "_id": post._id }, { $inc: { "clicks": 1 }})
  res.json({post: post, author: extractUser2(author)})
})

export default handler