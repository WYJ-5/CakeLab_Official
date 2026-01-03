const express = require('express');
const router = express.Router();
const Product = require('./models/Product');
const Category = require('./models/Category');
const Order = require('./models/Order');

// --- 1. 登入驗證 中間件 (Middleware) ---
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

// --- 2. 公開頁面路由 ---
router.get('/', (req, res) => res.render('index'));
router.get('/menu', (req, res) => res.render('menu'));
router.get('/order', (req, res) => res.render('order'));
router.get('/about', (req, res) => res.render('about'));
router.get('/contact', (req, res) => res.render('contact'));
router.get('/search', (req, res) => res.render('search'));

// --- 3. 登入相關路由 ---
router.get('/admin/login', (req, res) => res.render('admin/login'));
router.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    // 從環境變數讀取帳密
    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
        req.session.isAdmin = true;
        res.redirect('/admin/products');
    } else {
        res.render('admin/login', { error: '帳號或密碼錯誤' });
    }
});
router.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

// --- 4. 受保護的後台管理頁面 ---
router.get('/admin/products', checkAuth, (req, res) => res.render('admin/products'));
router.get('/admin/orders', checkAuth, (req, res) => res.render('admin/orders'));

// --- 5. 公開 API 路由 (前台使用) ---
router.get('/api/products', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (err) { res.status(500).json([]); }
});

router.post('/api/orders', async (req, res) => {
    try {
        const { customer_name, phone, pickup_date, cake_item_string, notes } = req.body;
        const newOrder = await Order.create({ 
            customer_name, phone, pickup_date, cake_item_string, notes 
        });
        res.status(201).json({ message: '訂購成功', orderId: newOrder.id });
    } catch (err) { res.status(500).json({ message: '伺服器出錯' }); }
});

router.get('/api/orders/search', async (req, res) => {
    try {
        const orders = await Order.findAll({ 
            where: { phone: req.query.phone }, 
            order: [['createdAt', 'DESC']] 
        });
        res.json(orders);
    } catch (err) { res.status(500).json([]); }
});

// --- 6. 受保護的管理端 API (後台使用) ---
router.use('/api/admin', checkAuth);

// 訂單 API (取得/更新/刪除)
router.get('/api/admin/orders', async (req, res) => {
    try {
        const orders = await Order.findAll({ order: [['createdAt', 'DESC']] });
        res.json(orders);
    } catch (err) { res.status(500).json([]); }
});

router.put('/api/admin/orders/:id', async (req, res) => {
    try {
        const { customer_name, phone, pickup_date, notes } = req.body;
        await Order.update(
            { customer_name, phone, pickup_date, notes },
            { where: { id: req.params.id } }
        );
        res.json({ message: '更新成功' });
    } catch (err) { res.status(500).json({ message: '更新失敗' }); }
});

router.delete('/api/admin/orders/:id', async (req, res) => {
    try {
        await Order.destroy({ where: { id: req.params.id } });
        res.json({ message: '刪除成功' });
    } catch (err) { res.status(500).json({ message: '刪除失敗' }); }
});

// 商品 API (新增/更新/刪除)
router.post('/api/admin/products', async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
    } catch (err) { res.status(500).json({ message: '新增失敗' }); }
});

router.put('/api/admin/products/:id', async (req, res) => {
    try {
        await Product.update(req.body, { where: { id: req.params.id } });
        res.json({ message: '更新成功' });
    } catch (err) { res.status(500).json({ message: '更新失敗' }); }
});

router.delete('/api/admin/products/:id', async (req, res) => {
    try {
        await Product.destroy({ where: { id: req.params.id } });
        res.json({ message: '刪除成功' });
    } catch (err) { res.status(500).json({ message: '刪除失敗' }); }
});

module.exports = router;