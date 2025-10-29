// === Sidebar Toggle ===
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleBtn");
  const sidebar = document.getElementById("sidebar");

  if (toggleBtn && sidebar) {
    sidebar.classList.add("collapsed");
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  } else {
    console.error("Could not find toggle button or sidebar.");
  }
});

// === Shared Search, Filter, Sort ===
const searchBar =
  document.getElementById("searchBar") ||
  document.getElementById("memberSearch") ||
  document.getElementById("searchInput");

const filterStatus =
  document.getElementById("filterStatus") ||
  document.getElementById("filterSelect");

const sortBy =
  document.getElementById("sortBy") || document.getElementById("sortSelect");

const filterMembership = document.getElementById("filterMembership");

// Detect current page
const isBooksPage = document.querySelector(".book-card");
const isMembersPage = document.querySelector(".member-card");
const isTransactionsPage = document.querySelector(".transaction-card");

// === Apply Filters (Books, Members, Transactions) ===
const applyFilters = () => {
  const query = searchBar ? searchBar.value.toLowerCase() : "";
  const statusFilter = filterStatus ? filterStatus.value.toLowerCase() : "all";
  const sortOption = sortBy ? sortBy.value : null;
  const membershipFilter = filterMembership ? filterMembership.value : "all";

  // --- 📚 Books ---
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

    // Optional sorting (alphabetical)
if (sortOption) {
  const visibleCards = cards.filter((c) => c.style.display !== "none");

  visibleCards.sort((a, b) => {
    let aText = "";
    let bText = "";

    if (sortOption === "title") {
      aText = a.querySelector("h3")?.innerText.toLowerCase() || "";
      bText = b.querySelector("h3")?.innerText.toLowerCase() || "";
    } 
    else if (sortOption === "author") {
      aText =
        a.querySelector(".book-info-left p:nth-child(2)")?.innerText
          .replace("Author:", "")
          .trim()
          .toLowerCase() || "";
      bText =
        b.querySelector(".book-info-left p:nth-child(2)")?.innerText
          .replace("Author:", "")
          .trim()
          .toLowerCase() || "";
    }

    return aText.localeCompare(bText);
  });

  // Re-append sorted cards
  visibleCards.forEach((card) => grid.appendChild(card));
}
  }

  // --- 👥 Members ---
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

  // --- 🔄 Transactions ---
  if (isTransactionsPage) {
    const cards = Array.from(document.querySelectorAll(".transaction-card"));
    const grid = document.querySelector(".transactions-grid");

    cards.forEach((card) => {
      const bookTitle = card.querySelector("h3").innerText.toLowerCase();
      const member = card
        .querySelector(".transaction-info-left p")
        .innerText.toLowerCase();
      const status = card.querySelector(".status").innerText.toLowerCase();

      const matchesQuery = bookTitle.includes(query) || member.includes(query);
      const matchesStatus =
        statusFilter === "all" || status.includes(statusFilter);

      card.style.display = matchesQuery && matchesStatus ? "flex" : "none";
    });

    // Sorting by issue date
    if (sortOption) {
      const visibleCards = cards.filter((c) => c.style.display !== "none");
      visibleCards.sort((a, b) => {
        const aDate = new Date(
          a.querySelector(".transaction-info-left p:nth-child(3)").innerText
        );
        const bDate = new Date(
          b.querySelector(".transaction-info-left p:nth-child(3)").innerText
        );
        return sortOption === "recent" ? bDate - aDate : aDate - bDate;
      });
      visibleCards.forEach((card) => grid.appendChild(card));
    }
  }
};

// === Event Bindings for Filters ===
if (searchBar) searchBar.addEventListener("input", applyFilters);
if (filterStatus) filterStatus.addEventListener("change", applyFilters);
if (sortBy) sortBy.addEventListener("change", applyFilters);
if (filterMembership) filterMembership.addEventListener("change", applyFilters);

// === Issue & Receive Book Logic ===
// (unchanged from your current version)
(function issueBook() {
  const $ = (id) => document.getElementById(id);
  const issueForm = $("issueForm");
  if (!issueForm) return;

  const bookIdInput = $("bookId");
  const bookTitleInput = $("bookTitle");
  const bookAuthorInput = $("bookAuthor");
  const addBookBtn = $("addBookBtn");
  const cartTableBody = document.querySelector("#cartTable tbody");
  const booksInput = $("booksInput");
  const emptyRowId = "emptyRow";

  if (!cartTableBody || !booksInput) return;
  let cart = [];

  Array.from(cartTableBody.querySelectorAll("tr")).forEach((row) => {
    if (row.id === emptyRowId) return;
    const idCell = row.querySelector(".cell-bookId");
    const titleCell = row.querySelector(".cell-title");
    const authorCell = row.querySelector(".cell-author");
    if (idCell && titleCell) {
      cart.push({
        bookId: idCell.textContent.trim(),
        title: titleCell.textContent.trim(),
        author: authorCell ? authorCell.textContent.trim() : "",
      });
    }
  });

  const refreshHiddenInput = () => {
    booksInput.value = JSON.stringify(cart);
  };

  const renderCart = () => {
    cartTableBody.innerHTML = "";
    if (cart.length === 0) {
      const tr = document.createElement("tr");
      tr.id = emptyRowId;
      tr.innerHTML = '<td colspan="5" class="muted">No books added</td>';
      cartTableBody.appendChild(tr);
    } else {
      cart.forEach((item, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${idx + 1}</td>
          <td class="cell-bookId">${escapeHtml(item.bookId)}</td>
          <td class="cell-title">${escapeHtml(item.title)}</td>
          <td class="cell-author">${escapeHtml(item.author)}</td>
          <td><button type="button" class="retro-btn btn--danger removeBtn">Remove</button></td>`;
        cartTableBody.appendChild(tr);
      });
    }
    refreshHiddenInput();
  };

  const escapeHtml = (str) =>
    String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  if (addBookBtn) {
    addBookBtn.addEventListener("click", () => {
      const bookId = bookIdInput.value.trim();
      const title = bookTitleInput.value.trim();
      const author = bookAuthorInput.value.trim();

      if (!bookId || !title) {
        alert("Please provide at least Book ID and Title.");
        return;
      }

      cart.push({ bookId, title, author });
      renderCart();
      bookIdInput.value = "";
      bookTitleInput.value = "";
      bookAuthorInput.value = "";
      bookIdInput.focus();
    });
  }

  cartTableBody.addEventListener("click", (e) => {
    if (!e.target.matches(".removeBtn")) return;
    const tr = e.target.closest("tr");
    const idx = Array.from(cartTableBody.querySelectorAll("tr")).indexOf(tr);
    if (idx >= 0 && idx < cart.length) {
      cart.splice(idx, 1);
      renderCart();
    }
  });

  issueForm.addEventListener("submit", (e) => {
    if (cart.length === 0) {
      e.preventDefault();
      alert("Please add at least one book to issue.");
    }
    refreshHiddenInput();
  });

  renderCart();
})();

(function receiveBook() {
  const $ = (id) => document.getElementById(id);
  const receiveForm = $("receiveForm");
  if (!receiveForm) return; // Exit if not on this page

  const bookIdInput = $("bookId");
  const bookTitleInput = $("bookTitle");
  const bookAuthorInput = $("bookAuthor");
  const bookConditionSelect = $("bookCondition");
  const addBookBtn = $("addBookBtn");
  const cartTableBody = document.querySelector("#cartTable tbody");
  const booksInput = $("booksInput");
  const emptyRowId = "emptyRow";

  if (!cartTableBody || !booksInput) return;

  let cart = [];

  // 🧩 Load existing cart items (if EJS rendered any)
  Array.from(cartTableBody.querySelectorAll("tr")).forEach((row) => {
    if (row.id === emptyRowId) return;
    const idCell = row.querySelector(".cell-bookId");
    const titleCell = row.querySelector(".cell-title");
    const authorCell = row.querySelector(".cell-author");
    const conditionCell = row.querySelector(".cell-condition");
    if (idCell && titleCell) {
      cart.push({
        bookId: idCell.textContent.trim(),
        title: titleCell.textContent.trim(),
        author: authorCell ? authorCell.textContent.trim() : "",
        condition: conditionCell ? conditionCell.textContent.trim() : "Good",
      });
    }
  });

  // 🔄 Update hidden input whenever cart changes
  const refreshHiddenInput = () => {
    booksInput.value = JSON.stringify(cart);
  };

  // 🧱 Render cart in table
  const renderCart = () => {
    cartTableBody.innerHTML = "";
    if (cart.length === 0) {
      const tr = document.createElement("tr");
      tr.id = emptyRowId;
      tr.innerHTML = `<td colspan="6" class="muted">No books added</td>`;
      cartTableBody.appendChild(tr);
    } else {
      cart.forEach((item, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${idx + 1}</td>
          <td class="cell-bookId">${escapeHtml(item.bookId)}</td>
          <td class="cell-title">${escapeHtml(item.title)}</td>
          <td class="cell-author">${escapeHtml(item.author)}</td>
          <td class="cell-condition">${escapeHtml(item.condition)}</td>
          <td><button type="button" class="retro-btn btn--danger removeBtn">Remove</button></td>
        `;
        cartTableBody.appendChild(tr);
      });
    }
    refreshHiddenInput();
  };

  // 🧼 Prevent XSS via safe text escaping
  const escapeHtml = (str) =>
    String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  // ➕ Add book to the cart
  if (addBookBtn) {
    addBookBtn.addEventListener("click", () => {
      const bookId = bookIdInput.value.trim();
      const title = bookTitleInput.value.trim();
      const author = bookAuthorInput.value.trim();
      const condition = bookConditionSelect.value;

      if (!bookId || !title) {
        alert("Please provide at least Book ID and Title.");
        return;
      }

      // Prevent duplicates (same book ID)
      if (cart.some((b) => b.bookId === bookId)) {
        alert("This book is already added to the receive list.");
        return;
      }

      cart.push({ bookId, title, author, condition });
      renderCart();

      // Reset fields
      bookIdInput.value = "";
      bookTitleInput.value = "";
      bookAuthorInput.value = "";
      bookConditionSelect.value = "Good";
      bookIdInput.focus();
    });
  }

  // 🗑️ Remove book from cart
  cartTableBody.addEventListener("click", (e) => {
    if (!e.target.matches(".removeBtn")) return;
    const tr = e.target.closest("tr");
    const idx = Array.from(cartTableBody.querySelectorAll("tr")).indexOf(tr);
    if (idx >= 0 && idx < cart.length) {
      cart.splice(idx, 1);
      renderCart();
    }
  });

  // ✅ On form submit: ensure at least one book
  receiveForm.addEventListener("submit", (e) => {
    if (cart.length === 0) {
      e.preventDefault();
      alert("Please add at least one book to receive.");
      return;
    }
    refreshHiddenInput();
  });

  // Initial render (if preloaded cart exists)
  renderCart();
})();

// === Dashboard Stats ===
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

// === Dashboard Charts ===
document.addEventListener("DOMContentLoaded", () => {
  const dataTag = document.getElementById("dashboard-data");
  if (!dataTag) return;
  const { trends = [], genres = [] } = JSON.parse(dataTag.textContent);

  if (typeof Chart === "undefined") {
    console.error("Chart.js not loaded");
    return;
  }

  const borrowCanvas = document.getElementById("borrowTrendsChart");
  if (borrowCanvas) {
    new Chart(borrowCanvas.getContext("2d"), {
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

  const genreCanvas = document.getElementById("genreChart");
  if (genreCanvas) {
    new Chart(genreCanvas.getContext("2d"), {
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
