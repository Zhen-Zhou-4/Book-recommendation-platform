const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;  // 修改：支持环境变量端口

// 中间件
app.use(express.json());

// 只在本地开发时服务静态文件，Vercel会自动处理静态文件
if (!process.env.VERCEL) {
    app.use(express.static(path.join(__dirname, '../client')));
}

// 完整的10本书数据（保持不变）
const books = [
    {
        id: '1',
        title: "The Three-Body Problem",
        author: "Liu Cixin",
        cover: "https://img1.doubanio.com/view/subject/s/public/s2768378.jpg",
        description: "A milestone work in Chinese science fiction literature, with a grand cosmology and profound humanistic thinking.",
        category: "science fiction",
        votes: 156
    },
    {
        id: '2',
        title: "To Live",
        author: "Yu Hua",
        cover: "https://img9.doubanio.com/view/subject/s/public/s29053580.jpg",
        description: "Telling the friendship between a person and their fate is the most touching friendship.",
        category: "literature",
        votes: 142
    },
    {
        id: '3',
        title: "One Hundred Years of Solitude",
        author: "Gabriel Garcia Marquez ",
        cover: "https://img9.doubanio.com/view/subject/s/public/s6384944.jpg",
        description: "The representative work of magical realism literature, the legendary story of seven generations of the Buendia family.",
        category: "literature",
        votes: 128
    },
    {
        id: '4',
        title: "The Little Prince",
        author: "Antoine de Saint Exup é ry",
        cover: "https://img9.doubanio.com/view/subject/s/public/s1103152.jpg",
        description: "A fairy tale written for adults, about love, responsibility, and the meaning of life.",
        category: "fairy tale",
        votes: 115
    },
    {
        id: '5',
        title: "A Brief History of Humanity",
        author: "Yuval Harari",
        cover: "https://img9.doubanio.com/view/subject/s/public/s27814883.jpg",
        description: "From cognitive revolution to scientific revolution, reinterpreting the history of human development.",
        category: "history",
        votes: 98
    },
    {
        id: '6',
        title: "The person chasing kites",
        author: "Khaled Hosseini",
        cover: "https://img9.doubanio.com/view/subject/s/public/s1727290.jpg",
        description: "A touching story about friendship, betrayal, and redemption. for you, a thousand times over.",
        category: "literature",
        votes: 87
    },
    {
        id: '7',
        title: "Dream of the Red Chamber",
        author: "Cao Xueqin",
        cover: "https://img9.doubanio.com/view/subject/s/public/s1070959.jpg",
        description: "The pinnacle of Chinese classical novels, an encyclopedia of feudal society.",
        category: "classical",
        votes: 76
    },
    {
        id: '8',
        title: "Thinking, fast and slow",
        author: "Daniel Kahneman ",
        cover: "https://img9.doubanio.com/view/subject/s/public/s11374569.jpg",
        description: "Revealing the mysteries of human thinking and helping us make better decisions.",
        category: "psychology",
        votes: 65
    },
    {
        id: '9',
        title: "Principle",
        author: "Ray Dalio",
        cover: "https://img9.doubanio.com/view/subject/s/public/s29634509.jpg",
        description: "The life and work principles of Wall Street investment guru.",
        category: "personal growth",
        votes: 54
    },
    {
        id: '10',
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        cover: "https://img9.doubanio.com/view/subject/s/public/s1919061.jpg",
        description: "A science popularization masterpiece that explores the core secrets of time and space.",
        category: "popularization of science",
        votes: 43
    }
];

// API路由（保持不变）
app.get('/api/books', (req, res) => {
    console.log('📚 Return book list, quantity:', books.length);
    res.json({
        success: true,
        count: books.length,
        data: books
    });
});

app.get('/api/books/ranking', (req, res) => {
    const ranking = [...books].sort((a, b) => b.votes - a.votes);
    res.json({
        success: true,
        data: ranking
    });
});

app.post('/api/books/:id/vote', (req, res) => {
    const bookId = req.params.id;
    const book = books.find(b => b.id === bookId);
    
    if (book) {
        book.votes += 1;
        console.log(`👍 Vote successful: ${book.title} (votes: ${book.votes})`);
        res.json({
            success: true,
            message: `Success for《${book.title}》votes`,
            data: book
        });
    } else {
        res.status(404).json({
            success: false,
            error: 'Book not found'
        });
    }
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'The server is running normally',
        timestamp: new Date().toISOString(),
        booksCount: books.length
    });
});

// 提供前端页面（修改：只在非Vercel环境服务静态文件）
app.get('/', (req, res) => {
    if (!process.env.VERCEL) {
        res.sendFile(path.join(__dirname, '../client/index.html'));
    } else {
        // 在Vercel环境，静态文件由Vercel自动处理
        res.json({
            message: 'Book Recommendation Platform API is running',
            frontend: 'Static files are served by Vercel'
        });
    }
});

// 启动服务器（只在非Vercel环境监听端口）
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log('==================================');
        console.log('🚀 Server startup successful!');
        console.log(`📍 port: ${PORT}`);
        console.log(`🌐 Visit: http://localhost:${PORT}`);
        console.log(`📚 Number of books: ${books.length} `);
        console.log('==================================');
    });
}

console.log('✅ server.js File loading completed');

// 导出app供Vercel使用
module.exports = app;