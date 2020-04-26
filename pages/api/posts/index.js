import nextConnect from 'next-connect'
import database from '@middlewares/database'

const handler = nextConnect()

handler.use(database)

handler.get(async (req, res) => {
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
  res.json(posts)
})

export default handler