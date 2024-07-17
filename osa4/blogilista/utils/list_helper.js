const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const favorite = blogs.reduce((prev, current) => {
    return (prev.likes > current.likes) ? prev : current
  })

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorCounts = _.countBy(blogs, 'author')
  const mostBlogsAuthor = _.maxBy(_.keys(authorCounts), (author) => authorCounts[author])

  return {
    author: mostBlogsAuthor,
    blogs: authorCounts[mostBlogsAuthor]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorLikes = blogs.reduce((result, blog) => {
    if (!result[blog.author]) {
      result[blog.author] = 0
    }
    result[blog.author] += blog.likes
    return result
  }, {})

  const mostLikesAuthor = _.maxBy(_.keys(authorLikes), (author) => authorLikes[author])

  return {
    author: mostLikesAuthor,
    likes: authorLikes[mostLikesAuthor]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
