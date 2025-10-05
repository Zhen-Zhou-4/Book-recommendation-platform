const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// 获取所有书籍
router.get('/', async (req, res) => {
    try {
        const books = await Book.find().sort({ title: 1 });
        res.json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to obtain book list'
        });
    }
});

// 获取书籍排行榜
router.get('/ranking', async (req, res) => {
    try {
        const ranking = await Book.getRanking();
        res.json({
            success: true,
            data: ranking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to obtain ranking list'
        });
    }
});

// 为书籍投票
router.post('/:id/vote', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        
        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        const updatedBook = await book.incrementVotes();
        
        res.json({
            success: true,
            message: `Success for《${updatedBook.title}》vote`,
            data: updatedBook
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Voting failed'
        });
    }
});

// 获取单个书籍详情
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        
        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        res.json({
            success: true,
            data: book
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to obtain book details'
        });
    }
});

// 添加新书籍 (管理功能)
router.post('/', async (req, res) => {
    try {
        const book = new Book(req.body);
        const savedBook = await book.save();
        
        res.status(201).json({
            success: true,
            message: 'Book added successfully',
            data: savedBook
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Adding book failed'
        });
    }
});

module.exports = router;