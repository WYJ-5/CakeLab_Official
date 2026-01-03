const express = require('express');
const path = require('path');
const session = require('express-session');
const sequelize = require('./config/db');
const router = require('./router'); // 引入外部路由檔案
require('dotenv').config(); // 確保讀取 .env 檔案

const app = express();

// --- 1. 解析 JSON 與 URL 編碼資料 ---
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// --- 2. Session 設定 ---
app.use(session({
    secret: 'cakelab_key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 } // 1 小時
}));

// --- 3. 設定 EJS 模板引擎與靜態檔案 ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// --- 4. 使用路由模組 ---
app.use('/', router); 

// --- 5. 同步資料庫並啟動 ---
const PORT = process.env.PORT || 3000;
sequelize.sync({ force: false }).then(() => {
    console.log('資料庫同步成功');
    app.listen(PORT, () => console.log(`伺服器運行於: http://localhost:${PORT}`));
}).catch(err => console.error('資料庫同步失敗:', err));