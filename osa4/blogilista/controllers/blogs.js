const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// Blogipostauksen lisääminen
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  //if (!body.title || !body.url) {
  //  return response.status(401).json({ error: 'title or url missing' })
  //}

  if (!body.title ) {
    return response.status(401).json({ error: 'title missing' })
  }
  if (!body.url ) {
    return response.status(401).json({ error: 'url missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: request.user._id
  })

  const savedBlog = await blog.save()
  request.user.blogs = request.user.blogs.concat(savedBlog._id)
  await request.user.save()

  response.status(201).json(savedBlog)
})

// Kaikkien blogien hakeminen
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// Blogipostauksen poistaminen
blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  if (blog.user.toString() !== request.user._id.toString()) {
    return response.status(403).json({ error: 'not authorized to delete this blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

// Blogipostauksen päivittäminen
blogsRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter
