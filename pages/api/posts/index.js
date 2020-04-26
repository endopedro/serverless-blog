import nextConnect from 'next-connect'
import database from '@middlewares/database'

const handler = nextConnect()

handler.use(database)

handler.get(async (req, res) => {
  const doc = await req.db.collection('posts').find().toArray()
  res.json(doc)
})

export default handler