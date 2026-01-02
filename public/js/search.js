async function searchOrder() {
            const phone = document.getElementById('searchPhone').value;
            const resultArea = document.getElementById('resultArea');

            if(!phone) {
                alert('請輸入電話號碼');
                return;
            }

            resultArea.innerHTML = '<p class="text-center">查詢中...</p>';

            try {
                // 呼叫後端 API
                const response = await fetch(`/api/orders/search?phone=${phone}`);
                const orders = await response.json();

                resultArea.innerHTML = '';

                if (orders.length === 0) {
                    resultArea.innerHTML = '<p class="text-center" style="color: red;">查無此電話的訂單記錄。</p>';
                    return;
                }

                // 生成訂單表格
                let html = `
                    <table class="cart-table"> <thead>
                            <tr>
                                <th>訂單編號</th>
                                <th>下單日期</th>
                                <th>預計取貨</th>
                                <th>訂購內容</th>
                                <th>備註</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                orders.forEach(order => {
                    // 格式化日期
                    const createDate = new Date(order.created_at).toLocaleDateString();
                    const pickupDate = new Date(order.pickup_date).toLocaleDateString();

                    html += `
                        <tr>
                            <td>#${order.id}</td>
                            <td>${createDate}</td>
                            <td style="color: #8B5E3C; font-weight:bold;">${pickupDate}</td>
                            <td style="text-align: left; max-width: 300px;">${order.cake_item}</td>
                            <td>${order.notes || '-'}</td>
                        </tr>
                    `;
                });

                html += '</tbody></table>';
                resultArea.innerHTML = html;

            } catch (error) {
                console.error(error);
                resultArea.innerHTML = '<p class="text-center">系統發生錯誤，請稍後再試。</p>';
            }
        }