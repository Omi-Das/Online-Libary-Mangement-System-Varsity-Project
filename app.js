// ---------- INIT DATA ----------
let books = JSON.parse(localStorage.getItem("books")) || [];

// ---------- LOGIN ----------
function login() {
  let u = document.getElementById("username").value;
  let p = document.getElementById("password").value;

  if (u === "admin" && p === "1234") {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("dashboard").classList.remove("hidden");
    showBooks();
  } else {
    alert("Invalid Login (admin/1234)");
  }
}

function logout() {
  location.reload();
}

// ---------- ADD BOOK ----------
function addBook() {
  let title = document.getElementById("title").value;
  let author = document.getElementById("author").value;
  let category = document.getElementById("category").value;

  books.push({
    title,
    author,
    category,
    status: "Available"
  });

  localStorage.setItem("books", JSON.stringify(books));
  showBooks();
}

// ---------- SHOW BOOK ----------
function showBooks() {
  let table = document.getElementById("bookList");
  table.innerHTML = "";

  books.forEach((b, index) => {
    table.innerHTML += `
      <tr>
        <td>${b.title}</td>
        <td>${b.author}</td>
        <td>${b.category}</td>
        <td>${b.status}</td>
        <td>
          <button onclick="issueBook(${index})">Issue</button>
          <button onclick="returnBook(${index})">Return</button>
          <button onclick="deleteBook(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}

// ---------- DELETE ----------
function deleteBook(i) {
  books.splice(i, 1);
  localStorage.setItem("books", JSON.stringify(books));
  showBooks();
}

// ---------- ISSUE BOOK ----------
function issueBook(i) {
  if (books[i].status === "Issued") {
    alert("Already Issued");
    return;
  }

  let days = 7;
  let issueDate = new Date();
  let dueDate = new Date();
  dueDate.setDate(issueDate.getDate() + days);

  books[i].status = "Issued";
  books[i].due = dueDate;

  localStorage.setItem("books", JSON.stringify(books));
  showBooks();
}

// ---------- RETURN BOOK + FINE ----------
function returnBook(i) {
  if (books[i].status === "Available") return;

  let today = new Date();
  let due = new Date(books[i].due);

  let fine = 0;
  if (today > due) {
    let diff = Math.ceil((today - due) / (1000 * 60 * 60 * 24));
    fine = diff * 10; // 10 per day fine
  }

  alert("Fine: " + fine + " BDT");

  books[i].status = "Available";
  delete books[i].due;

  localStorage.setItem("books", JSON.stringify(books));
  showBooks();
}

// ---------- SEARCH ----------
function searchBook() {
  let value = document.getElementById("search").value.toLowerCase();

  let filtered = books.filter(b =>
    b.title.toLowerCase().includes(value) ||
    b.author.toLowerCase().includes(value) ||
    b.category.toLowerCase().includes(value)
  );

  let table = document.getElementById("bookList");
  table.innerHTML = "";

  filtered.forEach((b, index) => {
    table.innerHTML += `
      <tr>
        <td>${b.title}</td>
        <td>${b.author}</td>
        <td>${b.category}</td>
        <td>${b.status}</td>
        <td></td>
      </tr>
    `;
  });
}

// initial load
showBooks();