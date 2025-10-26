// Wait for the document to be fully loaded
document.addEventListener("DOMContentLoaded", (event) => {
  // Find the button and the sidebar by their IDs
  const toggleBtn = document.getElementById("toggleBtn");
  const sidebar = document.getElementById("sidebar");

  // Make sure both elements were found before adding a listener
  if (toggleBtn && sidebar) {
    // Add the click event listener to the button
    toggleBtn.addEventListener("click", () => {
      // This one line adds or removes the "collapsed" class
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

// === Event Listeners ===
if (searchBar) searchBar.addEventListener("input", applyFilters);
if (filterStatus) filterStatus.addEventListener("change", applyFilters);
if (sortBy) sortBy.addEventListener("change", applyFilters);
if (filterMembership) filterMembership.addEventListener("change", applyFilters);
