let allProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartBadge();

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            const filtered = allProducts.filter(p => p.name.toLowerCase().includes(term));
            renderProducts(filtered);
        });
    }
});

async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        const data = await response.json();
        allProducts = data;
        renderProducts(allProducts);
    } catch (error) {
        console.error("載入失敗", error);
    }
}

function renderProducts(items) {
    const list = document.getElementById('product-list');
    list.innerHTML = '';

    items.forEach(product => {
        // 使用 1 或 true 進行判斷
        const hotBadge = product.is_featured ? `<div class="tag-hot">HOT</div>` : '';

        const card = `
            <div class="product-card" style="position: relative; background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.05); border: 1px solid #f0f0f0;">
                ${hotBadge}
                <div style="height: 280px; overflow: hidden;">
                    <img src="${product.img}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='img/logo.png'">
                </div>
                <div style="padding: 25px; text-align: center;">
                    <h3 style="font-family: 'Playfair Display'; margin-bottom: 8px;">${product.name}</h3>
                    <p style="color: #8b5e3c; font-size: 1.3rem; font-weight: bold; margin-bottom: 12px;">$${product.price}</p>
                    <p style="color: #888; font-size: 0.85rem; min-height: 40px; margin-bottom: 20px;">${product.description || ''}</p>
                    <button class="btn" onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.img}')" style="width: 100%; background: #8b5e3c; color: white; border: none; padding: 12px; border-radius: 8px; cursor: pointer;">加入購物車</button>
                </div>
            </div>
        `;
        list.innerHTML += card;
    });
}

// 購物車與彈窗邏輯 (維持不變)
function addToCart(id, name, price, img) {
    let cart = JSON.parse(localStorage.getItem('cake_cart')) || [];
    const idx = cart.findIndex(i => i.id === id);
    if (idx > -1) cart[idx].quantity += 1;
    else cart.push({ id, name, price, img, quantity: 1 });
    localStorage.setItem('cake_cart', JSON.stringify(cart));
    updateCartBadge();
}

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cake_cart')) || [];
    const count = cart.reduce((s, i) => s + i.quantity, 0);
    document.getElementById('cart-badge').innerText = count;
}

function toggleCartModal() {
    const overlay = document.getElementById('cartModalOverlay');
    if (overlay.style.display === 'block') { overlay.style.display = 'none'; }
    else { renderCartModal(); overlay.style.display = 'block'; }
}

function closeCartOnOverlay(e) { if (e.target.id === 'cartModalOverlay') toggleCartModal(); }

function renderCartModal() {
    const cart = JSON.parse(localStorage.getItem('cake_cart')) || [];
    const container = document.getElementById('cartModalItems');
    const totalDisplay = document.getElementById('modalTotalAmount');
    container.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:20px;">購物車空空如也...</p>';
    } else {
        cart.forEach(item => {
            total += item.price * item.quantity;
            container.innerHTML += `
                <div class="cart-item-row">
                    <span>${item.name} x ${item.quantity}</span>
                    <span>
                        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                        <span class="delete-item" onclick="removeItem(${item.id})">刪除</span>
                    </span>
                </div>
            `;
        });
    }
    totalDisplay.innerText = `總計: $${total}`;
}

function changeQty(id, delta) {
    let cart = JSON.parse(localStorage.getItem('cake_cart')) || [];
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) return removeItem(id);
    }
    localStorage.setItem('cake_cart', JSON.stringify(cart));
    updateCartBadge(); renderCartModal();
}

function removeItem(id) {
    let cart = JSON.parse(localStorage.getItem('cake_cart')) || [];
    cart = cart.filter(i => i.id !== id);
    localStorage.setItem('cake_cart', JSON.stringify(cart));
    updateCartBadge(); renderCartModal();
}

function goToCheckout() { window.location.href = '/order'; }