const express = require('express');
const path = require('path');
const session = require('express-session');
const sequelize = require('./config/db');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Order = require('./models/Order'); 

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

// --- 4. 登入驗證 Middleware ---
function checkAuth(req, res, next) {
    if (req.session.isAdmin) {
        return next();
    }
    // 如果是 API 請求且未登入，回傳 401 錯誤碼
    if (req.originalUrl.startsWith('/api/admin')) {
        return res.status(401).json({ message: '登入逾時，請重新登入' });
    }
    res.redirect('/admin/login');
}

// --- 5. 公開頁面路由 ---
app.get('/', (req, res) => res.render('index'));
app.get('/menu', (req, res) => res.render('menu'));
app.get('/order', (req, res) => res.render('order'));
app.get('/about', (req, res) => res.render('about'));
app.get('/contact', (req, res) => res.render('contact'));
app.get('/search', (req, res) => res.render('search'));

// --- 6. 登入相關路由 ---
app.get('/admin/login', (req, res) => res.render('admin/login'));
app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '1234') {
        req.session.isAdmin = true;
        res.redirect('/admin/products');
    } else {
        res.render('admin/login', { error: '帳號或密碼錯誤' });
    }
});
app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

// --- 7. 受保護的後台頁面 ---
app.get('/admin/products', checkAuth, (req, res) => res.render('admin/products'));
app.get('/admin/orders', checkAuth, (req, res) => res.render('admin/orders'));

// --- 8. 公開 API 路由 ---
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (err) { res.status(500).json([]); }
});

app.post('/api/orders', async (req, res) => {
    try {
        const { customer_name, phone, pickup_date, cake_item_string, notes } = req.body;
        const newOrder = await Order.create({ 
            customer_name, 
            phone, 
            pickup_date, 
            cake_item_string, 
            notes 
        });
        res.status(201).json({ message: '訂購成功', orderId: newOrder.id });
    } catch (err) { res.status(500).json({ message: '伺服器出錯' }); }
});

app.get('/api/orders/search', async (req, res) => {
    try {
        const orders = await Order.findAll({ 
            where: { phone: req.query.phone }, 
            order: [['createdAt', 'DESC']] 
        });
        res.json(orders);
    } catch (err) { res.status(500).json([]); }
});

// --- 9. 受保護的管理端 API ---
app.use('/api/admin', checkAuth);

app.get('/api/admin/orders', async (req, res) => {
    try {
        const orders = await Order.findAll({ order: [['createdAt', 'DESC']] });
        res.json(orders);
    } catch (err) { res.status(500).json([]); }
});

// 修正後的訂單更新 API (支援修改姓名、電話、日期、備註)
app.put('/api/admin/orders/:id', async (req, res) => {
    try {
        const { customer_name, phone, pickup_date, notes } = req.body;
        await Order.update(
            { customer_name, phone, pickup_date, notes },
            { where: { id: req.params.id } }
        );
        res.json({ message: '更新成功' });
    } catch (err) { res.status(500).json({ message: '更新失敗' }); }
});

app.delete('/api/admin/orders/:id', async (req, res) => {
    try {
        await Order.destroy({ where: { id: req.params.id } });
        res.json({ message: '刪除成功' });
    } catch (err) { res.status(500).json({ message: '刪除失敗' }); }
});

// 商品管理 API
app.post('/api/admin/products', async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
    } catch (err) { res.status(500).json({ message: '新增失敗' }); }
});

app.put('/api/admin/products/:id', async (req, res) => {
    try {
        await Product.update(req.body, { where: { id: req.params.id } });
        res.json({ message: '更新成功' });
    } catch (err) { res.status(500).json({ message: '更新失敗' }); }
});

app.delete('/api/admin/products/:id', async (req, res) => {
    try {
        await Product.destroy({ where: { id: req.params.id } });
        res.json({ message: '刪除成功' });
    } catch (err) { res.status(500).json({ message: '刪除失敗' }); }
});

// --- 10. 同步資料庫並啟動 ---
const PORT = 3000;
sequelize.sync({ force: false }).then(() => {
    console.log('資料庫同步成功');
    app.listen(PORT, () => console.log(`伺服器運行於: http://localhost:${PORT}`));
}).catch(err => console.error('資料庫同步失敗:', err));