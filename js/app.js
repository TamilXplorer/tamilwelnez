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
            stock: 30,
            skinType: "Dry, dehydrated, and sensitive skin",
            description: "A soothing, milky toner loaded with ceramides and hyaluronic acid to instantly quench dry skin, balance pH levels, and prep it for serums.",
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
            video: "https://player.vimeo.com/external/551733120.sd.mp4?s=2e1a1ee51e923fd7529d774970fb2bdd56d9a65c&profile_id=165",
            stock: 45,
            skinType: "Normal, dry, and mature skin types",
            description: "A rich, whipped cream moisturizer that strengthens the skin barrier while delivering long-lasting, deep hydration without feeling heavy or greasy.",
            benefits: [
                "Deep cushion texture locks in moisture",
                "Triple Ceramide blend (NP, AP, EOP) repairs barrier",
                "Squalane and Shea Butter nourish dry patches",
                "Restores elasticity and plumpness to skin"
            ],
            ingredients: "Water, Squalane, Shea Butter, Glycerin, Ceramide NP, Ceramide AP, Ceramide EOP, Phytsphingosine, Cholesterol, Carbomer, Xanthan Gum, Phenoxyethanol.",
            howToUse: "Scoop a nickel-sized amount and apply evenly to face and neck as the final moisturizing step in your routine. Press gently into skin."
        },
        {
            id: "eye-gel",
            name: "Lash & Line Peptide Eye Gel",
            category: "Eye Care",
            price: 599,
            comparePrice: 699,
            image: "images/eye_gel.png",
            video: "https://player.vimeo.com/external/372789822.sd.mp4?s=ff563b4a77e1f7265a6d96d66ea9f96940d9acbe&profile_id=139&oauth2_token_id=1223210874",
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
            video: "https://player.vimeo.com/external/223840006.hd.mp4?s=54a1da69d40a39c25fa2088d50ed0d46447e7149&profile_id=175",
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
            { name: "Rohan M.", rating: 4, comment: "Extremely hydrating. A bit rich for daytime, but makes a fantastic sleeping cream.", date: "2026-07-04", verified: true }
        ],
        "eye-gel": [
            { name: "Nisha D.", rating: 4, comment: "Really cooling and depuffs my morning eyes. Dark circles are slightly brighter.", date: "2026-06-30", verified: true }
        ],
        "serum": [
            { name: "Deepak G.", rating: 5, comment: "Visible reduction in oiliness and redness. My acne scars are fading nicely.", date: "2026-07-04", verified: true },
            { name: "Elena R.", rating: 5, comment: "Excellent texture, absorbs instantly. Works well under sunscreen.", date: "2026-07-07", verified: true }
        ]
    };

    const INITIAL_USERS = [
        { username: "admin", email: "admin@wellnez.com", password: "password123", role: "admin" },
        { username: "user", email: "user@wellnez.com", password: "password123", role: "customer" }
    ];

    const initStorage = () => {
        const existingProducts = JSON.parse(localStorage.getItem("wellnez_products"));
        const needsVideoMigration = existingProducts && existingProducts.some(p => !p.video);
        if (!existingProducts || existingProducts.length < INITIAL_PRODUCTS.length || needsVideoMigration) {
            localStorage.setItem("wellnez_products", JSON.stringify(INITIAL_PRODUCTS));
            localStorage.setItem("wellnez_reviews", JSON.stringify(INITIAL_REVIEWS));
        }
        if (!localStorage.getItem("wellnez_coupons")) {
            localStorage.setItem("wellnez_coupons", JSON.stringify(INITIAL_COUPONS));
        }
        if (!localStorage.getItem("wellnez_reviews")) {
            localStorage.setItem("wellnez_reviews", JSON.stringify(INITIAL_REVIEWS));
        }
        
        // Ensure wellnez_users exists and has the admin user
        let existingUsers = JSON.parse(localStorage.getItem("wellnez_users"));
        if (!existingUsers) {
            localStorage.setItem("wellnez_users", JSON.stringify(INITIAL_USERS));
        } else {
            const hasAdmin = existingUsers.some(u => u.role === "admin");
            if (!hasAdmin) {
                existingUsers.push({ username: "admin", email: "admin@wellnez.com", password: "password123", role: "admin" });
                localStorage.setItem("wellnez_users", JSON.stringify(existingUsers));
            }
        }
        if (!localStorage.getItem("wellnez_orders")) {
            localStorage.setItem("wellnez_orders", JSON.stringify([]));
        }
        if (!localStorage.getItem("wellnez_cart")) {
            localStorage.setItem("wellnez_cart", JSON.stringify([]));
        }
        if (!localStorage.getItem("wellnez_wishlist")) {
            localStorage.setItem("wellnez_wishlist", JSON.stringify([]));
        }
    };

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
                window.dispatchEvent(new Event("products-synced"));
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
                window.dispatchEvent(new Event("orders-synced"));
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
            console.error("Supabase background sync failed:", err);
        }
    };

    initStorage();
    syncFromSupabase();

    // Re-route on sync
    window.addEventListener("products-synced", () => {
        const hash = window.location.hash;
        if (!hash || hash === "#/" || hash === "#/shop") {
            if (typeof Router !== 'undefined' && Router.handleRoute) {
                Router.handleRoute();
            }
        }
    });

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
        },
        updateProduct(updatedProduct) {
            let products = this.getProducts();
            products = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
            this.saveProducts(products);
        },
        deleteProduct(id) {
            let products = this.getProducts();
            products = products.filter(p => p.id !== id);
            this.saveProducts(products);
            const reviews = this.getAllReviews();
            if (reviews[id]) {
                delete reviews[id];
                localStorage.setItem("wellnez_reviews", JSON.stringify(reviews));
            }
        },
        updateProductStock(productId, changeQty) {
            const products = this.getProducts();
            const product = products.find(p => p.id === productId);
            if (product) {
                product.stock = Math.max(0, product.stock + changeQty);
                this.saveProducts(products);
            }
        },
        getCart() {
            return JSON.parse(localStorage.getItem("wellnez_cart")) || [];
        },
        saveCart(cart) {
            localStorage.setItem("wellnez_cart", JSON.stringify(cart));
            window.dispatchEvent(new Event("cart-updated"));
        },
        addToCart(productId, qty = 1, forceUpdate = false) {
            const cart = this.getCart();
            const product = this.getProductById(productId);
            if (!product) return false;

            const cartItemIndex = cart.findIndex(item => item.productId === productId);
            if (cartItemIndex > -1) {
                if (forceUpdate) {
                    cart[cartItemIndex].qty = qty;
                } else {
                    cart[cartItemIndex].qty += qty;
                }
                if (cart[cartItemIndex].qty > product.stock) {
                    cart[cartItemIndex].qty = product.stock;
                }
            } else {
                cart.push({
                    productId,
                    qty: Math.min(qty, product.stock),
                    price: product.price,
                    name: product.name,
                    image: product.image
                });
            }
            this.saveCart(cart);
            return true;
        },
        removeFromCart(productId) {
            let cart = this.getCart();
            cart = cart.filter(item => item.productId !== productId);
            this.saveCart(cart);
        },
        updateCartQty(productId, qty) {
            if (qty <= 0) {
                this.removeFromCart(productId);
            } else {
                this.addToCart(productId, qty, true);
            }
        },
        clearCart() {
            this.saveCart([]);
        },
        getCartSubtotal() {
            return this.getCart().reduce((sum, item) => sum + (item.price * item.qty), 0);
        },
        getWishlist() {
            return JSON.parse(localStorage.getItem("wellnez_wishlist")) || [];
        },
        saveWishlist(wishlist) {
            localStorage.setItem("wellnez_wishlist", JSON.stringify(wishlist));
            window.dispatchEvent(new Event("wishlist-updated"));
        },
        toggleWishlist(productId) {
            let wishlist = this.getWishlist();
            const idx = wishlist.indexOf(productId);
            if (idx > -1) {
                wishlist.splice(idx, 1);
            } else {
                wishlist.push(productId);
            }
            this.saveWishlist(wishlist);
        },
        isInWishlist(productId) {
            return this.getWishlist().includes(productId);
        },
        getUsers() {
            return JSON.parse(localStorage.getItem("wellnez_users")) || [];
        },
        getCurrentUser() {
            return JSON.parse(localStorage.getItem("wellnez_user")) || null;
        },
        login(email, password) {
            const users = this.getUsers();
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                localStorage.setItem("wellnez_user", JSON.stringify(user));
                return { success: true, user };
            }
            return { success: false, message: "Invalid email or password" };
        },
        signup(username, email, password) {
            const users = this.getUsers();
            if (users.some(u => u.email === email)) {
                return { success: false, message: "Email is already registered" };
            }
            const newUser = { username, email, password, role: "customer" };
            users.push(newUser);
            localStorage.setItem("wellnez_users", JSON.stringify(users));
            localStorage.setItem("wellnez_user", JSON.stringify(newUser));
            return { success: true, user: newUser };
        },
        logout() {
            localStorage.removeItem("wellnez_user");
            window.dispatchEvent(new Event("auth-changed"));
        },
        getAllReviews() {
            return JSON.parse(localStorage.getItem("wellnez_reviews")) || {};
        },
        getReviews(productId) {
            return this.getAllReviews()[productId] || [];
        },
        addReview(productId, review) {
            const reviews = this.getAllReviews();
            if (!reviews[productId]) {
                reviews[productId] = [];
            }
            const newReview = {
                name: review.name,
                rating: parseInt(review.rating),
                comment: review.comment,
                date: new Date().toISOString().split("T")[0],
                verified: review.verified || false
            };
            reviews[productId].unshift(newReview);
            localStorage.setItem("wellnez_reviews", JSON.stringify(reviews));
        },
        getCoupons() {
            return JSON.parse(localStorage.getItem("wellnez_coupons")) || [];
        },
        addCoupon(coupon) {
            const coupons = this.getCoupons();
            coupons.push(coupon);
            localStorage.setItem("wellnez_coupons", JSON.stringify(coupons));
        },
        deleteCoupon(code) {
            let coupons = this.getCoupons();
            coupons = coupons.filter(c => c.code !== code);
            localStorage.setItem("wellnez_coupons", JSON.stringify(coupons));
        },
        validateCoupon(code, purchaseAmount) {
            const coupon = this.getCoupons().find(c => c.code.toUpperCase() === code.trim().toUpperCase());
            if (!coupon) return { valid: false, message: "Invalid coupon code" };
            if (purchaseAmount < coupon.minPurchase) {
                return { valid: false, message: `Minimum purchase of ₹${coupon.minPurchase} required` };
            }
            let discount = 0;
            if (coupon.discountType === "percentage") {
                discount = Math.round(purchaseAmount * (coupon.value / 100));
            } else {
                discount = coupon.value;
            }
            return { valid: true, discount, code: coupon.code };
        },
        getOrders() {
            return JSON.parse(localStorage.getItem("wellnez_orders")) || [];
        },
        getUserOrders(email) {
            return this.getOrders().filter(o => o.customerEmail === email);
        },
        getOrderById(id) {
            return this.getOrders().find(o => o.id === id);
        },
        placeOrder(orderData) {
            const orders = this.getOrders();
            const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
            const randHex = Math.floor(1000 + Math.random() * 9000);
            const orderId = `WN${dateStr}-${randHex}`;

            const newOrder = {
                id: orderId,
                date: new Date().toISOString().split("T")[0],
                customerName: orderData.name,
                customerEmail: orderData.email,
                shippingAddress: `${orderData.address}, ${orderData.city} - ${orderData.pincode}`,
                items: orderData.items,
                subtotal: orderData.subtotal,
                discount: orderData.discount || 0,
                shippingCharge: orderData.shippingCharge,
                total: orderData.total,
                paymentMethod: orderData.paymentMethod,
                pincode: orderData.pincode,
                status: "Pending"
            };

            orders.unshift(newOrder);
            localStorage.setItem("wellnez_orders", JSON.stringify(orders));

            orderData.items.forEach(item => {
                this.updateProductStock(item.productId, -item.qty);
            });

            // Sync with Supabase
            if (db) {
                db.from('orders').insert([{
                    id: newOrder.id,
                    date: newOrder.date,
                    customer_name: newOrder.customerName,
                    customer_email: newOrder.customerEmail,
                    shipping_address: newOrder.shippingAddress,
                    items: newOrder.items,
                    subtotal: newOrder.subtotal,
                    discount: newOrder.discount,
                    shipping_charge: newOrder.shippingCharge,
                    total: newOrder.total,
                    payment_method: newOrder.paymentMethod,
                    pincode: newOrder.pincode,
                    status: newOrder.status
                }]).then(({ error }) => {
                    if (error) console.error("Error saving order to Supabase:", error);
                });

                orderData.items.forEach(item => {
                    const prod = this.getProductById(item.productId);
                    if (prod) {
                        db.from('products').update({ stock: prod.stock }).eq('id', item.productId).then(() => {});
                    }
                });
            }

            return newOrder;
        },
        updateOrderStatus(orderId, status) {
            const orders = this.getOrders();
            const order = orders.find(o => o.id === orderId);
            if (order) {
                order.status = status;
                localStorage.setItem("wellnez_orders", JSON.stringify(orders));
                if (db) {
                    db.from('orders').update({ status }).eq('id', orderId).then(() => {});
                }
                return true;
            }
            return false;
        },
        addProduct(product) {
            const products = this.getProducts();
            products.push(product);
            this.saveProducts(products);
        },
        updateProduct(product) {
            let products = this.getProducts();
            const idx = products.findIndex(p => p.id === product.id);
            if (idx !== -1) {
                products[idx] = product;
                this.saveProducts(products);
                return true;
            }
            return false;
        },
        deleteProduct(id) {
            let products = this.getProducts();
            products = products.filter(p => p.id !== id);
            this.saveProducts(products);
        },
        getAdminKPIs() {
            const products = this.getProducts();
            const orders = this.getOrders();
            const users = this.getUsers().filter(u => u.role !== "admin");
            const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
            const lowStockCount = products.filter(p => p.stock <= 10).length;

            return {
                totalRevenue,
                ordersCount: orders.length,
                customersCount: users.length,
                lowStockCount
            };
        },
        getSalesGraphData() {
            const orders = this.getOrders();
            const last5Days = Array.from({ length: 5 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - i);
                return d.toISOString().split("T")[0];
            }).reverse();

            return last5Days.map(date => {
                const dayOrders = orders.filter(o => o.date === date);
                const total = dayOrders.reduce((sum, o) => sum + o.total, 0);
                return {
                    date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                    sales: total
                };
            });
        },
        getPaymentMethods() {
            const defaults = [
                { id: "UPI", name: "UPI (GPAY, Paytm)", enabled: true, icon: "fa-solid fa-mobile-screen-button" },
                { id: "Card", name: "Debit / Credit Card", enabled: true, icon: "fa-regular fa-credit-card" },
                { id: "NetBanking", name: "Net Banking", enabled: true, icon: "fa-solid fa-building-columns" },
                { id: "COD", name: "Cash on Delivery (COD)", enabled: true, icon: "fa-solid fa-hand-holding-dollar" }
            ];
            const stored = localStorage.getItem("wellnez_payment_methods");
            if (!stored) {
                localStorage.setItem("wellnez_payment_methods", JSON.stringify(defaults));
                return defaults;
            }
            return JSON.parse(stored);
        },
        savePaymentMethods(methods) {
            localStorage.setItem("wellnez_payment_methods", JSON.stringify(methods));
        },
        getUPISettings() {
            const stored = localStorage.getItem("wellnez_upi_settings");
            return stored ? JSON.parse(stored) : { upiId: "", qrBase64: "" };
        }
    };

    // ==========================================================================
    // 2. CLIENT-SIDE ROUTER
    // ==========================================================================

    const SEO_MAP = {
        "/": { title: "your Wellnez | Skin Barrier-First Skincare", desc: "Dermatologist-formulated, barrier-supporting skincare." },
        "/shop": { title: "Shop All | your Wellnez", desc: "Browse our premium range of skin-barrier friendly products." },
        "/about": { title: "Our Story | your Wellnez", desc: "Learn about your Wellnez. Bridging the gap between viral beauty trends and science." },
        "/contact": { title: "Contact Us | your Wellnez", desc: "Get in touch with the your Wellnez skincare experts." },
        "/faq": { title: "FAQs | your Wellnez", desc: "Find answers to frequently asked questions." },
        "/checkout": { title: "Secure Checkout | your Wellnez", desc: "Complete your your Wellnez purchase securely." },
        "/account": { title: "My Account | your Wellnez", desc: "Access your your Wellnez account and track shipments." },
        "/wishlist": { title: "My Wishlist | your Wellnez", desc: "View your saved skincare items." },
        "/privacy-policy": { title: "Privacy Policy | your Wellnez", desc: "Privacy Guidelines." },
        "/shipping-policy": { title: "Shipping & Delivery Policy | your Wellnez", desc: "Details on shipping." },
        "/return-policy": { title: "Returns & Refund Policy | your Wellnez", desc: "Refund Guidelines." },
        "/terms-conditions": { title: "Terms & Conditions | your Wellnez", desc: "Terms of website usage." },
        "/admin": { title: "Merchant Dashboard | your Wellnez Admin", desc: "Internal admin portal for managing operations." },
        "/admin-login": { title: "Admin Console Authentication | your Wellnez", desc: "Security gateway for merchant console." }
    };

    const Router = {
        routes: {},
        viewport: null,

        init(viewportElement) {
            this.viewport = viewportElement;
            window.addEventListener("hashchange", () => this.handleRoute());
            window.addEventListener("load", () => this.handleRoute());
        },

        register(hash, renderFunction) {
            this.routes[hash] = renderFunction;
        },

        async handleRoute() {
            const hash = window.location.hash || "#/";
            const cleanedHash = hash.replace(/^#/, "");

            // Toggle footer visibility for admin views
            const footer = document.querySelector(".main-footer");
            if (footer) {
                if (cleanedHash === "/admin" || cleanedHash === "/admin-login") {
                    footer.style.display = "none";
                } else {
                    footer.style.display = "";
                }
            }

            const navMenu = document.getElementById("nav-menu");
            if (navMenu) navMenu.classList.remove("active");

            const searchDropdown = document.getElementById("search-dropdown");
            if (searchDropdown) searchDropdown.classList.remove("active");

            window.scrollTo({ top: 0, behavior: "instant" });

            let routeRenderer = this.routes[cleanedHash];
            let params = {};

            if (!routeRenderer) {
                for (const registeredRoute in this.routes) {
                    if (registeredRoute.includes("/:")) {
                        const routePattern = registeredRoute.replace(/:[^\s/]+/g, "([^\\s/]+)");
                        const regex = new RegExp(`^${routePattern}$`);
                        const match = cleanedHash.match(regex);
                        if (match) {
                            routeRenderer = this.routes[registeredRoute];
                            const paramNames = registeredRoute.match(/:[^\s/]+/g).map(name => name.substring(1));
                            paramNames.forEach((name, i) => {
                                params[name] = match[i + 1];
                            });
                            break;
                        }
                    }
                }
            }
            // Standalone admin.html manages admin auth
            if (routeRenderer) {
                this.updateSEO(cleanedHash, params);
                try {
                    this.viewport.innerHTML = `<div style="text-align: center; padding: 100px 0;"><i class="fa-solid fa-spinner fa-spin fa-2x"></i></div>`;
                    const content = await routeRenderer(params);
                    this.viewport.innerHTML = content;
                    window.dispatchEvent(new CustomEvent("view-rendered", { detail: { hash: cleanedHash, params } }));
                } catch (err) {
                    console.error("Renderer error:", err);
                    this.viewport.innerHTML = this.renderErrorPage("Failed to render page");
                }
            } else {
                this.viewport.innerHTML = this.renderErrorPage("404 Page Not Found");
            }
        },

        updateSEO(hashPath, params) {
            let seo = SEO_MAP[hashPath] || { title: "your Wellnez", desc: "" };
            if (hashPath.startsWith("/product/")) {
                const product = Store.getProductById(params.id);
                if (product) {
                    seo = {
                        title: `${product.name} | your Wellnez Skincare`,
                        desc: `${product.name}: ${product.description.slice(0, 150)}...`
                    };
                }
            }
            document.title = seo.title;
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute("content", seo.desc);
            }
        },

        renderErrorPage(message) {
            return `
                <div style="text-align: center; padding: 100px 30px; max-width: 600px; margin: 0 auto;">
                    <h1 style="font-family: var(--font-heading); font-size: 4rem; font-weight: 800; margin-bottom: 20px;">Oops!</h1>
                    <p style="font-size: 1.15rem; color: var(--text-muted); margin-bottom: 30px;">${message}</p>
                    <a href="#/" class="btn btn-chrome">Back to Home</a>
                </div>
            `;
        }
    };

    // ==========================================================================
    // 3. CART DRAWER STATE & HELPER ACTIONS
    // ==========================================================================

    const COUPON_SESSION_KEY = "wellnez_active_coupon";

    const getAppliedCoupon = () => {
        try {
            return JSON.parse(sessionStorage.getItem(COUPON_SESSION_KEY)) || null;
        } catch {
            return null;
        }
    };

    const setAppliedCoupon = (coupon) => {
        if (coupon) {
            sessionStorage.setItem(COUPON_SESSION_KEY, JSON.stringify(coupon));
        } else {
            sessionStorage.removeItem(COUPON_SESSION_KEY);
        }
    };

    const CartController = {
        init() {
            const drawer = document.getElementById("cart-drawer");
            const overlay = document.getElementById("cart-overlay");
            const toggleBtn = document.getElementById("cart-toggle-btn");
            const closeBtn = document.getElementById("cart-drawer-close");
            const contBtn = document.getElementById("cart-continue-shopping");

            const openDrawer = () => {
                this.render();
                drawer.classList.add("active");
                overlay.classList.add("active");
            };

            const closeDrawer = () => {
                drawer.classList.remove("active");
                overlay.classList.remove("active");
            };

            if (toggleBtn) toggleBtn.addEventListener("click", openDrawer);
            if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
            if (contBtn) contBtn.addEventListener("click", closeDrawer);
            if (overlay) overlay.addEventListener("click", closeDrawer);

            window.addEventListener("cart-updated", () => {
                this.updateHeaderBadge();
                this.render();
            });

            this.updateHeaderBadge();
            this.bindEvents();
        },

        updateHeaderBadge() {
            const cart = Store.getCart();
            const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
            const countBadge = document.getElementById("cart-count");
            const drawerCount = document.getElementById("cart-drawer-count");
            if (countBadge) countBadge.innerText = totalItems;
            if (drawerCount) drawerCount.innerText = totalItems;
        },

        render() {
            const cartContent = document.getElementById("cart-drawer-content");
            if (!cartContent) return;

            const cart = Store.getCart();
            const subtotal = Store.getCartSubtotal();

            if (cart.length === 0) {
                cartContent.innerHTML = `
                    <div class="empty-cart-message">
                        <i class="fa-solid fa-bag-shopping"></i>
                        <p>Your shopping bag is empty.</p>
                        <a href="#/shop" class="btn btn-chrome" style="margin-top:20px; display:inline-block;" id="drawer-shop-now-btn">Shop Now</a>
                    </div>
                `;
                document.getElementById("cart-drawer-subtotal").innerText = "₹0";
                document.getElementById("cart-drawer-shipping").innerText = "Calculated at checkout";
                document.getElementById("cart-drawer-total").innerText = "₹0";
                document.getElementById("cart-drawer-discount-row").style.display = "none";
                setAppliedCoupon(null);

                const shopNowBtn = document.getElementById("drawer-shop-now-btn");
                if (shopNowBtn) {
                    shopNowBtn.addEventListener("click", () => {
                        document.getElementById("cart-drawer-close").click();
                    });
                }
                return;
            }

            cartContent.innerHTML = cart.map(item => {
                const product = Store.getProductById(item.productId);
                const maxQty = product ? product.stock : item.qty;
                return `
                    <div class="cart-item" data-id="${item.productId}">
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-item-details">
                            <h4 class="cart-item-title">${item.name}</h4>
                            <div class="cart-item-price">₹${item.price}</div>
                            <div class="cart-item-qty">
                                <button class="cart-qty-dec" data-id="${item.productId}">-</button>
                                <span>${item.qty}</span>
                                <button class="cart-qty-inc" data-id="${item.productId}" ${item.qty >= maxQty ? 'disabled style="color:#ccc; cursor:not-allowed;"' : ''}>+</button>
                            </div>
                        </div>
                        <button class="cart-item-remove" data-id="${item.productId}" aria-label="Remove item"><i class="fa-regular fa-trash-can"></i></button>
                    </div>
                `;
            }).join("");

            const shippingCharge = subtotal >= 999 ? 0 : 80;
            document.getElementById("cart-drawer-shipping").innerText = shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`;

            let discount = 0;
            const appliedCoupon = getAppliedCoupon();
            const discountRow = document.getElementById("cart-drawer-discount-row");
            const couponFeedback = document.getElementById("coupon-feedback");

            if (appliedCoupon) {
                const validation = Store.validateCoupon(appliedCoupon.code, subtotal);
                if (validation.valid) {
                    discount = validation.discount;
                    discountRow.style.display = "flex";
                    document.getElementById("cart-drawer-discount-code").innerText = appliedCoupon.code;
                    document.getElementById("cart-drawer-discount-amount").innerText = `-₹${discount}`;
                    couponFeedback.className = "coupon-feedback success";
                    couponFeedback.innerText = `Coupon '${appliedCoupon.code}' applied.`;
                } else {
                    setAppliedCoupon(null);
                    discountRow.style.display = "none";
                    couponFeedback.className = "coupon-feedback error";
                    couponFeedback.innerText = validation.message;
                }
            } else {
                discountRow.style.display = "none";
            }

            const total = Math.max(0, subtotal + shippingCharge - discount);
            document.getElementById("cart-drawer-subtotal").innerText = `₹${subtotal}`;
            document.getElementById("cart-drawer-total").innerText = `₹${total}`;
        },

        bindEvents() {
            const drawer = document.getElementById("cart-drawer");
            if (!drawer) return;

            drawer.addEventListener("click", (e) => {
                const target = e.target;

                const incBtn = target.closest(".cart-qty-inc");
                if (incBtn) {
                    const id = incBtn.dataset.id;
                    const cart = Store.getCart();
                    const item = cart.find(x => x.productId === id);
                    if (item) Store.updateCartQty(id, item.qty + 1);
                }

                const decBtn = target.closest(".cart-qty-dec");
                if (decBtn) {
                    const id = decBtn.dataset.id;
                    const cart = Store.getCart();
                    const item = cart.find(x => x.productId === id);
                    if (item) Store.updateCartQty(id, item.qty - 1);
                }

                const removeBtn = target.closest(".cart-item-remove");
                if (removeBtn) {
                    const id = removeBtn.dataset.id;
                    Store.removeFromCart(id);
                    window.dispatchEvent(new CustomEvent("toast", {
                        detail: { message: "Item removed from cart.", type: "success" }
                    }));
                }

                const checkoutBtn = target.closest("#cart-checkout-btn");
                if (checkoutBtn) {
                    document.getElementById("cart-drawer-close").click();
                }
            });

            const couponApplyBtn = document.getElementById("cart-coupon-apply-btn");
            const couponInput = document.getElementById("cart-coupon-input");
            const couponFeedback = document.getElementById("coupon-feedback");

            if (couponApplyBtn) {
                couponApplyBtn.addEventListener("click", () => {
                    const code = couponInput.value.trim().toUpperCase();
                    const subtotal = Store.getCartSubtotal();

                    if (!code) {
                        couponFeedback.className = "coupon-feedback error";
                        couponFeedback.innerText = "Please enter a coupon code.";
                        return;
                    }

                    const validation = Store.validateCoupon(code, subtotal);
                    if (validation.valid) {
                        setAppliedCoupon({ code: validation.code, discount: validation.discount });
                        this.render();
                        couponInput.value = "";
                    } else {
                        couponFeedback.className = "coupon-feedback error";
                        couponFeedback.innerText = validation.message;
                    }
                });

                couponInput.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") couponApplyBtn.click();
                });
            }
        }
    };

    // ==========================================================================
    // 4. VIEWS RENDERERS & BINDERS
    // ==========================================================================

    // A. HOME VIEW
    const HomeView = () => {
        const products = Store.getProducts();
        const productsHtml = products.map(product => {
            const ratingReviews = Store.getReviews(product.id);
            const avgRating = ratingReviews.length > 0
                ? (ratingReviews.reduce((sum, r) => sum + r.rating, 0) / ratingReviews.length).toFixed(1)
                : "5.0";

            const isWish = Store.isInWishlist(product.id);
            const inStock = product.stock > 0;

            return `
                <div class="product-card" data-product-id="${product.id}">
                    ${product.comparePrice > product.price ? `<span class="product-card-badge">Sale</span>` : ''}
                    <button class="product-card-wishlist ${isWish ? 'active' : ''}" data-id="${product.id}" aria-label="Add to Wishlist">
                        <i class="${isWish ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                    </button>
                    <a href="#/product/${product.id}">
                        <div class="product-card-image">
                            <img class="product-card-img" src="${product.image}" alt="${product.name}">
                            ${product.video 
                                ? `<video class="product-card-video-hover" src="${product.video}" loop muted playsinline preload="none"></video>`
                                : ''
                            }
                        </div>
                    </a>
                    <div class="product-card-info">
                        <div class="product-card-rating">
                            <i class="fa-solid fa-star"></i>
                            <span>${avgRating} (${ratingReviews.length})</span>
                        </div>
                        <a href="#/product/${product.id}">
                            <h3 class="product-card-title">${product.name}</h3>
                        </a>
                        <p class="product-card-skin">${product.skinType.split(",")[0]}</p>
                        <div class="product-card-bottom">
                            <div class="product-card-price">
                                ₹${product.price}
                                ${product.comparePrice > product.price ? `<span class="compare-price">₹${product.comparePrice}</span>` : ''}
                            </div>
                            ${inStock 
                                ? `<button class="btn btn-chrome product-card-cta add-to-cart-btn" data-id="${product.id}">Add to Bag</button>`
                                : `<button class="btn btn-outline product-card-cta" style="cursor:not-allowed;" disabled>Sold Out</button>`
                            }
                        </div>
                    </div>
                </div>
            `;
        }).join("");

        const REELS_DATA = [
            {
                productId: "face-wash",
                productName: "Slick Cleanse Wash",
                productPrice: 699,
                video: "https://player.vimeo.com/external/188216678.hd.mp4?s=2095ec96830131a5474bddcea37b82f2c98c54fa&profile_id=119",
                caption: "pH 5.5 gentle cleanse"
            },
            {
                productId: "sunscreen",
                productName: "Shield Guard SPF 50+",
                productPrice: 849,
                video: "https://player.vimeo.com/external/372535660.sd.mp4?s=396d52af437419d5b0b018d97b67d524e3a44a7d&profile_id=139&oauth2_token_id=1223210874",
                caption: "Zero white cast formula"
            },
            {
                productId: "face-toner",
                productName: "Dew Barrier Toner",
                productPrice: 699,
                video: "https://player.vimeo.com/external/372436717.sd.mp4?s=94b20ca07817031c0ad538e2227d413f8e716d95&profile_id=139&oauth2_token_id=1223210874",
                caption: "Milky hydration layers"
            },
            {
                productId: "moisturizing-cream",
                productName: "Ceramide Cushion Cream",
                productPrice: 899,
                video: "https://player.vimeo.com/external/551733120.sd.mp4?s=2e1a1ee51e923fd7529d774970fb2bdd56d9a65c&profile_id=165",
                caption: "Barrier repair in 3 days"
            },
            {
                productId: "eye-gel",
                productName: "Peptide Eye Gel",
                productPrice: 599,
                video: "https://player.vimeo.com/external/372789822.sd.mp4?s=ff563b4a77e1f7265a6d96d66ea9f96940d9acbe&profile_id=139&oauth2_token_id=1223210874",
                caption: "Instant morning depuff"
            },
            {
                productId: "serum",
                productName: "Niacinamide Serum",
                productPrice: 799,
                video: "https://player.vimeo.com/external/223840006.hd.mp4?s=54a1da69d40a39c25fa2088d50ed0d46447e7149&profile_id=175",
                caption: "Clear pores & smooth skin"
            }
        ];

        const reelsHtml = REELS_DATA.map(reel => `
            <div class="reel-item">
                <div class="reel-card" data-product-id="${reel.productId}">
                    <video class="reel-video" src="${reel.video}" loop muted autoplay playsinline></video>
                    <div class="reel-overlay">
                        <div class="reel-play-btn"><i class="fa-solid fa-play"></i></div>
                        <div class="reel-sound-indicator"><i class="fa-solid fa-volume-xmark"></i></div>
                        <div class="reel-info-box">
                            <p class="reel-caption">${reel.caption}</p>
                        </div>
                    </div>
                </div>
                <div class="reel-product-footer">
                    <a href="#/product/${reel.productId}" class="reel-product-title">${reel.productName}</a>
                    <span class="reel-product-price">₹${reel.productPrice}</span>
                    <button class="btn btn-chrome reel-buy-btn add-to-cart-btn" data-id="${reel.productId}">Add to Bag</button>
                </div>
            </div>
        `).join("");

        return `
            <section class="hero-banner">
                <div class="hero-container">
                    <div class="hero-text">
                        <span class="hero-badge">Clean & Cruelty-Free</span>
                        <h1>Skin Barrier First. Actives Second.</h1>
                        <p>High-performance skincare formulated to reinforce your natural lipids, lock in hydration, and shield against environmental stressors.</p>
                        <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                            <a href="#/shop" class="btn btn-chrome">Shop the collection</a>
                            <a href="#/about" class="btn btn-secondary">Our Philosophy</a>
                        </div>
                    </div>
                    <div class="hero-image-wrapper">
                        <div class="hero-circle"></div>
                        <img src="images/hero.png" alt="your Wellnez Skincare Products Hero">
                    </div>
                </div>
            </section>

            <section class="features-section">
                <div class="section-header">
                    <h2>Formulated for Skin Health</h2>
                    <p>We combine advanced dermatology concepts with clean ingredients to prioritize skin barrier defense.</p>
                </div>
                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon-wrapper"><i class="fa-solid fa-droplet"></i></div>
                        <h3>Intense Hydration</h3>
                        <p>Contains multi-molecular hyaluronic acid and natural lipids that mimic your skin's natural hydration matrix.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon-wrapper"><i class="fa-solid fa-shield-halved"></i></div>
                        <h3>Barrier First</h3>
                        <p>Soothes active breakouts and prevents water loss with dynamic Ceramide-NP integrations.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon-wrapper"><i class="fa-solid fa-flask"></i></div>
                        <h3>pH-Balanced</h3>
                        <p>Formulated at optimal physiological pH ranges (5.5 - 6.0) to preserve acid mantle homeostasis.</p>
                    </div>
                </div>
            </section>

            <section class="products-section">
                <div class="section-header">
                    <h2>Our Best Sellers</h2>
                    <p>Start your minimalist skincare routine with our dermatologist-approved core daily essentials.</p>
                </div>
                <div class="products-grid">${productsHtml}</div>
            </section>

            <!-- Social Reels Carousel Section (sacheu.com style) -->
            <section class="social-reels-section">
                <div class="section-header">
                    <span class="section-badge">#yourWellnezGlow</span>
                    <h2>How We Glow: See It In Action</h2>
                    <p>Real results. Real reviews. Tap a video to unmute and learn how to use our barrier-first skincare.</p>
                </div>
                <div class="reels-slider-wrapper">
                    <button class="reels-control-btn prev-btn" id="reels-prev-btn" aria-label="Previous videos"><i class="fa-solid fa-chevron-left"></i></button>
                    <div class="reels-container" id="reels-container">
                        ${reelsHtml}
                    </div>
                    <button class="reels-control-btn next-btn" id="reels-next-btn" aria-label="Next videos"><i class="fa-solid fa-chevron-right"></i></button>
                </div>
            </section>

            <section class="why-choose-us">
                <div class="why-container">
                    <div class="why-image">
                        <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=600" alt="skincare routine models">
                    </div>
                    <div class="why-content">
                        <h2>Why Choose your Wellnez?</h2>
                        <div class="why-items">
                            <div class="why-item">
                                <span class="why-item-num">01</span>
                                <div class="why-item-text">
                                    <h4>No Toxic Fillers</h4>
                                    <p>100% free from drying alcohols, synthetic fragrances, sulfates, and essential oils that trigger skin barrier breakdowns.</p>
                                </div>
                            </div>
                            <div class="why-item">
                                <span class="why-item-num">02</span>
                                <div class="why-item-text">
                                    <h4>Sustainable Materials</h4>
                                    <p>We use recyclable packaging and sustainably sourced organic botanical extracts for environmental stewardship.</p>
                                </div>
                            </div>
                            <div class="why-item">
                                <span class="why-item-num">03</span>
                                <div class="why-item-text">
                                    <h4>Transparent Ingredients</h4>
                                    <p>We disclose every single ingredient concentration. What you read on the bottle is exactly what you put on your skin.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="promo-offer-banner">
                <div class="promo-offer-container">
                    <h2>Enjoy 10% Off Your First Purchase</h2>
                    <p>Reinforce your skin barrier today. Enter code <strong style="font-family: var(--font-heading);">WELLNEZ10</strong> at checkout to apply discount.</p>
                    <a href="#/shop" class="btn btn-chrome">Unlock Coupon Now</a>
                </div>
            </section>

            <section class="reviews-section">
                <div class="section-header">
                    <h2>What the Glow Club Says</h2>
                    <p>Real reviews from real members who transformed their skin barrier health.</p>
                </div>
                <div class="reviews-container">
                    <div class="reviews-grid">
                        <div class="review-card">
                            <div class="review-stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
                            <h4 class="review-title">Dry patches are gone!</h4>
                            <p class="review-text">"I spent months repairing my barrier after over-exfoliating. Using the Slick Cleanse and Sunscreen combo saved my skin!"</p>
                            <span class="review-author">Aisha M.</span>
                        </div>
                        <div class="review-card">
                            <div class="review-stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
                            <h4 class="review-title">Best Sunscreen ever!</h4>
                            <p class="review-text">"Most sunscreens cause white casts or breakouts. This Matte SPF feels completely weightless and controls sebum grease."</p>
                            <span class="review-author">Karthik R.</span>
                        </div>
                        <div class="review-card">
                            <div class="review-stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
                            <h4 class="review-title">Gentle yet effective</h4>
                            <p class="review-text">"The cleanser feels extremely luxurious. It is gel-like, foaming gently, and strips nothing. Skin feels soft."</p>
                            <span class="review-author">Meera J.</span>
                        </div>
                    </div>
                </div>
            </section>
        `;
    };

    // B. SHOP VIEW
    const ShopView = () => {
        const isWishlistPage = window.location.hash.includes("/wishlist");
        const title = isWishlistPage ? "My Wishlist" : "Shop Skincare Essentials";
        const subtitle = isWishlistPage 
            ? "Your saved items. Keep track of what your skin barrier needs." 
            : "Reinforce your skin barrier with our dermatologist tested, fragrance-free collections.";

        return `
            <div class="shop-layout">
                <div class="section-header" style="text-align: left; margin-bottom: 40px; margin-left: 0; max-width: 800px;">
                    <h1 style="font-family: var(--font-heading); font-size: 2.5rem; font-weight: 800; text-transform: uppercase;">${title}</h1>
                    <p style="margin-top: 10px;">${subtitle}</p>
                </div>

                ${!isWishlistPage ? `
                <div class="shop-controls">
                    <div class="shop-search-wrapper">
                        <input type="text" id="shop-search-input" placeholder="Search skincare products...">
                        <button><i class="fa-solid fa-magnifying-glass"></i></button>
                    </div>
                    <div class="shop-filters-sort">
                        <select id="shop-filter-category" class="filter-select">
                            <option value="all">All Categories</option>
                            <option value="Cleanser">Cleansers</option>
                            <option value="Sun Care">Sun Care</option>
                            <option value="Toner">Toners</option>
                            <option value="Moisturizer">Moisturizers</option>
                            <option value="Eye Care">Eye Care</option>
                            <option value="Serum">Serums</option>
                        </select>
                        <select id="shop-sort" class="sort-select">
                            <option value="default">Sort By</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="name-asc">Alphabetical: A-Z</option>
                        </select>
                    </div>
                </div>
                ` : ''}

                <div class="products-grid" id="shop-products-grid"></div>
            </div>
        `;
    };

    const ShopViewSetup = () => {
        const isWishlistPage = window.location.hash.includes("/wishlist");
        const productsGrid = document.getElementById("shop-products-grid");
        if (!productsGrid) return;

        const searchInput = document.getElementById("shop-search-input");
        const categorySelect = document.getElementById("shop-filter-category");
        const sortSelect = document.getElementById("shop-sort");

        const renderGrid = () => {
            let products = Store.getProducts();

            if (isWishlistPage) {
                const wishlist = Store.getWishlist();
                products = products.filter(p => wishlist.includes(p.id));
                if (products.length === 0) {
                    productsGrid.innerHTML = `
                        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
                            <i class="fa-regular fa-heart" style="font-size: 3rem; margin-bottom: 15px; color: #ccc;"></i>
                            <p style="font-size: 1.15rem; margin-bottom: 20px;">Your wishlist is empty.</p>
                            <a href="#/shop" class="btn btn-chrome">Shop Products</a>
                        </div>
                    `;
                    return;
                }
            } else {
                const category = categorySelect.value;
                if (category !== "all") {
                    products = products.filter(p => p.category === category);
                }

                const query = searchInput.value.toLowerCase().trim();
                if (query) {
                    products = products.filter(p => 
                        p.name.toLowerCase().includes(query) || 
                        p.description.toLowerCase().includes(query) ||
                        p.category.toLowerCase().includes(query)
                    );
                }

                const sortVal = sortSelect.value;
                if (sortVal === "price-asc") {
                    products.sort((a, b) => a.price - b.price);
                } else if (sortVal === "price-desc") {
                    products.sort((a, b) => b.price - a.price);
                } else if (sortVal === "name-asc") {
                    products.sort((a, b) => a.name.localeCompare(b.name));
                }
            }

            if (products.length === 0) {
                productsGrid.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
                        <i class="fa-solid fa-magnifying-glass" style="font-size: 3rem; margin-bottom: 15px; color: #ccc;"></i>
                        <p style="font-size: 1.15rem;">No products found matching your criteria.</p>
                    </div>
                `;
                return;
            }

            productsGrid.innerHTML = products.map(product => {
                const ratingReviews = Store.getReviews(product.id);
                const avgRating = ratingReviews.length > 0
                    ? (ratingReviews.reduce((sum, r) => sum + r.rating, 0) / ratingReviews.length).toFixed(1)
                    : "5.0";
                const isWish = Store.isInWishlist(product.id);
                const inStock = product.stock > 0;

                return `
                    <div class="product-card" data-product-id="${product.id}">
                        ${product.comparePrice > product.price ? `<span class="product-card-badge">Sale</span>` : ''}
                        <button class="product-card-wishlist ${isWish ? 'active' : ''}" data-id="${product.id}" aria-label="Add to Wishlist">
                            <i class="${isWish ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                        </button>
                        <a href="#/product/${product.id}">
                            <div class="product-card-image">
                                <img class="product-card-img" src="${product.image}" alt="${product.name}">
                                ${product.video 
                                    ? `<video class="product-card-video-hover" src="${product.video}" loop muted playsinline preload="none"></video>`
                                    : ''
                                }
                            </div>
                        </a>
                        <div class="product-card-info">
                            <div class="product-card-rating">
                                <i class="fa-solid fa-star"></i>
                                <span>${avgRating} (${ratingReviews.length})</span>
                            </div>
                            <a href="#/product/${product.id}">
                                <h3 class="product-card-title">${product.name}</h3>
                            </a>
                            <p class="product-card-skin">${product.skinType.split(",")[0]}</p>
                            <div class="product-card-bottom">
                                <div class="product-card-price">
                                    ₹${product.price}
                                    ${product.comparePrice > product.price ? `<span class="compare-price">₹${product.comparePrice}</span>` : ''}
                                </div>
                                ${inStock 
                                    ? `<button class="btn btn-chrome product-card-cta add-to-cart-btn" data-id="${product.id}">Add to Bag</button>`
                                    : `<button class="btn btn-outline product-card-cta" style="cursor:not-allowed;" disabled>Sold Out</button>`
                                }
                            </div>
                        </div>
                    </div>
                `;
            }).join("");
        };

        if (!isWishlistPage) {
            searchInput.addEventListener("input", renderGrid);
            categorySelect.addEventListener("change", renderGrid);
            sortSelect.addEventListener("change", renderGrid);
        }
        renderGrid();
    };

    // C. PRODUCT DETAILS VIEW
    const ProductDetailsView = (params) => {
        const productId = params.id;
        const product = Store.getProductById(productId);

        if (!product) {
            return `
                <div style="text-align: center; padding: 100px 30px;">
                    <h1 style="font-family: var(--font-heading); font-size: 2.5rem; margin-bottom: 20px;">Product Not Found</h1>
                    <p style="color: var(--text-muted); margin-bottom: 35px;">The skincare product you are looking for does not exist or has been removed.</p>
                    <a href="#/shop" class="btn btn-chrome">Back to Shop</a>
                </div>
            `;
        }

        const ratingReviews = Store.getReviews(productId);
        const avgRating = ratingReviews.length > 0
            ? (ratingReviews.reduce((sum, r) => sum + r.rating, 0) / ratingReviews.length).toFixed(1)
            : "5.0";

        const drawStars = (rating) => {
            let stars = "";
            for (let i = 1; i <= 5; i++) {
                stars += `<i class="${i <= rating ? 'fa-solid' : 'fa-regular'} fa-star"></i>`;
            }
            return stars;
        };

        const inStock = product.stock > 0;
        const isWish = Store.isInWishlist(productId);

        const relatedProducts = Store.getProducts().filter(p => p.id !== productId).slice(0, 3);
        const relatedHtml = relatedProducts.map(p => {
            const relReviews = Store.getReviews(p.id);
            const relAvg = relReviews.length > 0
                ? (relReviews.reduce((sum, r) => sum + r.rating, 0) / relReviews.length).toFixed(1)
                : "5.0";
            return `
                <div class="product-card">
                    <a href="#/product/${p.id}">
                        <div class="product-card-image" style="height: 200px;">
                            <img class="product-card-img" src="${p.image}" alt="${p.name}" style="max-height: 160px;">
                            ${p.video 
                                ? `<video class="product-card-video-hover" src="${p.video}" loop muted playsinline preload="none"></video>`
                                : ''
                            }
                        </div>
                    </a>
                    <div class="product-card-info" style="padding: 15px; display: flex; flex-direction: column; align-items: center; text-align: center;">
                        <div class="product-card-rating" style="margin-bottom: 8px;">
                            <i class="fa-solid fa-star"></i>
                            <span>${relAvg}</span>
                        </div>
                        <a href="#/product/${p.id}">
                            <h4 class="product-card-title" style="font-size:0.95rem; text-transform: uppercase; margin-bottom: 6px;">${p.name}</h4>
                        </a>
                        <div class="product-card-bottom" style="margin-top: auto; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                            <span class="product-card-price" style="font-size: 1rem;">₹${p.price}</span>
                            <a href="#/product/${p.id}" class="btn btn-chrome product-card-cta" style="width: 100%; padding: 8px 12px; font-size: 0.75rem; text-align: center;">View Product</a>
                        </div>
                    </div>
                </div>
            `;
        }).join("");

        return `
            <div class="product-details-container">
                <div class="product-details-grid">
                    <div class="product-gallery">
                        <div class="product-gallery-main">
                            <img id="main-product-image" src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="product-gallery-thumbs">
                            <div class="gallery-thumb active" data-img="${product.image}">
                                <img src="${product.image}" alt="Product Angle 1">
                            </div>
                            <div class="gallery-thumb" data-img="https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=400">
                                <img src="https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=400" alt="Texture Swatch">
                            </div>
                        </div>
                    </div>

                    <div class="product-info-panel">
                        <span class="product-category-tag">${product.category}</span>
                        <h1 class="product-title-detail">${product.name}</h1>
                        <div class="product-card-rating" style="font-size:0.9rem; margin-bottom: 15px;">
                            <div style="color: #f1c40f;">${drawStars(Math.round(parseFloat(avgRating)))}</div>
                            <span style="font-weight:700; color:var(--text-main); margin-left: 5px;">${avgRating}</span>
                            <a href="#reviews-mount" style="text-decoration: underline; color: var(--text-muted); font-size:0.8rem; margin-left: 8px;">(${ratingReviews.length} Customer Reviews)</a>
                        </div>
                        <div class="product-price-detail">
                            ₹${product.price}
                            ${product.comparePrice > product.price ? `<span class="compare-price">₹${product.comparePrice}</span>` : ''}
                        </div>
                        <p class="product-description-detail">${product.description}</p>

                        <div class="product-actions-detail">
                            ${inStock ? `
                                <div class="product-quantity-selector">
                                    <button id="qty-decrement">-</button>
                                    <span id="qty-counter">1</span>
                                    <button id="qty-increment">+</button>
                                </div>
                                <button class="btn btn-chrome" id="detail-add-to-cart-btn" data-id="${product.id}">Add to Bag</button>
                                <button class="btn btn-secondary" id="detail-buy-now-btn" data-id="${product.id}">Buy Now</button>
                            ` : `
                                <button class="btn btn-outline btn-block" style="cursor:not-allowed; height: 48px;" disabled>Sold Out</button>
                            `}
                            <button class="btn btn-outline" id="detail-wishlist-btn" data-id="${product.id}" style="width: 48px; min-width: 48px; padding:0; display:flex; align-items:center; justify-content:center; font-size: 1.15rem;">
                                <i class="${isWish ? 'fa-solid' : 'fa-regular'} fa-heart" style="${isWish ? 'color:#ff4757;' : ''}"></i>
                            </button>
                        </div>

                        <div class="pincode-checker">
                            <h4><i class="fa-solid fa-truck-fast"></i> Check Delivery Availability</h4>
                            <div class="pincode-input-wrapper">
                                <input type="text" id="pincode-input" placeholder="Enter 6-digit Pincode" maxlength="6">
                                <button id="pincode-check-btn">Check</button>
                            </div>
                            <div class="pincode-feedback" id="pincode-feedback"></div>
                        </div>

                        <div class="product-tabs">
                            <div class="tab-item active">
                                <div class="tab-header">Benefits <i class="fa-solid fa-chevron-down"></i></div>
                                <div class="tab-content">
                                    <ul style="list-style-type: disc; padding-left: 20px; display: flex; flex-direction: column; gap: 8px;">
                                        ${product.benefits.map(b => `<li>${b}</li>`).join("")}
                                    </ul>
                                </div>
                            </div>
                            <div class="tab-item">
                                <div class="tab-header">Key Ingredients <i class="fa-solid fa-chevron-down"></i></div>
                                <div class="tab-content" style="line-height: 1.7;">
                                    <p style="font-weight: 700; margin-bottom: 8px; color: var(--text-main);">Full Ingredients List:</p>
                                    ${product.ingredients}
                                </div>
                            </div>
                            <div class="tab-item">
                                <div class="tab-header">How to Use <i class="fa-solid fa-chevron-down"></i></div>
                                <div class="tab-content">${product.howToUse}</div>
                            </div>
                            <div class="tab-item">
                                <div class="tab-header">Skin Type <i class="fa-solid fa-chevron-down"></i></div>
                                <div class="tab-content">
                                    <p><strong>Ideal For:</strong> ${product.skinType}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="product-reviews-section" id="reviews-mount">
                    <div class="section-header" style="text-align:left; margin-left:0; margin-bottom: 30px;">
                        <h2 style="font-family: var(--font-heading); font-size: 1.75rem; text-transform: uppercase;">Customer Reviews</h2>
                    </div>
                    <div class="reviews-summary-wrapper">
                        <div class="reviews-avg">
                            <span class="reviews-avg-num">${avgRating}</span>
                            <div class="reviews-avg-stars">
                                <div class="stars" style="color: #f1c40f;">${drawStars(Math.round(parseFloat(avgRating)))}</div>
                                <p>Based on ${ratingReviews.length} reviews</p>
                            </div>
                        </div>
                        <button class="btn btn-outline" id="toggle-review-form-btn">Write a Review</button>
                    </div>

                    <div class="review-form-card" id="review-form-card" style="display: none; margin-bottom: 40px;">
                        <h4>Write A Review</h4>
                        <form id="product-review-form">
                            <div class="form-group">
                                <label>Your Rating</label>
                                <div class="star-rating-input" id="star-rating-selector">
                                    <i class="fa-solid fa-star" data-rating="1"></i>
                                    <i class="fa-solid fa-star" data-rating="2"></i>
                                    <i class="fa-solid fa-star" data-rating="3"></i>
                                    <i class="fa-solid fa-star" data-rating="4"></i>
                                    <i class="fa-solid fa-star" data-rating="5"></i>
                                </div>
                                <input type="hidden" id="review-rating-value" value="5">
                            </div>
                            <div class="form-group">
                                <label for="review-author-name">Your Name</label>
                                <input type="text" id="review-author-name" class="form-control" placeholder="e.g. Priyan K." required>
                            </div>
                            <div class="form-group">
                                <label for="review-comment">Review Content</label>
                                <textarea id="review-comment" class="form-control" rows="4" placeholder="Share your experience..." required></textarea>
                            </div>
                            <button type="submit" class="btn btn-chrome">Submit Review</button>
                            <button type="button" class="btn btn-outline" id="cancel-review-btn" style="margin-left: 10px;">Cancel</button>
                        </form>
                    </div>

                    <div class="reviews-list">
                        ${ratingReviews.length > 0 ? ratingReviews.map(r => `
                            <div class="review-item">
                                <div class="review-item-header">
                                    <span class="review-item-user">
                                        ${r.name}
                                        ${r.verified ? `<span class="verified-buyer"><i class="fa-solid fa-circle-check"></i> Verified Buyer</span>` : ''}
                                    </span>
                                    <span class="review-item-date">${r.date}</span>
                                </div>
                                <div style="color: #f1c40f; font-size: 0.8rem; margin-bottom: 10px;">${drawStars(r.rating)}</div>
                                <p style="color: var(--text-muted); font-size:0.95rem;">${r.comment}</p>
                            </div>
                        `).join("") : `
                            <div style="text-align: center; padding: 40px; color: var(--text-muted);">
                                <p>No reviews yet. Be the first to share your experience!</p>
                            </div>
                        `}
                    </div>
                </div>

                ${relatedProducts.length > 0 ? `
                    <div style="border-top:1px solid var(--border-color); padding-top:60px; margin-top:60px;">
                        <div class="section-header" style="text-align:left; margin-left:0; margin-bottom:30px;">
                            <h2 style="font-family: var(--font-heading); font-size: 1.5rem; text-transform: uppercase;">You May Also Like</h2>
                        </div>
                        <div class="products-grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">${relatedHtml}</div>
                    </div>
                ` : ''}
            </div>
        `;
    };

    const ProductDetailsSetup = (params) => {
        const productId = params.id;
        const product = Store.getProductById(productId);
        if (!product) return;

        const mainImg = document.getElementById("main-product-image");
        const thumbs = document.querySelectorAll(".gallery-thumb");
        thumbs.forEach(thumb => {
            thumb.addEventListener("click", () => {
                thumbs.forEach(t => t.classList.remove("active"));
                thumb.classList.add("active");
                mainImg.src = thumb.dataset.img;
            });
        });

        const qtyCounter = document.getElementById("qty-counter");
        const decBtn = document.getElementById("qty-decrement");
        const incBtn = document.getElementById("qty-increment");
        if (decBtn && incBtn) {
            let qty = 1;
            decBtn.addEventListener("click", () => {
                if (qty > 1) {
                    qty--;
                    qtyCounter.innerText = qty;
                }
            });
            incBtn.addEventListener("click", () => {
                if (qty < product.stock) {
                    qty++;
                    qtyCounter.innerText = qty;
                }
            });
        }

        const wishBtn = document.getElementById("detail-wishlist-btn");
        if (wishBtn) {
            wishBtn.addEventListener("click", () => {
                Store.toggleWishlist(productId);
                const isWish = Store.isInWishlist(productId);
                const icon = wishBtn.querySelector("i");
                if (isWish) {
                    icon.className = "fa-solid fa-heart";
                    icon.style.color = "#ff4757";
                } else {
                    icon.className = "fa-regular fa-heart";
                    icon.style.color = "";
                }
            });
        }

        const addBtn = document.getElementById("detail-add-to-cart-btn");
        if (addBtn) {
            addBtn.addEventListener("click", () => {
                const qty = parseInt(document.getElementById("qty-counter").innerText) || 1;
                Store.addToCart(productId, qty);
                window.dispatchEvent(new CustomEvent("toast", {
                    detail: { message: `${product.name} added to cart!`, type: "success" }
                }));
                document.getElementById("cart-drawer").classList.add("active");
                document.getElementById("cart-overlay").classList.add("active");
            });
        }

        const buyBtn = document.getElementById("detail-buy-now-btn");
        if (buyBtn) {
            buyBtn.addEventListener("click", () => {
                const qty = parseInt(document.getElementById("qty-counter").innerText) || 1;
                Store.addToCart(productId, qty);
                window.location.hash = "#/checkout";
            });
        }

        const pinInput = document.getElementById("pincode-input");
        const pinCheckBtn = document.getElementById("pincode-check-btn");
        const pinFeedback = document.getElementById("pincode-feedback");
        if (pinCheckBtn) {
            pinCheckBtn.addEventListener("click", () => {
                const pin = pinInput.value.trim();
                if (!/^\d{6}$/.test(pin)) {
                    pinFeedback.className = "pincode-feedback error";
                    pinFeedback.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Please enter a valid 6-digit Pincode.`;
                    return;
                }
                const prefix = pin.substring(0, 2);
                const isMetro = ["11", "22", "40", "56", "60", "70", "38", "50"].includes(prefix);
                if (isMetro) {
                    pinFeedback.className = "pincode-feedback success";
                    pinFeedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> Serviceable! Estimated delivery in 2-3 Days. Free delivery available.`;
                } else {
                    pinFeedback.className = "pincode-feedback success";
                    pinFeedback.innerHTML = `<i class="fa-solid fa-circle-check"></i> Serviceable! Estimated delivery in 4-6 Days. Standard shipping fees apply.`;
                }
            });
            pinInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") pinCheckBtn.click();
            });
        }

        const tabHeaders = document.querySelectorAll(".tab-header");
        tabHeaders.forEach(header => {
            header.addEventListener("click", () => {
                header.parentElement.classList.toggle("active");
            });
        });

        const toggleFormBtn = document.getElementById("toggle-review-form-btn");
        const cancelFormBtn = document.getElementById("cancel-review-btn");
        const formCard = document.getElementById("review-form-card");
        if (toggleFormBtn && formCard) {
            toggleFormBtn.addEventListener("click", () => {
                formCard.style.display = formCard.style.display === "none" ? "block" : "none";
            });
        }
        if (cancelFormBtn) {
            cancelFormBtn.addEventListener("click", () => {
                formCard.style.display = "none";
            });
        }

        const starSelectors = document.querySelectorAll("#star-rating-selector i");
        const ratingInput = document.getElementById("review-rating-value");
        starSelectors.forEach(star => {
            star.addEventListener("click", () => {
                const r = parseInt(star.dataset.rating);
                ratingInput.value = r;
                starSelectors.forEach(s => {
                    const sr = parseInt(s.dataset.rating);
                    s.className = sr <= r ? "fa-solid fa-star active" : "fa-solid fa-star";
                });
            });
        });

        const reviewForm = document.getElementById("product-review-form");
        if (reviewForm) {
            reviewForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const rating = parseInt(ratingInput.value) || 5;
                const name = document.getElementById("review-author-name").value.trim();
                const comment = document.getElementById("review-comment").value.trim();
                if (!name || !comment) return;

                Store.addReview(productId, { name, rating, comment, verified: true });
                window.dispatchEvent(new CustomEvent("toast", {
                    detail: { message: "Review submitted successfully! Thank you.", type: "success" }
                }));
                reviewForm.reset();
                formCard.style.display = "none";
                Router.handleRoute(); // reload route content dynamically
            });
        }
    };

    // D. SECURE CHECKOUT VIEW
    const CheckoutView = () => {
        const cart = Store.getCart();
        const subtotal = Store.getCartSubtotal();

        if (cart.length === 0) {
            return `
                <div style="text-align: center; padding: 100px 30px;">
                    <h1 style="font-family: var(--font-heading); font-size: 2.5rem; margin-bottom: 20px;">Your Cart is Empty</h1>
                    <p style="color: var(--text-muted); margin-bottom: 35px;">Add products before heading to checkout.</p>
                    <a href="#/shop" class="btn btn-chrome">Shop Now</a>
                </div>
            `;
        }

        const shippingCharge = subtotal >= 999 ? 0 : 80;
        let discount = 0;
        const appliedCoupon = getAppliedCoupon();
        if (appliedCoupon) {
            const validation = Store.validateCoupon(appliedCoupon.code, subtotal);
            if (validation.valid) discount = validation.discount;
        }

        const total = Math.max(0, subtotal + shippingCharge - discount);
        const itemsHtml = cart.map(item => `
            <div class="checkout-item-row">
                <span class="checkout-item-name">${item.name} <span style="color: var(--text-muted);">x${item.qty}</span></span>
                <span class="checkout-item-qty-price">₹${item.price * item.qty}</span>
            </div>
        `).join("");

        const currentUser = Store.getCurrentUser() || {};
        return `
            <div class="checkout-container">
                <div class="section-header" style="text-align: left; margin-bottom: 45px; margin-left:0;">
                    <h1 style="font-family: var(--font-heading); font-size: 2.5rem; font-weight: 800; text-transform: uppercase;">Secure Checkout</h1>
                </div>
                <div class="checkout-grid" id="checkout-main-grid">
                    <form id="checkout-form">
                        <div class="checkout-section-card">
                            <h3>Shipping Information</h3>
                            <div class="form-group">
                                <label for="shipping-name">Full Name</label>
                                <input type="text" id="shipping-name" class="form-control" placeholder="e.g. Priyan K." value="${currentUser.username || ''}" required>
                            </div>
                            <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                                <div class="form-group">
                                    <label for="shipping-email">Email Address</label>
                                    <input type="email" id="shipping-email" class="form-control" placeholder="name@email.com" value="${currentUser.email || ''}" required>
                                </div>
                                <div class="form-group">
                                    <label for="shipping-phone">Phone Number</label>
                                    <input type="tel" id="shipping-phone" class="form-control" placeholder="9876543210" pattern="[6-9][0-9]{9}" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="shipping-address">Delivery Address</label>
                                <input type="text" id="shipping-address" class="form-control" placeholder="Street Address, Apartment, Suite" required>
                            </div>
                            <div class="grid-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                                <div class="form-group">
                                    <label for="shipping-city">City</label>
                                    <input type="text" id="shipping-city" class="form-control" placeholder="Mumbai" required>
                                </div>
                                <div class="form-group">
                                    <label for="shipping-pincode">Pincode</label>
                                    <input type="text" id="shipping-pincode" class="form-control" placeholder="400001" maxlength="6" pattern="[0-9]{6}" required>
                                </div>
                            </div>
                        </div>

                        <div class="checkout-section-card">
                            <h3>Payment Method</h3>
                            ${(() => {
                                const methods = Store.getPaymentMethods().filter(m => m.enabled);
                                if (methods.length === 0) {
                                    return `<div style="padding:20px; text-align:center; color:var(--text-muted); border:1px dashed var(--border-color);">
                                        <i class="fa-solid fa-ban" style="font-size:2rem; margin-bottom:10px; color:#e74c3c;"></i>
                                        <p>No payment methods are currently available. Please contact support.</p>
                                    </div>`;
                                }
                                const panelDetails = (() => {
                                    const upi = Store.getUPISettings();
                                    const hasQR = upi.qrBase64 && upi.qrBase64.length > 0;
                                    const hasId = upi.upiId && upi.upiId.length > 0;
                                    return {
                                        UPI: `<div class="upi-qr-mock" style="padding:20px;">
                                            ${hasQR
                                                ? `<img src="${upi.qrBase64}" alt="UPI QR Code" style="width:160px; height:160px; object-fit:contain; border:1px solid var(--border-color); padding:8px; background:#FFF; display:block; margin:0 auto 12px;">`
                                                : `<i class="fa-solid fa-qrcode" style="font-size:3.5rem; color:var(--text-muted); margin-bottom:12px;"></i>`
                                            }
                                            <p style="font-weight:700; margin-bottom:5px;">Scan & Pay with UPI</p>
                                            ${hasId ? `<p style="font-size:0.85rem; font-weight:600; color:#27ae60; margin-bottom:6px;"><i class="fa-solid fa-mobile-screen-button"></i> UPI ID: <strong style="color:var(--text-main);">${upi.upiId}</strong></p>` : ''}
                                            <p style="font-size:0.8rem; color:var(--text-muted);">Pay <strong>₹${total}</strong> · GPay, Paytm, PhonePe accepted</p>
                                            <div style="margin-top:12px; font-weight:700; color:#27ae60; font-size:0.8rem;"><i class="fa-solid fa-circle-notch fa-spin"></i> Awaiting secure UPI confirmation...</div>
                                        </div>`,
                                        Card: `<div class="form-group"><label for="card-name">Cardholder Name</label><input type="text" id="card-name" class="form-control"></div>
                                        <div class="form-group"><label for="card-num">Card Number</label><input type="text" id="card-num" class="form-control" placeholder="1234 5678 1234 5678" maxlength="19"></div>
                                        <div class="card-inputs-grid">
                                            <div class="form-group"><label for="card-expiry">Expiry Date</label><input type="text" id="card-expiry" class="form-control" placeholder="MM/YY" maxlength="5"></div>
                                            <div class="form-group"><label for="card-cvv">CVV</label><input type="password" id="card-cvv" class="form-control" placeholder="123" maxlength="3"></div>
                                        </div>`,
                                        NetBanking: `<div class="form-group"><label for="nb-bank">Select Your Bank</label>
                                            <select id="nb-bank" class="form-control">
                                                <option value="sbi">State Bank of India</option>
                                                <option value="hdfc">HDFC Bank</option>
                                                <option value="icici">ICICI Bank</option>
                                            </select></div>`,
                                        COD: `<p style="font-size:0.85rem; color:var(--text-muted);">Pay with cash upon delivery. No additional COD handling fees apply.</p>`
                                    };
                                })();
                                return `<div class="payment-methods-grid">
                                    ${methods.map((m, idx) => `
                                        <div class="payment-method-option ${idx === 0 ? 'selected' : ''}" data-method="${m.id}">
                                            <input type="radio" name="payment-method" id="pay-${m.id.toLowerCase()}" value="${m.id}" ${idx === 0 ? 'checked' : ''}>
                                            <label for="pay-${m.id.toLowerCase()}" style="font-weight:700; cursor:pointer;"><i class="${m.icon}" style="margin-right:8px;"></i> ${m.name}</label>
                                        </div>
                                        <div class="payment-details-panel ${idx === 0 ? 'active' : ''}" id="panel-${m.id}">
                                            ${panelDetails[m.id] || ''}
                                        </div>
                                    `).join('')}
                                </div>`;
                            })()}
                        </div>
                    </form>

                    <div class="checkout-summary-card">
                        <h4>Order Summary</h4>
                        <div class="checkout-items-list">${itemsHtml}</div>
                        <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px; border-bottom:1px solid var(--border-color); padding-bottom:20px;">
                            <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
                                <span>Subtotal</span>
                                <span>₹${subtotal}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
                                <span>Shipping</span>
                                <span>${shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}</span>
                            </div>
                            ${discount > 0 ? `
                            <div style="display:flex; justify-content:space-between; font-size:0.9rem; color:#27ae60; font-weight:700;">
                                <span>Discount (${appliedCoupon.code})</span>
                                <span>-₹${discount}</span>
                            </div>
                            ` : ''}
                        </div>
                        <div style="display:flex; justify-content:space-between; font-family: var(--font-heading); font-size:1.35rem; font-weight:800; margin-bottom:25px;">
                            <span>Total Due</span>
                            <span>₹${total}</span>
                        </div>
                        <button type="submit" form="checkout-form" class="btn btn-chrome btn-block" style="height: 50px;">Place Order</button>
                        <a href="#/shop" class="btn btn-outline btn-block" style="margin-top:10px; height: 50px; display:flex; align-items:center; justify-content:center;">Cancel Order</a>
                    </div>
                </div>
            </div>
        `;
    };

    const CheckoutSetup = () => {
        const checkoutForm = document.getElementById("checkout-form");
        if (!checkoutForm) return;

        const paymentMethods = document.querySelectorAll(".payment-method-option");
        const paymentPanels = document.querySelectorAll(".payment-details-panel");

        paymentMethods.forEach(method => {
            method.addEventListener("click", () => {
                paymentMethods.forEach(m => m.classList.remove("selected"));
                paymentPanels.forEach(p => p.classList.remove("active"));

                method.classList.add("selected");
                const radio = method.querySelector('input[type="radio"]');
                radio.checked = true;

                const selectedMethod = method.dataset.method;
                const panel = document.getElementById(`panel-${selectedMethod}`);
                if (panel) panel.classList.add("active");
            });
        });

        const cardNumInput = document.getElementById("card-num");
        if (cardNumInput) {
            cardNumInput.addEventListener("input", (e) => {
                let val = e.target.value.replace(/\D/g, "");
                let formatted = val.match(/.{1,4}/g)?.join(" ") || "";
                e.target.value = formatted.substring(0, 19);
            });
        }

        const cardExpiryInput = document.getElementById("card-expiry");
        if (cardExpiryInput) {
            cardExpiryInput.addEventListener("input", (e) => {
                let val = e.target.value.replace(/\D/g, "");
                e.target.value = val.length >= 2 ? val.substring(0, 2) + "/" + val.substring(2, 4) : val;
            });
        }

        checkoutForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("shipping-name").value.trim();
            const email = document.getElementById("shipping-email").value.trim();
            const phone = document.getElementById("shipping-phone").value.trim();
            const address = document.getElementById("shipping-address").value.trim();
            const city = document.getElementById("shipping-city").value.trim();
            const pincode = document.getElementById("shipping-pincode").value.trim();

            const paymentRadio = document.querySelector('input[name="payment-method"]:checked');
            const paymentMethod = paymentRadio ? paymentRadio.value : "UPI";

            if (paymentMethod === "Card") {
                const cardName = document.getElementById("card-name").value.trim();
                const cardNum = document.getElementById("card-num").value.trim();
                const cardExpiry = document.getElementById("card-expiry").value.trim();
                const cardCvv = document.getElementById("card-cvv").value.trim();
                if (!cardName || cardNum.length < 19 || cardExpiry.length < 5 || cardCvv.length < 3) {
                    window.dispatchEvent(new CustomEvent("toast", {
                        detail: { message: "Please fill in all credit card details correctly.", type: "error" }
                    }));
                    return;
                }
            }

            const cart = Store.getCart();
            const subtotal = Store.getCartSubtotal();
            const shippingCharge = subtotal >= 999 ? 0 : 80;

            let discount = 0;
            const appliedCoupon = getAppliedCoupon();
            if (appliedCoupon) {
                const validation = Store.validateCoupon(appliedCoupon.code, subtotal);
                if (validation.valid) discount = validation.discount;
            }

            const total = Math.max(0, subtotal + shippingCharge - discount);
            const placedOrder = Store.placeOrder({
                name, email, phone, address, city, pincode,
                items: cart, subtotal, discount, shippingCharge, total, paymentMethod
            });

            Store.clearCart();
            setAppliedCoupon(null);

            const mainContainer = document.getElementById("checkout-main-grid");
            if (mainContainer) {
                document.querySelector(".checkout-container").innerHTML = `
                    <div style="text-align: center; padding: 60px 20px; max-width: 600px; margin: 0 auto;">
                        <div style="width: 80px; height: 80px; background-color:#27ae60; color:#FFF; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:2.5rem; margin: 0 auto 30px;">
                            <i class="fa-solid fa-circle-check"></i>
                        </div>
                        <h1 style="font-family: var(--font-heading); font-size: 2.25rem; font-weight:800; text-transform: uppercase; margin-bottom: 15px;">Order Placed!</h1>
                        <p style="font-size:1.1rem; color: var(--text-muted); margin-bottom: 30px;">Thank you for your purchase, ${name}!</p>
                        
                        <div style="background-color:#FFF; border:1px solid var(--border-color); padding: 25px; text-align: left; margin-bottom: 40px;">
                            <h4 style="font-family: var(--font-heading); border-bottom:1px solid var(--border-color); padding-bottom:10px; margin-bottom:15px; text-transform:uppercase;">Order Summary</h4>
                            <div style="display:flex; justify-content:space-between; margin-bottom: 8px; font-size:0.9rem;">
                                <span>Order ID:</span>
                                <strong style="font-family: var(--font-heading);">${placedOrder.id}</strong>
                            </div>
                            <div style="display:flex; justify-content:space-between; margin-bottom: 8px; font-size:0.9rem;">
                                <span>Delivery Address:</span>
                                <span style="max-width: 250px; text-align: right; color:var(--text-muted);">${placedOrder.shippingAddress}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; border-top:1px solid var(--border-color); padding-top:10px; margin-top:10px; font-family: var(--font-heading); font-weight:800; font-size:1.1rem;">
                                <span>Total Paid:</span>
                                <span>₹${placedOrder.total}</span>
                            </div>
                        </div>

                        <div style="display: flex; gap: 15px; flex-wrap:wrap; justify-content: center;">
                            <a href="#/account" class="btn btn-chrome">Track My Order</a>
                            <a href="#/shop" class="btn btn-secondary">Continue Shopping</a>
                        </div>
                    </div>
                `;
                window.dispatchEvent(new CustomEvent("toast", {
                    detail: { message: "Order placed successfully!", type: "success" }
                }));
            }
        });
    };

    // E. CUSTOMER ACCOUNT VIEW
    const AccountView = () => {
        const user = Store.getCurrentUser();

        if (!user) {
            return `
                <div class="account-container" style="background-color: var(--bg-primary); padding: 80px 20px; display: flex; align-items: center; justify-content: center; min-height: calc(100vh - 400px);">
                    <div class="auth-centered-card">
                        <div class="auth-tabs">
                            <button class="auth-tab-btn active" data-target="login-form-container">Sign In</button>
                            <button class="auth-tab-btn" data-target="signup-form-container">Create Account</button>
                        </div>
                        
                        <!-- Sign In Panel -->
                        <div id="login-form-container" class="auth-form-panel active">
                            <p class="auth-panel-intro">Welcome back! Sign in to track your skincare shipments and orders.</p>
                            <form id="login-form">
                                <div class="elegant-form-group">
                                    <input type="email" id="login-email" class="elegant-input" placeholder=" " required autocomplete="email">
                                    <label for="login-email" class="elegant-label">Email Address</label>
                                </div>
                                <div class="elegant-form-group">
                                    <input type="password" id="login-password" class="elegant-input" placeholder=" " required autocomplete="current-password">
                                    <label for="login-password" class="elegant-label">Password</label>
                                </div>
                                <button type="submit" class="btn btn-chrome btn-block" style="margin-top: 15px; height: 50px;">Sign In</button>
                            </form>
                            <div class="auth-demo-credentials">
                                Demo: <strong>user@wellnez.com</strong> / <strong>password123</strong>
                            </div>
                        </div>
                        
                        <!-- Create Account Panel -->
                        <div id="signup-form-container" class="auth-form-panel">
                            <p class="auth-panel-intro">Join the Glow Club to track shipments, get customized product routines, and manage orders.</p>
                            <form id="signup-form">
                                <div class="elegant-form-group">
                                    <input type="text" id="signup-username" class="elegant-input" placeholder=" " required autocomplete="username">
                                    <label for="signup-username" class="elegant-label">Username</label>
                                </div>
                                <div class="elegant-form-group">
                                    <input type="email" id="signup-email" class="elegant-input" placeholder=" " required autocomplete="email">
                                    <label for="signup-email" class="elegant-label">Email Address</label>
                                </div>
                                <div class="elegant-form-group">
                                    <input type="password" id="signup-password" class="elegant-input" placeholder=" " minlength="6" required autocomplete="new-password">
                                    <label for="signup-password" class="elegant-label">Password</label>
                                </div>
                                <button type="submit" class="btn btn-secondary btn-block" style="margin-top: 15px; height: 50px;">Create Account</button>
                            </form>
                        </div>
                    </div>
                </div>
            `;
        }

        const activeTab = getActiveTab();
        const orders = Store.getUserOrders(user.email);

        const renderProfileTab = () => `
            <div class="account-panel-title">My Profile</div>
            <div style="display:flex; flex-direction:column; gap:20px;">
                <div style="display:grid; grid-template-columns: 1fr 2fr; padding-bottom: 15px; border-bottom: 1px dashed var(--border-color);">
                    <strong>Name:</strong><span>${user.username}</span>
                </div>
                <div style="display:grid; grid-template-columns: 1fr 2fr; padding-bottom: 15px; border-bottom: 1px dashed var(--border-color);">
                    <strong>Email Address:</strong><span>${user.email}</span>
                </div>
                <div style="display:grid; grid-template-columns: 1fr 2fr; padding-bottom: 15px; border-bottom: 1px dashed var(--border-color);">
                    <strong>Membership Status:</strong><span><span class="promo-badge">Glow Club Member</span></span>
                </div>
                ${user.role === "admin" ? `<div style="margin-top: 20px;"><a href="#/admin" class="btn btn-chrome">Access Admin Control Panel</a></div>` : ''}
            </div>
        `;

        const renderOrdersTab = () => {
            if (orders.length === 0) {
                return `
                    <div class="account-panel-title">Order History</div>
                    <div style="text-align:center; padding: 40px 10px; color: var(--text-muted);">
                        <i class="fa-solid fa-receipt" style="font-size: 3rem; margin-bottom: 15px; color: #ccc;"></i>
                        <p>You haven't placed any orders yet.</p>
                        <a href="#/shop" class="btn btn-chrome">Shop Best Sellers</a>
                    </div>
                `;
            }

            const ordersListHtml = orders.map(order => `
                <tr>
                    <td><strong style="font-family:var(--font-heading);">${order.id}</strong></td>
                    <td>${order.date}</td>
                    <td>₹${order.total}</td>
                    <td><span class="status-badge ${order.status.toLowerCase()}">${order.status}</span></td>
                    <td><button class="btn btn-outline view-order-details-btn" data-id="${order.id}" style="padding:6px 12px; font-size:0.75rem;">Details</button></td>
                </tr>
            `).join("");

            return `
                <div class="account-panel-title">Order History</div>
                <div class="table-responsive">
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>${ordersListHtml}</tbody>
                    </table>
                </div>
            `;
        };

        const renderTrackingTab = () => {
            const latestOrder = orders.length > 0 ? orders[0] : null;
            return `
                <div class="account-panel-title">Order Tracking</div>
                <p style="color:var(--text-muted); margin-bottom:25px;">Enter your Order ID to track shipment.</p>
                <div style="display:flex; border: 1px solid var(--border-dark); max-width: 500px; margin-bottom: 40px; background-color:#FFF;">
                    <input type="text" id="track-id-input" class="form-control" style="border:none; padding:10px 15px; background:none;" placeholder="e.g. WN260708-4927" value="${latestOrder ? latestOrder.id : ''}">
                    <button id="track-submit-btn" class="btn btn-secondary" style="border:none; border-radius:0;">Track</button>
                </div>
                <div id="tracking-display-area">
                    ${latestOrder ? renderTrackingTimeline(latestOrder) : `
                        <div style="text-align:center; padding: 30px; color:var(--text-muted); border: 1px dashed var(--border-color);">
                            <i class="fa-solid fa-map-location-dot" style="font-size: 2.5rem; margin-bottom: 12px; color: #ccc;"></i>
                            <p>Awaiting Order ID to track shipment...</p>
                        </div>
                    `}
                </div>
            `;
        };

        const activePanelHtml = activeTab === "profile" 
            ? renderProfileTab() 
            : activeTab === "orders" 
                ? renderOrdersTab() 
                : renderTrackingTab();

        return `
            <div class="account-container">
                <div class="account-dashboard-grid">
                    <div class="account-nav">
                        <div style="padding: 0 25px 20px; border-bottom: 1px solid var(--border-color); margin-bottom: 15px;">
                            <h4 style="font-family:var(--font-heading); font-size:1.1rem; text-transform:uppercase;">Hello, ${user.username}</h4>
                            <span style="font-size:0.75rem; color:var(--text-muted);">${user.email}</span>
                        </div>
                        <button class="account-nav-btn ${activeTab === 'profile' ? 'active' : ''}" data-tab="profile"><i class="fa-regular fa-id-card" style="margin-right:10px;"></i> Profile</button>
                        <button class="account-nav-btn ${activeTab === 'orders' ? 'active' : ''}" data-tab="orders"><i class="fa-solid fa-box-open" style="margin-right:10px;"></i> Orders</button>
                        <button class="account-nav-btn ${activeTab === 'tracking' ? 'active' : ''}" data-tab="tracking"><i class="fa-solid fa-truck-ramp-box" style="margin-right:10px;"></i> Track Order</button>
                        <button class="account-nav-btn" id="logout-btn" style="color:#d63031; margin-top:20px; border-top: 1px dashed var(--border-color); padding-top:20px;"><i class="fa-solid fa-arrow-right-from-bracket" style="margin-right:10px;"></i> Logout</button>
                    </div>
                    <div class="account-content-panel">${activePanelHtml}</div>
                </div>
            </div>

            <div class="modal-overlay" id="order-details-modal">
                <div class="modal-content-card">
                    <button class="modal-close-btn" id="order-modal-close">&times;</button>
                    <div class="modal-title">Order Details</div>
                    <div id="modal-order-content"></div>
                </div>
            </div>
        `;
    };

    const renderTrackingTimeline = (order) => {
        const statuses = ["Pending", "Processing", "Shipped", "Delivered"];
        const currentIdx = statuses.indexOf(order.status);
        const progressWidth = currentIdx >= 0 ? Math.round((currentIdx / 3) * 100) : 0;

        let estMessage = "";
        if (order.status === "Pending") estMessage = "Awaiting merchant review.";
        else if (order.status === "Processing") estMessage = "Packaging your items. Dispatches within 24 hours.";
        else if (order.status === "Shipped") estMessage = `In transit. Estimated arrival in 2 days. Pincode: ${order.pincode}`;
        else if (order.status === "Delivered") estMessage = "Delivered successfully! Thank you.";

        const getProgressStyle = () => {
            const isMobile = window.innerWidth <= 767;
            return isMobile ? `height: ${progressWidth}%; width: 3px;` : `width: ${progressWidth}%; height: 3px;`;
        };

        return `
            <div class="tracking-wrapper">
                <div class="tracking-header">
                    <div>
                        <span class="tracking-id">Order ID: ${order.id}</span>
                        <p style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">Placed: ${order.date}</p>
                    </div>
                    <span class="status-badge ${order.status.toLowerCase()}">${order.status}</span>
                </div>
                <p class="tracking-est"><strong>Status:</strong> ${estMessage}</p>
                <div class="tracking-timeline">
                    <div class="tracking-timeline-progress" style="${getProgressStyle()}"></div>
                    <div class="tracking-step ${currentIdx >= 0 ? 'completed' : ''} ${currentIdx === 0 ? 'active' : ''}">
                        <div class="tracking-node"><i class="fa-solid fa-check"></i></div>
                        <div class="tracking-label">Received</div>
                    </div>
                    <div class="tracking-step ${currentIdx >= 1 ? 'completed' : ''} ${currentIdx === 1 ? 'active' : ''}">
                        <div class="tracking-node"><i class="fa-solid fa-spinner"></i></div>
                        <div class="tracking-label">Processing</div>
                    </div>
                    <div class="tracking-step ${currentIdx >= 2 ? 'completed' : ''} ${currentIdx === 2 ? 'active' : ''}">
                        <div class="tracking-node"><i class="fa-solid fa-truck"></i></div>
                        <div class="tracking-label">In Transit</div>
                    </div>
                    <div class="tracking-step ${currentIdx >= 3 ? 'completed' : ''} ${currentIdx === 3 ? 'active' : ''}">
                        <div class="tracking-node"><i class="fa-solid fa-house-chimney-user"></i></div>
                        <div class="tracking-label">Delivered</div>
                    </div>
                </div>
            </div>
        `;
    };

    const AccountSetup = () => {
        const tabBtns = document.querySelectorAll(".auth-tab-btn");
        tabBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                tabBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                
                const targetId = btn.dataset.target;
                document.querySelectorAll(".auth-form-panel").forEach(panel => {
                    panel.classList.remove("active");
                });
                const activePanel = document.getElementById(targetId);
                if (activePanel) {
                    activePanel.classList.add("active");
                }
            });
        });

        const loginForm = document.getElementById("login-form");
        const signupForm = document.getElementById("signup-form");

        if (loginForm) {
            loginForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const email = document.getElementById("login-email").value.trim();
                const password = document.getElementById("login-password").value.trim();
                const result = Store.login(email, password);
                if (result.success) {
                    window.dispatchEvent(new CustomEvent("toast", {
                        detail: { message: `Welcome back, ${result.user.username}!`, type: "success" }
                    }));
                    setActiveTab("profile");
                    window.dispatchEvent(new Event("auth-changed"));
                    Router.handleRoute();
                } else {
                    window.dispatchEvent(new CustomEvent("toast", {
                        detail: { message: result.message, type: "error" }
                    }));
                }
            });
        }

        if (signupForm) {
            signupForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const username = document.getElementById("signup-username").value.trim();
                const email = document.getElementById("signup-email").value.trim();
                const password = document.getElementById("signup-password").value.trim();
                const result = Store.signup(username, email, password);
                if (result.success) {
                    window.dispatchEvent(new CustomEvent("toast", {
                        detail: { message: "Account registered successfully!", type: "success" }
                    }));
                    setActiveTab("profile");
                    window.dispatchEvent(new Event("auth-changed"));
                    Router.handleRoute();
                } else {
                    window.dispatchEvent(new CustomEvent("toast", {
                        detail: { message: result.message, type: "error" }
                    }));
                }
            });
        }

        const navButtons = document.querySelectorAll(".account-nav-btn[data-tab]");
        navButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                setActiveTab(btn.dataset.tab);
                Router.handleRoute();
            });
        });

        const logoutBtn = document.getElementById("logout-btn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                Store.logout();
                setActiveTab("profile");
                window.dispatchEvent(new CustomEvent("toast", {
                    detail: { message: "Logged out successfully.", type: "success" }
                }));
                window.location.hash = "#/";
            });
        }

        const modal = document.getElementById("order-details-modal");
        const modalClose = document.getElementById("order-modal-close");
        const modalContent = document.getElementById("modal-order-content");
        const detailButtons = document.querySelectorAll(".view-order-details-btn");

        if (modal && modalClose) {
            detailButtons.forEach(btn => {
                btn.addEventListener("click", () => {
                    const order = Store.getOrderById(btn.dataset.id);
                    if (!order) return;

                    const orderItemsHtml = order.items.map(item => `
                        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px dashed var(--border-color); font-size:0.85rem;">
                            <span style="font-weight:700;">${item.name} <span style="font-weight:400; color:var(--text-muted);">x${item.qty}</span></span>
                            <span>₹${item.price * item.qty}</span>
                        </div>
                    `).join("");

                    modalContent.innerHTML = `
                        <div style="display:flex; flex-direction:column; gap:12px;">
                            <div style="display:flex; justify-content:space-between;"><span>Order ID:</span><strong>${order.id}</strong></div>
                            <div style="display:flex; justify-content:space-between;"><span>Status:</span><span class="status-badge ${order.status.toLowerCase()}">${order.status}</span></div>
                            <div style="display:flex; justify-content:space-between;"><span>Address:</span><span style="max-width:200px; text-align:right; font-size:0.8rem; color:var(--text-muted);">${order.shippingAddress}</span></div>
                            <div style="margin-top: 15px; border-top:1px solid var(--border-color); padding-top:15px;">
                                <h5 style="font-family:var(--font-heading); text-transform:uppercase; margin-bottom:10px;">Items</h5>
                                ${orderItemsHtml}
                            </div>
                            <div style="display:flex; justify-content:space-between; margin-top:10px; font-size:0.9rem;"><span>Subtotal:</span><span>₹${order.subtotal}</span></div>
                            ${order.discount > 0 ? `<div style="display:flex; justify-content:space-between; font-size:0.9rem; color:#27ae60; font-weight:700;"><span>Discount:</span><span>-₹${order.discount}</span></div>` : ''}
                            <div style="display:flex; justify-content:space-between; font-size:0.9rem;"><span>Shipping:</span><span>${order.shippingCharge === 0 ? 'FREE' : `₹${order.shippingCharge}`}</span></div>
                            <div style="display:flex; justify-content:space-between; border-top: 1px solid var(--border-color); padding-top:10px; font-family:var(--font-heading); font-weight:800; font-size:1.15rem;"><span>Total:</span><span>₹${order.total}</span></div>
                        </div>
                    `;
                    modal.classList.add("active");
                });
            });

            modalClose.onclick = () => modal.classList.remove("active");
            modal.onclick = (e) => { if (e.target === modal) modal.classList.remove("active"); };
        }

        const trackInput = document.getElementById("track-id-input");
        const trackBtn = document.getElementById("track-submit-btn");
        const trackArea = document.getElementById("tracking-display-area");

        if (trackBtn && trackInput && trackArea) {
            trackBtn.addEventListener("click", () => {
                const trackId = trackInput.value.trim().toUpperCase();
                if (!trackId) return;

                const order = Store.getOrderById(trackId);
                if (!order) {
                    trackArea.innerHTML = `
                        <div style="text-align:center; padding: 30px; color:#e74c3c; border: 1px dashed #e74c3c; background-color:#fdf2f2;">
                            <i class="fa-solid fa-triangle-exclamation" style="font-size: 2.5rem; margin-bottom: 12px;"></i>
                            <p><strong>Tracking Error:</strong> Order ID <strong>${trackId}</strong> not found.</p>
                        </div>
                    `;
                    return;
                }
                trackArea.innerHTML = renderTrackingTimeline(order);
            });
            trackInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter") trackBtn.click();
            });
        }
    };

    // F. ADMIN DASHBOARD VIEW
    const getAdminTab = () => sessionStorage.getItem(ADMIN_TAB_KEY) || "dashboard";
    const setAdminTab = (tab) => sessionStorage.setItem(ADMIN_TAB_KEY, tab);
    const ADMIN_TAB_KEY = "wellnez_admin_active_tab";

    const AdminView = () => {
        const kpis = Store.getAdminKPIs();
        const activeTab = getAdminTab();

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
                    </div>
                    <div class="table-responsive">
                        <table class="admin-table">
                            <thead>
                                <tr><th>Image</th><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
                            </thead>
                            <tbody>${productRows}</tbody>
                        </table>
                    </div>
                </div>
            `;
        };

        const renderOrdersTab = () => {
            const orders = Store.getOrders();
            const orderRows = orders.map(o => `
                <tr>
                    <td><strong>${o.id}</strong></td>
                    <td>${o.customerName}<br><span style="font-size:0.75rem; color:var(--text-muted);">${o.customerEmail}</span></td>
                    <td>₹${o.total}</td>
                    <td>
                        <select class="admin-order-status-select filter-select" data-id="${o.id}">
                            <option value="Pending" ${o.status === "Pending" ? "selected" : ""}>Pending</option>
                            <option value="Processing" ${o.status === "Processing" ? "selected" : ""}>Processing</option>
                            <option value="Shipped" ${o.status === "Shipped" ? "selected" : ""}>Shipped</option>
                            <option value="Delivered" ${o.status === "Delivered" ? "selected" : ""}>Delivered</option>
                        </select>
                    </td>
                    <td>${o.date}</td>
                    <td><button class="btn btn-outline admin-view-order-btn" data-id="${o.id}">Items</button></td>
                </tr>
            `).join("");

            return `
                <div class="admin-section-box">
                    <h3>Orders List</h3>
                    <div class="table-responsive">
                        <table class="admin-table">
                            <thead>
                                <tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th><th>Action</th></tr>
                            </thead>
                            <tbody>
                                ${orderRows.length > 0 ? orderRows : '<tr><td colspan="6" style="text-align:center;">No orders.</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        };

        const renderCouponsTab = () => {
            const coupons = Store.getCoupons();
            const couponRows = coupons.map(c => `
                <tr>
                    <td><strong>${c.code}</strong></td>
                    <td>${c.discountType}</td>
                    <td>${c.discountType === "percentage" ? `${c.value}%` : `₹${c.value}`}</td>
                    <td>₹${c.minPurchase}</td>
                    <td><button class="btn btn-outline delete-coupon-btn" data-code="${c.code}" style="color:#d63031;"><i class="fa-regular fa-trash-can"></i></button></td>
                </tr>
            `).join("");

            return `
                <div class="admin-main-grid" style="grid-template-columns: 1.5fr 1fr;">
                    <div class="admin-section-box">
                        <h3>Active Coupons</h3>
                        <div class="table-responsive">
                            <table class="admin-table">
                                <thead>
                                    <tr><th>Code</th><th>Type</th><th>Value</th><th>Min Order</th><th>Action</th></tr>
                                </thead>
                                <tbody>${couponRows}</tbody>
                            </table>
                        </div>
                    </div>
                    <div class="admin-section-box">
                        <h3>Create Coupon</h3>
                        <form id="create-coupon-form">
                            <div class="form-group">
                                <label for="coupon-code-in">Coupon Code</label>
                                <input type="text" id="coupon-code-in" class="form-control" placeholder="e.g. GLOW50" required style="text-transform:uppercase;">
                            </div>
                            <div class="form-group">
                                <label for="coupon-type-in">Type</label>
                                <select id="coupon-type-in" class="form-control">
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="flat">Flat Cash (₹)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="coupon-value-in">Value</label>
                                <input type="number" id="coupon-value-in" class="form-control" required min="1">
                            </div>
                            <div class="form-group">
                                <label for="coupon-min-in">Min Order Value (₹)</label>
                                <input type="number" id="coupon-min-in" class="form-control" value="0" min="0">
                            </div>
                            <button type="submit" class="btn btn-chrome btn-block">Add Coupon</button>
                        </form>
                    </div>
                </div>
            `;
        };

        const renderCustomersTab = () => {
            const users = Store.getUsers().filter(u => u.role !== "admin");
            const userRows = users.map(u => `
                <tr>
                    <td><strong>${u.username}</strong></td>
                    <td>${u.email}</td>
                    <td><span class="promo-badge">Glow Club</span></td>
                </tr>
            `).join("");

            return `
                <div class="admin-section-box">
                    <h3>Customer Directory</h3>
                    <div class="table-responsive">
                        <table class="admin-table">
                            <thead>
                                <tr><th>Username</th><th>Email</th><th>Tier</th></tr>
                            </thead>
                            <tbody>
                                ${userRows.length > 0 ? userRows : '<tr><td colspan="3" style="text-align:center;">No customers.</td></tr>'}
                            </tbody>
                        </table>
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
                        : renderCustomersTab();

        return `
            <div class="admin-layout">
                <div class="admin-header-row">
                    <div>
                        <h1>your Wellnez Admin Panel</h1>
                    </div>
                    <div style="display:flex; gap:10px; flex-wrap:wrap;">
                        <button class="btn btn-outline admin-nav-tab ${activeTab === 'dashboard' ? 'btn-secondary' : ''}" data-tab="dashboard">Dashboard</button>
                        <button class="btn btn-outline admin-nav-tab ${activeTab === 'products' ? 'btn-secondary' : ''}" data-tab="products">Products</button>
                        <button class="btn btn-outline admin-nav-tab ${activeTab === 'orders' ? 'btn-secondary' : ''}" data-tab="orders">Orders</button>
                        <button class="btn btn-outline admin-nav-tab ${activeTab === 'coupons' ? 'btn-secondary' : ''}" data-tab="coupons">Coupons</button>
                        <button class="btn btn-outline admin-nav-tab ${activeTab === 'customers' ? 'btn-secondary' : ''}" data-tab="customers">Customers</button>
                    </div>
                </div>

                <div class="admin-kpis-grid">
                    <div class="kpi-card">
                        <div class="kpi-icon"><i class="fa-solid fa-indian-rupee-sign"></i></div>
                        <div class="kpi-details"><h5>Total Sales</h5><p>₹${kpis.totalRevenue}</p></div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-icon"><i class="fa-solid fa-truck-loading"></i></div>
                        <div class="kpi-details"><h5>Orders</h5><p>${kpis.ordersCount}</p></div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-icon"><i class="fa-solid fa-users"></i></div>
                        <div class="kpi-details"><h5>Customers</h5><p>${kpis.customersCount}</p></div>
                    </div>
                    <div class="kpi-card">
                        <div class="kpi-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
                        <div class="kpi-details"><h5>Low Stocks</h5><p style="${kpis.lowStockCount > 0 ? 'color:#e74c3c; font-weight:800;' : ''}">${kpis.lowStockCount}</p></div>
                    </div>
                </div>

                <div id="admin-subview-mount">${activeViewHtml}</div>
            </div>

            <div class="modal-overlay" id="admin-product-modal">
                <div class="modal-content-card" style="max-width: 650px;">
                    <button class="modal-close-btn" id="product-modal-close-btn">&times;</button>
                    <div class="modal-title" id="modal-product-title">Add New Product</div>
                    <form id="admin-product-form" style="max-height: 500px; overflow-y: auto; padding-right:10px;">
                        <input type="hidden" id="prod-form-mode" value="add">
                        <div class="form-group">
                            <label for="prod-id">Product ID</label>
                            <input type="text" id="prod-id" class="form-control" placeholder="skin-cream" required>
                        </div>
                        <div class="grid-2" style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                            <div class="form-group">
                                <label for="prod-name">Name</label>
                                <input type="text" id="prod-name" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label for="prod-category">Category</label>
                                <input type="text" id="prod-category" class="form-control" required>
                            </div>
                        </div>
                        <div class="grid-3" style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:15px;">
                            <div class="form-group">
                                <label for="prod-price">Price (₹)</label>
                                <input type="number" id="prod-price" class="form-control" required min="1">
                            </div>
                            <div class="form-group">
                                <label for="prod-compare">Compare At (₹)</label>
                                <input type="number" id="prod-compare" class="form-control" min="0">
                            </div>
                            <div class="form-group">
                                <label for="prod-stock">Stock</label>
                                <input type="number" id="prod-stock" class="form-control" required min="0">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="prod-image">Image URL / Path</label>
                            <input type="text" id="prod-image" class="form-control" placeholder="images/custom.png" required>
                        </div>
                        <div class="form-group">
                            <label for="prod-skin">Skin Types</label>
                            <input type="text" id="prod-skin" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="prod-desc">Description</label>
                            <textarea id="prod-desc" class="form-control" rows="2" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="prod-benefits">Benefits (comma-separated)</label>
                            <input type="text" id="prod-benefits" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="prod-ingredients">Ingredients</label>
                            <textarea id="prod-ingredients" class="form-control" rows="2" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="prod-use">How to Use</label>
                            <textarea id="prod-use" class="form-control" rows="2" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-chrome btn-block" style="margin-top:15px;">Save Product</button>
                    </form>
                </div>
            </div>
        `;
    };

    const AdminSetup = () => {
        const navTabs = document.querySelectorAll(".admin-nav-tab");
        navTabs.forEach(btn => {
            btn.addEventListener("click", () => {
                setAdminTab(btn.dataset.tab);
                Router.handleRoute();
            });
        });

        const quickNavs = document.querySelectorAll(".admin-quick-nav");
        quickNavs.forEach(btn => {
            btn.addEventListener("click", () => {
                setAdminTab(btn.dataset.tab);
                Router.handleRoute();
            });
        });

        const statusSelects = document.querySelectorAll(".admin-order-status-select");
        statusSelects.forEach(select => {
            select.addEventListener("change", () => {
                const orderId = select.dataset.id;
                const newStatus = select.value;
                Store.updateOrderStatus(orderId, newStatus);
                window.dispatchEvent(new CustomEvent("toast", {
                    detail: { message: `Order ${orderId} status updated to '${newStatus}'`, type: "success" }
                }));
            });
        });

        const viewOrderButtons = document.querySelectorAll(".admin-view-order-btn");
        viewOrderButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const order = Store.getOrderById(btn.dataset.id);
                if (!order) return;

                const modal = document.getElementById("order-details-modal");
                const modalContent = document.getElementById("modal-order-content");

                if (modal && modalContent) {
                    const orderItemsHtml = order.items.map(item => `
                        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px dashed var(--border-color); font-size:0.85rem;">
                            <span style="font-weight:700;">${item.name} <span style="font-weight:400; color:var(--text-muted);">x${item.qty}</span></span>
                            <span>₹${item.price * item.qty}</span>
                        </div>
                    `).join("");

                    modalContent.innerHTML = `
                        <div style="display:flex; flex-direction:column; gap:12px;">
                            <div style="display:flex; justify-content:space-between;"><span>Order ID:</span><strong>${order.id}</strong></div>
                            <div style="display:flex; justify-content:space-between;"><span>Customer:</span><span>${order.customerName}</span></div>
                            <div style="display:flex; justify-content:space-between;"><span>Address:</span><span style="max-width:200px; text-align:right; font-size:0.8rem; color:var(--text-muted);">${order.shippingAddress}</span></div>
                            <div style="margin-top: 15px; border-top:1px solid var(--border-color); padding-top:15px;">
                                <h5>Items</h5>
                                ${orderItemsHtml}
                            </div>
                            <div style="display:flex; justify-content:space-between; margin-top:10px; font-size:0.9rem;"><span>Subtotal:</span><span>₹${order.subtotal}</span></div>
                            <div style="display:flex; justify-content:space-between; border-top: 1px solid var(--border-color); padding-top:10px; font-family:var(--font-heading); font-weight:800; font-size:1.15rem;"><span>Total:</span><span>₹${order.total}</span></div>
                        </div>
                    `;
                    modal.classList.add("active");
                    const modalClose = document.getElementById("order-modal-close");
                    if (modalClose) modalClose.onclick = () => modal.classList.remove("active");
                }
            });
        });

        const productModal = document.getElementById("admin-product-modal");
        const addProductOpenBtn = document.getElementById("add-product-open-btn");
        const productModalCloseBtn = document.getElementById("product-modal-close-btn");
        const productForm = document.getElementById("admin-product-form");

        if (productModal && productForm) {
            if (addProductOpenBtn) {
                addProductOpenBtn.addEventListener("click", () => {
                    productForm.reset();
                    document.getElementById("prod-form-mode").value = "add";
                    document.getElementById("prod-id").disabled = false;
                    document.getElementById("modal-product-title").innerText = "Add New Skincare Product";
                    productModal.classList.add("active");
                });
            }

            if (productModalCloseBtn) {
                productModalCloseBtn.onclick = () => productModal.classList.remove("active");
            }
            productModal.onclick = (e) => { if (e.target === productModal) productModal.classList.remove("active"); };

            const deleteButtons = document.querySelectorAll(".delete-product-btn");
            deleteButtons.forEach(btn => {
                btn.addEventListener("click", () => {
                    const id = btn.dataset.id;
                    if (confirm(`Delete product '${id}'?`)) {
                        Store.deleteProduct(id);
                        window.dispatchEvent(new CustomEvent("toast", {
                            detail: { message: `Product '${id}' deleted.`, type: "success" }
                        }));
                        Router.handleRoute();
                    }
                });
            });

            const editButtons = document.querySelectorAll(".edit-product-btn");
            editButtons.forEach(btn => {
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
                        window.dispatchEvent(new CustomEvent("toast", {
                            detail: { message: "Product ID SKU already exists.", type: "error" }
                        }));
                        return;
                    }
                    Store.addProduct(productData);
                } else {
                    Store.updateProduct(productData);
                }

                productModal.classList.remove("active");
                window.dispatchEvent(new CustomEvent("toast", {
                    detail: { message: "Product saved successfully!", type: "success" }
                }));
                Router.handleRoute();
            });
        }

        const couponForm = document.getElementById("create-coupon-form");
        if (couponForm) {
            couponForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const code = document.getElementById("coupon-code-in").value.trim().toUpperCase();
                const discountType = document.getElementById("coupon-type-in").value;
                const value = parseInt(document.getElementById("coupon-value-in").value);
                const minPurchase = parseInt(document.getElementById("coupon-min-in").value) || 0;

                if (Store.getCoupons().some(c => c.code === code)) {
                    window.dispatchEvent(new CustomEvent("toast", {
                        detail: { message: "Coupon code already exists.", type: "error" }
                    }));
                    return;
                }
                Store.addCoupon({ code, discountType, value, minPurchase });
                window.dispatchEvent(new CustomEvent("toast", {
                    detail: { message: `Coupon '${code}' created!`, type: "success" }
                }));
                couponForm.reset();
                Router.handleRoute();
            });

            const deleteCouponBtns = document.querySelectorAll(".delete-coupon-btn");
            deleteCouponBtns.forEach(btn => {
                btn.addEventListener("click", () => {
                    const code = btn.dataset.code;
                    if (confirm(`Delete coupon '${code}'?`)) {
                        Store.deleteCoupon(code);
                        window.dispatchEvent(new CustomEvent("toast", {
                            detail: { message: `Coupon '${code}' removed.`, type: "success" }
                        }));
                        Router.handleRoute();
                    }
                });
            });
        }
    };

    const AdminLoginView = () => {
        const user = Store.getCurrentUser();
        if (user && user.role === "admin") {
            setTimeout(() => { window.location.hash = "#/admin"; }, 100);
            return `<div style="text-align:center; padding:100px 30px;"><i class="fa-solid fa-spinner fa-spin fa-2x"></i><p>Redirecting to dashboard...</p></div>`;
        }

        return `
            <div style="background-color: var(--bg-primary); min-height: calc(100vh - 400px); display: flex; align-items: center; justify-content: center; padding: 60px 20px;">
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
                        <a href="#/" class="btn btn-outline btn-block" style="margin-top:10px; height: 48px; display:flex; align-items:center; justify-content:center;">Return to Store</a>
                    </form>
                    <div style="margin-top: 25px; border-top: 1px dashed var(--border-color); padding-top: 15px; font-size: 0.8rem; text-align: center; color: var(--text-muted);">
                        Demo Admin: <strong>admin@wellnez.com</strong> / <strong>password123</strong>
                    </div>
                </div>
            </div>
        `;
    };

    const AdminLoginSetup = () => {
        const form = document.getElementById("admin-login-form");
        if (!form) return;

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("admin-email").value.trim();
            const password = document.getElementById("admin-password").value.trim();

            const result = Store.login(email, password);
            if (result.success) {
                if (result.user.role === "admin") {
                    window.dispatchEvent(new CustomEvent("toast", {
                        detail: { message: "Console Authenticated successfully!", type: "success" }
                    }));
                    window.dispatchEvent(new Event("auth-changed"));
                    window.location.hash = "#/admin";
                } else {
                    Store.logout();
                    window.dispatchEvent(new CustomEvent("toast", {
                        detail: { message: "Access Denied: Customer accounts are not authorized to view the admin console.", type: "error" }
                    }));
                }
            } else {
                window.dispatchEvent(new CustomEvent("toast", {
                    detail: { message: result.message, type: "error" }
                }));
            }
        });
    };

    // G. STATIC VIEWS & SETUP
    const AboutView = () => `
        <div class="about-grid-container">
            <div class="about-text-panel">
                <h1>Our Story</h1>
                <p>Welcome to <strong>your Wellnez</strong>. We believe in one simple, powerful skincare philosophy: <strong>Skin Barrier First. Actives Second.</strong></p>
                <p style="margin-top: 15px;">Founded in 2026, our mission was born out of frustration with over-complicated skincare routines that relied on harsh active chemicals. We engineer daily skincare basics designed to defend, restore, and lock in your natural skin lipids.</p>
                <div style="background-color: var(--bg-secondary); border-left: 3px solid var(--border-dark); padding: 20px 25px; margin: 30px 0; font-style: italic; font-weight: 500; font-size: 0.95rem; line-height: 1.6; color: var(--text-main);">
                    "Your skin barrier is your body's shield. If it is damaged, no active serum will give you that coveted glass skin glow. We focus on rebuilding your barrier first."
                </div>
                <h3 style="font-family: var(--font-heading); text-transform: uppercase; font-size: 1.2rem; margin-top: 15px; margin-bottom: 10px;">Cruelty-Free & Sustainable</h3>
                <p>All our products are dermatologist-tested, pH-balanced (5.5 - 6.0), vegan, and 100% cruelty-free.</p>
            </div>
            <div class="about-image-panel">
                <img src="images/about.png" alt="our story skincare concept">
            </div>
        </div>
    `;

    const ContactView = () => `
        <div class="contact-grid-container">
            <div class="contact-info-panel">
                <h1>Contact Us</h1>
                <p style="color: var(--text-muted); margin-bottom: 40px; font-size: 1.05rem;">We are here to support your skincare barrier journey. Reach out anytime.</p>
                
                <div style="display:flex; flex-direction:column; gap:35px;">
                    <div style="padding-bottom: 20px; border-bottom: 1px dashed var(--border-color);">
                        <h4 style="font-family:var(--font-heading); text-transform:uppercase; margin-bottom:10px; font-weight:700; font-size: 1rem;"><i class="fa-regular fa-envelope" style="margin-right:10px; color: var(--text-main);"></i> Email Support</h4>
                        <p style="color:var(--text-muted); font-size:0.95rem; line-height: 1.6;">hello@yourwellnez.com<br>Our barrier experts reply within 24 hours.</p>
                    </div>
                    <div style="padding-bottom: 20px; border-bottom: 1px dashed var(--border-color);">
                        <h4 style="font-family:var(--font-heading); text-transform:uppercase; margin-bottom:10px; font-weight:700; font-size: 1rem;"><i class="fa-brands fa-whatsapp" style="margin-right:10px; color:#25D366;"></i> WhatsApp Chat</h4>
                        <p style="color:var(--text-muted); font-size:0.95rem; line-height: 1.6;">+91 99999 99999<br>Mon-Sat: 10 AM to 6 PM IST</p>
                    </div>
                    <div>
                        <h4 style="font-family:var(--font-heading); text-transform:uppercase; margin-bottom:10px; font-weight:700; font-size: 1rem;"><i class="fa-solid fa-location-dot" style="margin-right:10px; color: var(--text-main);"></i> Head Office</h4>
                        <p style="color:var(--text-muted); font-size:0.95rem; line-height: 1.6;">your Wellnez Skincare Labs Ltd.<br>Mumbai, Maharashtra, India</p>
                    </div>
                </div>
            </div>
            
            <div class="contact-form-panel">
                <h2 style="font-family:var(--font-heading); text-transform: uppercase; font-size: 1.75rem; margin-bottom: 10px; font-weight: 800;">Send a Message</h2>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 30px;">Got questions about ingredients or order issues? Write to us.</p>
                <form id="contact-form">
                    <div class="elegant-form-group">
                        <input type="text" id="contact-name" class="elegant-input" placeholder=" " required autocomplete="name">
                        <label for="contact-name" class="elegant-label">Your Name</label>
                    </div>
                    <div class="elegant-form-group">
                        <input type="email" id="contact-email" class="elegant-input" placeholder=" " required autocomplete="email">
                        <label for="contact-email" class="elegant-label">Email Address</label>
                    </div>
                    <div class="elegant-form-group" style="margin-top: 30px;">
                        <textarea id="contact-message" class="elegant-input" placeholder=" " rows="3" required style="resize:none; padding-top:10px; height: 100px;"></textarea>
                        <label for="contact-message" class="elegant-label" style="top: -12px;">Your Message</label>
                    </div>
                    <button type="submit" class="btn btn-chrome btn-block" style="margin-top: 25px; height: 50px;">Send Message</button>
                </form>
            </div>
        </div>
    `;

    const ContactSetup = () => {
        const form = document.getElementById("contact-form");
        if (form) {
            form.addEventListener("submit", (e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("toast", {
                    detail: { message: "Message sent successfully! We will reply shortly.", type: "success" }
                }));
                form.reset();
            });
        }
    };

    const FaqView = () => `
        <div class="static-page-container" style="max-width: 900px;">
            <h1>Frequently Asked Questions</h1>
            <p class="static-page-meta">Answers to common skincare, shipping, and payment queries.</p>
            <div class="product-tabs" style="margin-top: 30px; border-bottom:1px solid var(--border-color);">
                <div class="tab-item">
                    <div class="tab-header">Are your Wellnez products suitable for acne-prone skin? <i class="fa-solid fa-chevron-down"></i></div>
                    <div class="tab-content">Yes! Both our Slick Cleanse Face Wash and Matte Sunscreen are non-comedogenic and pH-balanced to soothe inflamed acne-prone skin barriers.</div>
                </div>
                <div class="tab-item">
                    <div class="tab-header">Do you use artificial fragrances? <i class="fa-solid fa-chevron-down"></i></div>
                    <div class="tab-content">No. Artificial fragrances are primary skin barrier irritants. All our formulas are 100% fragrance-free.</div>
                </div>
                <div class="tab-item">
                    <div class="tab-header">What are your shipping rates? <i class="fa-solid fa-chevron-down"></i></div>
                    <div class="tab-content">Standard shipping is ₹80, and Free Shipping is unlocked automatically on all orders above ₹999.</div>
                </div>
            </div>
        </div>
    `;

    const FaqSetup = () => {
        const tabHeaders = document.querySelectorAll(".tab-header");
        tabHeaders.forEach(header => {
            header.addEventListener("click", () => {
                header.parentElement.classList.toggle("active");
            });
        });
    };

    const PrivacyPolicyView = () => `
        <div class="static-page-container">
            <h1>Privacy Policy</h1>
            <p class="static-page-meta">Last Updated: July 8, 2026</p>
            <div class="static-page-content">
                <p>At your Wellnez, we prioritize visitor privacy. This document details how order details and profiles are collected locally to process checkout securely. We never store credit card records on our database.</p>
            </div>
        </div>
    `;

    const ShippingPolicyView = () => `
        <div class="static-page-container">
            <h1>Shipping Policy</h1>
            <p class="static-page-meta">Last Updated: July 8, 2026</p>
            <div class="static-page-content">
                <p>Standard Shipping is ₹80. Free Shipping applies automatically on all orders above ₹999. Dispatches occur within 24 hours. Metros arrive in 2-3 business days; other regions in 4-6 business days.</p>
            </div>
        </div>
    `;

    const ReturnPolicyView = () => `
        <div class="static-page-container">
            <h1>Returns & Refunds</h1>
            <p class="static-page-meta">Last Updated: July 8, 2026</p>
            <div class="static-page-content">
                <p>For hygiene reasons, we do not accept returns on used skincare items. However, if your items are received damaged or leaking, please email us with photos at hello@yourwellnez.com within 7 days of delivery for a replacement or full refund.</p>
            </div>
        </div>
    `;

    const TermsConditionsView = () => `
        <div class="static-page-container">
            <h1>Terms & Conditions</h1>
            <p class="static-page-meta">Last Updated: July 8, 2026</p>
            <div class="static-page-content">
                <p>By accessing #/, you agree to comply with our e-commerce terms of use. All product handles, names (Slick Cleanse), and metallic shine gradients are intellectual properties of your Wellnez.</p>
            </div>
        </div>
    `;

    // Active tab states helper keys
    const getActiveTab = () => sessionStorage.getItem(ACTIVE_TAB_KEY) || "profile";
    const setActiveTab = (tab) => sessionStorage.setItem(ACTIVE_TAB_KEY, tab);
    const ACTIVE_TAB_KEY = "wellnez_account_active_tab";

    // ==========================================================================
    // 5. GLOBAL APP ORCHESTRATION & EVENT BINDS
    // ==========================================================================

    document.addEventListener("DOMContentLoaded", () => {
        
        // Register Routes
        Router.register("/", HomeView);
        Router.register("/shop", ShopView);
        Router.register("/wishlist", ShopView);
        Router.register("/product/:id", ProductDetailsView);
        Router.register("/checkout", CheckoutView);
        Router.register("/account", AccountView);
        Router.register("/about", AboutView);
        Router.register("/contact", ContactView);
        Router.register("/faq", FaqView);
        Router.register("/privacy-policy", PrivacyPolicyView);
        Router.register("/shipping-policy", ShippingPolicyView);
        Router.register("/return-policy", ReturnPolicyView);
        Router.register("/terms-conditions", TermsConditionsView);

        // Initialize Router on viewport
        const viewport = document.getElementById("app-viewport");
        Router.init(viewport);

        // Init Drawer
        CartController.init();
        initGlobalUI();
        initPromoPopup();
    });

    function initGlobalUI() {
        const menuToggle = document.getElementById("menu-toggle");
        const navClose = document.getElementById("nav-close");
        const navMenu = document.getElementById("nav-menu");

        if (menuToggle && navMenu) menuToggle.onclick = () => navMenu.classList.add("active");
        if (navClose && navMenu) navClose.onclick = () => navMenu.classList.remove("active");

        const searchTrigger = document.getElementById("search-trigger");
        const searchDropdown = document.getElementById("search-dropdown");
        const searchInput = document.getElementById("search-input");
        const searchResults = document.getElementById("search-results-preview");

        if (searchTrigger && searchDropdown) {
            searchTrigger.onclick = (e) => {
                e.stopPropagation();
                searchDropdown.classList.toggle("active");
                if (searchDropdown.classList.contains("active")) searchInput.focus();
            };
            document.onclick = (e) => {
                if (!searchDropdown.contains(e.target) && e.target !== searchTrigger && !searchTrigger.contains(e.target)) {
                    searchDropdown.classList.remove("active");
                }
            };
        }

        if (searchInput && searchResults) {
            searchInput.oninput = () => {
                const query = searchInput.value.toLowerCase().trim();
                if (!query) {
                    searchResults.innerHTML = "";
                    return;
                }
                const matched = Store.getProducts().filter(p => p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query));
                if (matched.length === 0) {
                    searchResults.innerHTML = `<div style="padding:15px; font-size:0.8rem; text-align:center;">No items.</div>`;
                    return;
                }
                searchResults.innerHTML = matched.map(p => `
                    <a href="#/product/${p.id}" class="search-result-item">
                        <img src="${p.image}" alt="${p.name}">
                        <div><h5>${p.name}</h5><p>₹${p.price} | ${p.category}</p></div>
                    </a>
                `).join("");

                searchResults.querySelectorAll(".search-result-item").forEach(item => {
                    item.onclick = () => {
                        searchDropdown.classList.remove("active");
                        searchInput.value = "";
                        searchResults.innerHTML = "";
                    };
                });
            };
        }

        const newsForm = document.getElementById("newsletter-form");
        const newsFeedback = document.getElementById("newsletter-feedback");
        if (newsForm && newsFeedback) {
            newsForm.onsubmit = (e) => {
                e.preventDefault();
                newsFeedback.innerText = "Subscription successful! Welcome to the Glow Club.";
                newsForm.reset();
                setTimeout(() => newsFeedback.innerText = "", 4000);
            };
        }

        const updateWishlistBadge = () => {
            const wishlist = Store.getWishlist();
            const badge = document.getElementById("wishlist-count");
            if (badge) badge.innerText = wishlist.length;
        };
        window.addEventListener("wishlist-updated", updateWishlistBadge);
        updateWishlistBadge();

        const syncAuthUI = () => {
            const user = Store.getCurrentUser();
            const adminLinks = document.querySelectorAll(".admin-nav-link");
            adminLinks.forEach(link => {
                if (user && user.role === "admin") {
                    link.style.display = "block";
                } else {
                    link.style.display = "none";
                }
            });
        };
        window.addEventListener("auth-changed", syncAuthUI);
        syncAuthUI();



        const toastContainer = document.getElementById("toast-container");
        window.addEventListener("toast", (e) => {
            const { message, type } = e.detail;
            if (!toastContainer) return;
            const toast = document.createElement("div");
            toast.className = `toast ${type}`;
            const icon = type === "success" ? `<i class="fa-solid fa-circle-check" style="color:#2ecc71;"></i>` : `<i class="fa-solid fa-circle-exclamation" style="color:#e74c3c;"></i>`;
            toast.innerHTML = `${icon} <span>${message}</span>`;
            toastContainer.appendChild(toast);
            setTimeout(() => toast.classList.add("show"), 10);
            setTimeout(() => {
                toast.classList.remove("show");
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        });

        window.addEventListener("view-rendered", (e) => {
            const { hash, params } = e.detail;
            bindProductCardActions();
            bindProductCardHoverVideos();

            if (hash === "/") HomeViewSetup();
            else if (hash === "/shop" || hash === "/wishlist") ShopViewSetup();
            else if (hash.startsWith("/product/")) ProductDetailsSetup(params);
            else if (hash === "/checkout") CheckoutSetup();
            else if (hash === "/account") AccountSetup();
            else if (hash === "/contact") ContactSetup();
            else if (hash === "/faq") FaqSetup();
        });
    }

    function HomeViewSetup() {
        const reelsContainer = document.getElementById("reels-container");
        const prevBtn = document.getElementById("reels-prev-btn");
        const nextBtn = document.getElementById("reels-next-btn");

        if (reelsContainer) {
            if (prevBtn) {
                prevBtn.onclick = () => {
                    reelsContainer.scrollBy({ left: -260, behavior: "smooth" });
                };
            }
            if (nextBtn) {
                nextBtn.onclick = () => {
                    reelsContainer.scrollBy({ left: 260, behavior: "smooth" });
                };
            }

            const reels = reelsContainer.querySelectorAll(".reel-card");
            reels.forEach(reel => {
                const video = reel.querySelector(".reel-video");
                const soundIcon = reel.querySelector(".reel-sound-indicator i");

                // Start autoplay muted
                video.muted = true;
                video.play().catch(err => console.log("Reel autoplay prevented:", err));

                reel.onclick = (e) => {
                    // Ignore clicks on shop pills so they can navigate
                    if (e.target.closest(".reel-shop-pill")) {
                        return;
                    }

                    if (video.muted) {
                        // Mute all other videos
                        reels.forEach(otherReel => {
                            const otherVid = otherReel.querySelector(".reel-video");
                            const otherSoundIcon = otherReel.querySelector(".reel-sound-indicator i");
                            if (otherVid && otherVid !== video) {
                                otherVid.muted = true;
                                if (otherSoundIcon) {
                                    otherSoundIcon.className = "fa-solid fa-volume-xmark";
                                }
                                otherReel.classList.remove("unmuted");
                            }
                        });

                        video.muted = false;
                        if (soundIcon) {
                            soundIcon.className = "fa-solid fa-volume-high";
                        }
                        reel.classList.add("unmuted");
                    } else {
                        video.muted = true;
                        if (soundIcon) {
                            soundIcon.className = "fa-solid fa-volume-xmark";
                        }
                        reel.classList.remove("unmuted");
                    }
                };
            });
        }
    }

    function bindProductCardActions() {
        const productGrid = document.querySelector(".products-grid");
        if (!productGrid) return;

        const newGrid = productGrid.cloneNode(true);
        productGrid.parentNode.replaceChild(newGrid, productGrid);

        newGrid.addEventListener("click", (e) => {
            const target = e.target;
            const addToCartBtn = target.closest(".add-to-cart-btn");
            if (addToCartBtn) {
                e.preventDefault();
                const id = addToCartBtn.dataset.id;
                const product = Store.getProductById(id);
                if (product) {
                    Store.addToCart(id, 1);
                    window.dispatchEvent(new CustomEvent("toast", {
                        detail: { message: `${product.name} added to cart!`, type: "success" }
                    }));
                    document.getElementById("cart-drawer").classList.add("active");
                    document.getElementById("cart-overlay").classList.add("active");
                }
            }

            const wishBtn = target.closest(".product-card-wishlist");
            if (wishBtn) {
                e.preventDefault();
                const id = wishBtn.dataset.id;
                Store.toggleWishlist(id);
                const isWish = Store.isInWishlist(id);
                wishBtn.classList.toggle("active", isWish);
                wishBtn.querySelector("i").className = isWish ? "fa-solid fa-heart" : "fa-regular fa-heart";
                window.dispatchEvent(new CustomEvent("toast", {
                    detail: { message: isWish ? "Item added to wishlist." : "Item removed from wishlist.", type: "success" }
                }));
            }
        });
    }

    function bindProductCardHoverVideos() {
        const cards = document.querySelectorAll(".product-card");
        cards.forEach(card => {
            const video = card.querySelector(".product-card-video-hover");
            if (video) {
                card.onmouseenter = () => {
                    video.setAttribute("preload", "auto");
                    video.play().catch(err => console.log("Hover play prevented:", err));
                    card.classList.add("video-playing");
                };
                card.onmouseleave = () => {
                    video.pause();
                    video.currentTime = 0;
                    card.classList.remove("video-playing");
                };
            }
        });
    }

    function initPromoPopup() {
        const modal = document.getElementById("promo-popup-modal");
        const closeBtn = document.getElementById("promo-close-btn");
        const noThanksBtn = document.getElementById("promo-no-thanks-btn");
        const form = document.getElementById("promo-popup-form");

        if (!modal) return;

        // Show popup after 1.5 seconds delay
        setTimeout(() => {
            modal.classList.add("active");
            document.body.style.overflow = "hidden"; // Prevent background scrolling
        }, 1500);

        function closeModal() {
            modal.classList.remove("active");
            document.body.style.overflow = ""; // Restore scrolling
        }

        if (closeBtn) closeBtn.onclick = closeModal;
        if (noThanksBtn) noThanksBtn.onclick = closeModal;

        if (form) {
            form.onsubmit = (e) => {
                e.preventDefault();
                const email = document.getElementById("promo-email-input").value.trim();
                
                if (email) {
                    // Show a toast message to the user with coupon code
                    window.dispatchEvent(new CustomEvent("toast", {
                        detail: { 
                            message: "Thank you for signing up! Use code WELLNEZ25 for 25% off.", 
                            type: "success" 
                        }
                    }));
                    
                    // Close the modal
                    modal.classList.remove("active");
                    document.body.style.overflow = "";
                }
            };
        }
    }

})();
