const API_BASE = "http://127.0.0.1:8000/api/expenses/";

const form = document.getElementById("expenseForm");
const titleEl = document.getElementById("title");
const amountEl = document.getElementById("amount");
const categoryEl = document.getElementById("category");

const listEl = document.getElementById("list");
const filterEl = document.getElementById("filter");
const refreshBtn = document.getElementById("refreshBtn");

const loadingEl = document.getElementById("loading");
const statusEl = document.getElementById("status");
const totalBadge = document.getElementById("totalBadge");

let allExpenses = [];

function setLoading(isLoading) {
  loadingEl.classList.toggle("hidden", !isLoading);
}

function setStatus(message, type = "success") {
  if (!message) {
    statusEl.classList.add("hidden");
    statusEl.textContent = "";
    statusEl.classList.remove("error", "success");
    return;
  }
  statusEl.classList.remove("hidden");
  statusEl.textContent = message;
  statusEl.classList.toggle("error", type === "error");
  statusEl.classList.toggle("success", type === "success");
}

function formatMoney(v) {
  const n = Number(v || 0);
  return n.toFixed(2);
}

function computeTotal(expenses) {
  return expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
}

function uniqCategories(expenses) {
  const set = new Set();
  expenses.forEach(e => {
    if (e.category) set.add(String(e.category).trim());
  });
  return Array.from(set).filter(Boolean).sort((a, b) => a.localeCompare(b));
}

function renderFilterOptions(expenses) {
  const current = filterEl.value;
  const cats = uniqCategories(expenses);

  filterEl.innerHTML = `<option value="">All Categories</option>`;
  cats.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    filterEl.appendChild(opt);
  });

  // try restore selection if still exists
  if (cats.includes(current)) filterEl.value = current;
}

function renderList(expenses) {
  listEl.innerHTML = "";

  if (!expenses.length) {
    listEl.innerHTML = `<li class="status">No expenses yet. Add your first one 👆</li>`;
    return;
  }

  expenses.forEach(e => {
    const li = document.createElement("li");
    li.className = "item";

    const left = document.createElement("div");
    left.className = "meta";

    const top = document.createElement("div");
    top.className = "title";
    top.textContent = e.title;

    const sub = document.createElement("div");
    sub.className = "sub";

    const cat = document.createElement("span");
    cat.className = "pill";
    cat.textContent = e.category || "Uncategorized";

    const date = document.createElement("span");
    date.className = "sub";
    // created_at comes as ISO string
    const dt = e.created_at ? new Date(e.created_at) : null;
    date.textContent = dt ? dt.toLocaleString() : "";

    sub.appendChild(cat);

    left.appendChild(top);
    left.appendChild(sub);
    if (date.textContent) left.appendChild(date);

    const right = document.createElement("div");
    right.className = "actions";

    const amount = document.createElement("div");
    amount.className = "amount";
    amount.textContent = formatMoney(e.amount);

    const del = document.createElement("button");
    del.className = "iconbtn danger";
    del.title = "Delete";
    del.innerHTML = "🗑️";
    del.addEventListener("click", () => deleteExpense(e.id));

    right.appendChild(amount);
    right.appendChild(del);

    li.appendChild(left);
    li.appendChild(right);

    listEl.appendChild(li);
  });
}

async function fetchExpenses() {
  setStatus("");
  setLoading(true);

  try {
    const category = filterEl.value.trim();
    const url = category ? `${API_BASE}?category=${encodeURIComponent(category)}` : API_BASE;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load. HTTP ${res.status}`);

    const data = await res.json();
    allExpenses = Array.isArray(data) ? data : [];

    // Update UI
    renderFilterOptions(allExpenses);
    renderList(allExpenses);

    const total = computeTotal(allExpenses);
    totalBadge.textContent = `Total: ${formatMoney(total)}`;

  } catch (err) {
    setStatus(err.message || "Something went wrong", "error");
  } finally {
    setLoading(false);
  }
}

async function addExpense(payload) {
  setStatus("");
  setLoading(true);

  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`Add failed. HTTP ${res.status} - ${msg}`);
    }

    setStatus("Expense added ✅", "success");

    // Refresh list (keep current filter)
    await fetchExpenses();

  } catch (err) {
    setStatus(err.message || "Add failed", "error");
  } finally {
    setLoading(false);
  }
}

async function deleteExpense(id) {
  if (!confirm("Delete this expense?")) return;

  setStatus("");
  setLoading(true);

  try {
    const res = await fetch(`${API_BASE}${id}/`, { method: "DELETE" });
    if (!(res.status === 204 || res.ok)) {
      const msg = await res.text();
      throw new Error(`Delete failed. HTTP ${res.status} - ${msg}`);
    }

    setStatus("Deleted ✅", "success");
    await fetchExpenses();

  } catch (err) {
    setStatus(err.message || "Delete failed", "error");
  } finally {
    setLoading(false);
  }
}

// Events
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = titleEl.value.trim();
  const amount = amountEl.value.trim();
  const category = categoryEl.value.trim();

  if (!title || !amount || !category) {
    setStatus("Please fill all fields.", "error");
    return;
  }

  const amountNum = Number(amount);
  if (Number.isNaN(amountNum) || amountNum <= 0) {
    setStatus("Amount must be a number greater than 0.", "error");
    return;
  }

  await addExpense({ title, amount: amountNum, category });

  // Clear form
  titleEl.value = "";
  amountEl.value = "";
  categoryEl.value = "";
  titleEl.focus();
});

filterEl.addEventListener("change", () => fetchExpenses());
refreshBtn.addEventListener("click", () => fetchExpenses());

// First load
fetchExpenses();
