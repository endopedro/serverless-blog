import nextConnect from 'next-connect'
import middleware from '@middlewares/middleware'

const handler = nextConnect()

handler.use(middleware)

handler.post(async (req, res) => {
  const { 
    user,
    author,
    date,
    title,
    slug,
    category,
    content,
    clicks,
    thumb,
    tags,
    action
  } = req.body
  
  if (!user || (await req.db.collection('users').countDocuments({ slug })) > 0) {
    res.status(403).send('Not logged.')
    return
  }
  
  if (!slug) {
    res.status(400).send('Slug is missing.')
    return
  }

  if (action=="create" && (await req.db.collection('posts').countDocuments({ slug })) > 0) {
    res.status(403).send('The slug has already been used.')
    return
  }

  const post = await req.db
    .collection('posts')
    .insertOne({ 
      author,
      date,
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