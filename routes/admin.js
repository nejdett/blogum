const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const checkAuth = require('../modules/checkIfAuth')
const User = require('../models/User')
const multer = require('multer')
const path = require('path')

const Comment = require('../models/comment')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

router.get('/', checkAuth.checkIfAdmin, async (req, res) => {
    const posts = await Post.find().sort({ createdAt: -1 })
    res.render('admin', { posts, username: req.user.username })
})

router.get('/new', checkAuth.checkIfAdmin, async (req, res) => {
    const categories = await Post.distinct('category')
    res.render('post-form', { post: null, user: req.user, categories })
})

router.post('/new', checkAuth.checkIfAdmin, upload.single('image'), async (req, res) => {
    try {
        const { title, content, category, newCategory, isPublished } = req.body
        const finalCategory = newCategory && newCategory.trim() ? newCategory.trim() : (category || 'Genel')
        const slug = title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-') + '-' + Date.now()
        await Post.create({
            title,
            content,
            category: finalCategory,
            slug,
            isPublished: isPublished === 'on',
            author: req.user.id,
            image: req.file ? '/uploads/' + req.file.filename : null
        })
        res.redirect('/admin')
    } catch (error) {
        throw new Error(error)
    }
})

router.get('/edit/:id', checkAuth.checkIfAdmin, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) return res.status(404).send('Yazı bulunamadı')
        const categories = await Post.distinct('category')
        res.render('post-form', { post, user: req.user, categories })
    } catch (error) {
        throw new Error(error)
    }
})

router.put('/edit/:id', checkAuth.checkIfAdmin, upload.single('image'), async (req, res) => {
    try {
        const { title, content, category, newCategory, isPublished } = req.body
        const finalCategory = newCategory && newCategory.trim() ? newCategory.trim() : (category || 'Genel')
        const slug = title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-') + '-' + Date.now()
        const updateData = { title, content, category: finalCategory, slug, isPublished: isPublished === 'on' }
        if (req.file) updateData.image = '/uploads/' + req.file.filename
        await Post.findByIdAndUpdate(req.params.id, updateData)
        res.redirect('/admin')
    } catch (error) {
        throw new Error(error)
    }
})

router.delete('/delete/:id', checkAuth.checkIfAdmin, async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id)
        res.redirect('/admin')
    } catch (error) {
        throw new Error(error)
    }
})

router.get('/users', checkAuth.checkIfAdmin, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 })
        res.render('users', { users, username: req.user.username })
    } catch (error) {
        throw new Error(error)
    }
})

router.post('/users/:id/role', checkAuth.checkIfAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user) return res.status(404).send('Kullanıcı bulunamadı')
        if (user._id.toString() === req.user.id) return res.status(400).send('Kendi rolünüzü değiştiremezsiniz')
        user.role = user.role === 'admin' ? 'user' : 'admin'
        await user.save()
        res.redirect('/admin/users')
    } catch (error) {
        throw new Error(error)
    }
})


router.delete('/comment/:id', checkAuth.checkIfAdmin, async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id)
        if (!comment) return res.status(404).send('Yorum bulunamadı')
        const post = await Post.findById(comment.post)
        await Comment.findByIdAndDelete(req.params.id)
        res.redirect('/blog/' + (post ? post.slug : ''))
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = router
