// 產品展示與過濾邏輯
document.addEventListener('DOMContentLoaded', () => {
  const productGrid = document.getElementById('product-grid');
  const featuredProductGrid = document.getElementById('featured-product-grid');
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');
  const filterPills = document.querySelectorAll('.filter-pill');

  let allProducts = [];
  let currentCategory = 'all';
  let searchQuery = '';
  let currentSort = 'recommended';

  // 讀取配置
  const siteConfig = window.SITE_CONFIG || {
    amazonId: '9908qq-20'
  };

  // 獲取數據
  fetch('data/products.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      allProducts = data;
      
      // 判斷是首頁還是產品列表頁
      if (productGrid) {
        // 產品列表頁邏輯
        initProductCatalog();
      }
      
      if (featuredProductGrid) {
        // 首頁精選邏輯
        renderFeaturedProducts();
      }
    })
    .catch(error => {
      console.error('載入商品資料失敗:', error);
      if (productGrid) {
        productGrid.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">
            <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: var(--star-color); margin-bottom: 1rem;"></i>
            <p>商品載入中或載入失敗，請確認 JSON 路徑是否正確。</p>
          </div>
        `;
      }
    });

  // 1. 初始化產品目錄頁面
  function initProductCatalog() {
    renderProducts();

    // 搜尋輸入監聽
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderProducts();
      });
    }

    // 排序選擇監聽
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderProducts();
      });
    }

    // 分類按鈕監聽
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentCategory = pill.getAttribute('data-category');
        renderProducts();
      });
    });
  }

  // 2. 渲染首頁精選商品
  function renderFeaturedProducts() {
    // 篩選出 featured 或 hot 商品，最多顯示 4 個
    const featuredList = allProducts
      .filter(p => p.featured || p.hot)
      .slice(0, 4);

    featuredProductGrid.innerHTML = '';
    
    if (featuredList.length === 0) {
      featuredProductGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">暫無精選推薦</p>';
      return;
    }

    featuredList.forEach(product => {
      const card = createProductCard(product);
      featuredProductGrid.appendChild(card);
    });
  }

  // 3. 篩選與排序並渲染所有商品
  function renderProducts() {
    if (!productGrid) return;

    // 篩選邏輯
    let filtered = allProducts.filter(product => {
      // 分類過濾
      const matchCategory = currentCategory === 'all' || product.category === currentCategory;
      
      // 關鍵字搜尋（標題、英文標題、敘述、標籤）
      const matchSearch = searchQuery === '' || 
        product.title.toLowerCase().includes(searchQuery) ||
        (product.englishTitle && product.englishTitle.toLowerCase().includes(searchQuery)) ||
        product.description.toLowerCase().includes(searchQuery) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchQuery)));
        
      return matchCategory && matchSearch;
    });

    // 排序邏輯
    if (currentSort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else {
      // 預設推薦：將 featured/hot 靠前
      filtered.sort((a, b) => {
        const valA = (a.featured ? 2 : 0) + (a.hot ? 1 : 0);
        const valB = (b.featured ? 2 : 0) + (b.hot ? 1 : 0);
        return valB - valA;
      });
    }

    productGrid.innerHTML = '';

    if (filtered.length === 0) {
      productGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-secondary);">
          <i class="fas fa-search-minus" style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--text-muted);"></i>
          <p style="font-size: 1.1rem; font-weight: 500;">找不到符合條件的商品</p>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.25rem;">試試更換關鍵字或重設分類篩選。</p>
        </div>
      `;
      return;
    }

    filtered.forEach(product => {
      const card = createProductCard(product);
      productGrid.appendChild(card);
    });
  }

  // 4. 創建單個產品卡片 DOM
  function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // 聯盟連結轉換
    const affiliateUrl = formatAmazonUrl(product.amazonUrl || `https://www.amazon.com/dp/`, siteConfig.amazonId);
    
    // 原價折舊折扣標記
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercent = hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    
    // 評分星星生成
    let starsHtml = '';
    const roundedRating = Math.round(product.rating * 2) / 2; // 四捨五入到 0.5
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        starsHtml += '<i class="fas fa-star"></i>';
      } else if (i - 0.5 === roundedRating) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
      } else {
        starsHtml += '<i class="far fa-star"></i>';
      }
    }

    // 標籤 tags HTML
    const tagsHtml = product.tags ? product.tags.map(tag => `<span class="meta-tag">#${tag}</span>`).join('') : '';

    card.innerHTML = `
      <div class="product-image-container">
        <img src="${product.image}" alt="${product.title}" loading="lazy">
        ${hasDiscount ? `<span class="badge-deal">省 ${discountPercent}%</span>` : ''}
        ${product.hot ? `<span class="badge-hot"><i class="fas fa-fire"></i> HOT</span>` : ''}
      </div>
      <div class="product-info">
        <span class="product-category">${product.categoryName}</span>
        <h3 class="product-title" title="${product.title}">${product.title}</h3>
        <p class="product-english-title">${product.englishTitle || ''}</p>
        <div class="product-rating">
          <div class="stars">${starsHtml}</div>
          <span class="rating-value">${product.rating}</span>
          <span class="rating-count">(${product.reviewsCount ? product.reviewsCount.toLocaleString() : '1,000+'})</span>
        </div>
        <p class="product-description">${product.description}</p>
        <div class="product-meta">
          ${tagsHtml}
        </div>
        <div class="product-footer">
          <div class="product-price">
            <span class="price-now">$${product.price.toFixed(2)}</span>
            ${hasDiscount ? `<span class="price-original">$${product.originalPrice.toFixed(2)}</span>` : ''}
          </div>
          <div class="product-actions">
            <a href="${affiliateUrl}" target="_blank" rel="noopener sponsored" class="btn btn-amazon">
              <i class="fab fa-amazon"></i> 亞馬遜購買
            </a>
          </div>
        </div>
      </div>
    `;

    return card;
  }
});
