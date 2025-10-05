// 内存数据库实现 - 避免 Vercel 的文件系统限制
let books = [
  {
    id: 1,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description: "A gripping tale of racial injustice and childhood innocence in the American South.",
    category: "Classic",
    votes: Math.floor(Math.random() * 50)
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    description: "A dystopian social science fiction novel about totalitarian control.",
    category: "Science Fiction",
    votes: Math.floor(Math.random() * 50)
  },
  {
    id: 3,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "A romantic novel of manners that depicts the emotional development of protagonist Elizabeth Bennet.",
    category: "Romance",
    votes: Math.floor(Math.random() * 50)
  },
  {
    id: 4,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description: "A tragic story of Jay Gatsby's quest for the American Dream during the Jazz Age.",
    category: "Classic",
    votes: Math.floor(Math.random() * 50)
  },
  {
    id: 5,
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    description: "The first novel in the Harry Potter series following a young wizard's journey.",
    category: "Fantasy",
    votes: Math.floor(Math.random() * 50)
  },
  {
    id: 6,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description: "A fantasy novel about Bilbo Baggins' unexpected journey to reclaim treasure.",
    category: "Fantasy",
    votes: Math.floor(Math.random() * 50)
  },
  {
    id: 7,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    description: "A controversial novel following teenage rebel Holden Caulfield in New York City.",
    category: "Classic",
    votes: Math.floor(Math.random() * 50)
  },
  {
    id: 8,
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    description: "An epic high fantasy trilogy about the quest to destroy the One Ring.",
    category: "Fantasy",
    votes: Math.floor(Math.random() * 50)
  },
  {
    id: 9,
    title: "Brave New World",
    author: "Aldous Huxley",
    description: "A dystopian novel exploring technological advancement and societal control.",
    category: "Science Fiction",
    votes: Math.floor(Math.random() * 50)
  },
  {
    id: 10,
    title: "The Alchemist",
    author: "Paulo Coelho",
    description: "A philosophical book about following your dreams and personal legend.",
    category: "Fiction",
    votes: Math.floor(Math.random() * 50)
  }
];

const initializeDatabase = () => {
  console.log('Memory database initialized with', books.length, 'books');
  return Promise.resolve();
};

const getBooks = () => {
  // 按票数排序
  const sortedBooks = [...books].sort((a, b) => b.votes - a.votes);
  return Promise.resolve(sortedBooks);
};

const voteForBook = (bookId) => {
  const bookIndex = books.findIndex(book => book.id === bookId);
  if (bookIndex !== -1) {
    books[bookIndex].votes += 1;
    return Promise.resolve(books[bookIndex]);
  }
  return Promise.reject(new Error('Book not found'));
};

module.exports = {
  initializeDatabase,
  getBooks,
  voteForBook
};