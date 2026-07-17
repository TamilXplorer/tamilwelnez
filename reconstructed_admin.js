/* ==========================================
   Zentro World Connect - Admin Control JS
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --- AUTHENTICATION SHIELD --- */
    const loginOverlay = document.getElementById('loginOverlay');
    const adminContainer = document.getElementById('adminContainer');
    const loginForm = document.getElementById('loginForm');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Check if already authenticated
    const checkAuth = () => {
        if (sessionStorage.getItem('zentro_auth') === 'true') {
            loginOverlay.style.display = 'none';
            adminContainer.style.display = 'grid';
            initializeAdminPanel();
        } else {
            loginOverlay.style.display = 'flex';
            adminContainer.style.display = 'none';
        }
    };

    // Authenticate submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            let isValid = true;

            if (usernameInput.value.trim() === '') {
                showFieldError(usernameInput, true);
                isValid = false;
            } else {
                showFieldError(usernameInput, false);
            }

            if (passwordInput.value.trim() === '') {
                showFieldError(passwordInput, true);
                isValid = false;
            } else {
                showFieldError(passwordInput, false);
            }

            if (isValid) {
                if (usernameInput.value.trim() === 'admin' && passwordInput.value.trim() === 'zentro123') {
                    sessionStorage.setItem('zentro_auth', 'true');
                    usernameInput.value = '';
                    passwordInput.value = '';
                    checkAuth();
                } else {
                    // Password validation styling error
                    const passGroup = document.getElementById('passGroup');
                    if (passGroup) passGroup.classList.add('error');
                }
            }
        });
    }

    function showFieldError(element, hasError) {
        const parent = element.closest('.form-group');
        if (parent) {
            if (hasError) parent.classList.add('error');
            else parent.classList.remove('error');
        }
    }

    // Log Out
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('zentro_auth');
            checkAuth();
        });
    }

    checkAuth(); // Run initial auth check

    /* ==========================================
         ADMIN CORE CONTROLLER ACTIONS
         ========================================== */
    function initializeAdminPanel() {
        
        // 1. Sidebar Tab Switcher
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        const tabPanels = document.querySelectorAll('.tab-panel');
        const currentTabTitle = document.getElementById('currentTabTitle');
        const currentTabSub = document.getElementById('currentTabSub');

        const tabDetails = {
            overview: { title: "Dashboard Overview", sub: "Real-time statistics and quote requests." },
            products: { title: "Manage Products", sub: "Add, edit, or delete items from the exports catalog." },
            inquiries: { title: "Client Inquiries", sub: "Manage and export incoming customer quote requests." },
            settings: { title: "Site Settings", sub: "Configure branding colors, company information, and lead contacts." }
        };

        const switchTab = (tabId) => {
            sidebarLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-tab') === tabId) link.classList.add('active');
            });

            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `panel-${tabId}`) panel.classList.add('active');
            });

            if (tabDetails[tabId]) {
                currentTabTitle.innerText = tabDetails[tabId].title;
                currentTabSub.innerText = tabDetails[tabId].sub;
            }

            // Custom Loaders based on tab
            if (tabId === 'overview') renderOverview();
            if (tabId === 'products') renderProductsTable();
            if (tabId === 'inquiries') renderInquiriesTable();
            if (tabId === 'settings') loadSettingsForm();
        };

        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const tabId = link.getAttribute('data-tab');
                switchTab(tabId);
            });
        });

        // Overview Tab link shortcut
        document.querySelectorAll('.view-inquiries-shortcut').forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-target-tab');
                switchTab(target);
            });
        });

        // 2. Load LocalStorage Data Helper
        const getProducts = () => JSON.parse(localStorage.getItem('zentro_products')) || [];
        const getInquiries = () => JSON.parse(localStorage.getItem('zentro_inquiries')) || [];
        const getSettings = () => JSON.parse(localStorage.getItem('zentro_settings')) || {};

        // 3. Dynamic Color Styling Previews
        const applyThemeColors = (sets) => {
            const root = document.documentElement;
            root.style.setProperty('--primary', sets.primaryColor);
            root.style.setProperty('--primary-light', sets.secondaryColor);
            root.style.setProperty('--primary-dark', darkenColor(sets.primaryColor, 30));
            root.style.setProperty('--secondary', sets.primaryColor);
            root.style.setProperty('--secondary-hover', darkenColor(sets.primaryColor, 20));
            root.style.setProperty('--accent', sets.accentColor);
        };

        function darkenColor(hex, percent) {
            let num = parseInt(hex.replace("#",""), 16),
                amt = Math.round(2.55 * percent),
                R = (num >> 16) - amt,
                G = (num >> 8 & 0x00FF) - amt,
                B = (num & 0x0000FF) - amt;
            return "#" + (0x1000000 + (R<0?0:R>255?255:R)*0x10000 + (G<0?0:G>255?255:G)*0x100 + (B<0?0:B>255?255:B)).toString(16).slice(1);
        }

        // Apply theme color on page load
        applyThemeColors(getSettings());

        // Update badge counts in sidebar on load
        const updateSidebarBadges = () => {
            const count = getInquiries().length;
            const badge = document.getElementById('inquiryCountBadge');
            if (badge) {
                badge.innerText = count;
                badge.style.display = count > 0 ? 'inline-block' : 'none';
            }
        };
        updateSidebarBadges();

        /* --- DASHBOARD OVERVIEW RENDER --- */
        const renderOverview = () => {
            const currentProds = getProducts();
            const currentInqs = getInquiries();
            const currentSets = getSettings();

            // Set counters
            document.getElementById('statTotalInquiries').innerText = currentInqs.length;
            document.getElementById('statTotalProducts').innerText = currentProds.length;
            document.getElementById('statLeadName').innerText = currentSets.leadName;
            document.getElementById('statLeadPhone').innerText = currentSets.leadPhone;

            // Render recent 3 inquiries
            const recentInquiriesList = document.getElementById('recentInquiriesList');
            if (recentInquiriesList) {
                recentInquiriesList.innerHTML = '';
                const recents = currentInqs.slice(0, 3); // Get first 3

                if (recents.length === 0) {
                    recentInquiriesList.innerHTML = `
                        <tr>
                            <td colspan="6" class="text-center py-4 text-muted">No inquiries received yet. Submit a quote request on the main page.</td>
                        </tr>
                    `;
                    return;
                }

                recents.forEach(inq => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${inq.date.split(',')[0]}</td>
                        <td><strong>${inq.name}</strong><br><span style="font-size:0.75rem;color:var(--text-muted);">${inq.company}</span></td>
                        <td>${inq.flower}</td>
                        <td>${inq.volume}</td>
                        <td>${inq.destination}</td>
                        <td><span class="inquiry-status-badge">New</span></td>
                    `;
                    recentInquiriesList.appendChild(row);
                });
            }
            updateSidebarBadges();
        };

        renderOverview(); // Render on initialization

        /* --- PRODUCTS MANAGEMENT (CRUD) --- */
        const productModal = document.getElementById('productModal');
        const addProductBtn = document.getElementById('addProductBtn');
        const closeProductModal = document.getElementById('closeProductModal');
        const cancelProductBtn = document.getElementById('cancelProductBtn');
        const productForm = document.getElementById('productForm');
        const productsTableBody = document.getElementById('productsTableBody');
        const productModalTitle = document.getElementById('productModalTitle');

        const renderProductsTable = () => {
            const currentProds = getProducts();
            productsTableBody.innerHTML = '';

            if (currentProds.length === 0) {
                productsTableBody.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center py-4 text-muted">No flowers currently listed. Add a variety.</td>
                    </tr>
                `;
                return;
            }

            currentProds.forEach(prod => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><img src="${prod.image}" alt="${prod.name}" class="product-table-img"></td>
                    <td><strong>${prod.name}</strong></td>
                    <td style="text-transform: capitalize;">${prod.category === 'traditional' ? 'Traditional Scented' : 'Cut Flowers'}</td>
                    <td>${prod.grade}</td>
                    <td>${prod.budLife}</td>
                    <td>${prod.availability}</td>
                    <td>
                        <div class="actions-cell">
                            <button class="btn-icon edit-btn" data-id="${prod.id}" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
                            <button class="btn-icon delete-btn" data-id="${prod.id}" title="Delete"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </td>
                `;
                productsTableBody.appendChild(tr);
            });

            // Bind Edit Action Buttons
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const pId = btn.getAttribute('data-id');
                    openProductEditModal(pId);
                });
            });

            // Bind Delete Action Buttons
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const pId = btn.getAttribute('data-id');
                    deleteProductAction(pId);
                });
            });
        };

        // Open Modal for Create
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => {
                productForm.reset();
                document.getElementById('editProductId').value = '';
                productModalTitle.innerText = 'Add Sourced Flower Variety';
                document.querySelectorAll('.modal-card .form-group').forEach(grp => grp.classList.remove('error'));
                productModal.classList.add('active');
            });
        }

        // Open Modal for Edit
        const openProductEditModal = (pId) => {
            const list = getProducts();
            const matched = list.find(p => p.id === pId);
            if (!matched) return;

            productForm.reset();
            document.getElementById('editProductId').value = matched.id;
            document.getElementById('prodName').value = matched.name;
            document.getElementById('prodCategory').value = matched.category;
            document.getElementById('prodGrade').value = matched.grade;
            document.getElementById('prodBudLife').value = matched.budLife;
            document.getElementById('prodAvailability').value = matched.availability;
            document.getElementById('prodPackage').value = matched.package;
            document.getElementById('prodImage').value = matched.image;
            document.getElementById('prodDescription').value = matched.description;

            productModalTitle.innerText = 'Edit Flower Variety';
            document.querySelectorAll('.modal-card .form-group').forEach(grp => grp.classList.remove('error'));
            productModal.classList.add('active');
        };

        // Close Modal
        const closeModal = () => {
            productModal.classList.remove('active');
        };

        if (closeProductModal) closeProductModal.addEventListener('click', closeModal);
        if (cancelProductBtn) cancelProductBtn.addEventListener('click', closeModal);

        // Delete Product
        const deleteProductAction = (pId) => {
            const list = getProducts();
            const matched = list.find(p => p.id === pId);
            if (!matched) return;

            if (confirm(`Are you sure you want to delete ${matched.name}? This will remove it from the homepage catalog.`)) {
                const updated = list.filter(p => p.id !== pId);
                localStorage.setItem('zentro_products', JSON.stringify(updated));
                renderProductsTable();
            }
        };

        // Save / Update Form Submission
        if (productForm) {
            productForm.addEventListener('submit', (e) => {
                e.preventDefault();
                let isFormValid = true;

                const fields = ['prodName', 'prodCategory', 'prodGrade', 'prodBudLife', 'prodAvailability', 'prodPackage', 'prodDescription'];
                fields.forEach(fId => {
                    const input = document.getElementById(fId);
                    if (input.value.trim() === '') {
                        showFieldError(input, true);
                        isFormValid = false;
                    } else {
                        showFieldError(input, false);
                    }
                });

                if (isFormValid) {
                    const editId = document.getElementById('editProductId').value;
                    const list = getProducts();
                    
                    const prodObj = {
                        name: document.getElementById('prodName').value.trim(),
                        category: document.getElementById('prodCategory').value,
                        grade: document.getElementById('prodGrade').value.trim(),
                        budLife: document.getElementById('prodBudLife').value.trim(),
                        availability: document.getElementById('prodAvailability').value.trim(),
                        package: document.getElementById('prodPackage').value.trim(),
                        image: document.getElementById('prodImage').value,
                        description: document.getElementById('prodDescription').value.trim()
                    };

                    if (editId) {
                        // Update
                        const idx = list.findIndex(p => p.id === editId);
                        if (idx !== -1) {
                            prodObj.id = editId;
                            list[idx] = prodObj;
                        }
                    } else {
                        // Create
                        prodObj.id = Date.now().toString();
                        list.push(prodObj);
                    }

                    localStorage.setItem('zentro_products', JSON.stringify(list));
                    closeModal();
                    renderProductsTable();
                }
            });
        }

        /* --- INQUIRIES MANAGEMENT --- */
        const inquiriesTableBody = document.getElementById('inquiriesTableBody');
        const inquiryModal = document.getElementById('inquiryModal');
        const closeInquiryModal = document.getElementById('closeInquiryModal');
        const inquiryDoneBtn = document.getElementById('inquiryDoneBtn');
        const inquiryModalBody = document.getElementById('inquiryModalBody');
        const exportCsvBtn = document.getElementById('exportCsvBtn');

        const renderInquiriesTable = () => {
            const inquiries = getInquiries();
            inquiriesTableBody.innerHTML = '';

            if (inquiries.length === 0) {
                inquiriesTableBody.innerHTML = `
                    <tr>
                        <td colspan="7" class="text-center py-4 text-muted">No inquiries received yet. Submit a quote on the frontpage.</td>
                    </tr>
                `;
                return;
            }

            inquiries.forEach(inq => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${inq.date.split(',')[0]}</td>
                    <td><strong>${inq.name}</strong><br><span style="font-size:0.75rem;color:var(--text-muted);">${inq.company}</span></td>
                    <td>${inq.flower}</td>
                    <td>${inq.volume}</td>
                    <td>${inq.destination}</td>
                    <td>
                        <div class="actions-cell">
                            <a href="tel:${cleanPhone(inq.phone)}" class="btn-icon view-btn" title="Call Client"><i class="fa-solid fa-phone"></i></a>
                            <a href="https://wa.me/${cleanPhone(inq.phone).replace('+','')}" target="_blank" class="btn-icon edit-btn" style="background-color:#25d366;border-color:#25d366;color:#fff;" title="WhatsApp Link"><i class="fa-brands fa-whatsapp"></i></a>
                        </div>
                    </td>
                    <td>
                        <div class="actions-cell">
                            <button class="btn-icon view-inq-btn" data-id="${inq.id}" title="View Details"><i class="fa-solid fa-eye"></i></button>
                            <button class="btn-icon delete-inq-btn" data-id="${inq.id}" title="Delete"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </td>
                `;
                inquiriesTableBody.appendChild(tr);
            });

            // Bind View inquiry Buttons
            document.querySelectorAll('.view-inq-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const inqId = btn.getAttribute('data-id');
                    openInquiryModal(inqId);
                });
            });

            // Bind Delete inquiry Buttons
            document.querySelectorAll('.delete-inq-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const inqId = btn.getAttribute('data-id');
                    deleteInquiryAction(inqId);
                });
            });
            updateSidebarBadges();
        };

        const openInquiryModal = (inqId) => {
            const list = getInquiries();
            const inq = list.find(i => i.id === inqId);
            if (!inq) return;

            inquiryModalBody.innerHTML = `
                <div class="inquiry-details-grid">
                    <div class="inquiry-detail-block">
                        <span class="label">Received Date</span>
                        <p class="val">${inq.date}</p>
                    </div>
                    <div class="inquiry-detail-block">
                        <span class="label">Customer Name</span>
                        <p class="val"><strong>${inq.name}</strong></p>
                    </div>
                    <div class="inquiry-detail-block">
                        <span class="label">Importer Firm</span>
                        <p class="val">${inq.company}</p>
                    </div>
                    <div class="inquiry-detail-block">
                        <span class="label">Target Flower Variety</span>
                        <p class="val"><strong>${inq.flower}</strong></p>
                    </div>
                    <div class="inquiry-detail-block">
                        <span class="label">Required Volume</span>
                        <p class="val">${inq.volume}</p>
                    </div>
                    <div class="inquiry-detail-block">
                        <span class="label">Destination Airport</span>
                        <p class="val">${inq.destination}</p>
                    </div>
                    <div class="inquiry-detail-block">
                        <span class="label">Email Address</span>
                        <p class="val"><a href="mailto:${inq.email}" style="color:var(--primary);text-decoration:underline;">${inq.email}</a></p>
                    </div>
                    <div class="inquiry-detail-block">
                        <span class="label">Phone / WhatsApp</span>
                        <p class="val"><a href="tel:${cleanPhone(inq.phone)}" style="color:var(--primary);text-decoration:underline;">${inq.phone}</a></p>
                    </div>
                    <div class="inquiry-detail-block full-width">
                        <span class="label">Additional Sourcing & Packaging Notes</span>
                        <p class="val notes-val">${inq.notes}</p>
                    </div>
                </div>
            `;

            inquiryModal.classList.add('active');
        };

        const closeInqModal = () => {
            inquiryModal.classList.remove('active');
        };

        if (closeInquiryModal) closeInquiryModal.addEventListener('click', closeInqModal);
        if (inquiryDoneBtn) inquiryDoneBtn.addEventListener('click', closeInqModal);

        const deleteInquiryAction = (inqId) => {
            if (confirm("Are you sure you want to delete this quote request?")) {
                const list = getInquiries();
                const updated = list.filter(i => i.id !== inqId);
                localStorage.setItem('zentro_inquiries', JSON.stringify(updated));
                renderInquiriesTable();
            }
        };

        // Export to CSV Functionality
        if (exportCsvBtn) {
            exportCsvBtn.addEventListener('click', () => {
                const list = getInquiries();
                if (list.length === 0) {
                    alert("No inquiries available to export.");
                    return;
                }

                // Headers
                let csvContent = "Date,Name,Company,Email,Phone,Variety,Volume,Destination,Notes\n";

                // Loop through inquiries
                list.forEach(inq => {
                    const row = [
                        `"${inq.date.replace(/"/g, '""')}"`,
                        `"${inq.name.replace(/"/g, '""')}"`,
                        `"${inq.company.replace(/"/g, '""')}"`,
                        `"${inq.email.replace(/"/g, '""')}"`,
                        `"${inq.phone.replace(/"/g, '""')}"`,
                        `"${inq.flower.replace(/"/g, '""')}"`,
                        `"${inq.volume.replace(/"/g, '""')}"`,
                        `"${inq.destination.replace(/"/g, '""')}"`,
                        `"${inq.notes.replace(/"/g, '""')}"`
                    ].join(",");
                    csvContent += row + "\n";
                });

                // Trigger file download
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", `zentro_inquiries_export_${Date.now()}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }


        /* --- SETTINGS MANAGER --- */
        const settingsForm = document.getElementById('settingsForm');
        
        // Color input colorpicker and text input synchronization
        const setupColorSync = (colorInputId, hexInputId) => {
            const picker = document.getElementById(colorInputId);
            const text = document.getElementById(hexInputId);

            if (picker && text) {
                picker.addEventListener('input', () => {
                    text.value = picker.value.toUpperCase();
                });
                text.addEventListener('input', () => {
                    if (text.value.startsWith('#') && text.value.length === 7) {
                        picker.value = text.value;
                    }
                });
            }
        };

        setupColorSync('primaryColor', 'primaryColorHex');
        setupColorSync('secondaryColor', 'secondaryColorHex');
        setupColorSync('accentColor', 'accentColorHex');

        const loadSettingsForm = () => {
            const sets = getSettings();
            
            // Branding colors
            document.getElementById('primaryColor').value = sets.primaryColor;
            document.getElementById('primaryColorHex').value = sets.primaryColor.toUpperCase();
            
            document.getElementById('secondaryColor').value = sets.secondaryColor;
            document.getElementById('secondaryColorHex').value = sets.secondaryColor.toUpperCase();
            
            document.getElementById('accentColor').value = sets.accentColor;
            document.getElementById('accentColorHex').value = sets.accentColor.toUpperCase();

            // Company info
            document.getElementById('setOfficeName').value = sets.officeName;
            document.getElementById('setOfficeEmail').value = sets.officeEmail;
            document.getElementById('setOfficePhone').value = sets.officePhone;
            document.getElementById('setOfficeAddress').value = sets.officeAddress;

            // Manager Info
            document.getElementById('setLeadName').value = sets.leadName;
            document.getElementById('setLeadPhone').value = sets.leadPhone;
            document.getElementById('setLeadEmail').value = sets.leadEmail;
        };

        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                let isFormValid = true;

                // Validate all fields
                const textFields = ['setOfficeName', 'setOfficeEmail', 'setOfficePhone', 'setOfficeAddress', 'setLeadName', 'setLeadPhone', 'setLeadEmail'];
                textFields.forEach(fId => {
                    const input = document.getElementById(fId);
                    if (input.value.trim() === '') {
                        showFieldError(input, true);
                        isFormValid = false;
                    } else {
                        showFieldError(input, false);
                    }
                });

                if (isFormValid) {
                    const updatedSettings = {
                        primaryColor: document.getElementById('primaryColorHex').value.trim(),
                        secondaryColor: document.getElementById('secondaryColorHex').value.trim(),
                        accentColor: document.getElementById('accentColorHex').value.trim(),
                        
                        officeName: document.getElementById('setOfficeName').value.trim(),
                        officeEmail: document.getElementById('setOfficeEmail').value.trim(),
                        officePhone: document.getElementById('setOfficePhone').value.trim(),
                        officeAddress: document.getElementById('setOfficeAddress').value.trim(),
                        
                        leadName: document.getElementById('setLeadName').value.trim(),
                        leadPhone: document.getElementById('setLeadPhone').value.trim(),
                        leadEmail: document.getElementById('setLeadEmail').value.trim(),
                    };

                    localStorage.setItem('zentro_settings', JSON.stringify(updatedSettings));
                    
                    // Trigger live color updates on dashboard
                    applyThemeColors(updatedSettings);
                    
                    alert("Settings saved successfully! Main landing page details and branding colors have been updated.");
                }
            });
        }

    }

});


























































































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

        // Product CRUD triggers
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
                    document.getElementById("prod-image").value = "";
                    document.getElementById("prod-image-url").value = "";
                    // Reset preview zone
                    document.getElementById("prod-img-preview-wrap").innerHTML = `
                        <i class="fa-solid fa-cloud-arrow-up" style="font-size:2rem; color:var(--text-muted); margin-bottom:8px;"></i>
                        <p style="font-size:0.82rem; color:var(--text-muted); margin:0;">Click to upload product image</p>
                        <p style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">PNG, JPG, WEBP — max 2MB</p>
                    `;
                    document.getElementById("modal-product-title").innerText = "Add New Skincare Product";
                    productModal.classList.add("active");
                });
            }

            // Image file upload handler
            const prodImgFile = document.getElementById("prod-img-file");
                    csvContent += row + "\n";
                });

                // Trigger file download
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.setAttribute("href", url);
                link.setAttribute("download", `zentro_inquiries_export_${Date.now()}.csv`);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }


        /* --- SETTINGS MANAGER --- */
        const settingsForm = document.getElementById('settingsForm');
        
        // Color input colorpicker and text input synchronization
        const setupColorSync = (colorInputId, hexInputId) => {
            const picker = document.getElementById(colorInputId);
            const text = document.getElementById(hexInputId);

            if (picker && text) {
                picker.addEventListener('input', () => {
                    text.value = picker.value.toUpperCase();
                });
                text.addEventListener('input', () => {
                    if (text.value.startsWith('#') && text.value.length === 7) {
                        picker.value = text.value;
                    }
                });
            }
        };

        setupColorSync('primaryColor', 'primaryColorHex');
        setupColorSync('secondaryColor', 'secondaryColorHex');
        setupColorSync('accentColor', 'accentColorHex');

        const loadSettingsForm = async () => {
            const sets = await getSettings();
            
            // Branding colors
            if (sets.primaryColor) {
                document.getElementById('primaryColor').value = sets.primaryColor;
                document.getElementById('primaryColorHex').value = sets.primaryColor.toUpperCase();
            }
            if (sets.secondaryColor) {
                document.getElementById('secondaryColor').value = sets.secondaryColor;
                document.getElementById('secondaryColorHex').value = sets.secondaryColor.toUpperCase();
            }
            if (sets.accentColor) {
                document.getElementById('accentColor').value = sets.accentColor;
                document.getElementById('accentColorHex').value = sets.accentColor.toUpperCase();
            }

            // Company info
            if (sets.officeName) document.getElementById('setOfficeName').value = sets.officeName;
            if (sets.officeEmail) document.getElementById('setOfficeEmail').value = sets.officeEmail;
            if (sets.officePhone) document.getElementById('setOfficePhone').value = sets.officePhone;
            if (sets.officeAddress) document.getElementById('setOfficeAddress').value = sets.officeAddress;

            // Manager Info
            if (sets.leadName) document.getElementById('setLeadName').value = sets.leadName;
            if (sets.leadPhone) document.getElementById('setLeadPhone').value = sets.leadPhone;
            if (sets.leadEmail) document.getElementById('setLeadEmail').value = sets.leadEmail;
        };

        if (settingsForm) {
            settingsForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                let isFormValid = true;

                // Validate all fields
                const textFields = ['setOfficeName', 'setOfficeEmail', 'setOfficePhone', 'setOfficeAddress', 'setLeadName', 'setLeadPhone', 'setLeadEmail'];
                textFields.forEach(fId => {
                    const input = document.getElementById(fId);
                    if (input.value.trim() === '') {
                        showFieldError(input, true);
                        isFormValid = false;
                    } else {
                        showFieldError(input, false);
                    }
                });

                // Validate Password Fields if filled
                const currentPassInput = document.getElementById('currentPassword');
                const newPassInput = document.getElementById('newPassword');
                const confPassInput = document.getElementById('confirmPassword');

                const hasPasswordInput = currentPassInput.value.trim() !== '' || newPassInput.value.trim() !== '' || confPassInput.value.trim() !== '';
                let newPassValue = null;

                if (hasPasswordInput) {
                    const savedPassword = localStorage.getItem('zentro_admin_password') || 'zentro123';
                    
                    if (currentPassInput.value.trim() !== savedPassword) {
                        showFieldError(currentPassInput, true);
                        isFormValid = false;
                    } else {
                        showFieldError(currentPassInput, false);
                    }

                    if (newPassInput.value.trim().length < 4) {
                        showFieldError(newPassInput, true);
                        isFormValid = false;
                    } else {
                        showFieldError(newPassInput, false);
                    }

                    if (newPassInput.value.trim() !== confPassInput.value.trim()) {
                        showFieldError(confPassInput, true);
                        isFormValid = false;
                    } else {
                        showFieldError(confPassInput, false);
                    }

                    if (isFormValid) {
                        newPassValue = newPassInput.value.trim();
                    }
                }

                if (isFormValid) {
                    const updatedSettings = {
                        primaryColor: document.getElementById('primaryColorHex').value.trim(),
                        secondaryColor: document.getElementById('secondaryColorHex').value.trim(),
                        accentColor: document.getElementById('accentColorHex').value.trim(),
                        
                        officeName: document.getElementById('setOfficeName').value.trim(),
                        officeEmail: document.getElementById('setOfficeEmail').value.trim(),
                        officePhone: document.getElementById('setOfficePhone').value.trim(),
                        officeAddress: document.getElementById('setOfficeAddress').value.trim(),
                        
                        leadName: document.getElementById('setLeadName').value.trim(),
                        leadPhone: document.getElementById('setLeadPhone').value.trim(),
                        leadEmail: document.getElementById('setLeadEmail').value.trim()
                    };

                    // Update local storage password if validated successfully
                    if (newPassValue) {
                        localStorage.setItem('zentro_admin_password', newPassValue);
                        updatedSettings.adminPassword = newPassValue;
                        currentPassInput.value = '';
                        newPassInput.value = '';
                        confPassInput.value = '';
                        alert("Administrator access password updated successfully!");
                    } else {
                        updatedSettings.adminPassword = localStorage.getItem('zentro_admin_password') || 'zentro123';
                    }

                    if (supabaseClient) {
                        try {
                            const { error } = await supabaseClient.from('settings').upsert({ id: 1, ...updatedSettings });
                            if (!error) {
                                applyThemeColors(updatedSettings);
                                alert("Settings saved successfully to Supabase cloud! Main landing page details and branding colors have been updated.");
                                return;
                            }
                            console.error("Supabase settings upsert error:", error);
                            alert("Failed to save to Supabase cloud, saving locally as fallback. Error: " + error.message);
                        } catch (e) {
                            console.error("Supabase exception:", e);
                        }
                    }

                    localStorage.setItem('zentro_settings', JSON.stringify(updatedSettings));
                    
                    // Trigger live color updates on dashboard
                    applyThemeColors(updatedSettings);
                    
                    alert("Settings saved successfully! Main landing page details and branding colors have been updated.");
                }
            });
        }

    }

    // Helper functions
    function cleanPhone(phone) {
        if (!phone) return "";
        return phone.replace(/[^+\d]/g, '');
    }

});


                if (hasPasswordInput) {
                    const savedPassword = localStorage.getItem('zentro_admin_password') || 'zentro123';
                    
                    if (currentPassInput.value.trim() !== savedPassword) {
                        showFieldError(currentPassInput, true);
                        isFormValid = false;
                    } else {
                        showFieldError(currentPassInput, false);
                    }

                    if (newPassInput.value.trim().length < 4) {
                        showFieldError(newPassInput, true);
                        isFormValid = false;
                    } else {
                        showFieldError(newPassInput, false);
                    }

                    if (newPassInput.value.trim() !== confPassInput.value.trim()) {
                        showFieldError(confPassInput, true);
                        isFormValid = false;
                    } else {
                        showFieldError(confPassInput, false);
                    }

                    if (isFormValid) {
                        newPassValue = newPassInput.value.trim();
                    }
                }

                if (isFormValid) {
                    const updatedSettings = {
                        primaryColor: document.getElementById('primaryColorHex').value.trim(),
                        secondaryColor: document.getElementById('secondaryColorHex').value.trim(),
                        accentColor: document.getElementById('accentColorHex').value.trim(),
                        
                        officeName: document.getElementById('setOfficeName').value.trim(),
                        officeEmail: document.getElementById('setOfficeEmail').value.trim(),
                        officePhone: document.getElementById('setOfficePhone').value.trim(),
                        officeAddress: document.getElementById('setOfficeAddress').value.trim(),
                        
                        leadName: document.getElementById('setLeadName').value.trim(),
                        leadPhone: document.getElementById('setLeadPhone').value.trim(),
                        leadEmail: document.getElementById('setLeadEmail').value.trim()
                    };

                    // Update local storage password if validated successfully
                    if (newPassValue) {
                        localStorage.setItem('zentro_admin_password', newPassValue);
                        updatedSettings.adminPassword = newPassValue;
                        currentPassInput.value = '';
                        newPassInput.value = '';
                        confPassInput.value = '';
                        alert("Administrator access password updated successfully!");
                    } else {
                        updatedSettings.adminPassword = localStorage.getItem('zentro_admin_password') || 'zentro123';
                    }

                    if (supabaseClient) {
                        try {
                            const { error } = await supabaseClient.from('settings').upsert({ id: 1, ...updatedSettings });
                            if (!error) {
                                applyThemeColors(updatedSettings);
                                alert("Settings saved successfully to Supabase cloud! Main landing page details and branding colors have been updated.");
                        confPassInput.value = '';
                        alert("Administrator access password updated successfully!");
                    } else {
                        updatedSettings.adminPassword = localStorage.getItem('zentro_admin_password') || 'zentro123';
                    }
                    } else {
                        updatedSettings.adminPassword = localStorage.getItem('zentro_admin_password') || 'zentro123';
                    }

                    if (supabaseClient) {
                        try {
                            const { error } = await supabaseClient.from('settings').upsert({ id: 1, ...updatedSettings });
                            if (!error) {
                                applyThemeColors(updatedSettings);
                                alert("Settings saved successfully to Supabase cloud! Main landing page details and branding colors have been updated.");
                                return;
                            }
                            console.error("Supabase settings upsert error:", error);
                            alert("Failed to save to Supabase cloud, saving locally as fallback. Error: " + error.message);
                        } catch (e) {
                            console.error("Supabase exception:", e);
                        }
                    }

                    localStorage.setItem('zentro_settings', JSON.stringify(updatedSettings));
                    
                    // Trigger live color updates on dashboard
                    applyThemeColors(updatedSettings);
                    
                    alert("Settings saved successfully! Main landing page details and branding colors have been updated.");
                }
            });
        }

    }

    // Helper functions
    function cleanPhone(phone) {
        if (!phone) return "";
        return String(phone).replace(/[^+\d]/g, '');
    }

});

                    if (currentPassInput.value.trim() !== savedPassword) {
                        showFieldError(currentPassInput, true);
                        isFormValid = false;
                    } else {
                        showFieldError(currentPassInput, false);
                    }

                    if (newPassInput.value.trim().length < 4) {
                        showFieldError(newPassInput, true);
                        isFormValid = false;
                    } else {
                        showFieldError(newPassInput, false);
                    }

                    if (newPassInput.value.trim() !== confPassInput.value.trim()) {
                        showFieldError(confPassInput, true);
                        isFormValid = false;
                    } else {
                        showFieldError(confPassInput, false);
                    }

                    if (isFormValid) {
                        newPassValue = newPassInput.value.trim();
                    }
                }

                    if (newPassInput.value.trim() !== confPassInput.value.trim()) {
                        showFieldError(confPassInput, true);
                        isFormValid = false;
                    } else {
                        showFieldError(confPassInput, false);
                    }

                    if (isFormValid) {
                        newPassValue = newPassInput.value.trim();
                    }
                }

                if (isFormValid) {
                    const updatedSettings = {
                        primaryColor: document.getElementById('primaryColorHex').value.trim(),
                        secondaryColor: document.getElementById('secondaryColorHex').value.trim(),
                        accentColor: document.getElementById('accentColorHex').value.trim(),
                        
                        officeName: document.getElementById('setOfficeName').value.trim(),
                        officeEmail: document.getElementById('setOfficeEmail').value.trim(),
                        officePhone: document.getElementById('setOfficePhone').value.trim(),
                        officeAddress: document.getElementById('setOfficeAddress').value.trim(),
                        
                        leadName: document.getElementById('setLeadName').value.trim(),
                        leadPhone: document.getElementById('setLeadPhone').value.trim(),
                        leadEmail: document.getElementById('setLeadEmail').value.trim(),

                        heroTitle: document.getElementById('setHeroTitle').value.trim(),
                        heroDescription: document.getElementById('setHeroDescription').value.trim(),
                        heroImage: document.getElementById('setHeroImage').value
                    };

                    // Update local storage password if validated successfully
                    if (newPassValue) {
                        localStorage.setItem('zentro_admin_password', newPassValue);
                        updatedSettings.adminPassword = newPassValue;
                        currentPassInput.value = '';
                        newPassInput.value = '';
                        confPassInput.value = '';
                        alert("Administrator access password updated successfully!");
                    } else {
                        updatedSettings.adminPassword = localStorage.getItem('zentro_admin_password') || 'zentro123';
                    }

                    if (supabaseClient) {
                        updatedSettings.adminPassword = localStorage.getItem('zentro_admin_password') || 'zentro123';
                    }

                    if (supabaseClient) {
                        try {
                            const { error } = await supabaseClient.from('settings').upsert({ id: 1, ...updatedSettings });
                            if (!error) {
                                applyThemeColors(updatedSettings);
                                alert("Settings saved successfully to Supabase cloud! Main landing page details and branding colors have been updated.");
                                return;
                            }
                            console.error("Supabase settings upsert error:", error);
                            alert("Failed to save to Supabase cloud, saving locally as fallback. Error: " + error.message);
                        } catch (e) {
                            console.error("Supabase exception:", e);
                        }
                    }

                    localStorage.setItem('zentro_settings', JSON.stringify(updatedSettings));
                    
                    // Trigger live color updates on dashboard
                    applyThemeColors(updatedSettings);
                    
                    alert("Settings saved successfully! Main landing page details and branding colors have been updated.");
                }
            });
        }

    }

                    if (currentPassInput.value.trim() !== savedPassword) {
                        showFieldError(currentPassInput, true);
                        isFormValid = false;
                    } else {
                        showFieldError(currentPassInput, false);
                    }

                    if (newPassInput.value.trim().length < 4) {
                        showFieldError(newPassInput, true);
                        isFormValid = false;
                    } else {
                        showFieldError(newPassInput, false);
                    }

                    if (newPassInput.value.trim() !== confPassInput.value.trim()) {
                        showFieldError(confPassInput, true);
                        isFormValid = false;
                    } else {
                        showFieldError(confPassInput, false);
                    }

                    if (isFormValid) {
                        newPassValue = newPassInput.value.trim();
                    }
                }

                if (isFormValid) {
                    const updatedSettings = {
                        primaryColor: document.getElementById('primaryColorHex').value.trim(),
                        secondaryColor: document.getElementById('secondaryColorHex').value.trim(),
                        accentColor: document.getElementById('accentColorHex').value.trim(),
                        
                        officeName: document.getElementById('setOfficeName').value.trim(),
                        officeEmail: document.getElementById('setOfficeEmail').value.trim(),
                        officePhone: document.getElementById('setOfficePhone').value.trim(),
                        officeAddress: document.getElementById('setOfficeAddress').value.trim(),
                        
                        leadName: document.getElementById('setLeadName').value.trim(),
                        leadPhone: document.getElementById('setLeadPhone').value.trim(),
                        leadEmail: document.getElementById('setLeadEmail').value.trim(),

                        heroTitle: document.getElementById('setHeroTitle').value.trim(),
                        heroDescription: document.getElementById('setHeroDescription').value.trim(),
                        heroImage: document.getElementById('setHeroImage').value,

                        aboutTitle: document.getElementById('setAboutTitle').value.trim(),
                        aboutDescription: document.getElementById('setAboutDescription').value.trim(),
                        aboutImage: document.getElementById('setAboutImage').value
                    };

                    // Update local storage password if validated successfully
                    if (newPassValue) {
                        localStorage.setItem('zentro_admin_password', newPassValue);
                        updatedSettings.adminPassword = newPassValue;
                        currentPassInput.value = '';
                        newPassInput.value = '';
                        confPassInput.value = '';
                        alert("Administrator access password updated successfully!");
                    } else {
                        updatedSettings.adminPassword = localStorage.getItem('zentro_admin_password') || 'zentro123';
                    }

                    if (supabaseClient) {
                        try {
                            const { error } = await supabaseClient.from('settings').upsert({ id: 1, ...updatedSettings });
                            if (!error) {
                                applyThemeColors(updatedSettings);
                                alert("Settings saved successfully to Supabase cloud! Main landing page details and branding colors have been updated.");
                                return;
                            }
                            console.error("Supabase settings upsert error:", error);
                            alert("Failed to save to Supabase cloud, saving locally as fallback. Error: " + error.message);
                        } catch (e) {
                            console.error("Supabase exception:", e);
                        }
                    }

                    localStorage.setItem('zentro_settings', JSON.stringify(updatedSettings));
                    
                    // Trigger live color updates on dashboard
                    applyThemeColors(updatedSettings);
                    
                    alert("Settings saved successfully! Main landing page details and branding colors have been updated.");
                }
            });
        }

    }

    // Helper functions
    function cleanPhone(phone) {
        if (!phone) return "";
        return String(phone).replace(/[^+\d]/g, '');
    }

        if (!phone) return "";
        return String(phone).replace(/[^+\d]/g, '');
    }

});


