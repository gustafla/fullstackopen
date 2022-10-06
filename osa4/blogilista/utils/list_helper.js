const dummy = (_blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.map(b => b.likes).reduce((a, b) => a + b, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((a, b) => a.likes > b.likes ? a : b)
}

const mostBlogs = (blogs) => {
  return blogs.reduce((list, blog) => {
    const author_element = list.find(e => e.author === blog.author)
    if (author_element) {
      console.log('found', author_element)
      author_element.blogs += 1
      return list
    } else {
      const new_element = { author: blog.author, blogs: 1 }
      console.log('creating', new_element)
      return list.concat(new_element)
    }
  }, []).reduce((a, b) => a.blogs > b.blogs ? a : b)
}

const mostLikes = (blogs) => {
  return blogs.reduce((list, blog) => {
    const author_element = list.find(e => e.author === blog.author)
    if (author_element) {
      console.log('found', author_element)
      author_element.likes += blog.likes
      return list
    } else {
      const new_element = { author: blog.author, likes: blog.likes }
      console.log('creating', new_element)
      return list.concat(new_element)
    }
  }, []).reduce((a, b) => a.likes > b.likes ? a : b)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}