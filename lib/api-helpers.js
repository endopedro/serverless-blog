export function extractUser(user) {
  if (!user) return null
  const {
    _id, name, email, bio, profilePicture, emailVerified, role
  } = user
  return {
    _id, name, email, bio, profilePicture, emailVerified, role
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