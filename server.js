const express = require('express');
const path = require('path');
const sequelize = require('./config/db');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Order = require('./models/Order'); 

const app = express();

// 設定 EJS 模板引擎
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 設定靜態檔案路徑 (CSS, JS, Images)
app.use(express.static(path.join(__dirname, 'public')));

/// --- 頁面路由 ---
app.get('/', (req, res) => res.render('index'));
app.get('/menu', (req, res) => res.render('menu'));
app.get('/order', (req, res) => res.render('order'));
app.get('/about', (req, res) => res.render('about'));
app.get('/contact', (req, res) => res.render('contact'));
app.get('/search', (req, res) => res.render('search'));

// --- API 路由 (給前端 JS 呼叫) ---
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


// --- 同步資料庫並啟動 ---
const PORT = process.env.PORT || 3000;

// 將 force 改為 false，這非常重要！
sequelize.sync({ force: false }).then(() => {
    console.log('資料庫已同步');

    app.listen(PORT, () => {
        console.log(`CakeLab server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('資料庫同步失敗:', err);
});
