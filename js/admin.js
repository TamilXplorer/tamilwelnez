(function () {
    "use strict";

    const viewport = document.getElementById("admin-viewport");

    // ==========================================================================
    // 1. STATE MANAGEMENT DATABASE (localStorage backed)
    // ==========================================================================

    // ==========================================================================
    // Supabase Cloud Sync Engine
    // ==========================================================================
    const supabaseUrl = "https://lafbbubclfhpqdeqflrl.supabase.co";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhZmJidWJjbGZocHFkZXFmbHJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyODgwNDUsImV4cCI6MjA5OTg2NDA0NX0.hKHmcnd1ia9o5P7M4O9uOz8_OvzzCmoHIuIps4CTzgM";
    let db = null;
    if (typeof supabase !== 'undefined') {
        db = supabase.createClient(supabaseUrl, supabaseKey);
    }

    const syncFromSupabase = async () => {
        if (!db) return;
        try {
            // 1. Sync Products
            const { data: dbProducts, error: prodErr } = await db.from('products').select('*');
            if (dbProducts && !prodErr && dbProducts.length > 0) {
                const mappedProducts = dbProducts.map(p => ({
                    id: p.id,
                    name: p.name,
                    category: p.category,
                    price: p.price,
                    comparePrice: p.compare_price,
                    stock: p.stock,
                    image: p.image,
                    video: p.video,
                    skinType: p.skin_type,
                    description: p.description,
                    benefits: p.benefits || [],
                    ingredients: p.ingredients,
                    howToUse: p.how_to_use
                }));
                localStorage.setItem("wellnez_products", JSON.stringify(mappedProducts));
            }

            // 2. Sync Coupons
            const { data: dbCoupons, error: coupErr } = await db.from('coupons').select('*');
            if (dbCoupons && !coupErr && dbCoupons.length > 0) {
                const mappedCoupons = dbCoupons.map(c => ({
                    code: c.code,
                    discountType: c.discount_type,
                    value: c.value,
                    minPurchase: c.min_purchase
                }));
                localStorage.setItem("wellnez_coupons", JSON.stringify(mappedCoupons));
            }

            // 3. Sync Orders
            const { data: dbOrders, error: ordErr } = await db.from('orders').select('*').order('created_at', { ascending: false });
            if (dbOrders && !ordErr) {
                const mappedOrders = dbOrders.map(o => ({
                    id: o.id,
                    date: o.date,
                    customerName: o.customer_name,
                    customerEmail: o.customer_email,
                    shippingAddress: o.shipping_address,
                    items: o.items,
                    subtotal: o.subtotal,
                    discount: o.discount,
                    shippingCharge: o.shipping_charge,
                    total: o.total,
                    paymentMethod: o.payment_method,
                    pincode: o.pincode,
                    status: o.status
                }));
                localStorage.setItem("wellnez_orders", JSON.stringify(mappedOrders));
            }

            // 4. Sync Settings
            const { data: dbSettings, error: setErr } = await db.from('settings').select('*');
            if (dbSettings && !setErr) {
                dbSettings.forEach(s => {
                    if (s.key === 'wellnez_payments') {
                        localStorage.setItem("wellnez_payments", JSON.stringify(s.value));
                    } else if (s.key === 'wellnez_upi') {
                        localStorage.setItem("wellnez_upi", JSON.stringify(s.value));
                    }
                });
            }
        } catch (err) {
            console.error("Supabase admin sync failed:", err);
        }
    };

    const Store = {
        getProducts() {
            return JSON.parse(localStorage.getItem("wellnez_products")) || [];
        },
        getProductById(id) {
            return this.getProducts().find(p => p.id === id);
        },
        saveProducts(products) {
            localStorage.setItem("wellnez_products", JSON.stringify(products));
        },
        addProduct(product) {
            const products = this.getProducts();
            products.push(product);
            this.saveProducts(products);

            if (db) {
                db.from('products').insert([{
                    id: product.id,
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    compare_price: product.comparePrice,
                    stock: product.stock,
                    image: product.image,
                    video: product.video,
                    skin_type: product.skinType,
                    description: product.description,
                    benefits: product.benefits,
                    ingredients: product.ingredients,
                    how_to_use: product.howToUse
                }]).then(({ error }) => {
                    if (error) console.error("Error adding product to Supabase:", error);
                });
            }
        },
        updateProduct(updatedProduct) {
            let products = this.getProducts();
            products = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
            this.saveProducts(products);

            if (db) {
                db.from('products').update({
                    name: updatedProduct.name,
                    category: updatedProduct.category,
                    price: updatedProduct.price,
                    compare_price: updatedProduct.comparePrice,
                    stock: updatedProduct.stock,
                    image: updatedProduct.image,
                    video: updatedProduct.video,
                    skin_type: updatedProduct.skinType,
                    description: updatedProduct.description,
                    benefits: updatedProduct.benefits,
                    ingredients: updatedProduct.ingredients,
                    how_to_use: updatedProduct.howToUse
                }).eq('id', updatedProduct.id).then(({ error }) => {
                    if (error) console.error("Error updating product on Supabase:", error);
                });
            }
        },
        deleteProduct(id) {
            let products = this.getProducts();
            products = products.filter(p => p.id !== id);
            this.saveProducts(products);

            if (db) {
                db.from('products').delete().eq('id', id).then(({ error }) => {
                    if (error) console.error("Error deleting product from Supabase:", error);
                });
            }
        },
        getOrders() {
            return JSON.parse(localStorage.getItem("wellnez_orders")) || [];
        },
        updateOrderStatus(orderId, status) {
            let orders = this.getOrders();
            orders = orders.map(o => {
                if (o.id === orderId) {
                    o.status = status;
                }
                return o;
            });
            localStorage.setItem("wellnez_orders", JSON.stringify(orders));

            if (db) {
                db.from('orders').update({ status }).eq('id', orderId).then(({ error }) => {
                    if (error) console.error("Error updating order status on Supabase:", error);
                });
            }
        },
        getCoupons() {
            return JSON.parse(localStorage.getItem("wellnez_coupons")) || [];
        },
        saveCoupons(coupons) {
            localStorage.setItem("wellnez_coupons", JSON.stringify(coupons));
        },
        addCoupon(coupon) {
            const coupons = this.getCoupons();
            coupons.push(coupon);
            this.saveCoupons(coupons);

            if (db) {
                db.from('coupons').insert([{
                    code: coupon.code,
                    discount_type: coupon.discountType,
                    value: coupon.value,
                    min_purchase: coupon.minPurchase
                }]).then(({ error }) => {
                    if (error) console.error("Error adding coupon to Supabase:", error);
                });
            }
        },
        deleteCoupon(code) {
            let coupons = this.getCoupons();
            coupons = coupons.filter(c => c.code !== code);
            this.saveCoupons(coupons);

            if (db) {
                db.from('coupons').delete().eq('code', code).then(({ error }) => {
                    if (error) console.error("Error deleting coupon from Supabase:", error);
                });
            }
        },
        getPaymentMethods() {
            return JSON.parse(localStorage.getItem("wellnez_payments")) || [
                { id: "cod", name: "Cash on Delivery", icon: "fa-solid fa-hand-holding-dollar", enabled: true },
                { id: "card", name: "Credit/Debit Card", icon: "fa-solid fa-credit-card", enabled: true },
                { id: "upi", name: "UPI Pay (GPay / PhonePe / Paytm)", icon: "fa-solid fa-qrcode", enabled: true }
            ];
        },
        togglePaymentMethod(id) {
            const methods = this.getPaymentMethods();
            const m = methods.find(x => x.id === id);
            if (m) {
                m.enabled = !m.enabled;
                localStorage.setItem("wellnez_payments", JSON.stringify(methods));

                if (db) {
                    db.from('settings').upsert({ key: 'wellnez_payments', value: methods }).then(({ error }) => {
                        if (error) console.error("Error saving payment settings to Supabase:", error);
                    });
                }
            }
        },
        getUPISettings() {
            return JSON.parse(localStorage.getItem("wellnez_upi")) || { upiId: "", qrBase64: "" };
        },
        saveUPISettings(upiId, qrBase64) {
            const settingsData = { upiId, qrBase64 };
            localStorage.setItem("wellnez_upi", JSON.stringify(settingsData));

            if (db) {
                db.from('settings').upsert({ key: 'wellnez_upi', value: settingsData }).then(({ error }) => {
                    if (error) console.error("Error saving UPI settings to Supabase:", error);
                });
            }
        },
        getAdminKPIs() {
            const orders = this.getOrders();
            const products = this.getProducts();
            const totalRevenue = orders.filter(o => o.status === "Delivered" || o.status === "Shipped" || o.status === "Processing").reduce((sum, o) => sum + o.total, 0);
            const totalOrders = orders.length;
            const pendingOrders = orders.filter(o => o.status === "Processing" || o.status === "Pending").length;
            const stockAlerts = products.filter(p => p.stock <= 5).length;
            return { totalRevenue, totalOrders, pendingOrders, stockAlerts };
        },
        getSalesGraphData() {
            const orders = this.getOrders();
            const data = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateStr = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
                
                const matchStr = d.toISOString().split('T')[0];
                const daySales = orders
                    .filter(o => o.date.startsWith(matchStr) || o.date === matchStr)
                    .reduce((sum, o) => sum + o.total, 0);
                
                data.push({ date: dateStr, sales: daySales });
            }
            return data;
        },
        getCustomers() {
            const orders = this.getOrders();
            const customersMap = {};
            orders.forEach(o => {
                const email = o.customerEmail || "walkin@wellnez.com";
                if (!customersMap[email]) {
                    customersMap[email] = {
                        name: o.customerName,
                        email: email,
                        phone: o.customerPhone || "N/A",
                        totalSpent: 0,
                        ordersCount: 0
                    };
                }
                customersMap[email].totalSpent += o.total;
                customersMap[email].ordersCount += 1;
            });
            return Object.values(customersMap);
        }
    };

    // ==========================================================================
    // 2. TOAST NOTIFICATION SYSTEM
    // ==========================================================================

    const showToast = (message, type = "success") => {
        const container = document.getElementById("toast-container");
        if (!container) return;
        
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${type === "success" ? "fa-solid fa-circle-check" : "fa-solid fa-circle-exclamation"}"></i>
            </div>
            <div class="toast-message">${message}</div>
        `;
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(20px)";
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    };

    // ==========================================================================
    // 3. GRAPHICS CHART RENDERER
    // ==========================================================================

    const renderSalesChart = () => {
        const salesData = Store.getSalesGraphData();
        const maxVal = Math.max(...salesData.map(d => d.sales), 5000);
        
        const chartWidth = 500;
        const chartHeight = 200;
        const paddingLeft = 60;
        const paddingBottom = 30;
        const paddingTop = 10;
        const paddingRight = 20;

        const graphWidth = chartWidth - paddingLeft - paddingRight;
        const graphHeight = chartHeight - paddingTop - paddingBottom;
        const barWidth = Math.round((graphWidth / salesData.length) - 20);

        const barsHtml = salesData.map((d, i) => {
            const valPct = d.sales / maxVal;
            const barHeight = Math.round(graphHeight * valPct);
            const x = Math.round(paddingLeft + i * (graphWidth / salesData.length) + 10);
            const y = Math.round(chartHeight - paddingBottom - barHeight);

            return `
                <g>
                    <rect class="chart-bar" x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="2" ry="2" style="fill:#000000;" />
                    <text class="chart-text" x="${x + barWidth/2}" y="${y - 5}" text-anchor="middle" font-weight="700" fill="var(--text-main)" style="font-size:10px; font-family:sans-serif;">₹${d.sales}</text>
                    <text class="chart-text" x="${x + barWidth/2}" y="${chartHeight - 10}" text-anchor="middle" style="font-size:10px; font-family:sans-serif; fill:var(--text-muted);">${d.date}</text>
                </g>
            `;
        }).join("");

        const gridLabels = [0, Math.round(maxVal / 2), maxVal].map(val => {
            const valPct = val / maxVal;
            const y = Math.round(chartHeight - paddingBottom - (graphHeight * valPct));
            return `
                <line class="chart-grid-line" x1="${paddingLeft}" y1="${y}" x2="${chartWidth - paddingRight}" y2="${y}" style="stroke:var(--border-color); stroke-dasharray:3;" />
                <text class="chart-text" x="${paddingLeft - 10}" y="${y + 4}" text-anchor="end" style="font-size:10px; font-family:sans-serif; fill:var(--text-muted);">₹${val}</text>
            `;
        }).join("");

        return `
            <svg viewBox="0 0 ${chartWidth} ${chartHeight}" class="chart-svg" style="width:100%; height:100%;">
                ${gridLabels}
                <line class="chart-axis-line" x1="${paddingLeft}" y1="${paddingTop}" x2="${paddingLeft}" y2="${chartHeight - paddingBottom}" style="stroke:var(--border-color);" />
                <line class="chart-axis-line" x1="${paddingLeft}" y1="${chartHeight - paddingBottom}" x2="${chartWidth - paddingRight}" y2="${chartHeight - paddingBottom}" style="stroke:var(--border-color);" />
                ${barsHtml}
            </svg>
        `;
    };

    // ==========================================================================
    // 4. SUBVIEW TAB RENDERERS (Module scope)
    // ==========================================================================

    const renderDashboardTab = () => {
        const recentOrders = Store.getOrders().slice(0, 5);
        const orderRows = recentOrders.map(o => `
            <tr>
                <td style="padding:12px;"><strong style="font-family:var(--font-heading);">${o.id}</strong></td>
                <td style="padding:12px;">${o.customerName}</td>
                <td style="padding:12px;">₹${o.total}</td>
                <td style="padding:12px;"><span class="status-badge ${o.status.toLowerCase()}" style="padding:4px 8px; border-radius:2px; font-size:0.75rem; font-weight:700; background:#000000; color:#FFFFFF;">${o.status}</span></td>
                <td style="padding:12px;">${o.date}</td>
            </tr>
        `).join("");

        return `
            <div class="admin-main-grid" style="display:grid; grid-template-columns: 2fr 1fr; gap:30px; margin-bottom:30px;">
                <div class="admin-section-box" style="background:#FFF; padding:25px; border:1px solid var(--border-color); border-radius:8px;">
                    <h3>Daily Sales Trend</h3>
                    <div class="chart-container" style="height:220px; margin-top:20px;">${renderSalesChart()}</div>
                </div>
                <div class="admin-section-box" style="background:#FFF; padding:25px; border:1px solid var(--border-color); border-radius:8px; display:flex; flex-direction:column; gap:15px; justify-content:center;">
                    <h3>Operations</h3>
                    <button class="btn btn-chrome btn-block admin-quick-nav" data-tab="products" style="height:45px; background:#000000; color:#FFFFFF; border:none; border-radius:4px; font-weight:700; cursor:pointer;"><i class="fa-solid fa-plus"></i> Add Product</button>
                    <button class="btn btn-secondary btn-block admin-quick-nav" data-tab="orders" style="height:45px; background:#FAFAFA; border:1px solid var(--border-color); border-radius:4px; font-weight:700; cursor:pointer;"><i class="fa-solid fa-boxes-packing"></i> Process Orders</button>
                    <button class="btn btn-outline btn-block admin-quick-nav" data-tab="coupons" style="height:45px; background:transparent; border:1px solid var(--border-dark); border-radius:4px; font-weight:700; cursor:pointer;"><i class="fa-solid fa-ticket"></i> Create Coupon</button>
                </div>
            </div>

            <div class="admin-section-box" style="background:#FFF; padding:25px; border:1px solid var(--border-color); border-radius:8px;">
                <h3>Recent Orders</h3>
                <div class="table-responsive" style="overflow-x:auto; margin-top:15px;">
                    <table class="admin-table" style="width:100%; border-collapse:collapse; text-align:left;">
                        <thead>
                            <tr style="background:#FAFAFA; border-bottom:1px solid var(--border-color); font-size:0.8rem; text-transform:uppercase;">
                                <th style="padding:12px;">Order ID</th>
                                <th style="padding:12px;">Customer</th>
                                <th style="padding:12px;">Total</th>
                                <th style="padding:12px;">Status</th>
                                <th style="padding:12px;">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orderRows ? orderRows : '<tr><td colspan="5" style="text-align:center; padding:20px;">No sales recorded yet.</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    };

    const renderProductsTab = () => {
        const products = Store.getProducts();
        const productRows = products.map(p => `
            <tr data-product-id="${p.id}" style="border-bottom:1px solid var(--border-color);">
                <td style="padding:12px;"><img src="${p.image}" alt="${p.name}" style="width:40px; height:40px; object-fit:contain; border:1px solid var(--border-color); padding:2px; background:#FFF;"></td>
                <td style="padding:12px;"><strong>${p.id}</strong></td>
                <td style="padding:12px;">${p.name}</td>
                <td style="padding:12px;">${p.category}</td>
                <td style="padding:12px;">₹${p.price}</td>
                <td style="padding:12px;">
                    <div class="stock-indicator" style="display:flex; align-items:center; gap:6px;">
                        <span class="stock-indicator-dot ${p.stock <= 5 ? 'low-stock' : 'in-stock'}" style="width:8px; height:8px; border-radius:50%; display:inline-block; background:${p.stock <= 5 ? '#e74c3c' : '#27ae60'};"></span>
                        <span>${p.stock} units</span>
                    </div>
                </td>
                <td style="padding:12px;">
                    <div style="display:flex; gap:8px;">
                        <button class="btn btn-outline edit-product-btn" data-id="${p.id}" style="padding:6px 10px; cursor:pointer; background:none; border:1px solid var(--border-dark); border-radius:3px;"><i class="fa-regular fa-pen-to-square"></i></button>
                        <button class="btn btn-outline delete-product-btn" data-id="${p.id}" style="padding:6px 10px; cursor:pointer; background:none; border:1px solid #d63031; color:#d63031; border-radius:3px;"><i class="fa-regular fa-trash-can"></i></button>
                    </div>
                </td>
            </tr>
        `).join("");

        return `
            <div class="admin-section-box" style="background:#FFF; padding:25px; border:1px solid var(--border-color); border-radius:8px;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:15px; margin-bottom:20px;">
                    <h3 style="border:none; margin:0;">Product Catalog</h3>
                    <button class="btn btn-chrome" id="add-product-open-btn" style="padding:10px 18px; background:#000000; color:#FFFFFF; border:none; border-radius:4px; font-weight:700; cursor:pointer;"><i class="fa-solid fa-plus"></i> Add Skincare Product</button>
                </div>
                <div class="table-responsive" style="overflow-x:auto;">
                    <table class="admin-table" style="width:100%; border-collapse:collapse; text-align:left;">
                        <thead>
                            <tr style="background:#FAFAFA; border-bottom:1px solid var(--border-color); font-size:0.8rem; text-transform:uppercase;">
                                <th style="padding:12px;">Image</th>
                                <th style="padding:12px;">SKU ID</th>
                                <th style="padding:12px;">Product Name</th>
                                <th style="padding:12px;">Category</th>
                                <th style="padding:12px;">Price</th>
                                <th style="padding:12px;">Stock</th>
                                <th style="padding:12px;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productRows ? productRows : '<tr><td colspan="7" style="text-align:center; padding:30px;">No skincare products found.</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    };

    const renderOrdersTab = () => {
        const orders = Store.getOrders();
        const orderRows = orders.map(o => `
            <tr style="border-bottom:1px solid var(--border-color);">
                <td style="padding:12px;"><strong style="font-family:var(--font-heading);">${o.id}</strong></td>
                <td style="padding:12px;">${o.customerName}</td>
                <td style="padding:12px;">₹${o.total}</td>
                <td style="padding:12px;">
                    <select class="admin-status-select" data-id="${o.id}" style="padding:6px; border-radius:3px; border:1px solid var(--border-color); font-weight:600; cursor:pointer;">
                        <option value="Pending" ${o.status === "Pending" ? "selected" : ""}>Pending</option>
                        <option value="Processing" ${o.status === "Processing" ? "selected" : ""}>Processing</option>
                        <option value="Shipped" ${o.status === "Shipped" ? "selected" : ""}>Shipped</option>
                        <option value="Delivered" ${o.status === "Delivered" ? "selected" : ""}>Delivered</option>
                        <option value="Cancelled" ${o.status === "Cancelled" ? "selected" : ""}>Cancelled</option>
                    </select>
                </td>
                <td style="padding:12px;">${o.date}</td>
                <td style="padding:12px;">
                    <button class="btn btn-outline view-order-details-btn" data-id="${o.id}" style="padding:6px 12px; cursor:pointer; background:none; border:1px solid var(--border-dark); border-radius:3px;"><i class="fa-regular fa-eye"></i> View</button>
                </td>
            </tr>
        `).join("");

        return `
            <div class="admin-section-box" style="background:#FFF; padding:25px; border:1px solid var(--border-color); border-radius:8px;">
                <h3 style="border-bottom:1px solid var(--border-color); padding-bottom:15px; margin-bottom:20px;">Customer Orders</h3>
                <div class="table-responsive" style="overflow-x:auto;">
                    <table class="admin-table" style="width:100%; border-collapse:collapse; text-align:left;">
                        <thead>
                            <tr style="background:#FAFAFA; border-bottom:1px solid var(--border-color); font-size:0.8rem; text-transform:uppercase;">
                                <th style="padding:12px;">Order ID</th>
                                <th style="padding:12px;">Customer</th>
                                <th style="padding:12px;">Total</th>
                                <th style="padding:12px;">Status</th>
                                <th style="padding:12px;">Date</th>
                                <th style="padding:12px;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orderRows ? orderRows : '<tr><td colspan="6" style="text-align:center; padding:30px;">No orders received yet.</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    };

    const renderCouponsTab = () => {
        const coupons = Store.getCoupons();
        const couponRows = coupons.map(c => `
            <tr style="border-bottom:1px solid var(--border-color);">
                <td style="padding:12px;"><strong>${c.code}</strong></td>
                <td style="padding:12px;">${c.discountType === "percentage" ? `${c.value}%` : `₹${c.value}`}</td>
                <td style="padding:12px;">₹${c.minPurchase}</td>
                <td style="padding:12px;">
                    <button class="btn btn-outline delete-coupon-btn" data-code="${c.code}" style="padding:6px 12px; cursor:pointer; background:none; border:1px solid #d63031; color:#d63031; border-radius:3px;"><i class="fa-regular fa-trash-can"></i> Delete</button>
                </td>
            </tr>
        `).join("");

        return `
            <div class="admin-main-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:30px;">
                <div class="admin-section-box" style="background:#FFF; padding:25px; border:1px solid var(--border-color); border-radius:8px;">
                    <h3>Create Promo Coupon</h3>
                    <form id="create-coupon-form" style="margin-top:15px; display:flex; flex-direction:column; gap:12px;">
                        <div class="form-group">
                            <label for="coupon-code" style="display:block; font-size:0.75rem; text-transform:uppercase; font-weight:700; margin-bottom:5px;">Coupon Code</label>
                            <input type="text" id="coupon-code" class="form-control" placeholder="WELLNEZ25" required style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:4px; text-transform:uppercase;">
                        </div>
                        <div class="form-group">
                            <label for="coupon-type" style="display:block; font-size:0.75rem; text-transform:uppercase; font-weight:700; margin-bottom:5px;">Discount Type</label>
                            <select id="coupon-type" class="form-control" style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:4px;">
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="flat">Flat Amount (₹)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="coupon-value" style="display:block; font-size:0.75rem; text-transform:uppercase; font-weight:700; margin-bottom:5px;">Discount Value</label>
                            <input type="number" id="coupon-value" class="form-control" placeholder="25" required min="1" style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:4px;">
                        </div>
                        <div class="form-group">
                            <label for="coupon-min" style="display:block; font-size:0.75rem; text-transform:uppercase; font-weight:700; margin-bottom:5px;">Minimum Purchase (₹)</label>
                            <input type="number" id="coupon-min" class="form-control" placeholder="999" value="0" min="0" style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:4px;">
                        </div>
                        <button type="submit" class="btn btn-chrome btn-block" style="margin-top:10px; height:45px; background:#000000; color:#FFFFFF; border:none; border-radius:4px; font-weight:700; cursor:pointer;"><i class="fa-solid fa-plus"></i> Create Coupon</button>
                    </form>
                </div>
                <div class="admin-section-box" style="background:#FFF; padding:25px; border:1px solid var(--border-color); border-radius:8px;">
                    <h3>Active Coupons</h3>
                    <div class="table-responsive" style="overflow-x:auto; margin-top:15px;">
                        <table class="admin-table" style="width:100%; border-collapse:collapse; text-align:left;">
                            <thead>
                                <tr style="background:#FAFAFA; border-bottom:1px solid var(--border-color); font-size:0.8rem; text-transform:uppercase;">
                                    <th style="padding:12px;">Code</th>
                                    <th style="padding:12px;">Discount</th>
                                    <th style="padding:12px;">Min Purchase</th>
                                    <th style="padding:12px;">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${couponRows ? couponRows : '<tr><td colspan="4" style="text-align:center; padding:20px;">No active promo coupons found.</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    };

    const renderPaymentsTab = () => {
        const methods = Store.getPaymentMethods();
        const upi = Store.getUPISettings();
        return `
            <div class="admin-section-box" style="background:#FFF; padding:25px; border:1px solid var(--border-color); border-radius:8px;">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:15px; margin-bottom:25px;">
                    <h3 style="border:none; margin:0;">Payment Methods</h3>
                    <span style="font-size:0.8rem; color:var(--text-muted); font-family:var(--font-heading);">Toggle to show/hide methods on customer checkout</span>
                </div>
                <div style="display:flex; flex-direction:column; gap:0;">
                    ${methods.map(m => `
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:20px 0; border-bottom:1px dashed var(--border-color);">
                        <div style="display:flex; align-items:center; gap:15px;">
                            <div style="width:44px; height:44px; border-radius:8px; border:1px solid var(--border-color); display:flex; align-items:center; justify-content:center; background:var(--bg-primary); font-size:1.2rem; background:#000000; color:#FFFFFF;">
                                <i class="${m.icon}"></i>
                            </div>
                            <div>
                                <div style="font-weight:700; font-family:var(--font-heading); text-transform:uppercase; font-size:0.85rem;">${m.name}</div>
                                <div style="font-size:0.75rem; color:var(--text-muted); margin-top:3px;">${m.enabled ? '<span style="color:#27ae60;"><i class="fa-solid fa-circle-check"></i> Active on checkout</span>' : '<span style="color:#e74c3c;"><i class="fa-solid fa-circle-xmark"></i> Hidden from customers</span>'}</div>
                            </div>
                        </div>
                        <label class="payment-toggle" style="display:flex; align-items:center; gap:10px; cursor:pointer;">
                            <span style="font-size:0.8rem; font-weight:600; color:var(--text-muted);">${m.enabled ? 'Enabled' : 'Disabled'}</span>
                            <div class="toggle-switch ${m.enabled ? 'on' : ''}" data-payment-id="${m.id}" style="width:46px; height:24px; border-radius:12px; background:${m.enabled ? '#000000' : '#CCCCCC'}; position:relative; transition:background-color 0.2s;">
                                <div class="toggle-thumb" style="width:18px; height:18px; border-radius:50%; background:#FFF; position:absolute; top:3px; left:${m.enabled ? '25px' : '3px'}; transition:left 0.2s;"></div>
                            </div>
                        </label>
                    </div>
                    `).join('')}
                </div>
            </div>

            <!-- UPI Settings Card -->
            <div class="admin-section-box" style="background:#FFF; padding:25px; border:1px solid var(--border-color); border-radius:8px; margin-top:25px;">
                <div style="display:flex; align-items:center; gap:12px; border-bottom:1px solid var(--border-color); padding-bottom:15px; margin-bottom:25px;">
                    <div style="width:40px; height:40px; border-radius:8px; background:#000000; color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-size:1.1rem;"><i class="fa-solid fa-qrcode"></i></div>
                    <div>
                        <h3 style="border:none; margin:0;">UPI Payment Settings</h3>
                        <p style="color:var(--text-muted); font-size:0.8rem; margin:0;">Set your UPI ID and QR code — shown to customers at checkout</p>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:35px; align-items:start;">
                    <form id="upi-settings-form" style="display:flex; flex-direction:column; gap:12px;">
                        <div class="form-group">
                            <label for="upi-id-input" style="display:block; font-size:0.75rem; text-transform:uppercase; font-weight:700; margin-bottom:5px;">UPI ID</label>
                            <input type="text" id="upi-id-input" class="form-control" placeholder="yourname@upi" value="${upi.upiId}" style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:4px;">
                            <p style="font-size:0.78rem; color:var(--text-muted); margin-top:6px;">e.g. wellnez@okicici, 9876543210@paytm</p>
                        </div>
                        <div class="form-group">
                            <label for="upi-qr-input" style="display:block; font-size:0.75rem; text-transform:uppercase; font-weight:700; margin-bottom:5px;">Upload QR Code Image</label>
                            <input type="file" id="upi-qr-input" class="form-control" accept="image/*" style="width:100%; padding:8px; border:1px solid var(--border-color); border-radius:4px;">
                            <p style="font-size:0.78rem; color:var(--text-muted); margin-top:6px;">PNG or JPG, recommended 400×400px</p>
                        </div>
                        <button type="submit" class="btn btn-chrome btn-block" style="height:45px; background:#000000; color:#FFFFFF; border:none; border-radius:4px; font-weight:700; cursor:pointer;"><i class="fa-solid fa-floppy-disk"></i> Save UPI Settings</button>
                    </form>

                    <div style="text-align:center;">
                        <p style="font-family:var(--font-heading); font-size:0.8rem; font-weight:700; text-transform:uppercase; margin-bottom:12px; color:var(--text-muted);">QR Preview</p>
                        ${upi.qrBase64
                            ? `<div style="border:1px solid var(--border-color); padding:15px; background:#FFF; display:inline-block;">
                                <img src="${upi.qrBase64}" alt="UPI QR Code" style="width:180px; height:180px; object-fit:contain; display:block;">
                               </div>
                               <p style="font-size:0.75rem; margin-top:10px; font-weight:600; color:#27ae60;"><i class="fa-solid fa-circle-check"></i> QR Code saved</p>
                               ${upi.upiId ? `<p style="font-size:0.8rem; margin-top:5px; color:var(--text-muted);">UPI ID: <strong>${upi.upiId}</strong></p>` : ''}`
                            : `<div style="border:2px dashed var(--border-color); padding:40px 20px; background:var(--bg-primary); color:var(--text-muted);">
                                <i class="fa-solid fa-qrcode" style="font-size:3rem; margin-bottom:12px; opacity:0.3;"></i>
                                <p style="font-size:0.85rem;">No QR code uploaded yet</p>
                               </div>`
                        }
                    </div>
                </div>
            </div>
        `;
    };

    const renderCustomersTab = () => {
        const customers = Store.getCustomers();
        const customerRows = customers.map(c => `
            <tr style="border-bottom:1px solid var(--border-color);">
                <td style="padding:12px;"><strong>${c.name}</strong></td>
                <td style="padding:12px;">${c.email}</td>
                <td style="padding:12px;">${c.phone}</td>
                <td style="padding:12px;">₹${c.totalSpent}</td>
                <td style="padding:12px;">${c.ordersCount} orders</td>
            </tr>
        `).join("");

        return `
            <div class="admin-section-box" style="background:#FFF; padding:25px; border:1px solid var(--border-color); border-radius:8px;">
                <h3 style="border-bottom:1px solid var(--border-color); padding-bottom:15px; margin-bottom:20px;">Customer Profiles</h3>
                <div class="table-responsive" style="overflow-x:auto;">
                    <table class="admin-table" style="width:100%; border-collapse:collapse; text-align:left;">
                        <thead>
                            <tr style="background:#FAFAFA; border-bottom:1px solid var(--border-color); font-size:0.8rem; text-transform:uppercase;">
                                <th style="padding:12px;">Customer Name</th>
                                <th style="padding:12px;">Email Address</th>
                                <th style="padding:12px;">Phone Number</th>
                                <th style="padding:12px;">Total Spent</th>
                                <th style="padding:12px;">Orders</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${customerRows ? customerRows : '<tr><td colspan="5" style="text-align:center; padding:30px;">No customers registered yet.</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    };

    // ==========================================================================
    // 5. MAIN PANEL RENDERER
    // ==========================================================================

    const renderLogin = () => {
        viewport.innerHTML = `
            <div style="min-height: calc(100vh - 200px); display: flex; align-items: center; justify-content: center; padding: 20px;">
                <div class="auth-card" style="max-width: 450px; width:100%; box-shadow: var(--shadow-lg); border: 1px solid var(--border-dark); background:#FFF; padding: 40px 30px; border-radius:8px;">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <span class="promo-badge" style="font-size: 0.7rem; font-weight:700; background:#000000; color:#FFFFFF; padding:4px 8px; border-radius:2px;">System Access Gate</span>
                        <h2 style="font-family: var(--font-heading); text-transform: uppercase; font-size: 1.5rem; margin-top: 15px; font-weight: 800;">Admin Console</h2>
                        <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 5px;">Enter merchant credentials to log in.</p>
                    </div>
                    <form id="admin-login-form">
                        <div class="form-group" style="margin-bottom:15px;">
                            <label for="admin-email" style="display:block; font-size:0.75rem; text-transform:uppercase; font-weight:700; margin-bottom:5px;">Admin Email</label>
                            <input type="email" id="admin-email" class="form-control" placeholder="admin@wellnez.com" required style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:4px;">
                        </div>
                        <div class="form-group" style="margin-bottom:20px;">
                            <label for="admin-password" style="display:block; font-size:0.75rem; text-transform:uppercase; font-weight:700; margin-bottom:5px;">Password</label>
                            <input type="password" id="admin-password" class="form-control" placeholder="••••••••" required style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:4px;">
                        </div>
                        <button type="submit" class="btn btn-chrome btn-block" style="margin-top:15px; height: 48px; width:100%; background:#000000; color:#FFFFFF; font-weight:700; border:none; border-radius:4px; cursor:pointer;">Authenticate Console</button>
                        <a href="index.html" class="btn btn-outline btn-block" style="margin-top:10px; height: 48px; display:flex; align-items:center; justify-content:center; width:100%; border:1px solid var(--border-dark); text-decoration:none; color:var(--text-main); font-weight:600; border-radius:4px;">Return to Store</a>
                    </form>
                    <div style="margin-top: 25px; border-top: 1px dashed var(--border-color); padding-top: 15px; font-size: 0.8rem; text-align: center; color: var(--text-muted);">
                        Demo Admin: <strong>admin@wellnez.com</strong> / <strong>password123</strong>
                    </div>
                </div>
            </div>
        `;
        bindLoginEvents();
    };

    const renderDashboard = () => {
        const kpis = Store.getAdminKPIs();
        const activeTab = getActiveTab();

        viewport.innerHTML = `
            <div class="admin-layout" style="max-width: 100% !important; padding-left: 4vw !important; padding-right: 4vw !important;">
                <div class="admin-header-row" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
                    <div>
                        <h1 style="margin: 0; font-size: 2rem;">your Wellnez Admin Panel</h1>
                    </div>
                </div>

                <div class="admin-container" style="display: grid; grid-template-columns: 240px 1fr; min-height: calc(100vh - 160px); gap:30px;">
                    <!-- Sidebar -->
                    <aside class="admin-sidebar" style="background: #FFFFFF; border: 1px solid var(--border-color); border-radius:8px; padding: 25px 15px; display: flex; flex-direction: column; gap: 20px; height:fit-content;">
                        <div style="font-family: var(--font-heading); font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; padding-left:12px;">Console Navigation</div>
                        <nav style="display: flex; flex-direction: column; gap: 5px;">
                            <a href="#" class="admin-nav-link ${activeTab === "dashboard" ? "active" : ""}" data-tab="dashboard" style="display: flex; align-items: center; gap: 10px; padding: 12px 15px; border-radius: 4px; text-decoration: none; color: var(--text-main); font-weight: 600; font-size: 0.85rem;"><i class="fa-solid fa-chart-line" style="width:20px;"></i> Overview</a>
                            <a href="#" class="admin-nav-link ${activeTab === "products" ? "active" : ""}" data-tab="products" style="display: flex; align-items: center; gap: 10px; padding: 12px 15px; border-radius: 4px; text-decoration: none; color: var(--text-main); font-weight: 600; font-size: 0.85rem;"><i class="fa-solid fa-spa" style="width:20px;"></i> Skincare Catalog</a>
                            <a href="#" class="admin-nav-link ${activeTab === "orders" ? "active" : ""}" data-tab="orders" style="display: flex; align-items: center; gap: 10px; padding: 12px 15px; border-radius: 4px; text-decoration: none; color: var(--text-main); font-weight: 600; font-size: 0.85rem;"><i class="fa-solid fa-boxes-packing" style="width:20px;"></i> Orders</a>
                            <a href="#" class="admin-nav-link ${activeTab === "coupons" ? "active" : ""}" data-tab="coupons" style="display: flex; align-items: center; gap: 10px; padding: 12px 15px; border-radius: 4px; text-decoration: none; color: var(--text-main); font-weight: 600; font-size: 0.85rem;"><i class="fa-solid fa-ticket" style="width:20px;"></i> Coupons</a>
                            <a href="#" class="admin-nav-link ${activeTab === "payments" ? "active" : ""}" data-tab="payments" style="display: flex; align-items: center; gap: 10px; padding: 12px 15px; border-radius: 4px; text-decoration: none; color: var(--text-main); font-weight: 600; font-size: 0.85rem;"><i class="fa-solid fa-credit-card" style="width:20px;"></i> Payments</a>
                            <a href="#" class="admin-nav-link ${activeTab === "customers" ? "active" : ""}" data-tab="customers" style="display: flex; align-items: center; gap: 10px; padding: 12px 15px; border-radius: 4px; text-decoration: none; color: var(--text-main); font-weight: 600; font-size: 0.85rem;"><i class="fa-solid fa-users" style="width:20px;"></i> Customers</a>
                        </nav>
                        <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 10px 0;">
                        <a href="#" id="admin-logout-btn" style="display: flex; align-items: center; gap: 10px; padding: 12px 15px; text-decoration: none; color: #d63031; font-weight: 600; font-size: 0.85rem;"><i class="fa-solid fa-arrow-right-from-bracket" style="width:20px;"></i> Sign Out</a>
                    </aside>
                    
                    <!-- Main Dashboard Panel -->
                    <main style="background:none; padding:0; display:flex; flex-direction:column; gap:25px;">
                        <!-- KPI Row -->
                        <div class="kpi-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
                            <div class="kpi-card" style="background: #FFFFFF; border: 1px solid var(--border-color); border-radius: 8px; padding: 20px 15px; display: flex; align-items: center; gap: 15px;">
                                <div style="width: 40px; height: 40px; border-radius: 50%; background: #000000; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;"><i class="fa-solid fa-indian-rupee-sign"></i></div>
                                <div>
                                    <div style="font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 700;">Revenue</div>
                                    <div style="font-size: 1.25rem; font-weight: 800; margin-top: 2px; font-family: var(--font-heading);">₹${kpis.totalRevenue}</div>
                                </div>
                            </div>
                            <div class="kpi-card" style="background: #FFFFFF; border: 1px solid var(--border-color); border-radius: 8px; padding: 20px 15px; display: flex; align-items: center; gap: 15px;">
                                <div style="width: 40px; height: 40px; border-radius: 50%; background: #000000; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;"><i class="fa-solid fa-shopping-bag"></i></div>
                                <div>
                                    <div style="font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 700;">Total Orders</div>
                                    <div style="font-size: 1.25rem; font-weight: 800; margin-top: 2px; font-family: var(--font-heading);">${kpis.totalOrders}</div>
                                </div>
                            </div>
                            <div class="kpi-card" style="background: #FFFFFF; border: 1px solid var(--border-color); border-radius: 8px; padding: 20px 15px; display: flex; align-items: center; gap: 15px;">
                                <div style="width: 40px; height: 40px; border-radius: 50%; background: #000000; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;"><i class="fa-solid fa-spinner"></i></div>
                                <div>
                                    <div style="font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 700;">Pending</div>
                                    <div style="font-size: 1.25rem; font-weight: 800; margin-top: 2px; font-family: var(--font-heading);">${kpis.pendingOrders}</div>
                                </div>
                            </div>
                            <div class="kpi-card" style="background: #FFFFFF; border: 1px solid var(--border-color); border-radius: 8px; padding: 20px 15px; display: flex; align-items: center; gap: 15px;">
                                <div style="width: 40px; height: 40px; border-radius: 50%; background: #000000; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-size: 1.1rem;"><i class="fa-solid fa-triangle-exclamation"></i></div>
                                <div>
                                    <div style="font-size: 0.68rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); font-weight: 700;">Stock Alerts</div>
                                    <div style="font-size: 1.25rem; font-weight: 800; margin-top: 2px; font-family: var(--font-heading); color: ${kpis.stockAlerts > 0 ? "#d63031" : "inherit"};">${kpis.stockAlerts}</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Content View Mount -->
                        <div id="admin-main-content">
                            <!-- Renders active view tab dynamically -->
                        </div>
                    </main>
                </div>
            </div>

            <!-- Product Add/Edit Dialog Modal -->
            <div class="modal-overlay" id="admin-product-modal">
                <div class="modal-content-card" style="max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto; padding: 30px;">
                    <button class="modal-close-btn" id="product-modal-close-btn">&times;</button>
                    <div class="modal-title" id="modal-product-title" style="font-size: 1.25rem; font-family: var(--font-heading); text-transform: uppercase; font-weight: 800; margin-bottom: 20px; border:none; padding:0;">Add New Skincare Product</div>
                    
                    <form id="admin-product-form" style="display: flex; flex-direction: column; gap: 15px;">
                        <input type="hidden" id="prod-form-mode" value="add">
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <div class="form-group">
                                <label for="prod-id" style="display:block; font-size:0.75rem; text-transform:uppercase; font-weight:700; margin-bottom:5px;">Product SKU ID</label>
                                <input type="text" id="prod-id" class="form-control" placeholder="slug-id (e.g. eye-gel)" required style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:4px;">
                            </div>
                            <div class="form-group">
                                <label for="prod-name" style="display:block; font-size:0.75rem; text-transform:uppercase; font-weight:700; margin-bottom:5px;">Product Name</label>
                                <input type="text" id="prod-name" class="form-control" placeholder="Peptide Glow Eye Gel" required style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:4px;">
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;">
                            <div class="form-group" style="grid-column: span 2;">
                                <label for="prod-category" style="display:block; font-size:0.75rem; text-transform:uppercase; font-weight:700; margin-bottom:5px;">Category</label>
                                <input type="text" id="prod-category" class="form-control" placeholder="Eye Care" required style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:4px;">
                            </div>
                            <div class="form-group">
                                <label for="prod-price" style="display:block; font-size:0.75rem; text-transform:uppercase; font-weight:700; margin-bottom:5px;">Price (₹)</label>
                                <input type="number" id="prod-price" class="form-control" placeholder="599" required min="1" style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:4px;">
                            </div>
                            <div class="form-group">
                                <label for="prod-stock" style="display:block; font-size:0.75rem; text-transform:uppercase; font-weight:700; margin-bottom:5px;">Stock Qty</label>
                                <input type="number" id="prod-stock" class="form-control" placeholder="25" required min="0" style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:4px;">
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                            <div class="form-group">
                                <label for="prod-compare" style="display:block; font-size:0.75rem; text-transform:uppercase; font-weight:700; margin-bottom:5px;">Compare Price (₹)</label>
                                <input type="number" id="prod-compare" class="form-control" placeholder="699" min="0" style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:4px;">
                            </div>
                            <div class="form-group">
                                <label for="prod-skin" style="display:block; font-size:0.75rem; text-transform:uppercase; font-weight:700; margin-bottom:5px;">Skin Target</label>
                                <input type="text" id="prod-skin" class="form-control" placeholder="All skin types, oily skin" required style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:4px;">
                            </div>
                        </div>

                        <div class="form-group">
                            <label style="display:block; font-size:0.75rem; text-transform:uppercase; font-weight:700; margin-bottom:5px;">Product Image Asset</label>
                            <input type="hidden" id="prod-image">
                            <div id="prod-img-upload-zone" style="border: 2px dashed var(--border-color); padding: 20px; border-radius: 6px; text-align: center; background: var(--bg-primary); cursor: pointer;">
                                <input type="file" id="prod-img-file" accept="image/*" style="display: none;">
                                <div id="prod-img-preview-wrap">
                                    <i class="fa-solid fa-cloud-arrow-up" style="font-size:1.8rem; color:var(--text-muted); margin-bottom:6px;"></i>
                                    <p style="font-size:0.8rem; color:var(--text-muted); margin:0;">Click to upload image file</p>
                                </div>
                            </div>
                            <div style="margin-top: 10px;">
                                <label for="prod-image-url" style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Or Image URL</label>
                                <input type="text" id="prod-image-url" class="form-control" placeholder="images/custom-item.png" style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:4px;">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="prod-video" style="display:block; font-size:0.75rem; text-transform:uppercase; font-weight:700; margin-bottom:5px;">Product Video URL (MP4 Stream)</label>
                            <input type="text" id="prod-video" class="form-control" placeholder="https://player.vimeo.com/external/..." style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:4px; font-size: 0.8rem;">
                        </div>

                        <div class="form-group">
                            <label for="prod-desc" style="display:block; font-size:0.75rem; text-transform:uppercase; font-weight:700; margin-bottom:5px;">Description</label>
                            <textarea id="prod-desc" class="form-control" rows="3" placeholder="Description of the item..." required style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:4px; font-family:inherit;"></textarea>
                        </div>

                        <div class="form-group">
                            <label for="prod-benefits" style="display:block; font-size:0.75rem; text-transform:uppercase; font-weight:700; margin-bottom:5px;">Key Benefits (comma separated)</label>
                            <input type="text" id="prod-benefits" class="form-control" placeholder="Repairs barrier, Soothes redness" required style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:4px;">
                        </div>

                        <div class="form-group">
                            <label for="prod-ingredients" style="display:block; font-size:0.75rem; text-transform:uppercase; font-weight:700; margin-bottom:5px;">Ingredients</label>
                            <textarea id="prod-ingredients" class="form-control" rows="2" placeholder="Water, Glycerin..." required style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:4px; font-family:inherit;"></textarea>
                        </div>

                        <div class="form-group">
                            <label for="prod-use" style="display:block; font-size:0.75rem; text-transform:uppercase; font-weight:700; margin-bottom:5px;">How to Use</label>
                            <textarea id="prod-use" class="form-control" rows="2" placeholder="Apply evenly onto damp skin..." required style="width:100%; padding:10px; border:1px solid var(--border-color); border-radius:4px; font-family:inherit;"></textarea>
                        </div>

                        <button type="submit" class="btn btn-chrome btn-block" style="height: 48px; background:#000000; color:#FFFFFF; border:none; border-radius:4px; font-weight:700; cursor:pointer; text-transform:uppercase;">Sync Skincare Details</button>
                    </form>
                </div>
            </div>
        `;
        bindDashboardEvents();
        renderDashboardContent();
    };

    const renderDashboardContent = () => {
        const activeTab = getActiveTab();
        const mainContent = document.getElementById("admin-main-content");
        if (!mainContent) return;

        if (activeTab === "dashboard") {
            mainContent.innerHTML = renderDashboardTab();
        } else if (activeTab === "products") {
            mainContent.innerHTML = renderProductsTab();
            bindProductEvents();
        } else if (activeTab === "orders") {
            mainContent.innerHTML = renderOrdersTab();
            bindOrderEvents();
        } else if (activeTab === "coupons") {
            mainContent.innerHTML = renderCouponsTab();
            bindCouponEvents();
        } else if (activeTab === "payments") {
            mainContent.innerHTML = renderPaymentsTab();
            bindPaymentEvents();
        } else if (activeTab === "customers") {
            mainContent.innerHTML = renderCustomersTab();
        }

        // Re-bind quick nav buttons
        document.querySelectorAll(".admin-quick-nav").forEach(btn => {
            btn.onclick = () => {
                const tab = btn.dataset.tab;
                sessionStorage.setItem("admin_active_tab", tab);
                document.querySelectorAll(".admin-nav-link").forEach(nl => {
                    if (nl.dataset.tab === tab) nl.classList.add("active");
                    else nl.classList.remove("active");
                });
                renderDashboardContent();
            };
        });
    };

    // ==========================================================================
    // 5. EVENT BINDINGS
    // ==========================================================================

    const bindLoginEvents = () => {
        const form = document.getElementById("admin-login-form");
        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                const email = document.getElementById("admin-email").value.trim();
                const pass = document.getElementById("admin-password").value.trim();

                if (email === "admin@wellnez.com" && pass === "password123") {
                    sessionStorage.setItem("admin_auth", "true");
                    renderDashboard();
                } else {
                    showToast("Authentication Failed. Invalid credentials.", "error");
                }
            });
        }
    };

    const bindDashboardEvents = () => {
        const navLinks = document.querySelectorAll(".admin-nav-link");
        navLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                const tab = link.dataset.tab;
                sessionStorage.setItem("admin_active_tab", tab);
                
                navLinks.forEach(nl => nl.classList.remove("active"));
                link.classList.add("active");
                
                renderDashboardContent();
            });
        });

        const logoutBtn = document.getElementById("admin-logout-btn");
        if (logoutBtn) {
            logoutBtn.onclick = (e) => {
                e.preventDefault();
                sessionStorage.removeItem("admin_auth");
                renderLogin();
            };
        }
    };

    const bindProductEvents = () => {
        const productModal = document.getElementById("admin-product-modal");
        const addProductOpenBtn = document.getElementById("add-product-open-btn");
        const productModalCloseBtn = document.getElementById("product-modal-close-btn");
        const productForm = document.getElementById("admin-product-form");

        if (productModal && productForm) {
            if (addProductOpenBtn) {
                addProductOpenBtn.onclick = () => {
                    productForm.reset();
                    document.getElementById("prod-form-mode").value = "add";
                    document.getElementById("prod-id").disabled = false;
                    document.getElementById("prod-image").value = "";
                    document.getElementById("prod-image-url").value = "";
                    document.getElementById("prod-img-preview-wrap").innerHTML = `
                        <i class="fa-solid fa-cloud-arrow-up" style="font-size:1.8rem; color:var(--text-muted); margin-bottom:6px;"></i>
                        <p style="font-size:0.8rem; color:var(--text-muted); margin:0;">Click to upload image file</p>
                    `;
                    document.getElementById("modal-product-title").innerText = "Add New Skincare Product";
                    productModal.classList.add("active");
                };
            }

            if (productModalCloseBtn) {
                productModalCloseBtn.onclick = () => productModal.classList.remove("active");
            }

            const prodImgFile = document.getElementById("prod-img-file");
            const prodImgHidden = document.getElementById("prod-image");
            const prodImgUrl = document.getElementById("prod-image-url");
            const prodImgZone = document.getElementById("prod-img-upload-zone");
            const prodImgPreviewWrap = document.getElementById("prod-img-preview-wrap");

            if (prodImgFile && prodImgZone) {
                prodImgZone.onclick = () => prodImgFile.click();
                prodImgFile.onchange = (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        prodImgHidden.value = event.target.result;
                        prodImgPreviewWrap.innerHTML = `
                            <img src="${event.target.result}" alt="Preview" style="max-height:100px; max-width:100%; object-fit:contain; border-radius:4px; margin-bottom:6px;">
                            <p style="font-size:0.75rem; color:#27ae60; margin:0;"><i class="fa-solid fa-circle-check"></i> Image selected</p>
                        `;
                    };
                    reader.readAsDataURL(file);
                };
            }

            if (prodImgUrl) {
                prodImgUrl.oninput = () => {
                    const val = prodImgUrl.value.trim();
                    if (val) {
                        prodImgHidden.value = val;
                        prodImgPreviewWrap.innerHTML = `
                            <img src="${val}" alt="Preview" style="max-height:100px; max-width:100%; object-fit:contain; border-radius:4px; margin-bottom:6px;">
                            <p style="font-size:0.75rem; color:#27ae60; margin:0;"><i class="fa-solid fa-circle-check"></i> Remote URL linked</p>
                        `;
                    }
                };
            }

            // Edit product binds
            document.querySelectorAll(".edit-product-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const prod = Store.getProductById(btn.dataset.id);
                    if (!prod) return;

                    document.getElementById("prod-form-mode").value = "edit";
                    document.getElementById("prod-id").value = prod.id;
                    document.getElementById("prod-id").disabled = true;
                    document.getElementById("prod-name").value = prod.name;
                    document.getElementById("prod-category").value = prod.category;
                    document.getElementById("prod-price").value = prod.price;
                    document.getElementById("prod-compare").value = prod.comparePrice || "";
                    document.getElementById("prod-stock").value = prod.stock;
                    document.getElementById("prod-image").value = prod.image;
                    
                    if (prodImgPreviewWrap) {
                        prodImgPreviewWrap.innerHTML = `
                            <img src="${prod.image}" alt="Current Image" style="max-height:100px; max-width:100%; object-fit:contain; border-radius:4px; margin-bottom:6px;">
                            <p style="font-size:0.75rem; color:var(--text-muted);">Current image — upload to replace</p>
                        `;
                    }
                    if (prodImgUrl && !prod.image.startsWith("data:")) prodImgUrl.value = prod.image;
                    
                    document.getElementById("prod-video").value = prod.video || "";
                    document.getElementById("prod-skin").value = prod.skinType;
                    document.getElementById("prod-desc").value = prod.description;
                    document.getElementById("prod-benefits").value = prod.benefits.join(", ");
                    document.getElementById("prod-ingredients").value = prod.ingredients;
                    document.getElementById("prod-use").value = prod.howToUse;
                    document.getElementById("modal-product-title").innerText = `Edit Product: ${prod.id}`;
                    productModal.classList.add("active");
                });
            });

            // Delete product
            document.querySelectorAll(".delete-product-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    if (confirm(`Are you sure you want to delete product: ${btn.dataset.id}?`)) {
                        Store.deleteProduct(btn.dataset.id);
                        showToast("Product deleted successfully.", "success");
                        renderDashboardContent();
                    }
                });
            });

            // Form Submit Add/Edit Product
            productForm.onsubmit = (e) => {
                e.preventDefault();
                const mode = document.getElementById("prod-form-mode").value;
                const id = document.getElementById("prod-id").value.trim().toLowerCase().replace(/\s+/g, "-");
                const name = document.getElementById("prod-name").value.trim();
                const category = document.getElementById("prod-category").value.trim();
                const price = parseInt(document.getElementById("prod-price").value);
                const comparePrice = parseInt(document.getElementById("prod-compare").value) || price;
                const stock = parseInt(document.getElementById("prod-stock").value);
                const image = document.getElementById("prod-image").value.trim() || "images/placeholder.png";
                const video = document.getElementById("prod-video").value.trim();
                const skinType = document.getElementById("prod-skin").value.trim();
                const description = document.getElementById("prod-desc").value.trim();
                const benefitsText = document.getElementById("prod-benefits").value.trim();
                const ingredients = document.getElementById("prod-ingredients").value.trim();
                const howToUse = document.getElementById("prod-use").value.trim();

                const benefits = benefitsText.split(",").map(b => b.trim()).filter(Boolean);
                const productData = { id, name, category, price, comparePrice, stock, image, video, skinType, description, benefits, ingredients, howToUse };

                if (mode === "add") {
                    if (Store.getProductById(id)) {
                        showToast("Product SKU ID already exists.", "error");
                        return;
                    }
                    Store.addProduct(productData);
                    showToast("Product added successfully!", "success");
                } else {
                    Store.updateProduct(productData);
                    showToast("Product updated successfully!", "success");
                }

                productModal.classList.remove("active");
                renderDashboardContent();
            };
        }
    };

    const bindOrderEvents = () => {
        document.querySelectorAll(".admin-status-select").forEach(select => {
            select.addEventListener("change", (e) => {
                const id = select.dataset.id;
                const status = select.value;
                Store.updateOrderStatus(id, status);
                showToast(`Order status updated to ${status}`, "success");
            });
        });

        document.querySelectorAll(".view-order-details-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.dataset.id;
                const orders = Store.getOrders();
                const o = orders.find(x => x.id === id);
                if (!o) return;

                const modal = document.getElementById("order-details-modal");
                const content = document.getElementById("modal-order-content");
                const closeBtn = document.getElementById("order-modal-close");

                let itemsHtml = o.items.map(item => {
                    const product = Store.getProductById(item.productId);
                    const imgSrc = item.image || (product ? product.image : "images/logo.png");
                    return `
                        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px dashed var(--border-color);">
                            <div style="display:flex; align-items:center; gap:12px;">
                                <img src="${imgSrc}" style="width:40px; height:40px; object-fit:cover; border-radius:4px; border:1px solid var(--border-color);" alt="${item.name}">
                                <div>
                                    <strong style="display:block;">${item.name}</strong>
                                    <span style="font-size:0.8rem; color:var(--text-muted);">Qty: ${item.qty}</span>
                                </div>
                            </div>
                            <div>₹${item.price * item.qty}</div>
                        </div>
                    `;
                }).join("");

                content.innerHTML = `
                    <div style="margin-bottom:20px; font-size:0.88rem; line-height:1.6;">
                        <p><strong>Customer Name:</strong> ${o.customerName}</p>
                        <p><strong>Email Address:</strong> ${o.customerEmail}</p>
                        <p><strong>Phone:</strong> ${o.customerPhone || "N/A"}</p>
                        <p><strong>Shipping Address:</strong> ${o.shippingAddress}</p>
                        <p><strong>Payment Method:</strong> ${o.paymentMethod || "COD"}</p>
                        <p><strong>Order Date:</strong> ${o.date}</p>
                    </div>
                    <div style="margin-top:20px;">
                        <h4 style="font-family:var(--font-heading); margin-bottom:10px; text-transform:uppercase; font-size:0.75rem; letter-spacing:0.05em; color:var(--text-muted);">Purchased Items</h4>
                        ${itemsHtml}
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:15px; font-weight:800; font-size:1.1rem; border-top:1px solid var(--border-color); padding-top:10px;">
                            <div>Total Amount</div>
                            <div>₹${o.total}</div>
                        </div>
                    </div>
                `;

                modal.classList.add("active");
                closeBtn.onclick = () => modal.classList.remove("active");
            });
        });
    };

    const bindCouponEvents = () => {
        const form = document.getElementById("create-coupon-form");
        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                const code = document.getElementById("coupon-code").value.trim().toUpperCase();
                const discountType = document.getElementById("coupon-type").value;
                const value = parseInt(document.getElementById("coupon-value").value);
                const minPurchase = parseInt(document.getElementById("coupon-min").value) || 0;

                const coupons = Store.getCoupons();
                if (coupons.some(c => c.code === code)) {
                    showToast("Coupon code already exists.", "error");
                    return;
                }

                Store.addCoupon({ code, discountType, value, minPurchase });
                showToast(`Coupon ${code} created successfully!`, "success");
                renderDashboardContent();
            };
        }

        document.querySelectorAll(".delete-coupon-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const code = btn.dataset.code;
                Store.deleteCoupon(code);
                showToast(`Coupon ${code} deleted.`, "success");
                renderDashboardContent();
            });
        });
    };

    const bindPaymentEvents = () => {
        document.querySelectorAll(".toggle-switch").forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.paymentId;
                Store.togglePaymentMethod(id);
                showToast("Payment status changed.", "success");
                renderDashboardContent();
            };
        });

        const upiForm = document.getElementById("upi-settings-form");
        if (upiForm) {
            upiForm.onsubmit = (e) => {
                e.preventDefault();
                const upiId = document.getElementById("upi-id-input").value.trim();
                const qrBase64 = document.getElementById("prod-image").value || Store.getUPISettings().qrBase64;
                Store.saveUPISettings(upiId, qrBase64);
                showToast("UPI Settings updated successfully!", "success");
                renderDashboardContent();
            };
        }

        const qrInput = document.getElementById("upi-qr-input");
        if (qrInput) {
            qrInput.onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    document.getElementById("prod-image").value = event.target.result;
                    showToast("QR Image selected. Click Save to apply.", "success");
                };
                reader.readAsDataURL(file);
            };
        }
    };

    // ==========================================================================
    // 6. INITIALIZATION HOOKS
    // ==========================================================================

    const getActiveTab = () => {
        return sessionStorage.getItem("admin_active_tab") || "dashboard";
    };

    const initConsole = () => {
        const auth = sessionStorage.getItem("admin_auth") === "true";
        if (auth) {
            renderDashboard();
            // Pull latest from Supabase and refresh view dynamically
            syncFromSupabase().then(() => {
                renderDashboardContent();
            });
        } else {
            renderLogin();
        }
    };

    initConsole();

})();
