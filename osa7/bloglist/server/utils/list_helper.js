const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.map((b) => b.likes).reduce((a, b) => a + b, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((a, b) => (a.likes > b.likes ? a : b))
}

const reduceMaxByAuthor = (blogs, count) => {
  return blogs
    .reduce((list, blog) => {
      const author_element = list.find((e) => e.author === blog.author)
      if (author_element) {
        author_element.count += count(blog)
        return list
      } else {
        const new_element = { author: blog.author, count: count(blog) }
        return list.concat(new_element)
      }
    }, [])
    .reduce((a, b) => (a.count > b.count ? a : b))
}

const mostBlogs = (blogs) => {
  const o = reduceMaxByAuthor(blogs, () => 1)
  return { author: o.author, blogs: o.count }
}

const mostLikes = (blogs) => {
  const o = reduceMaxByAuthor(blogs, (blog) => blog.likes)
  return { author: o.author, likes: o.count }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
