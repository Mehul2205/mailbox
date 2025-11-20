// script.js
// Full mailbox script with Splash (Option A), confetti, mail-sprinkle, pagination, folders, etc.

document.addEventListener('DOMContentLoaded', () => {
    /* =========================
       CONFIG
    ========================= */
    const PAGE_SIZE = 10;                    // emails per page
    const SPLASH_TOTAL_CONFETTI = 60;        // confetti particles
    const SPLASH_MAIL_SPRINKLE = 12;         // number of mail icons that fly out
    const SPLASH_TIMINGS = {
        envelopeScaleDelay: 400,             // ms
        flapOpenDelay: 900,
        confettiStartDelay: 1000,
        mailsSprinkleDelay: 1200,
        revealUIDelay: 2400
    };

    /* =========================
       DOM ELEMENTS / STATE
    ========================= */
    // Primary UI elements (must match your HTML)
    const splashScreen = document.getElementById('splash-screen');
    const envelopeContainer = document.querySelector('.envelope-container');
    const topFlap = document.querySelector('.envelope .top-flap');
    const confettiContainer = document.getElementById('confetti-container');
    const inboxName = document.getElementById('inbox-name');
    const mainContentWrapper = document.getElementById('main-content-wrapper');

    const emailList = document.getElementById('email-list');
    const emailDetailView = document.getElementById('email-detail-view');
    const backBtn = document.getElementById('back-btn');
    const navItems = document.querySelectorAll('.nav-item');
    const deleteBtn = document.getElementById('delete-btn');
    const spamBtn = document.getElementById('spam-btn');
    const searchInput = document.getElementById('search-input');
    const profileActions = document.querySelector('.profile-actions');
    const toggleBtn = document.getElementById('toggle-btn');
    const profileSidebar = document.getElementById('profile-sidebar');
    const mainContainer = document.getElementById('main-container');
    const composeBtn = document.getElementById('compose-btn');

    // runtime state
    let allEmails = [];          // full email list
    let visibleEmails = [];      // after folder & search filter
    let selectedEmails = new Set();
    let currentFolder = 'inbox';
    let currentPage = 1;
    let currentSort = 'default'; // track current sorting method

    // Ensure pagination container exists (if not present in HTML, create it)
    let paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.id = 'pagination';
        // style lightly so it matches your theme (main CSS added earlier)
        paginationContainer.style.margin = '8px 0 20px 0';
        // insert after email-list
        emailList.insertAdjacentElement('afterend', paginationContainer);
    }

    /* =========================
       UTILITIES
    ========================= */
    function randomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    function escapeHtml(text) {
        if (text === undefined || text === null) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

    /* =========================
       REALISTIC EMAIL GENERATOR
       (200 emails - human-like)
    ========================= */
    (function generateEmails() {
        const senders = [
            "Amazon Support", "Flipkart", "HR - Infosys", "Google Security", "Microsoft Teams",
            "LinkedIn", "Paytm Wallet", "University Office", "Netflix India", "Swiggy",
            "Zomato", "Campus Coordinator", "Prof. Sharma", "Prof. Mehta", "GitHub",
            "Stack Overflow", "Coursera", "Udemy", "NPTEL", "Delivery Service",
            "Blue Dart", "FedEx", "DHL", "TCS Careers", "HackerRank"
        ];

        const subjects = [
            "Your order has been shipped",
            "Important: Update your account information",
            "Assignment deadline reminder",
            "Interview scheduled - confirm availability",
            "Subscription renewal notice",
            "Security Alert: New login detected",
            "Payment receipt available",
            "Invitation: Campus event this Friday",
            "Weekly progress report",
            "OTP for your login",
            "Verify your email address",
            "Resume shortlisted for review",
            "Your parcel is out for delivery",
            "Congratulations — test cleared",
            "Submission successful",
            "Exam timetable released",
            "Refund processed",
            "Ticket confirmation",
            "New course recommendation",
            "Exclusive offer inside"
        ];

        const bodyTemplates = [
`Hi,

Your order has been processed and is on the way. Track it using your account dashboard.

Regards,
Customer Support`,

`Hello,

We detected an unfamiliar login to your account. If this was not you, please reset your password.

Security Team`,

`Dear Student,

This is a reminder that your assignment is due tomorrow on the portal.

Best,
Course Instructor`,

`Greetings,

Your interview has been scheduled — please check the attachments and confirm.

HR Team`,

`Hi,

Your parcel has arrived at the local center and will be delivered within 24 hours.

Delivery Services`
        ];

        const categories = [
            "academic", "promotional", "social", "shipment", "invoices", "security", "career", "subscription"
        ];

        const photos = [
            "https://cdn-icons-png.flaticon.com/512/1998/1998592.png",
            "https://cdn-icons-png.flaticon.com/512/1144/1144760.png",
            "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            "https://cdn-icons-png.flaticon.com/512/3001/3001764.png"
        ];

        function randomDateLast90Days() {
            const days = Math.floor(Math.random() * 90);
            const d = new Date();
            d.setDate(d.getDate() - days);
            return d.toLocaleString('en-US', { month: 'short', day: 'numeric' });
        }

        function snippetFrom(body) {
            return body.replace(/\n/g, ' ').slice(0, 70) + (body.length > 70 ? '...' : '');
        }

        for (let i = 1; i <= 200; i++) {
            const body = randomItem(bodyTemplates);
            const subject = randomItem(subjects);
            const sender = randomItem(senders);
            const senderEmail = sender.toLowerCase().replace(/\s+/g, '.') + '@example.com';
            const folder = Math.random() > 0.92 ? 'spam' : (Math.random() > 0.95 ? 'trash' : 'inbox'); // bias inbox
            const days = Math.floor(Math.random() * 90);
            const d = new Date();
            d.setDate(d.getDate() - days);
            const timestamp = d.getTime();
            const dateStr = d.toLocaleString('en-US', { month: 'short', day: 'numeric' });
            allEmails.push({
                id: i,
                sender,
                senderEmail,
                subject,
                snippet: snippetFrom(body),
                date: dateStr,
                timestamp,
                isRead: Math.random() > 0.45,
                isStarred: Math.random() > 0.82,
                isImportant: Math.random() > 0.88,
                hasAttachments: Math.random() > 0.7,
                folder,
                category: randomItem(categories),
                photo: randomItem(photos),
                body
            });
        }
    })();

    /* =========================
       SPLASH SCREEN / ANIMATIONS (Option A)
    ========================= */
    // Create confetti particles during splash
    function createConfettiBurst(container, count) {
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'confetti-particle';
            const color = ['#ffc107', '#28a745', '#007bff', '#dc3545', '#6c757d'][Math.floor(Math.random() * 5)];
            const size = Math.random() * 8 + 4;
            p.style.backgroundColor = color;
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            // initial position centered
            p.style.left = `${(Math.random() - 0.5) * 240}px`;
            p.style.top = `${(Math.random() - 0.5) * 80}px`;
            // random animation - translate, rotate, fade
            const dx = (Math.random() - 0.5) * 800;
            const dy = 300 + Math.random() * 200;
            const rot = (Math.random() - 0.5) * 720;
            p.animate([
                { transform: `translate(0px, 0px) rotate(0deg)`, opacity: 1 },
                { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, opacity: 0 }
            ], {
                duration: 1800 + Math.random() * 800,
                easing: 'cubic-bezier(.2,.7,.2,1)',
                delay: Math.random() * 500
            });
            container.appendChild(p);
            // remove after animation
            setTimeout(() => p.remove(), 3000);
        }
    }

    // Create mail-icon sprinkles that fly out from envelope
    function createMailSprinkle(container, count) {
        for (let i = 0; i < count; i++) {
            const m = document.createElement('div');
            m.className = 'mail-sprinkle';
            // simple mail icon as text using Material Icons where available; fallback to emoji
            m.innerHTML = `<span class="material-icons" style="font-size:24px;">mail_outline</span>`;
            m.style.position = 'absolute';
            const startX = (Math.random() - 0.5) * 200;
            const startY = 10 + Math.random() * 30;
            m.style.left = `${startX}px`;
            m.style.top = `${startY}px`;
            container.appendChild(m);

            // animate along a curve outward
            const angle = (Math.random() * Math.PI) - (Math.PI / 2); // spread upward
            const distance = 220 + Math.random() * 240;
            const dx = Math.cos(angle) * distance;
            const dy = -Math.abs(Math.sin(angle) * distance) - 40 - Math.random() * 120;
            const rotate = (Math.random() - 0.5) * 720;
            const duration = 1200 + Math.random() * 800;

            m.animate([
                { transform: `translate(0px,0px) rotate(0deg)`, opacity: 1 },
                { transform: `translate(${dx}px, ${dy}px) rotate(${rotate}deg)`, opacity: 0 }
            ], {
                duration,
                easing: 'cubic-bezier(.2,.7,.2,1)',
                delay: Math.random() * 300
            });

            setTimeout(() => m.remove(), duration + 400);
        }
    }

    function playSplashSequence() {
        // start envelope scale
        envelopeContainer.style.transform = 'scale(1)';
        // small bounce effect
        envelopeContainer.animate([
            { transform: 'scale(0.92)' },
            { transform: 'scale(1.03)' },
            { transform: 'scale(1)' }
        ], { duration: 400, easing: 'ease-out' });

        // open flap after short delay
        setTimeout(() => {
            topFlap.style.transform = 'rotateX(180deg)';
        }, SPLASH_TIMINGS.envelopeScaleDelay);

        // confetti burst slightly after flap opens
        setTimeout(() => {
            createConfettiBurst(confettiContainer, SPLASH_TOTAL_CONFETTI);
            confettiContainer.classList.add('active');
        }, SPLASH_TIMINGS.confettiStartDelay);

        // mail sprinkles
        setTimeout(() => {
            createMailSprinkle(confettiContainer, SPLASH_MAIL_SPRINKLE);
        }, SPLASH_TIMINGS.mailsSprinkleDelay);

        // reveal UI after animations
        setTimeout(() => {
            // fade out splash
            splashScreen.style.transition = 'opacity 500ms ease';
            splashScreen.style.opacity = '0';
            splashScreen.style.pointerEvents = 'none';

            // show main wrapper (match CSS for display)
            mainContentWrapper.style.display = 'grid';
            mainContentWrapper.style.opacity = '1';
        }, SPLASH_TIMINGS.revealUIDelay);

        // cleanup confetti container later
        setTimeout(() => {
            confettiContainer.innerHTML = '';
            confettiContainer.classList.remove('active');
        }, SPLASH_TIMINGS.revealUIDelay + 1500);
    }

    // start splash
    // ensure initial styles (envelope scaled down etc.)
    envelopeContainer.style.transform = 'scale(0)';
    inboxName.style.opacity = '0';
    inboxName.style.transform = 'translateY(20px)';

    // textual reveal of inbox name slightly after flap opens
    setTimeout(() => {
        inboxName.style.opacity = '1';
        inboxName.style.transform = 'translateY(0)';
    }, SPLASH_TIMINGS.flapOpenDelay + 200);

    // run the animation chain
    setTimeout(() => playSplashSequence(), 450);

    /* =========================
       RENDERING & PAGINATION
    ========================= */

    function applyFilters() {
        // folder filter
        if (currentFolder === 'inbox') {
            visibleEmails = allEmails.filter(e => e.folder === 'inbox');
        } else if (currentFolder === 'starred') {
            visibleEmails = allEmails.filter(e => e.isStarred && e.folder === 'inbox');
        } else if (currentFolder === 'important') {
            visibleEmails = allEmails.filter(e => e.isImportant && e.folder === 'inbox');
        } else if (currentFolder === 'archive') {
            visibleEmails = allEmails.filter(e => e.folder === 'archive');
        } else if (currentFolder === 'trash') {
            visibleEmails = allEmails.filter(e => e.folder === 'trash' || e.folder === 'permanent-trash');
        } else if (currentFolder === 'spam') {
            visibleEmails = allEmails.filter(e => e.folder === 'spam');
        } else if (['academic','shipment','promotional','social','invoices','finance','subscription','security','career','events'].includes(currentFolder)) {
            visibleEmails = allEmails.filter(e => e.category === currentFolder && e.folder === 'inbox');
        } else {
            visibleEmails = allEmails.filter(e => e.folder === 'inbox');
        }

        // search filter
        const q = (searchInput && searchInput.value) ? searchInput.value.trim().toLowerCase() : '';
        if (q) {
            visibleEmails = visibleEmails.filter(e =>
                e.sender.toLowerCase().includes(q) ||
                e.subject.toLowerCase().includes(q) ||
                e.snippet.toLowerCase().includes(q) ||
                e.body.toLowerCase().includes(q)
            );
        }

        // apply sorting based on currentSort
        applySorting();
    }

    function applySorting() {
        if (currentSort === 'unread') {
            visibleEmails = visibleEmails.filter(e => !e.isRead);
        } else if (currentSort === 'newest') {
            visibleEmails.sort((a, b) => b.timestamp - a.timestamp);
        } else if (currentSort === 'oldest') {
            visibleEmails.sort((a, b) => a.timestamp - b.timestamp);
        } else if (currentSort === 'sender-asc') {
            visibleEmails.sort((a, b) => a.sender.localeCompare(b.sender));
        } else if (currentSort === 'attachments') {
            visibleEmails = visibleEmails.filter(e => e.hasAttachments);
        } else if (currentSort === 'all' || currentSort === 'default') {
            // No additional filtering/sorting for 'all' or default
            // Just keep the current order from folder filter
        }
    }

    function renderPage() {
        emailList.innerHTML = '';
        selectedEmails.clear();

        applyFilters();

        if (visibleEmails.length === 0) {
            emailList.innerHTML = `<p style="text-align:center; margin:40px 0; color:var(--text-medium)">No emails in this folder.</p>`;
            updatePagination();
            return;
        }

        // clamp page
        const totalPages = Math.max(1, Math.ceil(visibleEmails.length / PAGE_SIZE));
        currentPage = clamp(currentPage, 1, totalPages);

        const start = (currentPage - 1) * PAGE_SIZE;
        const pageItems = visibleEmails.slice(start, start + PAGE_SIZE);

        const frag = document.createDocumentFragment();
        for (const email of pageItems) {
            const item = document.createElement('div');
            item.className = 'email-item' + (email.isRead ? ' read' : ' unread');
            if (email.isStarred) item.classList.add('starred');
            if (email.isImportant) item.classList.add('important');
            item.dataset.id = email.id;

            item.innerHTML = `
                <input type="checkbox" class="email-checkbox" />
                ${!email.isRead ? '<span class="unread-badge" title="Unread"></span>' : ''}
                <div class="email-status">
                    <span class="material-icons star-icon" title="Toggle star" data-action="star" data-id="${email.id}">${email.isStarred ? 'star' : 'star_border'}</span>
                    <span class="material-icons important-icon" title="Important" data-action="important" data-id="${email.id}" style="visibility:${email.isImportant ? 'visible':'hidden'}">label_important</span>
                    ${email.hasAttachments ? '<span class="material-icons attach-icon" title="Has attachment">attach_file</span>' : ''}
                </div>
                <div class="email-details">
                    <span class="email-sender">${escapeHtml(email.sender)}</span>
                    <span class="email-subject">${escapeHtml(email.subject)}</span>
                    <span class="email-snippet"> - ${escapeHtml(email.snippet)}</span>
                </div>
                <span class="email-date">${escapeHtml(email.date)}</span>
            `;
            frag.appendChild(item);
        }
        emailList.appendChild(frag);

        updatePagination();
    }

    function updatePagination() {
        paginationContainer.innerHTML = '';
        const totalPages = Math.max(1, Math.ceil(visibleEmails.length / PAGE_SIZE));

        // only show if > 1 page
        if (totalPages <= 1) {
            // small info
            const info = document.createElement('div');
            info.style.color = 'var(--text-medium)';
            info.style.textAlign = 'center';
            info.style.padding = '8px';
            info.textContent = `${visibleEmails.length} item${visibleEmails.length !== 1 ? 's' : ''}`;
            paginationContainer.appendChild(info);
            return;
        }

        const btn = (label, page, disabled=false, active=false) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = active ? 'active-page' : '';
            b.textContent = label;
            b.disabled = disabled;
            b.style.padding = '6px 10px';
            b.style.borderRadius = '6px';
            b.style.border = 'none';
            b.style.cursor = disabled ? 'default' : 'pointer';
            if (active) {
                b.style.background = 'var(--primary-blue)';
                b.style.color = '#fff';
                b.style.fontWeight = '600';
            } else {
                b.style.background = 'transparent';
                b.style.color = 'var(--text-dark)';
                b.style.border = '1px solid var(--border-light)';
            }
            b.addEventListener('click', () => {
                currentPage = page;
                renderPage();
                // give smooth scroll to top of list
                emailList.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
            return b;
        };

        // prev
        paginationContainer.appendChild(btn('Prev', clamp(currentPage - 1, 1, totalPages), currentPage === 1));
        // page window logic (show up to 7)
        let start = Math.max(1, currentPage - 3);
        let end = Math.min(totalPages, currentPage + 3);
        if (end - start < 6) {
            start = Math.max(1, Math.min(start, totalPages - 6));
            end = Math.min(totalPages, start + 6);
        }

        if (start > 1) {
            paginationContainer.appendChild(btn('1', 1, false, currentPage === 1));
            if (start > 2) {
                const dots = document.createElement('span'); dots.textContent = '...'; dots.style.padding = '6px';
                paginationContainer.appendChild(dots);
            }
        }

        for (let p = start; p <= end; p++) {
            paginationContainer.appendChild(btn(String(p), p, false, p === currentPage));
        }

        if (end < totalPages) {
            if (end < totalPages - 1) {
                const dots = document.createElement('span'); dots.textContent = '...'; dots.style.padding = '6px';
                paginationContainer.appendChild(dots);
            }
            paginationContainer.appendChild(btn(String(totalPages), totalPages, false, totalPages === currentPage));
        }

        // next
        paginationContainer.appendChild(btn('Next', clamp(currentPage + 1, 1, totalPages), currentPage === totalPages));

        // small info
        const info = document.createElement('div');
        info.style.marginLeft = '12px';
        info.style.color = 'var(--text-medium)';
        const from = Math.min(visibleEmails.length, (currentPage - 1) * PAGE_SIZE + 1);
        const to = Math.min(visibleEmails.length, currentPage * PAGE_SIZE);
        info.textContent = `Showing ${from}-${to} of ${visibleEmails.length}`;
        paginationContainer.appendChild(info);
    }

    /* =========================
       INTERACTIONS
    ========================= */

    // search input
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            currentPage = 1;
            renderPage();
        });
    }

    // folder navigation
    navItems.forEach(item => {
        item.addEventListener('click', (ev) => {
            ev.preventDefault();
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            currentFolder = item.getAttribute('data-folder') || 'inbox';
            currentSort = 'default';
            currentPage = 1;
            renderPage();
            // ensure list view shown
            emailList.classList.remove('hidden');
            emailDetailView.classList.add('hidden');
            paginationContainer.classList.remove('hidden');
            backBtn.classList.add('hidden');
        });
    });

    // delegated clicks in email list
    emailList.addEventListener('click', (ev) => {
        const target = ev.target;

        // star / important toggles (elements have data-action attributes in renderPage)
        const actionEl = target.closest('[data-action]');
        if (actionEl) {
            const action = actionEl.getAttribute('data-action');
            const id = parseInt(actionEl.getAttribute('data-id'), 10);
            const email = allEmails.find(x => x.id === id);
            if (!email) return;
            if (action === 'star') {
                email.isStarred = !email.isStarred;
                renderPage();
            } else if (action === 'important') {
                email.isImportant = !email.isImportant;
                renderPage();
            }
            return;
        }

        // ignore clicks on checkboxes (they are handled by change event)
        if (target.type === 'checkbox') return;

        // open email item
        const item = target.closest('.email-item');
        if (item) {
            const id = parseInt(item.getAttribute('data-id'), 10);
            const email = allEmails.find(x => x.id === id);
            if (!email) return;

            // mark read and update UI
            if (!email.isRead) {
                email.isRead = true;
                item.classList.remove('unread');
                item.classList.add('read');
                const badge = item.querySelector('.unread-badge');
                if (badge) badge.remove();
            }

            showEmailDetails(email);
        }
    });

    // checkbox change (select/deselect)
    emailList.addEventListener('change', (ev) => {
        if (!ev.target.classList.contains('email-checkbox')) return;
        const item = ev.target.closest('.email-item');
        const id = parseInt(item.getAttribute('data-id'), 10);
        if (ev.target.checked) {
            selectedEmails.add(id);
            item.classList.add('selected');
        } else {
            selectedEmails.delete(id);
            item.classList.remove('selected');
        }
    });

    // delete selected
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (selectedEmails.size === 0) {
                alert('Select at least one email to delete.');
                return;
            }
            selectedEmails.forEach(id => {
                const e = allEmails.find(x => x.id === id);
                if (!e) return;
                if (currentFolder === 'trash' || e.folder === 'trash') {
                    e.folder = 'permanent-trash';
                } else {
                    e.folder = 'trash';
                }
            });
            selectedEmails.clear();
            renderPage();
        });
    }

    // report spam
    if (spamBtn) {
        spamBtn.addEventListener('click', () => {
            if (selectedEmails.size === 0) {
                alert('Select at least one email to report as spam.');
                return;
            }
            selectedEmails.forEach(id => {
                const e = allEmails.find(x => x.id === id);
                if (!e) return;
                e.folder = 'spam';
            });
            selectedEmails.clear();
            renderPage();
        });
    }

    // profile actions placeholder
    if (profileActions) {
        profileActions.addEventListener('click', (ev) => {
            const btn = ev.target.closest('.profile-btn');
            if (!btn) return;
            const action = btn.getAttribute('data-action');
            alert(`Clicked ${action} (demo placeholder).`);
        });
    }

    // sidebar toggle (collapse)
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            profileSidebar.classList.toggle('collapsed');
            mainContainer.classList.toggle('collapsed');
        });
    }

    // compose placeholder
    if (composeBtn) {
        composeBtn.addEventListener('click', () => {
            alert('Compose clicked — implement compose modal here.');
        });
    }

    // back button
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            emailDetailView.classList.add('hidden');
            emailList.classList.remove('hidden');
            paginationContainer.classList.remove('hidden');
            backBtn.classList.add('hidden');
        });
    }

    // archive button
    const archiveBtn = document.getElementById('archive-btn');
    if (archiveBtn) {
        archiveBtn.addEventListener('click', () => {
            if (selectedEmails.size === 0) {
                alert('Select at least one email to archive.');
                return;
            }
            selectedEmails.forEach(id => {
                const e = allEmails.find(x => x.id === id);
                if (!e) return;
                e.folder = 'archive';
            });
            selectedEmails.clear();
            renderPage();
        });
    }

    // mark unread button
    const markUnreadBtn = document.getElementById('mark-unread');
    if (markUnreadBtn) {
        markUnreadBtn.addEventListener('click', () => {
            if (selectedEmails.size === 0) {
                alert('Select at least one email to mark as unread.');
                return;
            }
            selectedEmails.forEach(id => {
                const e = allEmails.find(x => x.id === id);
                if (!e) return;
                e.isRead = false;
            });
            selectedEmails.clear();
            renderPage();
        });
    }

    /* =========================
       EMAIL DETAIL VIEW
    ========================= */
    function showEmailDetails(email) {
        document.getElementById('detail-subject').textContent = email.subject;
        document.getElementById('detail-photo').src = email.photo;
        document.getElementById('detail-sender').textContent = email.sender + ' <' + email.senderEmail + '>';
        document.getElementById('detail-date').textContent = email.date;
        document.getElementById('detail-body').innerHTML = escapeHtml(email.body).replace(/\n/g, '<br>');

        emailList.classList.add('hidden');
        emailDetailView.classList.remove('hidden');
        paginationContainer.classList.add('hidden');
        backBtn.classList.remove('hidden');
    }

    /* =========================
       KEYBOARD SHORTCUTS (small set)
    ========================= */
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'g') { // ctrl+g go inbox
            const inboxNav = document.querySelector('.nav-item[data-folder="inbox"]');
            if (inboxNav) inboxNav.click();
        }
        if (e.ctrlKey && e.key === 'n') { // ctrl+n compose
            composeBtn && composeBtn.click();
        }
    });

    /* =========================
       START: initial folder render
    ========================= */
    // ensure inbox nav reads "ksk's inbox" as in original
    const inboxNavItem = document.querySelector('.nav-item[data-folder="inbox"] span:last-of-type');
    if (inboxNavItem) inboxNavItem.textContent = "ksk's inbox";

    // initial render after the splash reveal finishes (give slight delay to ensure UI visible)
    setTimeout(() => {
        currentFolder = 'inbox';
        currentPage = 1;
        renderPage();
    }, SPLASH_TIMINGS.revealUIDelay + 60);

    /* =========================
       FILTER DROPDOWN SETUP
    ========================= */
    const filterBtn = document.getElementById("filter-btn");
    const filterMenu = document.getElementById("filter-menu");

    filterBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        filterMenu.classList.toggle("hidden");
    });

    // filter item click
    document.querySelectorAll(".filter-item").forEach(item => {
        item.addEventListener("click", () => {
            currentSort = item.dataset.filter;
            currentPage = 1;
            filterMenu.classList.add("hidden");
            renderPage();
        });
    });

    // Click outside → close dropdown
    document.addEventListener("click", (e) => {
        if (!filterMenu.contains(e.target) && !filterBtn.contains(e.target)) {
            filterMenu.classList.add("hidden");
        }
    });
});


