# 🚀 GuGoPro 網站部署與自訂網域設定指南

本指南將一步步帶領您將建立好的導購網站部署到 **GitHub Pages**，並綁定您的獨立網域 **`gugopro.com`**。

---

## 📋 部署前準備
1. **GitHub 帳號**：若無帳號，請至 [github.com](https://github.com/) 註冊。
2. **Git 工具**：電腦需安裝 Git（若無，可直接用網頁上傳，但建議使用 Git 命令列）。
3. **網域管理控制台**：登入您購買 `gugopro.com` 的註冊商（如 GoDaddy, Namecheap 或 Cloudflare）。

---

## 🛠️ 第一步：上傳網站檔案至 GitHub

### 方法 A：使用 Git 命令列（推薦）
開啟終端機（Terminal）或 PowerShell，切換至本專案目錄 `D:\聯盟行銷`，依序執行以下指令：

```bash
# 1. 初始化 Git 倉庫
git init

# 2. 將所有檔案加入暫存區
git add .

# 3. 提交變更
git commit -m "Initial commit: GuGoPro affiliate site"

# 4. 重新命名預設分支為 main
git branch -M main

# 5. 在 GitHub 上建立一個新的公開 (Public) 儲存庫 (Repository)
#    名稱自訂（例如：gugopro-site），建立後複製其 git 網址，並執行以下命令：
git remote add origin https://github.com/您的用戶名/您的倉庫名.git

# 6. 推送至 GitHub
git push -u origin main
```

### 方法 B：使用 GitHub 網頁直接上傳（免安裝 Git）
1. 登入 GitHub，點擊右上角 `+` 下拉選單，選擇 **New repository**。
2. 設定 **Repository name**（例如：`gugopro-site`），並確保設為 **Public**，然後點擊 **Create repository**。
3. 在新頁面中，點擊 **"uploading an existing file"**（上傳現有檔案）連結。
4. 將 `D:\聯盟行銷` 資料夾底下的**所有檔案與資料夾**（包含 `css`、`js`、`data`、`images` 資料夾及 `index.html` 等）拖曳上傳至網頁中。
5. 上傳完成後，在下方 Commit 欄位輸入「Initial commit」，點擊 **Commit changes**。

---

## 🌐 第二步：在 GitHub Pages 開啟網站服務
1. 進入您剛建立的 GitHub 倉庫頁面，點擊上方的 **Settings**（設定）分頁。
2. 在左側選單中，點擊 **Pages**。
3. 在 **Build and deployment** 下的 **Source** 選擇 `Deploy from a branch`。
4. 在 **Branch** 下拉選單中，選擇 **`main`** 分支，後方目錄保持 **`/ (root)`**，然後點擊 **Save**。
5. 稍等 1-2 分鐘，重新整理頁面，最上方會出現您的專屬預設網址，如：`https://您的用戶名.github.io/您的倉庫名/`。

---

## 🔗 第三步：綁定您的自訂網域 `gugopro.com`

### 1. GitHub 側設定
在剛才的 **Settings -> Pages** 頁面中：
- 找到 **Custom domain** 欄位。
- 輸入您的自訂網域：`gugopro.com`。
- 點擊 **Save**（此時 GitHub 會自動在倉庫中檢查/新增 `CNAME` 檔案，因為我們已經手動建立了 `CNAME` 檔案，此步驟會直接通過）。

### 2. 網域商 DNS 設定（最重要 🔑）
請登入您的網域註冊商控制台（如 GoDaddy），找到 `gugopro.com` 的 **DNS 管理 / DNS 紀錄** 設定，並新增以下幾筆紀錄：

#### A 紀錄 (A Records) — 指向 GitHub Pages 伺服器 IP
請新增 **4 筆 A 紀錄**，主機名稱 (Host) 填寫 **`@`**，分別指向以下四個 IP 位址：
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

#### CNAME 紀錄 (CNAME Record) — 讓 www.gugopro.com 也能正常連線
請新增 **1 筆 CNAME 紀錄**：
- **主機 (Host)**: `www`
- **指向 (Value/Target)**: `您的用戶名.github.io` (例如：`9908qq.github.io`，請替換為您實際的 GitHub 帳號名)
- **TTL**: 保持預設或設為 `1 Hour` (3600 秒)

---

## 🔒 第四步：啟用 HTTPS 安全加密
當 DNS 紀錄生效後（全球解析生效通常需要 5 分鐘至 24 小時不等，通常幾分鐘內就會好）：
1. 回到 GitHub 的 **Settings -> Pages** 頁面。
2. 找到 **Enforce HTTPS** 選項，勾選它（若尚未解析成功，此選項會呈灰色，請稍後再試）。
3. 啟用後，您的網址將強制使用加密的安全協定：`https://gugopro.com`！

---

## 📝 備忘與日後維護
- **修改推廣 ID**：若未來要變更亞馬遜的聯盟 ID，只需用編輯器開啟 [js/config.js](file:///D:/%E8%81%AF%E7%9B%9F%E8%A1%8C%E9%8A%B7/js/config.js)，修改 `amazonId` 欄位並推送至 GitHub 即可，全站的商品與文章連結會自動同步更新！
- **新增/更新商品**：只需修改 [data/products.json](file:///D:/%E8%81%AF%E7%9B%9F%E8%A1%8C%E9%8A%B7/data/products.json)，新增商品區塊，並將商品圖片放入 `images` 資料夾或直接使用網址。上傳至 GitHub 後，商品目錄將自動更新！
- **新增網誌文章**：
  1. 在 `blog` 資料夾下，參考現有文章建立新的 HTML 檔案（例如 `blog/my-new-post.html`）。
  2. 修改 [data/blog.json](file:///D:/%E8%81%AF%E7%9B%9F%E8%A1%8C%E9%8A%B7/data/blog.json)，在最前面加上新文章的 JSON 資訊，列表頁便會自動出現該文章。
