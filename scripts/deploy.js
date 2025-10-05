const mongoose = require('mongoose');
const Book = require('../server/models/Book');
require('dotenv').config();

const sampleBooks = [
    {
        title: "The Three-Body Problem",
        author: "Liu Cixin",
        cover: "https://img1.doubanio.com/view/subject/s/public/s2768378.jpg",
        description: "The milestone work of Chinese science fiction literature, with its grand cosmology and profound humanistic thinking, won the Hugo Award for Best Novel.",
        category: "science fiction",
        votes: 15,
        isbn: "9787536692930",
        publishedYear: 2008
    },
    {
        title: "To Live",
        author: "Yu Hua",
        cover: "https://img9.doubanio.com/view/subject/s/public/s29053580.jpg",
        description: "Tell the story of a friendship between a person and their fate, which is the most touching friendship because they appreciate each other but also hate each other.",
        category: "literature",
        votes: 12,
        isbn: "9787506365437",
        publishedYear: 2012
    },
    {
        title: "One Hundred Years of Solitude",
        author: "Gabriel Garcia Marquez ",
        cover: "https://img9.doubanio.com/view/subject/s/public/s6384944.jpg",
        description: "The representative work of magical realism literature, the legendary story of seven generations of the Buendia family, reflects the ever-changing history of Latin America over the past century.",
        category: "literature",
        votes: 10,
        isbn: "9787544253994",
        publishedYear: 2011
    },
    {
        title: "The Little Prince",
        author: "Antoine de Saint Exup é ry",
        cover: "https://img9.doubanio.com/view/subject/s/public/s1103152.jpg",
        description: "A fairy tale written for adults, about love, responsibility, and the meaning of life. Looking at the world through the pure perspective of the Little Prince is thought-provoking.",
        category: "fairy tale",
        votes: 8,
        isbn: "9787020042494",
        publishedYear: 2003
    },
    {
        title: "A Brief History of Humanity",
        author: "Yuval Harari",
        cover: "https://img9.doubanio.com/view/subject/s/public/s27814883.jpg",
        description: "From cognitive revolution to scientific revolution, reinterpreting the history of human development. A historical masterpiece that triggers global thinking.",
        category: "history",
        votes: 7,
        isbn: "9787508647357",
        publishedYear: 2014
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/book-recommendation');
        console.log('✅ Connect to database');

        // 清空现有数据
        await Book.deleteMany({});
        console.log('🗑️ Clear existing book data');

        // 插入示例数据
        await Book.insertMany(sampleBooks);
        console.log('📚 Successfully inserted sample book data');

        console.log('🎉 Database initialization completed！');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
};

seedDatabase();