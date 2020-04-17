export function extractUser(req) {
  if (!req.user) return null
  const {
    name, email, bio, profilePicture, emailVerified,
  } = req.user
  return {
    name, email, bio, profilePicture, emailVerified,
  }
}