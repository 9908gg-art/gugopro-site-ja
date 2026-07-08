// 亞馬遜聯盟行銷連結轉換器
function formatAmazonUrl(url, tag) {
  if (!url) return '#';
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname.includes('amazon.com') || parsedUrl.hostname.includes('amazon.co.jp') || parsedUrl.hostname.includes('amzn.to')) {
      parsedUrl.searchParams.set('tag', tag);
      parsedUrl.searchParams.set('linkCode', 'll1'); // 聯盟行銷追蹤碼
      return parsedUrl.toString();
    }
  } catch (e) {
    console.error('Invalid URL:', url);
  }
  return url;
}

document.addEventListener('DOMContentLoaded', () => {
  // 讀取配置
  const siteConfig = window.SITE_CONFIG || {
    amazonId: '9908qq-20',
    siteName: 'GuGoPro',
    disclosure: '作為亞馬遜會員，我們從符合條件的購買中賺取佣金。'
  };

  // 1. 動態修改頁面上的靜態亞馬遜連結
  const staticAmazonLinks = document.querySelectorAll('[data-amazon-link]');
  staticAmazonLinks.forEach(link => {
    const rawUrl = link.getAttribute('data-amazon-link');
    link.href = formatAmazonUrl(rawUrl, siteConfig.amazonId);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener sponsored');
  });

  // 2. 動態顯示亞馬遜免責聲明
  const disclosureContainer = document.querySelectorAll('.dynamic-disclosure');
  disclosureContainer.forEach(el => {
    el.textContent = siteConfig.disclosure;
  });

  // 3. 頁首與選單控制 (行動裝置)
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const nav = document.getElementById('nav-menu');
  if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener('click', () => {
      nav.classList.toggle('active');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        if (nav.classList.contains('active')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
    });
  }

  // 4. 深色/淺色主題切換
  const themeToggleBtn = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  // 初始化主題
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      let newTheme = theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('i');
    if (icon) {
      if (theme === 'dark') {
        icon.className = 'fas fa-sun';
      } else {
        icon.className = 'fas fa-moon';
      }
    }
  }

  // 5. 滾動置頂按鈕
  const scrollTopBtn = document.getElementById('scroll-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 6. 自動設定當前導覽列連結為活躍狀態
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('nav ul li a');
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (currentPath.endsWith(linkPath) || (currentPath === '/' && linkPath === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 設定頁尾版權年份
  const copyrightYear = document.getElementById('copyright-year');
  if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
  }
});
