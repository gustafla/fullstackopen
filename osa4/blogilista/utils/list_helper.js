const dummy = (_blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.map(b => b.likes).reduce((a, b) => a + b)
}

module.exports = {
  dummy,
  totalLikes
}