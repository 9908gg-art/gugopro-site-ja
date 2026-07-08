const CONFIG = {
  amazonId: '9908qq-22', // Please replace with your Amazon.co.jp Associate ID
  siteName: 'GuGoPro JP',
  siteUrl: 'https://shop-ja.gugopro.com',
  disclosure: 'Amazon.co.jpのアソシエイトとして、GuGoPro JPは適格販売により収入を得ています。'
};

// Export configuration
if (typeof window !== 'undefined') {
  window.SITE_CONFIG = CONFIG;
}
