// Products display and filtering logic (Japanese Version)
document.addEventListener('DOMContentLoaded', () => {
  const productGrid = document.getElementById('product-grid');
  const featuredProductGrid = document.getElementById('featured-product-grid');
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');
  const filterPills = document.querySelectorAll('#filter-pills-container .filter-pill');
  
  let tagPills = [];
  
  let allProducts = [];
  let currentCategory = 'all';
  let currentTag = 'all';
  let searchQuery = '';
  let currentSort = 'recommended';

  // Read config
  const siteConfig = window.SITE_CONFIG || {
    amazonId: '9908qq-22'
  };

  // Fetch products
  fetch('data/products.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      allProducts = data;
      
      if (productGrid) {
        initProductCatalog();
      }
      
      if (featuredProductGrid) {
        renderFeaturedProducts();
      }
    })
    .catch(error => {
      console.error('Failed to load products:', error);
      if (productGrid) {
        productGrid.innerHTML = `
          <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--text-secondary);">
            <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: var(--star-color); margin-bottom: 1rem;"></i>
            <p>商品の読み込みに失敗しました。JSONファイルを確認してください。</p>
          </div>
        `;
      }
    });

  // 1. Initialize catalog controls
  function initProductCatalog() {
    tagPills = document.querySelectorAll('#tag-pills-container .filter-pill');

    renderProducts();

    // Search input
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderProducts();
      });
    }

    // Sort selection
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderProducts();
      });
    }

    // Category pills
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentCategory = pill.getAttribute('data-category');
        renderProducts();
      });
    });

    // Tag pills
    if (tagPills.length > 0) {
      tagPills.forEach(pill => {
        pill.addEventListener('click', () => {
          tagPills.forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          currentTag = pill.getAttribute('data-tag');
          renderProducts();
        });
      });
    }
  }

  // 2. Render landing page featured products
  function renderFeaturedProducts() {
    const featuredList = allProducts
      .filter(p => p.featured)
      .slice(0, 4);

    featuredProductGrid.innerHTML = '';
    
    if (featuredList.length === 0) {
      featuredProductGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">おすすめ商品が見つかりません。</p>';
      return;
    }

    featuredList.forEach(product => {
      const card = createProductCard(product);
      featuredProductGrid.appendChild(card);
    });
  }

  // 3. Filter, Sort and Render
  function renderProducts() {
    if (!productGrid) return;

    // Filter Logic
    let filtered = allProducts.filter(product => {
      // Category filter
      const matchCategory = currentCategory === 'all' || product.category === currentCategory;
      
      // Tag filter
      const matchTag = currentTag === 'all' || 
        (currentTag === 'bestSeller' && product.bestSeller) ||
        (currentTag === 'topRated' && product.topRated) ||
        (currentTag === 'budgetPick' && product.budgetPick);

      // Search keyword filter
      const matchSearch = searchQuery === '' || 
        product.title.toLowerCase().includes(searchQuery) ||
        (product.englishTitle && product.englishTitle.toLowerCase().includes(searchQuery)) ||
        product.description.toLowerCase().includes(searchQuery) ||
        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchQuery)));
        
      return matchCategory && matchTag && matchSearch;
    });

    // Sort Logic
    if (currentSort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else {
      filtered.sort((a, b) => {
        const valA = (a.bestSeller ? 3 : 0) + (a.featured ? 2 : 0) + (a.topRated ? 1 : 0);
        const valB = (b.bestSeller ? 3 : 0) + (b.featured ? 2 : 0) + (b.topRated ? 1 : 0);
        return valB - valA;
      });
    }

    productGrid.innerHTML = '';

    if (filtered.length === 0) {
      productGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-secondary);">
          <i class="fas fa-search-minus" style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--text-muted);"></i>
          <p style="font-size: 1.1rem; font-weight: 500;">条件に合う商品が見つかりません</p>
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 0.25rem;">キーワードを変更するか、フィルターをリセットしてください。</p>
        </div>
      `;
      return;
    }

    filtered.forEach(product => {
      const card = createProductCard(product);
      productGrid.appendChild(card);
    });
  }

  // 4. Create single product card DOM
  function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const affiliateUrl = formatAmazonUrl(product.amazonUrl || `https://www.amazon.co.jp/dp/`, siteConfig.amazonId);
    
    // Discount percentage
    const hasDiscount = product.originalPrice && product.originalPrice > product.price;
    const discountPercent = hasDiscount ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    
    // Star rating rendering
    let starsHtml = '';
    const roundedRating = Math.round(product.rating * 2) / 2;
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        starsHtml += '<i class="fas fa-star"></i>';
      } else if (i - 0.5 === roundedRating) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
      } else {
        starsHtml += '<i class="far fa-star"></i>';
      }
    }

    // Top Left Badge Logic
    let topLeftBadge = '';
    if (product.bestSeller) {
      topLeftBadge = `<span class="badge-bestseller"><i class="fas fa-crown"></i> ベストセラー</span>`;
    } else if (product.topRated) {
      topLeftBadge = `<span class="badge-toprated"><i class="fas fa-award"></i> 大好評</span>`;
    } else if (product.budgetPick) {
      topLeftBadge = `<span class="badge-budget"><i class="fas fa-tag"></i> コスパ最強</span>`;
    }

    // Top Right Badge Logic
    let topRightBadge = '';
    if (hasDiscount) {
      topRightBadge = `<span class="badge-deal">${discountPercent}% OFF</span>`;
    } else if (product.hot) {
      topRightBadge = `<span class="badge-hot"><i class="fas fa-fire"></i> HOT</span>`;
    }

    const tagsHtml = product.tags ? product.tags.map(tag => `<span class="meta-tag">#${tag}</span>`).join('') : '';

    // Price formatting (check if Yen or USD)
    const isYen = product.price > 1000;
    const priceText = isYen ? `¥${product.price.toLocaleString()}` : `$${product.price.toFixed(2)}`;
    const originalPriceText = hasDiscount ? (isYen ? `¥${product.originalPrice.toLocaleString()}` : `$${product.originalPrice.toFixed(2)}`) : '';

    card.innerHTML = `
      <div class="product-image-container">
        <img src="${product.image}" alt="${product.title}" loading="lazy">
        ${topLeftBadge}
        ${topRightBadge}
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
            <span class="price-now">${priceText}</span>
            ${hasDiscount ? `<span class="price-original">${originalPriceText}</span>` : ''}
          </div>
          <div class="product-actions">
            <a href="${affiliateUrl}" target="_blank" rel="noopener sponsored" class="btn btn-amazon">
              <i class="fab fa-amazon"></i> Amazonでチェック
            </a>
          </div>
        </div>
      </div>
    `;

    return card;
  }
});
