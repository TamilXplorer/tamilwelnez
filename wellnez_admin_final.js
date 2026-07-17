/* ==========================================================================
   your Wellnez - Unified Application Orchestrator
   ========================================================================== */

(function () {
    "use strict";

    // ==========================================================================
    // 1. STATE MANAGEMENT DATABASE (localStorage backed)
    // ==========================================================================

    const INITIAL_PRODUCTS = [
        {
            id: "face-wash",
            name: "Slick Cleanse Hydrating Wash",
            category: "Cleanser",
            price: 699,
            comparePrice: 899,
            image: "images/face_wash.png",
            video: "https://player.vimeo.com/external/188216678.hd.mp4?s=2095ec96830131a5474bddcea37b82f2c98c54fa&profile_id=119",
            stock: 50,
            skinType: "All skin types, especially sensitive",
            description: "A gentle, pH-balanced gel-to-foam cleanser that effectively removes impurities and light makeup without stripping the skin's natural moisture barrier.",
            benefits: [
                "pH-balanced (5.5) formula prevents irritation",
                "Infused with Hyaluronic Acid and Ceramide NP",
                "Cleanses deeply while preserving lipid barrier",
                "Fragrance-free, sulfate-free, and vegan"
            ],
            ingredients: "Water, Glycerin, Sodium Cocoyl Alaninate, Lauryl Hydroxysultaine, Acrylates/C10-30 Alkyl Acrylate Crosspolymer, Ceramide NP, Hyaluronic Acid, Aloe Barbadensis Leaf Extract, Centella Asiatica Extract, Citric Acid, Sodium Chloride.",
            howToUse: "Apply 1-2 pumps onto damp skin. Gently massage in circular motions for 60 seconds. Rinse thoroughly with lukewarm water and pat dry. Use morning and night."
        },
        {
            id: "sunscreen",
            name: "Shield Guard Matte Sunscreen SPF 50+",
            category: "Sun Care",
            price: 849,
            comparePrice: 999,
            image: "images/sunscreen.png",
            video: "https://player.vimeo.com/external/372535660.sd.mp4?s=396d52af437419d5b0b018d97b67d524e3a44a7d&profile_id=139&oauth2_token_id=1223210874",
            stock: 35,
            skinType: "Oily, combination, and acne-prone skin",
            description: "An ultra-lightweight, non-greasy physical-hybrid sunscreen that offers broad-spectrum UVA/UVB protection while giving a velvety matte finish.",
            benefits: [
                "SPF 50+ PA++++ broad-spectrum protection",
                "Zero white cast, fast-absorbing texture",
                "Matte finish controls excess sebum all day",
                "Sweat-resistant and non-comedogenic"
            ],
            ingredients: "Zinc Oxide, Titanium Dioxide, Water, Cyclopentasiloxane, Ethylhexyl Methoxycinnamate, Butylene Glycol, Silica, Ceramide EOP, Niacinamide, Tocopherol (Vitamin E), Green Tea Leaf Extract.",
            howToUse: "Apply generously as the final step of your skincare routine, at least 15 minutes before sun exposure. Reapply every 2-3 hours of active outdoor exposure."
        },
        {
            id: "face-toner",
            name: "Dew Barrier Hydrating Toner",
            category: "Toner",
            price: 699,
            comparePrice: 799,
            image: "images/toner.png",
            video: "https://player.vimeo.com/external/372436717.sd.mp4?s=94b20ca07817031c0ad538e2227d413f8e716d95&profile_id=139&oauth2_token_id=1223210874",
            benefits: [
                "Milky texture delivers instant hydration boost",
                "Ceramide complex strengthens the skin barrier",
                "Soothes redness and calms irritation",
                "Alcohol-free and non-drying formulation"
            ],
            ingredients: "Water, Butylene Glycol, Glycerin, Ceramide NP, Hyaluronic Acid, Beta-Glucan, Centella Asiatica Extract, Panthenol, Allantoin, Disodium EDTA, 1,2-Hexanediol.",
            howToUse: "After cleansing, pour a small amount onto a cotton pad or directly into palms. Gently pat onto face and neck until fully absorbed. Follow with serum."
        },
        {
            id: "moisturizing-cream",
            name: "Ceramide Cushion Moisture Cream",
            category: "Moisturizer",
            price: 899,
            comparePrice: 999,
            image: "images/cream.png",
            stock: 45,
            skinType: "Normal, dry, and mature skin types",
            description: "A rich, whipped cream moisturizer that strengthens the skin barrier while delivering long-lasting, deep hydration without feeling heavy or greasy.",
            benefits: [
                "Deep cushion texture locks in moisture",
                "Triple Ceramide blend (NP, AP, EOP) repairs barrier",
                "Squalane and Shea Butter nourish dry patches",
                "Restores elasticity and plumpness to skin"
            ],
            ingredients: "Water, Squalane, Shea Butter, Glycerin, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Carbomer, Xanthan Gum, Phenoxyethanol.",
            howToUse: "Scoop a nickel-sized amount and apply evenly to face and neck as the final moisturizing step in your routine. Press gently into skin."
        },
        {
            id: "eye-gel",
            name: "Lash & Line Peptide Eye Gel",
            category: "Eye Care",
            price: 599,
            comparePrice: 699,
            image: "images/eye_gel.png",
            stock: 25,
            skinType: "All skin types showing fatigue or fine lines",
            description: "A cooling eye gel formulated with peptides and caffeine to reduce under-eye puffiness and diminish the appearance of fine lines and dark circles.",
            benefits: [
                "Cooling gel formula depuffs eyes instantly",
                "Peptide complex smoothens wrinkles and lines",
                "Caffeine visibly brightens under-eye shadows",
                "Safe for contact lens wearers and sensitive eyes"
            ],
            ingredients: "Water, Aloe Barbadensis Leaf Juice, Caffeine, Acetyl Tetrapeptide-5, Sodium Hyaluronate, Cucumber Fruit Extract, Carbomer, Glycerin, Triethanolamine.",
            howToUse: "Gently pat a pea-sized amount around the entire eye area (orbital bone) using your ring finger. Use morning and night."
        },
        {
            id: "serum",
            name: "Blemish Focus Niacinamide Serum",
            category: "Serum",
            price: 799,
            comparePrice: 899,
            image: "images/serum.png",
            stock: 40,
            skinType: "Oily, combination, and blemish-prone skin",
            description: "A daily clarifying serum powered by 10% Niacinamide and Zinc PCA to balance sebum production, clear pores, and smooth uneven skin texture.",
            benefits: [
                "10% Niacinamide brightens dark spots and scars",
                "1% Zinc PCA reduces excess oil and breakouts",
                "Refines pore appearance and smooths texture",
                "Water-light, fast-absorbing daily formulation"
            ],
            ingredients: "Water, Niacinamide (Vitamin B3), Zinc PCA, Pentylene Glycol, Tamarindus Indica Seed Gum, Xanthan Gum, Phenoxyethanol, Ethylhexylglycerin.",
            howToUse: "Apply 2-3 drops to clean skin in the morning and evening. Pat gently over face and neck. Allow to dry before applying moisturizer."
        }
    ];

    const INITIAL_COUPONS = [
        { code: "WELLNEZ10", discountType: "percentage", value: 10, minPurchase: 0 },
        { code: "FREE50", discountType: "flat", value: 50, minPurchase: 500 },
        { code: "SUPERDEAL", discountType: "percentage", value: 20, minPurchase: 1500 }
    ];

    const INITIAL_REVIEWS = {
        "face-wash": [
            { name: "Anjali R.", rating: 5, comment: "Hands down the best cleanser I have ever used. My skin feels clean but never dry or tight. Will buy again!", date: "2026-06-15", verified: true },
            { name: "Vikram S.", rating: 4, comment: "Very gentle and fragrance-free, which is great for my sensitive skin. Wish it came in a bigger bottle.", date: "2026-06-28", verified: true }
        ],
        "sunscreen": [
            { name: "Sarah T.", rating: 5, comment: "It really has no white cast! It gives a gorgeous semi-matte finish that controls my oily T-zone. Love this SPF.", date: "2026-07-01", verified: true },
            { name: "Kiran P.", rating: 5, comment: "Highly recommend. Doesn't pill under makeup and doesn't sting my eyes. Lightweight formulation.", date: "2026-07-05", verified: true }
        ],
        "face-toner": [
            { name: "Meera K.", rating: 5, comment: "Absolutely locks in moisture. I apply it in 3 layers and my skin feels so bouncy!", date: "2026-07-03", verified: true },
            { name: "Arjun V.", rating: 5, comment: "Great toner, very soothing. Perfect after shaving too.", date: "2026-07-06", verified: true }
        ],
        "moisturizing-cream": [
            { name: "Pooja S.", rating: 5, comment: "My skin barrier was damaged from over-exfoliation, and this cream saved it in 3 days! Holy grail.", date: "2026-07-02", verified: true },
    // 3. GRAPHICS CHART RENDERER
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
                    <rect class="chart-bar" x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="2" ry="2" />
                    <text class="chart-text" x="${x + barWidth/2}" y="${y - 5}" text-anchor="middle" font-weight="700" fill="var(--text-main)">₹${d.sales}</text>
                    <text class="chart-text" x="${x + barWidth/2}" y="${chartHeight - 10}" text-anchor="middle">${d.date}</text>
                </g>
            `;
        }).join("");

        const gridLabels = [0, Math.round(maxVal / 2), maxVal].map(val => {
            const valPct = val / maxVal;
            const y = Math.round(chartHeight - paddingBottom - (graphHeight * valPct));
            return `
                <line class="chart-grid-line" x1="${paddingLeft}" y1="${y}" x2="${chartWidth - paddingRight}" y2="${y}" />
                <text class="chart-text" x="${paddingLeft - 10}" y="${y + 4}" text-anchor="end">₹${val}</text>
            `;
        }).join("");

        return `
            <svg viewBox="0 0 ${chartWidth} ${chartHeight}" class="chart-svg">
                <defs>
                    <linearGradient id="chrome-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#b3b3b3" />
                        <stop offset="25%" stop-color="#ffffff" />
                        <stop offset="50%" stop-color="#cccccc" />
                        <stop offset="75%" stop-color="#f2f2f2" />
                        <stop offset="100%" stop-color="#808080" />
                    </linearGradient>
                </defs>
                ${gridLabels}
                <line class="chart-axis-line" x1="${paddingLeft}" y1="${paddingTop}" x2="${paddingLeft}" y2="${chartHeight - paddingBottom}" />
                <line class="chart-axis-line" x1="${paddingLeft}" y1="${chartHeight - paddingBottom}" x2="${chartWidth - paddingRight}" y2="${chartHeight - paddingBottom}" />
                ${barsHtml}
            </svg>
        `;
    };

    // 4. MAIN PANEL RENDERERS
    const renderLogin = () => {
        viewport.innerHTML = `
            <div style="min-height: calc(100vh - 200px); display: flex; align-items: center; justify-content: center; padding: 20px;">
                <div class="auth-card" style="max-width: 450px; width:100%; box-shadow: var(--shadow-lg); border: 1px solid var(--border-dark); background:#FFF;">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <span class="promo-badge" style="font-size: 0.7rem; font-weight:700;">System Access Gate</span>
                        <h2 style="font-family: var(--font-heading); text-transform: uppercase; font-size: 1.5rem; margin-top: 10px; font-weight: 800;">Admin Console</h2>
                        <p style="color: var(--text-muted); font-size: 0.85rem; margin-top: 5px;">Enter merchant credentials to log in.</p>
                    </div>
                    <form id="admin-login-form">
                        <div class="form-group">
                            <label for="admin-email">Admin Email</label>
                            <input type="email" id="admin-email" class="form-control" placeholder="admin@wellnez.com" required>
                        </div>
                        <div class="form-group">
                            <label for="admin-password">Password</label>
                            <input type="password" id="admin-password" class="form-control" placeholder="••••••••" required>
                        </div>
                        <button type="submit" class="btn btn-chrome btn-block" style="margin-top:15px; height: 48px;">Authenticate Console</button>
                        <a href="index.html" class="btn btn-outline btn-block" style="margin-top:10px; height: 48px; display:flex; align-items:center; justify-content:center;">Return to Store</a>
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

        // Subview Tabs Renderers
        const renderDashboardTab = () => {
            const recentOrders = Store.getOrders().slice(0, 5);
            const orderRows = recentOrders.map(o => `
                <tr>
                    <td><strong style="font-family:var(--font-heading);">${o.id}</strong></td>
                    <td>${o.customerName}</td>
                    <td>₹${o.total}</td>
                    <td><span class="status-badge ${o.status.toLowerCase()}">${o.status}</span></td>
                    <td>${o.date}</td>
                </tr>
            `).join("");

            return `
                <div class="admin-main-grid">
                    <div class="admin-section-box">
                        <h3>Daily Sales Trend</h3>
                        <div class="chart-container">${renderSalesChart()}</div>
                    </div>
                    <div class="admin-section-box" style="display:flex; flex-direction:column; gap:15px; justify-content:center;">
                        <h3>Operations</h3>
                        <button class="btn btn-chrome btn-block admin-quick-nav" data-tab="products"><i class="fa-solid fa-plus"></i> Add Product</button>
                        <button class="btn btn-secondary btn-block admin-quick-nav" data-tab="orders"><i class="fa-solid fa-boxes-packing"></i> Process Orders</button>
                        <button class="btn btn-outline btn-block admin-quick-nav" data-tab="coupons"><i class="fa-solid fa-ticket"></i> Create Coupon</button>
                    </div>
                </div>

                <div class="admin-section-box">
                    <h3>Recent Orders</h3>
                    <div class="table-responsive">
                        <table class="admin-table">
                            <thead>
                                <tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr>
                            </thead>
                            <tbody>
                                ${orderRows.length > 0 ? orderRows : '<tr><td colspan="5" style="text-align:center;">No sales.</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        };

        const renderProductsTab = () => {
            const products = Store.getProducts();
            const productRows = products.map(p => `
                <tr data-product-id="${p.id}">
                    <td><img src="${p.image}" alt="${p.name}" style="width:40px; height:40px; object-fit:contain; border:1px solid var(--border-color); padding:2px; background:#FFF;"></td>
                    <td><strong>${p.id}</strong></td>
                    <td>${p.name}</td>
                    <td>${p.category}</td>
                    <td>₹${p.price}</td>
                    <td>
                        <div class="stock-indicator">
                            <span class="stock-indicator-dot ${p.stock <= 10 ? 'low-stock' : 'in-stock'}"></span>
                            <span>${p.stock} units</span>
                        </div>
                    </td>
                    <td>
                        <div style="display:flex; gap:8px;">
                            <button class="btn btn-outline edit-product-btn" data-id="${p.id}"><i class="fa-regular fa-pen-to-square"></i></button>
                            <button class="btn btn-outline delete-product-btn" data-id="${p.id}" style="color:#d63031;"><i class="fa-regular fa-trash-can"></i></button>
                        </div>
                    </td>
                </tr>
            `).join("");

            return `
                <div class="admin-section-box">
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:15px; margin-bottom:20px;">
                        <h3 style="border:none; margin:0;">Product Catalog</h3>
                        <button class="btn btn-chrome" id="add-product-open-btn"><i class="fa-solid fa-plus"></i> Add Skincare Product</button>




























































































































                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        };

        const renderPaymentsTab = () => {
            const methods = Store.getPaymentMethods();
            const upi = Store.getUPISettings();
            return `
                <div class="admin-section-box">
                    <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:15px; margin-bottom:25px;">
                        <h3 style="border:none; margin:0;">Payment Methods</h3>
                        <span style="font-size:0.8rem; color:var(--text-muted); font-family:var(--font-heading);">Toggle to show/hide methods on customer checkout</span>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:0;">
                        ${methods.map(m => `
                        <div style="display:flex; justify-content:space-between; align-items:center; padding:20px 0; border-bottom:1px dashed var(--border-color);">
                            <div style="display:flex; align-items:center; gap:15px;">
                                <div style="width:44px; height:44px; border-radius:8px; border:1px solid var(--border-color); display:flex; align-items:center; justify-content:center; background:var(--bg-primary); font-size:1.2rem;">
                                    <i class="${m.icon}"></i>
                                </div>
                                <div>
                                    <div style="font-weight:700; font-family:var(--font-heading); text-transform:uppercase; font-size:0.85rem;">${m.name}</div>
                                    <div style="font-size:0.75rem; color:var(--text-muted); margin-top:3px;">${m.enabled ? '<span style="color:#27ae60;"><i class="fa-solid fa-circle-check"></i> Active on checkout</span>' : '<span style="color:#e74c3c;"><i class="fa-solid fa-circle-xmark"></i> Hidden from customers</span>'}</div>
                                </div>
                            </div>
                            <label class="payment-toggle" style="display:flex; align-items:center; gap:10px; cursor:pointer;">
                                <span style="font-size:0.8rem; font-weight:600; color:var(--text-muted);">${m.enabled ? 'Enabled' : 'Disabled'}</span>
                                <div class="toggle-switch ${m.enabled ? 'on' : ''}" data-payment-id="${m.id}">
                                    <div class="toggle-thumb"></div>
                                </div>
                            </label>
                        </div>
                        `).join('')}
                    </div>
                </div>

                <!-- UPI Settings Card -->
                <div class="admin-section-box" style="margin-top:25px;">
                    <div style="display:flex; align-items:center; gap:12px; border-bottom:1px solid var(--border-color); padding-bottom:15px; margin-bottom:25px;">
                        <div style="width:40px; height:40px; border-radius:8px; background:var(--metallic-chrome); display:flex; align-items:center; justify-content:center; font-size:1.1rem;"><i class="fa-solid fa-qrcode"></i></div>
                        <div>
                            <h3 style="border:none; margin:0;">UPI Payment Settings</h3>
                            <p style="color:var(--text-muted); font-size:0.8rem; margin:0;">Set your UPI ID and QR code — shown to customers at checkout</p>
                        </div>
                    </div>

                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:35px; align-items:start;">
                        <form id="upi-settings-form">
                            <div class="form-group">
                                <label for="upi-id-input">UPI ID</label>
                                <input type="text" id="upi-id-input" class="form-control" placeholder="yourname@upi" value="${upi.upiId}">
                                <p style="font-size:0.78rem; color:var(--text-muted); margin-top:6px;">e.g. wellnez@okicici, 9876543210@paytm</p>
                            </div>
                            <div class="form-group">
                                <label for="upi-qr-input">Upload QR Code Image</label>
                                <input type="file" id="upi-qr-input" class="form-control" accept="image/*" style="padding:8px;">
                                <p style="font-size:0.78rem; color:var(--text-muted); margin-top:6px;">PNG or JPG, recommended 400×400px</p>
                            </div>
                            <button type="submit" class="btn btn-chrome btn-block" style="margin-top:5px;"><i class="fa-solid fa-floppy-disk"></i> Save UPI Settings</button>
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

        const activeViewHtml = activeTab === "dashboard"
            ? renderDashboardTab()
            : activeTab === "products"
                ? renderProductsTab()
                : activeTab === "orders"
                    ? renderOrdersTab()
                    : activeTab === "coupons"
                        ? renderCouponsTab()
                        : activeTab === "payments"
                            ? renderPaymentsTab()
                            : renderCustomersTab();

        viewport.innerHTML = `
            <div class="admin-layout" style="max-width: 100% !important; padding-left: 4vw !important; padding-right: 4vw !important;">
                <div class="admin-header-row">
                    <div>
                        <h1 style="margin: 0; font-size: 2rem;">your Wellnez Admin Panel</h1>
                    </div>





















































































































































































































































































































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
                    // Set current image into hidden field + show preview
                    document.getElementById("prod-image").value = prod.image;
                    const previewWrap = document.getElementById("prod-img-preview-wrap");
                    const urlInput = document.getElementById("prod-image-url");
                    if (previewWrap) {
                        previewWrap.innerHTML = `
                            <img src="${prod.image}" alt="Current Image" style="max-height:100px; max-width:100%; object-fit:contain; border-radius:4px; margin-bottom:6px;">
                            <p style="font-size:0.75rem; color:var(--text-muted);">Current image — upload to replace</p>
                        `;
                    }
                    if (urlInput && !prod.image.startsWith("data:")) urlInput.value = prod.image;
                    document.getElementById("prod-skin").value = prod.skinType;
                    document.getElementById("prod-desc").value = prod.description;
                    document.getElementById("prod-benefits").value = prod.benefits.join(", ");
                    document.getElementById("prod-ingredients").value = prod.ingredients;
                    document.getElementById("prod-use").value = prod.howToUse;
                    document.getElementById("modal-product-title").innerText = `Edit Product: ${prod.id}`;
                    productModal.classList.add("active");
                });
            });

            productForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const mode = document.getElementById("prod-form-mode").value;
                const id = document.getElementById("prod-id").value.trim().toLowerCase().replace(/\s+/g, "-");
                const name = document.getElementById("prod-name").value.trim();
                const category = document.getElementById("prod-category").value.trim();
                const price = parseInt(document.getElementById("prod-price").value);
                const comparePrice = parseInt(document.getElementById("prod-compare").value) || price;
                const stock = parseInt(document.getElementById("prod-stock").value);
                const image = document.getElementById("prod-image").value.trim();
                const skinType = document.getElementById("prod-skin").value.trim();
                const description = document.getElementById("prod-desc").value.trim();
                const benefitsText = document.getElementById("prod-benefits").value.trim();
                const ingredients = document.getElementById("prod-ingredients").value.trim();
                const howToUse = document.getElementById("prod-use").value.trim();

                const benefits = benefitsText.split(",").map(b => b.trim()).filter(Boolean);
                const productData = { id, name, category, price, comparePrice, stock, image, skinType, description, benefits, ingredients, howToUse };

                if (mode === "add") {
                    if (Store.getProductById(id)) {
                        showToast("Product SKU ID already exists.", "error");
                        return;
                    }
                    Store.addProduct(productData);
                } else {
                    Store.updateProduct(productData);
                }

                productModal.classList.remove("active");
                showToast("Product details synced successfully!", "success");
                renderDashboard();
            });
        }

        // Coupon creations
        const couponForm = document.getElementById("create-coupon-form");
        if (couponForm) {
            couponForm.addEventListener("submit", (e) => {

