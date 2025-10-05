const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    cover: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    votes: {
        type: Number,
        default: 0
    },
    isbn: {
        type: String,
        sparse: true
    },
    publishedYear: {
        type: Number
    }
}, {
    timestamps: true
});

// 静态方法：获取排行榜
bookSchema.statics.getRanking = function() {
    return this.find().sort({ votes: -1 }).limit(10);
};

// 实例方法：增加投票
bookSchema.methods.incrementVotes = function() {
    this.votes += 1;
    return this.save();
};

module.exports = mongoose.model('Book', bookSchema);