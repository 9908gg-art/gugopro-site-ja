// Products display, subcategory filtering, and interactive comparison logic (Japanese Version)
document.addEventListener('DOMContentLoaded', () => {
  const productGrid = document.getElementById('product-grid');
  const featuredProductGrid = document.getElementById('featured-product-grid');
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');
  const filterPills = document.querySelectorAll('#filter-pills-container .filter-pill');
  
  let tagPills = [];
  let subcatPills = [];
  
  let allProducts = [];
  let currentCategory = 'all';
  let currentSubCategory = 'all';
  let currentTag = 'all';
  let searchQuery = '';
  let currentSort = 'recommended';
  
  // Comparison tool state
  let selectedCompareIds = [];

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
      
      // Initialize components
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

  // 1. Initialize catalog controls and Compare elements
  function initProductCatalog() {
    tagPills = document.querySelectorAll('#tag-pills-container .filter-pill');
    
    // Inject Compare Elements
    injectCompareElements();

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
        currentSubCategory = 'all'; // reset subcategory on main change
        
        // Generate subcategories dynamically
        renderSubcategories();
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

  // 2. Dynamically render Subcategories bar
  function renderSubcategories() {
    const existingBar = document.getElementById('subcat-pills-container');
    if (existingBar) existingBar.remove();

    if (currentCategory === 'all') return;

    // Filter products in current category to find unique subcategories
    const relevantProducts = allProducts.filter(p => p.category === currentCategory);
    
    // Extract unique subcategories
    const subcatsMap = {};
    relevantProducts.forEach(p => {
      if (p.subCategory) {
        subcatsMap[p.subCategory] = p.subCategoryName || p.subCategory;
      }
    });

    const subcatKeys = Object.keys(subcatsMap);
    if (subcatKeys.length === 0) return;

    // Create subcategory container
    const searchFilterSection = document.querySelector('.search-filter-section');
    if (!searchFilterSection) return;

    const subcatBar = document.createElement('div');
    subcatBar.id = 'subcat-pills-container';
    subcatBar.className = 'subcat-bar';
    
    let labelText = currentCategory === 'tech' ? 'テック製品すべて' : currentCategory === 'home' ? 'スマートホームすべて' : 'アウトドアすべて';
    
    let pillsHtml = `<span style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); margin-right: 0.5rem;"><i class="fas fa-sliders-h"></i> サブカテゴリー：</span>`;
    pillsHtml += `<button class="subcat-pill active" data-subcategory="all">${labelText}</button>`;
    
    subcatKeys.forEach(key => {
      pillsHtml += `<button class="subcat-pill" data-subcategory="${key}">${subcatsMap[key]}</button>`;
    });

    subcatBar.innerHTML = pillsHtml;
    searchFilterSection.appendChild(subcatBar);

    // Event listeners
    subcatPills = subcatBar.querySelectorAll('.subcat-pill');
    subcatPills.forEach(pill => {
      pill.addEventListener('click', () => {
        subcatPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentSubCategory = pill.getAttribute('data-subcategory');
        renderProducts();
      });
    });
  }

  // 3. Render landing page featured products
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

  // 4. Filter, Sort and Render
  function renderProducts() {
    if (!productGrid) return;

    // Filter Logic
    let filtered = allProducts.filter(product => {
      // Category filter
      const matchCategory = currentCategory === 'all' || product.category === currentCategory;
      
      // Subcategory filter
      const matchSubCategory = currentSubCategory === 'all' || product.subCategory === currentSubCategory;

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
        
      return matchCategory && matchSubCategory && matchTag && matchSearch;
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

    // Bind event listeners to comparison checkboxes
    bindCompareEvents();
  }

  // 5. Create single product card DOM
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
          <div class="product-actions" style="display: flex; flex-direction: column; gap: 0.5rem; align-items: stretch;">
            <a href="${affiliateUrl}" target="_blank" rel="noopener sponsored" class="btn btn-amazon">
              <i class="fab fa-amazon"></i> Amazonでチェック
            </a>
            <label class="compare-checkbox-container" style="justify-content: center;">
              <input type="checkbox" class="compare-checkbox" data-compare-id="${product.id}" ${selectedCompareIds.includes(product.id) ? 'checked' : ''}>
              <span><i class="fas fa-balance-scale"></i> 仕様を比較する</span>
            </label>
          </div>
        </div>
      </div>
    `;

    return card;
  }

  // --- Comparison Tool Core Code ---
  
  // Inject HTML Elements for Compare floating bar and Modal
  function injectCompareElements() {
    if (document.getElementById('compare-floating-bar')) return;

    // 1. Floating Bar
    const floatingBar = document.createElement('div');
    floatingBar.id = 'compare-floating-bar';
    floatingBar.className = 'compare-floating-bar';
    floatingBar.innerHTML = `
      <span class="compare-bar-text" id="compare-bar-text">0 件の商品が選択されています</span>
      <button class="btn btn-primary" id="compare-btn" style="padding: 0.5rem 1.25rem; font-size: 0.9rem;">
        <i class="fas fa-balance-scale"></i> 仕様を比較する
      </button>
    `;
    document.body.appendChild(floatingBar);

    // 2. Modal Overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'compare-modal-overlay';
    modalOverlay.className = 'compare-modal-overlay';
    modalOverlay.innerHTML = `
      <div class="compare-modal">
        <div class="compare-modal-header">
          <span class="compare-modal-title"><i class="fas fa-balance-scale"></i> 製品仕様の比較</span>
          <button class="compare-close-btn" id="compare-close-btn">&times;</button>
        </div>
        <div class="compare-modal-body" id="compare-modal-body">
          <!-- Comparison table rendered here -->
        </div>
      </div>
    `;
    document.body.appendChild(modalOverlay);

    // Event listeners
    document.getElementById('compare-close-btn').addEventListener('click', closeCompareModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeCompareModal();
    });
    
    document.getElementById('compare-btn').addEventListener('click', openCompareModal);
  }

  function bindCompareEvents() {
    const checkboxes = document.querySelectorAll('.compare-checkbox');
    checkboxes.forEach(box => {
      box.addEventListener('change', (e) => {
        const id = box.getAttribute('data-compare-id');
        if (box.checked) {
          if (selectedCompareIds.length >= 3) {
            alert("一度に比較できる商品は3つまでです！");
            box.checked = false;
            return;
          }
          if (!selectedCompareIds.includes(id)) {
            selectedCompareIds.push(id);
          }
        } else {
          selectedCompareIds = selectedCompareIds.filter(item => item !== id);
        }
        updateCompareFloatingBar();
      });
    });
  }

  function updateCompareFloatingBar() {
    const bar = document.getElementById('compare-floating-bar');
    const textEl = document.getElementById('compare-bar-text');
    
    if (selectedCompareIds.length > 0) {
      textEl.textContent = `${selectedCompareIds.length} 件の商品が選択されています`;
      bar.classList.add('active');
    } else {
      bar.classList.remove('active');
    }
  }

  function openCompareModal() {
    if (selectedCompareIds.length === 0) return;
    
    const bodyEl = document.getElementById('compare-modal-body');
    const overlay = document.getElementById('compare-modal-overlay');
    
    const productsToCompare = allProducts.filter(p => selectedCompareIds.includes(p.id));
    
    let tableHtml = `<table class="compare-table">`;
    
    // 1. Header row
    tableHtml += `<thead><tr><th>仕様と特徴</th>`;
    productsToCompare.forEach(p => {
      const isYen = p.price > 1000;
      const priceText = isYen ? `¥${p.price.toLocaleString()}` : `$${p.price.toFixed(2)}`;
      const affiliateUrl = formatAmazonUrl(p.amazonUrl || `https://www.amazon.co.jp/dp/`, siteConfig.amazonId);

      tableHtml += `
        <td>
          <div class="compare-product-header">
            <img src="${p.image}" class="compare-img" alt="${p.title}">
            <span class="compare-title">${p.title}</span>
            <span class="compare-price">${priceText}</span>
            <a href="${affiliateUrl}" target="_blank" rel="noopener sponsored" class="btn btn-amazon" style="font-size:0.8rem; padding:0.4rem 0.8rem;">
              <i class="fab fa-amazon"></i> Amazonで見る
            </a>
          </div>
        </td>
      `;
    });
    tableHtml += `</tr></thead><tbody>`;
    
    // 2. Ratings Row
    tableHtml += `<tr><th>カスタマー評価</th>`;
    productsToCompare.forEach(p => {
      tableHtml += `<td><strong>⭐ ${p.rating} / 5.0</strong> (${p.reviewsCount.toLocaleString()} 件の評価)</td>`;
    });
    tableHtml += `</tr>`;

    // 3. Category & Badges Row
    tableHtml += `<tr><th>バッジ・タグ</th>`;
    productsToCompare.forEach(p => {
      const badge = p.bestSeller ? '🔥 ベストセラー' : p.topRated ? '⭐ 大好評' : p.budgetPick ? '🏷️ コスパ最強' : '標準';
      tableHtml += `<td><span class="meta-tag">${badge}</span></td>`;
    });
    tableHtml += `</tr>`;

    // 4. Gather all unique specifications keys
    const specKeys = {};
    productsToCompare.forEach(p => {
      if (p.specs) {
        Object.keys(p.specs).forEach(k => { specKeys[k] = true; });
      }
    });

    const allKeys = Object.keys(specKeys);
    if (allKeys.length > 0) {
      allKeys.forEach(k => {
        tableHtml += `<tr><th>${k}</th>`;
        productsToCompare.forEach(p => {
          const specVal = p.specs && p.specs[k] ? p.specs[k] : 'なし';
          tableHtml += `<td>${specVal}</td>`;
        });
        tableHtml += `</tr>`;
      });
    }

    // 5. Description Row
    tableHtml += `<tr><th>商品の概要</th>`;
    productsToCompare.forEach(p => {
      tableHtml += `<td><p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.5;">${p.description}</p></td>`;
    });
    tableHtml += `</tr>`;

    tableHtml += `</tbody></table>`;
    
    bodyEl.innerHTML = tableHtml;
    overlay.classList.add('active');
  }

  function closeCompareModal() {
    const overlay = document.getElementById('compare-modal-overlay');
    overlay.classList.remove('active');
  }
});
