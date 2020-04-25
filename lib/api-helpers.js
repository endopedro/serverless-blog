export function extractUser(req) {
  if (!req.user) return null
  const {
    name, email, bio, profilePicture, emailVerified,
  } = req.user
  return {
    name, email, bio, profilePicture, emailVerified,
  }
}

export function extractPost(req) {
  if (!req.post) return null
  const {
    author,
    date,
    title,
    slug,
    category,
    content,
    clicks,
    thumb,
    tags
  } = req.user
  return {
    author,
    date,
    title,
    slug,
    category,
    content,
    clicks,
    thumb,
    tags
  }
}

