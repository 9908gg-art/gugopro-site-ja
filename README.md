# 🛒 GuGoPro - 亞馬遜聯盟行銷導購網站

這是一個專為亞馬遜聯盟行銷（Amazon Associates）設計的響應式導購網站，旨在透過精選產品與開箱購物指南賺取推廣佣金。

## 🌟 網站特色
- **現代美學設計**：乾淨優雅的淺色與深色主題切換、流暢的卡片懸浮與微交互動畫。
- **全站連結自動化轉換**：全站所有商品的「購買按鈕」與網誌文章中的推廣連結，皆會透過 JavaScript 自動附加您的亞馬遜聯盟 ID（`9908qq-20`），修改配置檔案即可全局生效。
- **動態商品與網誌加載**：首頁、商品目錄、網誌目錄皆透過資料檔案（`products.json` & `blog.json`）進行動態渲染，方便無痛新增與維護。
- **100% 靜態網頁與 SEO 友善**：無需資料庫與後端伺服器，適合完全託管於免費的 **GitHub Pages**，並支援自訂網域 `gugopro.com`。
- **亞馬遜官方政策合規**：內建全站與詳細關於頁面的聯屬聲明，防範帳號停權。

## 📂 資料夾結構
```text
D:\聯盟行銷\
├── index.html         # 網站首頁
├── products.html      # 商品目錄頁（支援動態關鍵字搜尋、類別篩選與排序）
├── blog.html          # 網誌指南列表頁
├── about.html         # 關於我們與亞馬遜合規條款免責聲明頁面
├── CNAME              # 自訂網域設定檔 (指向 gugopro.com)
├── DEPLOY_GUIDE.md    # 部署到 GitHub Pages 與 DNS 綁定詳細步驟說明書
├── README.md          # 專案說明文件
├── css/
│   └── style.css      # 全站樣式表（CSS 變數、響應式佈局、動態效果）
├── js/
│   ├── config.js      # 全站參數設定（亞馬遜聯盟 ID 等）
│   ├── main.js        # 全站通用邏輯（主題切換、行動版選單、連結轉換）
│   ├── products.js    # 商品動態加載、搜尋與過濾
│   └── blog.js        # 網誌文章動態加載與渲染
├── data/
│   ├── products.json  # 商品資料庫 (JSON 格式)
│   └── blog.json      # 文章清單 (JSON 格式)
├── blog/              # 存放靜態網誌文章 HTML 的資料夾
│   ├── best-smart-home-2026.html
│   ├── ergonomic-workplace.html
│   └── mechanical-keyboard-guide.html
└── images/            # 存放商品圖片與網誌配圖
    ├── headphones.jpg
    ├── keyboard.jpg
    ├── chair.jpg
    └── blog-smarthome.jpg
```

## 🚀 部署指南
請參閱 [DEPLOY_GUIDE.md](file:///D:/%E8%81%AF%E7%9B%9F%E8%A1%8C%E9%8A%B7/DEPLOY_GUIDE.md) 了解如何將此網站部署至 GitHub Pages 並綁定您的網域 `gugopro.com`。

## ✍️ 日常更新維護
1. **變更聯盟行銷 ID**：
   開啟 `js/config.js`，修改 `amazonId` 欄位。
2. **新增推薦商品**：
   編輯 `data/products.json`，在陣列中添加新的 JSON 物件，並將對應的商品圖片放進 `images/` 資料夾中。
3. **撰寫新購物指南**：
   在 `blog/` 目錄下建立新的文章 HTML（可複製現有文章修改），並在 `data/blog.json` 中登記新文章的標題、日期與連結。
