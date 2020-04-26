export function extractUser(req) {
  if (!req.user) return null
  const {
    _id, name, email, bio, profilePicture, emailVerified,
  } = req.user
  return {
    _id, name, email, bio, profilePicture, emailVerified,
  }
}

export function extractPosts(posts) {
  if (!posts) return null
  return posts.map(post => {
    const {_id, date, title, slug, category, content,
      clicks, thumb, tags, author} = post

    delete author[0].password
    
    return {_id, date, title, slug, category, content, 
      clicks, thumb, tags, author: author[0]}
  })
}