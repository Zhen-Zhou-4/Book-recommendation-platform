// 配置
const CONFIG = {
    API_BASE_URL: window.location.origin + '/api',
    DEBOUNCE_DELAY: 300
};

// 应用状态
const AppState = {
    books: [],
    isLoading: true,
    error: null
};

// 初始化应用
async function init() {
    console.log('🚀 Initialize the book recommendation platform...');
    try {
        await loadBooks();
        renderBooks();
        renderRanking();
        console.log('✅ Application initialization completed');
    } catch (error) {
        console.error('❌ Initialization failed:', error);
        showError('Application initialization failed, please refresh the page and try again');
    }
}

// 加载书籍数据
async function loadBooks() {
    try {
        AppState.isLoading = true;
        showLoading(true);
        
        const response = await fetch(`${CONFIG.API_BASE_URL}/books`);
        
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            AppState.books = result.data;
            console.log(`📚 Successfully loaded ${result.count} this book`);
        } else {
            throw new Error(result.error || 'Unknown error');
        }
    } catch (error) {
        console.error('❌ Failed to load book:', error);
        AppState.error = error.message;
        showError('Failed to load book data');
    } finally {
        AppState.isLoading = false;
        showLoading(false);
    }
}

// 为书籍投票
async function voteForBook(bookId) {
    try {
        const button = event.target;
        const originalText = button.textContent;
        
        // 禁用按钮并显示加载状态
        button.disabled = true;
        button.textContent = 'In the voting process...';
        button.style.opacity = '0.7';
        
        const response = await fetch(`${CONFIG.API_BASE_URL}/books/${bookId}/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success) {
            // 更新本地数据
            const bookIndex = AppState.books.findIndex(book => book.id === bookId);
            if (bookIndex !== -1) {
                AppState.books[bookIndex] = result.data;
            }
            
            // 更新UI
            updateBookDisplay(bookId);
            renderRanking();
            showSuccess(`Successful recommendation《${result.data.title}》！`);
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('❌ Voting failed:', error);
        showError('Voting failed, please try again');
    } finally {
        // 恢复按钮状态
        const button = event.target;
        button.disabled = false;
        button.textContent = '👍 Recommend this book';
        button.style.opacity = '1';
    }
}

// 渲染书籍列表
function renderBooks() {
    const booksGrid = document.getElementById('books-grid');
    if (!booksGrid) return;
    
    if (AppState.isLoading) {
        booksGrid.innerHTML = '<div class="loading">Load the book...</div>';
        return;
    }
    
    if (AppState.error) {
        booksGrid.innerHTML = `
            <div class="error-message">
                <p>❌ ${AppState.error}</p>
                <button onclick="location.reload()">Reload</button>
            </div>
        `;
        return;
    }
    
    if (AppState.books.length === 0) {
        booksGrid.innerHTML = '<div class="loading">No book data available at the moment</div>';
        return;
    }
    
    booksGrid.innerHTML = AppState.books.map((book, index) => `
        <div class="book-card" style="animation-delay: ${index * 0.1}s">
            <img src="${book.cover}" alt="${book.title}" class="book-cover"
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjE0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjE0MCIgZmlsbD0iI2YzZjNmMyIvPjx0ZXh0IHg9IjUwIiB5PSI3MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7lm77moIfvvIE8L3RleHQ+PC9zdmc+'">
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">作者：${book.author}</p>
                <span class="book-category">${book.category}</span>
                <p class="book-description">${book.description}</p>
                <div class="vote-section">
                    <button class="vote-btn" onclick="voteForBook('${book.id}')">
                        👍 Recommend this book
                    </button>
                    <div class="vote-count">Recommended numbers：<span>${book.votes}</span></div>
                </div>
            </div>
        </div>
    `).join('');
}

// 渲染排行榜
function renderRanking() {
    const rankingList = document.getElementById('ranking-list');
    if (!rankingList) return;
    
    if (AppState.isLoading) {
        rankingList.innerHTML = '<div class="loading">Load the leaderboard...</div>';
        return;
    }
    
    if (AppState.error || AppState.books.length === 0) {
        rankingList.innerHTML = '<div class="loading">There is currently no ranking data available</div>';
        return;
    }
    
    const ranking = [...AppState.books].sort((a, b) => b.votes - a.votes);
    
    rankingList.innerHTML = ranking.map((book, index) => `
        <div class="ranking-item" style="animation-delay: ${index * 0.1}s">
            <div class="rank">${index + 1}</div>
            <div class="book-info">
                <strong>${book.title}</strong> - ${book.author}
                <div class="vote-count">Recommended numbers：${book.votes}</div>
            </div>
        </div>
    `).join('');
}

// 更新单个书籍的显示
function updateBookDisplay(bookId) {
    const book = AppState.books.find(b => b.id === bookId);
    if (!book) return;
    
    // 更新书籍卡片中的票数
    const voteCountElements = document.querySelectorAll(`.book-card .vote-count span`);
    voteCountElements.forEach(element => {
        const card = element.closest('.book-card');
        const titleElement = card.querySelector('.book-title');
        if (titleElement && titleElement.textContent === book.title) {
            element.textContent = book.votes;
        }
    });
}

// 显示加载状态
function showLoading(show) {
    // 可以在这里添加全局加载指示器
}

// 显示成功消息
function showSuccess(message) {
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `✅ ${message}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #48bb78;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// 显示错误消息
function showError(message) {
    const notification = document.createElement('div');
    notification.className = 'notification error';
    notification.innerHTML = `❌ ${message}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #e53e3e;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .error-message {
        text-align: center;
        padding: 2rem;
        color: #e53e3e;
    }
    
    .error-message button {
        background: #667eea;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 1rem;
    }
`;
document.head.appendChild(style);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

console.log('✅ script.js File loading completed');