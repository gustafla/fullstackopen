import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { notifySuccess, notifyError } from './notificationReducer'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    addBlog: (state, action) => {
      state.push(action.payload)
    },
    updateBlog: (state, action) => {
      return state.map((b) => (b.id === action.payload.id ? action.payload : b))
    },
    removeBlog: (state, action) => {
      return state.filter((b) => b.id !== action.payload.id)
    },
    setBlogs: (_state, action) => {
      return action.payload
    },
  },
})

const { addBlog, updateBlog, removeBlog, setBlogs } = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    try {
      const blogs = await blogService.getAll()
      dispatch(setBlogs(blogs))
    } catch (exception) {
      const message = exception.response.data.error
      dispatch(
        notifyError('Failed to fetch blogs' + message ? `: ${message}` : '', 5),
      )
    }
  }
}

export const createBlog = (blog) => {
  return async (dispatch) => {
    try {
      const newBlog = await blogService.create(blog)
      dispatch(addBlog(newBlog))
      dispatch(notifySuccess(`${newBlog.title} by ${newBlog.author} added!`, 5))
    } catch (exception) {
      const message = exception.response.data.error
      dispatch(
        notifyError('Failed to submit' + message ? `: ${message}` : '', 5),
      )
    }
  }
}

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const likedBlog = { ...blog, likes: blog.likes + 1 }
    try {
      const newBlog = await blogService.update(likedBlog)
      dispatch(updateBlog(newBlog))
      dispatch(notifySuccess(`Liked ${newBlog.title}!`, 5))
    } catch (exception) {
      const message = exception.response.data.error
      dispatch(notifyError('Failed to like' + message ? `: ${message}` : '', 5))
    }
  }
}

export const deleteBlog = (blog) => {
  return async (dispatch) => {
    try {
      await blogService.remove(blog)
      dispatch(removeBlog(blog))
      dispatch(notifySuccess(`Removed ${blog.title}!`, 5))
    } catch (exception) {
      const message = exception.response.data.error
      dispatch(
        notifyError('Failed to remove' + message ? `: ${message}` : '', 5),
      )
    }
  }
}

export default blogSlice.reducer
