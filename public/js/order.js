let cartItems = [];

// 載入購物車
window.addEventListener('load', () => {
    cartItems = JSON.parse(localStorage.getItem('cake_cart')) || [];
    renderTable();
});

function renderTable() {
    const tbody = document.getElementById('cartTableBody');
    tbody.innerHTML = ''; 
    let grandTotal = 0;

    if (cartItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="padding: 40px; text-align:center;">購物車目前是空的，請先至<a href="/menu" style="color:#8B5E3C;">商品目錄</a>選購。</td></tr>';
        document.getElementById('displayTotal').innerText = "$0";
        return;
    }

    cartItems.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        grandTotal += subtotal;

        const row = `
            <tr>
                <td><img src="${item.img}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px;"></td>
                <td style="font-weight: bold;">${item.name}</td>
                <td>$${item.price}</td>
                <td>
                    <input type="number" class="qty-input" value="${item.quantity}" min="1" 
                           style="width: 50px; text-align: center;"
                           onchange="updateQuantity(${index}, this.value)">
                </td>
                <td style="font-weight:bold; color: #8b5e3c;">$${subtotal}</td>
                <td>
                    <button type="button" onclick="removeItem(${index})" style="background:none; border:none; color:#e74c3c; cursor:pointer;">刪除</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    document.getElementById('displayTotal').innerText = "$" + grandTotal;
}

function updateQuantity(index, newQty) {
    const qty = parseInt(newQty);
    if (qty < 1) return;
    cartItems[index].quantity = qty;
    localStorage.setItem('cake_cart', JSON.stringify(cartItems));
    renderTable();
}

function removeItem(index) {
    if(confirm('確定要移除此商品嗎？')) {
        cartItems.splice(index, 1);
        localStorage.setItem('cake_cart', JSON.stringify(cartItems));
        renderTable();
    }
}

// 送出訂單
document.getElementById('orderForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    if (cartItems.length === 0) {
        alert('購物車是空的，無法結帳！');
        return;
    }

    const itemsString = cartItems.map(item => `${item.name} x ${item.quantity}`).join(', ');
    const total = document.getElementById('displayTotal').innerText;
    const finalOrderDetails = `${itemsString} (總計: ${total})`;

    const formData = {
        customer_name: document.getElementById('customer_name').value,
        phone: document.getElementById('phone').value,
        pickup_date: document.getElementById('pickup_date').value,
        cake_item_string: finalOrderDetails,
        notes: document.getElementById('notes') ? document.getElementById('notes').value : ""
    };

    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        if(response.ok) {
            alert('🎉 訂購成功！感謝您的預約。');
            localStorage.removeItem('cake_cart'); 
            window.location.href = '/'; 
        } else {
            const error = await response.json();
            alert('訂購失敗：' + error.message);
        }
    } catch (error) {
        console.error("提交出錯:", error);
        alert('系統連線錯誤，請確認伺服器運作中。');
    }
});

// 後台新增訂單
async function adminAddOrder(event) {
    event.preventDefault();
    const formData = {
        customer_name: document.getElementById('adminCustName').value,
        phone: document.getElementById('adminCustPhone').value,
        pickup_date: document.getElementById('adminDate').value,
        cake_item_string: document.getElementById('adminItems').value, // 格式如: 紅絲絨 x 1
        notes: document.getElementById('adminNotes').value
    };

    try {
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            alert('後台手動下單成功');
            loadAllOrders(); 
        }
    } catch (err) {
        alert('下單失敗');
    }
}