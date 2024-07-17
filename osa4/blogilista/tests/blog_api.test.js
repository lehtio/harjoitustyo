const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// testit 4 osan tehtäviin 4.8-4.12
const api = supertest(app)

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
]

let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()

  const userForToken = { username: user.username, id: user._id }
  token = jwt.sign(userForToken, process.env.SECRET)

  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('the identifier field is named id', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body[0]
  assert(blog.id)
  assert(!blog._id)
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'Full Stack Developer',
    url: 'http://asyncawait.com/',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(r => r.title)

  assert.strictEqual(response.body.length, initialBlogs.length + 1)
  assert(titles.includes('async/await simplifies making async calls'))
})

test('blog without likes defaults to 0 likes', async () => {
  const newBlog = {
    title: 'blog without likes',
    author: 'No Likes',
    url: 'http://nolikes.com/'
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const addedBlog = response.body.find(blog => blog.title === 'blog without likes')
  assert.strictEqual(addedBlog.likes, 0)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title:'kissa',
    author: 'No Title or URL',
    likes: 5,
    
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'No Title or URL',
    likes: 5,
    url:'kiissa.com'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('a blog cannot be added without token', async () => {
  const newBlog = {
    title: 'no token blog',
    author: 'No Token',
    url: 'http://notoken.com/',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})

test('a blog cannot be deleted without token', async () => {
  const responseAtStart = await api.get('/api/blogs')
  const blogToDelete = responseAtStart.body[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(401)

  const responseAtEnd = await api.get('/api/blogs')
  const titles = responseAtEnd.body.map(r => r.title)

  assert.strictEqual(responseAtEnd.body.length, initialBlogs.length)
  assert(titles.includes(blogToDelete.title))
})



// blogin tykkäysten päivittäminen
test('a blog\'s likes can be updated', async () => {
  const responseAtStart = await api.get('/api/blogs')
  const blogToUpdate = responseAtStart.body[0]

  const updatedBlog = {
    likes: blogToUpdate.likes + 1
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
})

test('adding a blog fails with status 401 if token is not provided', async () => {
  const newBlog = {
    title: 'Unauthorized Blog',
    author: 'No Token',
    url: 'http://notoken.com/',
    likes: 10
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})
