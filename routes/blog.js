const express = require('express')
const router = express.Router()
const Post = require('../models/post')
const Comment = require('../models/comment')
const checkAuth = require('../modules/checkIfAuth')

router.get('/:slug', async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug, isPublished: true })
        if (!post) return res.status(404).send('Yazı bulunamadı')
        const comments = await Comment.find({ post: post._id }).populate('author', 'username').sort({ createdAt: -1 })
        res.render('post-detail', { post, user: req.user || null, comments })
    } catch (error) {
        throw new Error(error)
    }
})

router.post('/:slug/comment', checkAuth.checkIfAuthenticated, async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug })
        if (!post) return res.status(404).send('Yazı bulunamadı')
        await Comment.create({
            post: post._id,
            author: req.user.id,
            content: req.body.content
        })
        res.redirect('/blog/' + req.params.slug)
    } catch (error) {
        throw new Error(error)
    }
})

module.exports = router
