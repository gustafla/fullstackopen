import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { notifySuccess, notifyError } from './notificationReducer'
import { logOut } from './sessionReducer'

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

const handleException = (dispatch, exception, message) => {
  const error = exception.response.data.error
  if (error) {
    if (error.includes('expired')) {
      dispatch(logOut())
    }
    dispatch(notifyError(`${message}: ${error}`, 5))
  } else {
    dispatch(notifyError(message, 5))
  }
}

export const initializeBlogs = () => {
  return async (dispatch, getState) => {
    const token = getState().session.token
    try {
      const blogs = await blogService.getAll(token)
      dispatch(setBlogs(blogs))
    } catch (exception) {
      handleException(dispatch, exception, 'Failed to fetch blogs')
    }
  }
}

export const createBlog = (blog) => {
  return async (dispatch, getState) => {
    const token = getState().session.token
    try {
      const newBlog = await blogService.create(token, blog)
      dispatch(addBlog(newBlog))
      dispatch(notifySuccess(`${newBlog.title} by ${newBlog.author} added!`, 5))
    } catch (exception) {
      handleException(dispatch, exception, 'Failed to submit blog')
    }
  }
}

export const likeBlog = (blog) => {
  return async (dispatch, getState) => {
    const token = getState().session.token
    const likedBlog = { ...blog, likes: blog.likes + 1 }
    try {
      const newBlog = await blogService.update(token, likedBlog)
      dispatch(updateBlog(newBlog))
      dispatch(notifySuccess(`Liked ${newBlog.title}!`, 5))
    } catch (exception) {
      handleException(dispatch, exception, 'Failed to like blog')
    }
  }
}

export const deleteBlog = (blog) => {
  return async (dispatch, getState) => {
    const token = getState().session.token
    try {
      await blogService.remove(token, blog)
      dispatch(removeBlog(blog))
      dispatch(notifySuccess(`Removed ${blog.title}!`, 5))
    } catch (exception) {
      handleException(dispatch, exception, 'Failed to delete blog')
    }
  }
}

export default blogSlice.reducer
