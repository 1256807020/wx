const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const _ = require('lodash')
const Category = mongoose.model('Category')
exports.show = async (ctx, next) => {
  const { _id } = ctx.params
  let movie = {}
  if (_id) {
    movie = await Movie.findOne({ _id })
  }
  let categories = await Movie.find({})
  await ctx.render('pages/movie_admin', {
    title: '后台分类录入页面',
    movie,
    categories
  })
}
// 持久化
exports.new = async (ctx, next) => {
  // ctx.request.body.fields所有字段
  const movieData = ctx.request.body.fields || {}
  let movie
  if (movieData._id) {
    movie = await Movie.findOne({ _id: movieData._id })
  }
  // 关联分类id
  const categoryId = movieData.categoryId
  const categoryName = movieData.category
  let category
  if (categoryId) {
    category = await Category.findOne({ _id: categoryId })
  } else if (categoryName) {
    category = new Category({ name: categoryName })
    await category.save()
  }

  if (movie) {
    // lodash的方法_.extend
    movie = _.extend(movie, movieData)
    movie.category = category._id
  } else {
    // 以防止id相同
    delete movieData._id
    movieData.category = category._id
    movie = new Movie({ movieData })
  }
  // 让分类中也存在电影数据
  category = await Category.findOne({ _id: category._id })
  if (category) {
    category.movies = category.movies || []
    category.movies.push(movie._id)
    await category.save()
  }
  await movie.save()
  ctx.redirect('/admin/movie/list')
}
// 后台列表
exports.list = async (ctx, next) => {
  const movies = await Category.find({}).populate('category', 'name')
  await ctx.render('pages/movie_list', {
    title: '电影的列表页面',
    movies
  })
}
// 删除电影数据
exports.del = async (ctx, next) => {
  const id = ctx.query.id
  // let movie
  // if (id) {
  //   movie = await Movie.findOne({ _id: id })
  // }
  // if (!movie) {
  //   return (ctx.body = {
  //     success: false
  //   })
  // }
  // 暴力处理电影删除
  try {
    await Movie.remove({ _id: id })
    ctx.body = { success: true }
  } catch (err) {
    ctx.body = { success: false }
  }
}
