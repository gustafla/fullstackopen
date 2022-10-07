const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'HTML Lifestyle',
    author: 'Developer Trends',
    url: 'https://placeholder.dev/blog',
    likes: 0,
  },
  {
    title: 'Rust Blog',
    author: 'Rust Teams',
    url: 'https://blog.rust-lang.org/',
    likes: 9001,
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ ...initialBlogs[0], title: 'Will remove this soon' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blog = await Blog.find({})
  return blog.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}

