import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { notifySuccess } from './notificationReducer'
import handleException from './handleException'
import { initializeUsers } from './usersReducer'

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
      dispatch(initializeUsers())
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
      dispatch(initializeUsers())
      dispatch(notifySuccess(`Removed ${blog.title}!`, 5))
    } catch (exception) {
      handleException(dispatch, exception, 'Failed to delete blog')
    }
  }
}

export const commentBlog = (blog, comment) => {
  return async (dispatch, getState) => {
    const token = getState().session.token
    try {
      const newBlog = await blogService.comment(token, blog, comment)
      dispatch(updateBlog(newBlog))
      dispatch(notifySuccess(`Comment ${comment} added!`, 5))
    } catch (exception) {
      handleException(dispatch, exception, 'Failed to comment blog')
    }
  }
}

export default blogSlice.reducer
