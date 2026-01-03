let allOrders = [];
    window.onload = loadAllOrders;

    async function loadAllOrders() {
        try {
            const res = await fetch('/api/admin/orders');
            if (res.status === 401) return window.location.href = '/admin/login';
            allOrders = await res.json();
            const tbody = document.getElementById('adminOrderTable');
            tbody.innerHTML = allOrders.map(order => `
                <tr>
                    <td style="font-weight:bold;">#${order.id}</td>
                    <td>${order.customer_name}</td>
                    <td>${order.phone}</td>
                    <td style="color:#8b5e3c; font-weight:bold;">${order.pickup_date}</td>
                    <td style="font-size:0.85rem; max-width:250px;">${order.cake_item_string}</td>
                    <td style="color:#888;">${order.notes || '-'}</td>
                    <td>
                        <button class="btn-edit" onclick="openEditModal(${order.id})">修改</button>
                        <button class="btn-delete" onclick="deleteOrder(${order.id})">刪除</button>
                    </td>
                </tr>
            `).join('');
        } catch (err) { console.error('載入失敗:', err); }
    }

    function openEditModal(id) {
        const order = allOrders.find(o => o.id === id);
        if (order) {
            document.getElementById('editId').value = order.id;
            document.getElementById('editName').value = order.customer_name;
            document.getElementById('editPhone').value = order.phone;
            document.getElementById('editDate').value = order.pickup_date;
            document.getElementById('editNotes').value = order.notes || '';
            document.getElementById('editModal').style.display = 'flex';
        }
    }

    function closeModal() { document.getElementById('editModal').style.display = 'none'; }

    async function submitEdit() {
        const id = document.getElementById('editId').value;
        const data = {
            customer_name: document.getElementById('editName').value,
            phone: document.getElementById('editPhone').value,
            pickup_date: document.getElementById('editDate').value,
            notes: document.getElementById('editNotes').value
        };

        try {
            const res = await fetch('/api/admin/orders/' + id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            if (res.ok) {
                alert('🎉 訂單資料已更新成功！');
                closeModal();
                loadAllOrders();
            } else if (res.status === 401) {
                alert('登入已逾時，請重新登入');
                window.location.href = '/admin/login';
            } else {
                alert('儲存失敗，請檢查輸入內容');
            }
        } catch (err) { alert('系統錯誤，無法連線'); }
    }

    async function deleteOrder(id) {
        if (!confirm('⚠️ 確定要永久刪除這筆訂單嗎？')) return;
        try {
            const res = await fetch('/api/admin/orders/' + id, { method: 'DELETE' });
            if (res.ok) { alert('訂單已移除'); loadAllOrders(); }
        } catch (err) { alert('刪除失敗'); }
    }
