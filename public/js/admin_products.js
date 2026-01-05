document.addEventListener('DOMContentLoaded', () => {
    loadAdminProducts();
});

// 1. 載入所有商品
async function loadAdminProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        const tbody = document.getElementById('adminProductList');
        tbody.innerHTML = '';

        products.forEach(p => {
            const row = `
                <tr>
                    <td>${p.id}</td>
                    <td><img src="/${p.img}" style="width: 50px; height: 50px; object-fit: cover;"></td>
                    <td>${p.name}</td>
                    <td>$${p.price}</td>
                    <td>${p.is_featured ? '<span class="tag-hot-admin">HOT</span>' : '普通'}</td>
                    <td>
                        <button onclick="toggleFeatured(${p.id}, ${p.is_featured})" style="cursor:pointer;">切換推薦</button>
                        <button onclick="deleteProduct(${p.id})" style="color:red; cursor:pointer; margin-left:10px;">刪除</button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (err) {
        console.error("載入商品失敗:", err);
    }
}

// 2. 新增商品
async function addProduct(event) {
    event.preventDefault();
    const formData = {
        name: document.getElementById('newName').value,
        price: document.getElementById('newPrice').value,
        img: document.getElementById('newImg').value,
        description: document.getElementById('newDesc').value,
        is_featured: document.getElementById('newFeatured').checked ? 1 : 0
    };

    try {
        const response = await fetch('/api/admin/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            alert('商品新增成功！');
            loadAdminProducts(); 
            event.target.reset(); 
        }
    } catch (err) {
        alert('新增失敗');
    }
}

// 3. 切換推薦狀態
async function toggleFeatured(id, currentStatus) {
    try {
        const response = await fetch(`/api/admin/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_featured: !currentStatus })
        });
        if (response.ok) loadAdminProducts();
    } catch (err) {
        alert('切換失敗');
    }
}

// 4. 刪除商品
async function deleteProduct(id) {
    if (!confirm('確定要永久刪除這個蛋糕嗎？')) return;
    try {
        const response = await fetch(`/api/admin/products/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) loadAdminProducts();
    } catch (err) {
        alert('刪除失敗');
    }
}