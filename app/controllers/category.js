const mongoose = require('mongoose')
const Category = mongoose.model('Category')
exports.show = async (ctx, next) => {
  const { _id } = ctx.params
  let category = {}
  if (_id) {
    category = await Category.findOne({ _id })
  }
  await ctx.render('pages/category_admin', {
    title: '后台分类录入页面',
    category: category
  })
}
// 持久化
exports.new = async (ctx, next) => {
  const { name, _id } = ctx.request.body.category
  let category
  if (_id) {
    category = await Category.findOne({ _id })
  }
  if (category) {
    category.name = name
  } else {
    category = new Category({ name })
  }
  await category.save()
  ctx.redirect('/admin/category/list')
}
// 后台列表
exports.list = async (ctx, next) => {
  const categories = await Category.find({})
  await ctx.render('pages/category_list', {
    title: '分类的列表页面',
    categories
  })
}
