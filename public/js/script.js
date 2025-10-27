// Wait for the document to be fully loaded
document.addEventListener("DOMContentLoaded", (event) => {
  // Find the button and the sidebar by their IDs
  const toggleBtn = document.getElementById("toggleBtn");
  const sidebar = document.getElementById("sidebar");

  // Make sure both elements were found before adding a listener
  if (toggleBtn && sidebar) {
    // 🔽 Collapse sidebar by default on page load
    sidebar.classList.add("collapsed");

    // Add the click event listener to the button
    toggleBtn.addEventListener("click", () => {
      // Toggle the "collapsed" class on each click
      sidebar.classList.toggle("collapsed");
    });
  } else {
    console.error("Could not find toggle button or sidebar.");
  }
});


// === Search, Filter, Sort Logic (Reusable for Books & Members) ===
const searchBar =
  document.getElementById("searchBar") ||
  document.getElementById("memberSearch");
const filterStatus = document.getElementById("filterStatus");
const sortBy = document.getElementById("sortBy");
const filterMembership = document.getElementById("filterMembership");

// Detect page type
const isBooksPage = document.querySelector(".book-card");
const isMembersPage = document.querySelector(".member-card");

const applyFilters = () => {
  const query = searchBar ? searchBar.value.toLowerCase() : "";
  const statusFilter = filterStatus ? filterStatus.value : "all";
  const sortOption = sortBy ? sortBy.value : null;
  const membershipFilter = filterMembership ? filterMembership.value : "all";

  // --- For Books ---
  if (isBooksPage) {
    const cards = Array.from(document.querySelectorAll(".book-card"));
    const grid = document.querySelector(".books-grid");

    cards.forEach((card) => {
      const title = card.querySelector("h3").innerText.toLowerCase();
      const status = card.querySelector(".status").innerText.toLowerCase();

      const matchesQuery = title.includes(query);
      const matchesStatus = statusFilter === "all" || status === statusFilter;

      card.style.display = matchesQuery && matchesStatus ? "flex" : "none";
    });

    // Optional sorting (by title, author, year)
    if (sortOption) {
      const visibleCards = cards.filter((c) => c.style.display !== "none");
      visibleCards.sort((a, b) => {
        const aText =
          a.querySelector(`.book-info-left p strong:nth-child(1)`)?.innerText ||
          "";
        const bText =
          b.querySelector(`.book-info-left p strong:nth-child(1)`)?.innerText ||
          "";
        return aText.localeCompare(bText);
      });
      visibleCards.forEach((card) => grid.appendChild(card));
    }
  }

  // --- For Members ---
  if (isMembersPage) {
    const cards = Array.from(document.querySelectorAll(".member-card"));
    const grid = document.querySelector(".members-grid");

    cards.forEach((card) => {
      const name = card.querySelector("h3").innerText.toLowerCase();
      const membershipType = card
        .querySelector(".member-info-left p:nth-child(4)")
        .innerText.toLowerCase();
      const status = card.querySelector(".status").innerText.toLowerCase();

      const matchesQuery = name.includes(query);
      const matchesMembership =
        membershipFilter === "all" || membershipType.includes(membershipFilter);
      const matchesStatus = statusFilter === "all" || status === statusFilter;

      card.style.display =
        matchesQuery && matchesMembership && matchesStatus ? "flex" : "none";
    });
  }
};
// ...existing code...
    // issue book
    (function () {
        // Utilities
        const $ = id => document.getElementById(id);
        const issueForm = $('issueForm');
        // Bail out if we're not on the Issue page
        if (!issueForm) return;

        const bookIdInput = $('bookId');
        const bookTitleInput = $('bookTitle');
        const bookAuthorInput = $('bookAuthor');
        const addBookBtn = $('addBookBtn');
        const cartTableBody = document.querySelector('#cartTable tbody');
        const booksInput = $('booksInput');
        const emptyRowId = 'emptyRow';

        // If required elements are missing, stop (defensive)
        if (!cartTableBody || !booksInput) return;

        // Initialize cart from server-rendered rows if any
        let cart = [];
        Array.from(cartTableBody.querySelectorAll('tr')).forEach(row => {
            if (row.id === emptyRowId) return;
            const idCell = row.querySelector('.cell-bookId');
            const titleCell = row.querySelector('.cell-title');
            const authorCell = row.querySelector('.cell-author');
            if (idCell && titleCell) {
                cart.push({
                    bookId: idCell.textContent.trim(),
                    title: titleCell.textContent.trim(),
                    author: authorCell ? authorCell.textContent.trim() : ''
                });
            }
        });
        refreshHiddenInput();

        // default dates: issue = today, due = +14 days
        const issueDateEl = $('issueDate');
        const dueDateEl = $('dueDate');
        const today = new Date();
        const pad = n => n.toString().padStart(2, '0');
        const isoDate = d => d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate());
        if (issueDateEl && !issueDateEl.value) issueDateEl.value = isoDate(today);
        if (dueDateEl && !dueDateEl.value) {
            const due = new Date(today);
            due.setDate(due.getDate() + 14);
            dueDateEl.value = isoDate(due);
        }

        // Add book to cart (guard addBookBtn)
        if (addBookBtn) {
            addBookBtn.addEventListener('click', () => {
                const bookId = bookIdInput.value.trim();
                const title = bookTitleInput.value.trim();
                const author = bookAuthorInput.value.trim();

                if (!bookId || !title) {
                    alert('Please provide at least Book ID and Title.');
                    return;
                }

                cart.push({ bookId, title, author });
                renderCart();
                bookIdInput.value = '';
                bookTitleInput.value = '';
                bookAuthorInput.value = '';
                bookIdInput.focus();
            });
        }

        // Remove book (delegate)
        cartTableBody.addEventListener('click', (e) => {
            if (!e.target.matches('.removeBtn')) return;
            const tr = e.target.closest('tr');
            const idx = Array.from(cartTableBody.querySelectorAll('tr')).indexOf(tr);
            // adjust index if emptyRow present
            if (cartTableBody.querySelector('#' + emptyRowId)) return;
            if (idx >= 0 && idx < cart.length) {
                cart.splice(idx, 1);
                renderCart();
            }
        });

        // Form submit: attach books JSON
        issueForm.addEventListener('submit', (e) => {
            if (cart.length === 0) {
                e.preventDefault();
                alert('Please add at least one book to issue.');
                return;
            }
            refreshHiddenInput();
            // allow normal submit
        });

        function renderCart() {
            // clear
            cartTableBody.innerHTML = '';
            if (cart.length === 0) {
                const tr = document.createElement('tr');
                tr.id = emptyRowId;
                const td = document.createElement('td');
                td.colSpan = 5;
                td.className = 'muted';
                td.textContent = 'No books added';
                tr.appendChild(td);
                cartTableBody.appendChild(tr);
            } else {
                cart.forEach((item, idx) => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${idx+1}</td>
                        <td class="cell-bookId">${escapeHtml(item.bookId)}</td>
                        <td class="cell-title">${escapeHtml(item.title)}</td>
                        <td class="cell-author">${escapeHtml(item.author || '')}</td>
                        <td><button type="button" class="retro-btn btn--danger removeBtn">Remove</button></td>
                    `;
                    cartTableBody.appendChild(tr);
                });
            }
            refreshHiddenInput();
        }

        function refreshHiddenInput() {
            booksInput.value = JSON.stringify(cart);
        }

        // simple escaper for insertion into innerHTML
        function escapeHtml(str) {
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }
    })();

    // receive book

    (function(){
        // initialize client-side cart from server-provided variable `cart` if present
        // If using server-side templating, render the initial cart into the page as a global:
        //   <script>window.__INITIAL_CART = <%= JSON.stringify(cart || []) %>;</script>
        // This file (served as a static JS) will then read window.__INITIAL_CART safely.
        const initialCart = (typeof window !== 'undefined' && Array.isArray(window.__INITIAL_CART)) ? window.__INITIAL_CART.slice() : [];

        let clientCart = Array.isArray(initialCart) ? initialCart.slice() : [];

        const booksInput = document.getElementById('booksInput');
        const cartTableBody = document.querySelector('#cartTable tbody');

        // If required elements aren't on this page, don't run receive logic
        if (!booksInput || !cartTableBody) return;

        const bookIdEl = document.getElementById('bookId');
        const bookTitleEl = document.getElementById('bookTitle');
        const bookAuthorEl = document.getElementById('bookAuthor');
        const bookConditionEl = document.getElementById('bookCondition');
        const addBookBtn = document.getElementById('addBookBtn');

        function updateHidden() {
            booksInput.value = JSON.stringify(clientCart);
        }

        function renderCart() {
            // clear existing dynamic rows
            cartTableBody.innerHTML = '';
            if (!clientCart.length) {
                const tr = document.createElement('tr');
                tr.id = 'emptyRow';
                tr.innerHTML = '<td colspan="6" class="muted">No books added</td>';
                cartTableBody.appendChild(tr);
                updateHidden();
                return;
            }

            clientCart.forEach((item, idx) => {
                const tr = document.createElement('tr');
                tr.setAttribute('data-index', idx);
                tr.innerHTML = [
                    `<td>${idx+1}</td>`,
                    `<td class="cell-bookId">${escapeHtml(item.bookId || '')}</td>`,
                    `<td class="cell-title">${escapeHtml(item.title || '')}</td>`,
                    `<td class="cell-author">${escapeHtml(item.author || '')}</td>`,
                    `<td class="cell-condition">${escapeHtml(item.condition || 'Good')}</td>`,
                    `<td><button type="button" class="retro-btn btn--danger removeBtn">Remove</button></td>`
                ].join('');
                cartTableBody.appendChild(tr);
            });
            updateHidden();
        }

        function escapeHtml(str) {
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        if (addBookBtn) {
            addBookBtn.addEventListener('click', function(){
                const bookId = bookIdEl.value.trim();
                const title = bookTitleEl.value.trim();
                const author = bookAuthorEl.value.trim();
                const condition = bookConditionEl.value;

                if (!bookId) {
                    bookIdEl.focus();
                    return;
                }

                clientCart.push({ bookId, title, author, condition });
                bookIdEl.value = '';
                bookTitleEl.value = '';
                bookAuthorEl.value = '';
                bookConditionEl.value = 'Good';
                renderCart();
            });
        }

        // delegate remove button clicks
        cartTableBody.addEventListener('click', function(e){
            if (e.target && e.target.matches('.removeBtn')) {
                const tr = e.target.closest('tr');
                const idx = Number(tr.getAttribute('data-index'));
                if (!Number.isNaN(idx)) {
                    clientCart.splice(idx, 1);
                    renderCart();
                }
            }
        });

        // on initial load, render once to ensure hidden input sync
        renderCart();

        // ensure hidden input updated before submit (extra safety)
        const receiveForm = document.getElementById('receiveForm');
        if (receiveForm) {
            receiveForm.addEventListener('submit', function(){
                updateHidden();
            });
        }
    })();
// ...existing code...

// === Dashboard Stats Fetch ===
const fetchStats = async () => {
  try {
    const response = await fetch("/api/stats");
    const data = await response.json();

    document.getElementById("totalBooks").innerText = data.totalBooks || 0;
    document.getElementById("availableBooks").innerText =
      data.availableBooks || 0;
    document.getElementById("totalMembers").innerText = data.totalMembers || 0;
    document.getElementById("overdueMembers").innerText =
      data.overdueMembers || 0;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
  }
};

fetchStats();

document.addEventListener("DOMContentLoaded", () => {
  // Get embedded data from EJS
  const dataTag = document.getElementById("dashboard-data");
  if (!dataTag) return; // Only run this on dashboard page

  const { trends = [], genres = [] } = JSON.parse(dataTag.textContent);

  // Check Chart.js availability
  if (typeof Chart === "undefined") {
    console.error("Chart.js not loaded");
    return;
  }

  // Borrowing Trends (Bar Chart)
  const borrowCanvas = document.getElementById("borrowTrendsChart");
  if (borrowCanvas) {
    const borrowCtx = borrowCanvas.getContext("2d");
    new Chart(borrowCtx, {
      type: "bar",
      data: {
        labels: trends.map((t) => t.label),
        datasets: [
          {
            label: "Books Borrowed",
            data: trends.map((t) => t.count),
            backgroundColor: "#d97a00",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: { y: { beginAtZero: true } },
        plugins: { legend: { display: false } },
      },
    });
  }

  // Genre Distribution (Pie Chart)
  const genreCanvas = document.getElementById("genreChart");
  if (genreCanvas) {
    const genreCtx = genreCanvas.getContext("2d");
    new Chart(genreCtx, {
      type: "pie",
      data: {
        labels: genres.map((g) => g.genre),
        datasets: [
          {
            data: genres.map((g) => g.count),
            backgroundColor: [
              "#01204E",
              "#028391",
              "#F6DCAC",
              "#F85525",
              "#FAA968",
            ],
          },
        ],
      },
      options: {
        plugins: { legend: { position: "bottom" } },
      },
    });
  }
});


// === Event Listeners ===
if (searchBar) searchBar.addEventListener("input", applyFilters);
if (filterStatus) filterStatus.addEventListener("change", applyFilters);
if (sortBy) sortBy.addEventListener("change", applyFilters);
if (filterMembership) filterMembership.addEventListener("change", applyFilters);
