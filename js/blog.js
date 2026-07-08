// 網誌文章加載與展示邏輯
document.addEventListener('DOMContentLoaded', () => {
  const blogGrid = document.getElementById('blog-grid');
  const featuredBlogGrid = document.getElementById('featured-blog-grid');

  let allPosts = [];

  // 獲取網誌數據
  fetch('data/blog.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      allPosts = data;
      
      if (blogGrid) {
        renderBlogList();
      }
      
      if (featuredBlogGrid) {
        renderFeaturedBlogs();
      }
    })
    .catch(error => {
      console.error('載入文章失敗:', error);
      if (blogGrid) {
        blogGrid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:var(--text-secondary);">無法加載文章列表。</p>';
      }
    });

  // 1. 渲染網誌列表頁面的所有文章
  function renderBlogList() {
    blogGrid.innerHTML = '';
    
    if (allPosts.length === 0) {
      blogGrid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:var(--text-muted);">目前尚無文章</p>';
      return;
    }

    allPosts.forEach(post => {
      const card = createBlogCard(post);
      blogGrid.appendChild(card);
    });
  }

  // 2. 首頁渲染最新 3 篇文章
  function renderFeaturedBlogs() {
    featuredBlogGrid.innerHTML = '';
    
    // 取最新 3 篇
    const latestPosts = allPosts.slice(0, 3);
    
    if (latestPosts.length === 0) {
      featuredBlogGrid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:var(--text-muted);">目前尚無推薦文章</p>';
      return;
    }

    latestPosts.forEach(post => {
      const card = createBlogCard(post);
      featuredBlogGrid.appendChild(card);
    });
  }

  // 3. 創建單個網誌卡片 DOM
  function createBlogCard(post) {
    const card = document.createElement('div');
    card.className = 'blog-card';

    // 格式化日期
    const formattedDate = new Date(post.date).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    card.innerHTML = `
      <div class="blog-image" style="background-image: url('${post.image}')"></div>
      <div class="blog-info">
        <div class="blog-meta-top">
          <span class="blog-category-tag">${post.categoryName}</span>
          <span><i class="far fa-calendar-alt"></i> ${formattedDate}</span>
        </div>
        <h3 class="blog-title">
          <a href="${post.url}">${post.title}</a>
        </h3>
        <p class="blog-summary">${post.summary}</p>
        <div class="blog-footer">
          <span>作者: ${post.author}</span>
          <span>閱讀時間: ${post.readTime || '5 分鐘'}</span>
        </div>
        <div style="margin-top: 1.25rem;">
          <a href="${post.url}" class="blog-read-more">
            閱讀全文 <i class="fas fa-arrow-right" style="font-size: 0.8rem;"></i>
          </a>
        </div>
      </div>
    `;

    return card;
  }
});
