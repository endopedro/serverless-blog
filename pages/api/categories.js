import nextConnect from 'next-connect'
import middleware from '@middlewares/middleware'
import mongodb from 'mongodb'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const categories = await req.db.collection('categories').find().sort({ $natural: -1 }).toArray()
  return res.json(categories)
})

handler.post(async (req, res) => {
  if (!req.user) {
    res.status(403).send('Not logged.')
    return
  }
  const { category } = req.body

  if (!category) {
    res.status(400).send('Campo categoria vazio.')
    return
  }
  if ((await req.db.collection('categories').countDocuments({ name: category })) > 0) {
    res.status(403).send('Esta categoria já existe.')
  }

  const newCategory = await req.db
    .collection('categories')
    .insertOne({ name: category })
    .then(({ ops }) => ops[0])

  res.status(201).json(newCategory)
})

handler.delete(async (req, res) => {
  if (!req.user) {
    res.status(401).end()
    return
  }

  const { id } = req.body
  const category = await req.db
    .collection('categories')
    .deleteOne({ _id: mongodb.ObjectId(id) })

    console.log(category)
  if (category) {
    req.db.collection('posts').update(
      { category: mongodb.ObjectId(id) },
      {
        $set: {
          category: null,
        }
      }
    )
  }
  res.status(201).json(category)
})

export default handler
