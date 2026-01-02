const express = require('express');
const path = require('path');
const sequelize = require('./config/db');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Order = require('./models/Order'); 
const app = express();

// --- 關鍵修正：解析 JSON 與 URL 編碼資料 ---
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 設定 EJS 模板引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 設定靜態檔案路徑
app.use(express.static(path.join(__dirname, 'public')));

// --- 頁面路由 ---
app.get('/', (req, res) => res.render('index'));
app.get('/menu', (req, res) => res.render('menu'));
app.get('/order', (req, res) => res.render('order'));
app.get('/about', (req, res) => res.render('about'));
app.get('/contact', (req, res) => res.render('contact'));
app.get('/search', (req, res) => res.render('search'));

// --- API 路由 ---
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.findAll();
        const formattedProducts = products.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            img: p.img, 
            description: p.description,
            is_featured: p.is_featured 
        }));
        res.json(formattedProducts);
    } catch (err) {
        console.error("抓取產品失敗:", err);
        res.status(500).json([]);
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const { customer_name, phone, pickup_date, cake_item_string, notes } = req.body;

        // 建立資料庫紀錄
        const newOrder = await Order.create({
            customer_name,
            phone,
            pickup_date,
            cake_item_string,
            notes
        });

        res.status(201).json({ message: '訂購成功', orderId: newOrder.id });
    } catch (err) {
        console.error("訂單提交錯誤:", err);
        res.status(500).json({ message: '伺服器出錯，請檢查資料格式' });
    }
});

app.get('/api/orders/search', async (req, res) => {
    try {
        const { phone } = req.query; // 從 URL 參數抓取電話
        if (!phone) {
            return res.status(400).json({ message: '請提供電話號碼' });
        }

        // 搜尋資料庫中電話符合的訂單，並依據建立時間降冪排序（最新的在前）
        const orders = await Order.findAll({
            where: { phone: phone },
            order: [['createdAt', 'DESC']]
        });

        res.json(orders);
    } catch (err) {
        console.error("訂單查詢錯誤:", err);
        res.status(500).json({ message: '伺服器查詢出錯' });
    }
});

// --- 管理端頁面路由 ---
app.get('/admin', (req, res) => res.render('admin/dashboard'));
app.get('/admin/products', (req, res) => res.render('admin/products'));
app.get('/admin/orders', (req, res) => res.render('admin/orders'));
app.get('/admin/products', (req, res) => res.render('admin/products'));
app.get('/admin/orders', (req, res) => res.render('admin/orders'));

const session = require('express-session'); // 引入 session

// --- 在 app.use(express.static...) 之前加入 Session 設定 ---
app.use(session({
    secret: 'cakelab_key', // 密鑰，可隨意更改
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 } // 登入有效時間 1 小時
}));

// --- 登入驗證 Middleware (路由守衛) ---
function checkAuth(req, res, next) {
    if (req.session.isAdmin) {
        next(); // 已登入，繼續執行
    } else {
        res.redirect('/admin/login'); // 未登入，跳轉到登入頁
    }
}

// --- 登入路由 ---
app.get('/admin/login', (req, res) => {
    res.render('admin/login');
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    // 這裡先使用固定帳密進行簡單驗證
    if (username === 'admin' && password === '1234') {
        req.session.isAdmin = true;
        res.redirect('/admin/products');
    } else {
        res.render('admin/login', { error: '帳號或密碼錯誤' });
    }
});

// 登出
app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

// --- 受保護的後台路由 (加入 checkAuth) ---
app.get('/admin/products', checkAuth, (req, res) => res.render('admin/products'));
app.get('/admin/orders', checkAuth, (req, res) => res.render('admin/orders'));

// 受保護的 API 路由也要擋住
app.use('/api/admin', checkAuth);


// --- 管理端 API 路由 ---

// 1. 取得所有訂單 (依時間排序)
app.get('/api/admin/orders', async (req, res) => {
    try {
        const orders = await Order.findAll({ order: [['createdAt', 'DESC']] });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: '無法取得訂單' });
    }
});

// 2. 新增商品
app.post('/api/admin/products', async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ message: '新增失敗' });
    }
});

// 3. 修改商品 (含推薦狀態)
app.put('/api/admin/products/:id', async (req, res) => {
    try {
        await Product.update(req.body, { where: { id: req.params.id } });
        res.json({ message: '更新成功' });
    } catch (err) {
        res.status(500).json({ message: '更新失敗' });
    }
});

// 4. 刪除商品
app.delete('/api/admin/products/:id', async (req, res) => {
    try {
        await Product.destroy({ where: { id: req.params.id } });
        res.json({ message: '刪除成功' });
    } catch (err) {
        res.status(500).json({ message: '刪除失敗' });
    }
});


// --- 同步資料庫並啟動 ---
const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false }).then(() => {
    console.log('資料庫已同步');
    app.listen(PORT, () => {
        console.log(`CakeLab server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('資料庫同步失敗:', err);
});