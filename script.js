// ---------------- USERS ----------------

if (!localStorage.getItem("users")) {
    const defaultUsers = [
        {
            username: "Dhasvanth",
            password: "8387"
        },
        {
            username: "Nexu",
            password: "4321"
        }
    ];

    localStorage.setItem("users", JSON.stringify(defaultUsers));
}

// ---------------- LOGIN ----------------

function login() {

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (username === "" || password === "") {
        alert("Please fill all details");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const foundUser = users.find(user =>
        user.username === username &&
        user.password === password
    );

    if (foundUser) {

        localStorage.setItem("currentUser", username);

        alert("Welcome " + username);

        window.location.href = "home.html";

    } else {

        alert("Wrong username or password");

    }
}

// ---------------- CREATE USER ----------------

function createUser() {

    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    if (username === "" || password === "") {
        alert("Please fill all details");
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    users.push({
        username: username,
        password: password
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("User Created Successfully");

    window.location.href = "index.html";
}

// ---------------- HOME PAGE ----------------

function loadHome() {

    const user = localStorage.getItem("currentUser");

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const welcome = document.getElementById("welcomeUser");

    if (welcome) {
        welcome.innerText = "Hi " + user;
    }
}

// ---------------- SAVE MEMORY ----------------

function saveMemory() {

    const user = localStorage.getItem("currentUser");

    const date = document.getElementById("memoryDate").value;

    const content = document.getElementById("memoryText").value;

    if (date === "" || content === "") {
        alert("Please fill everything");
        return;
    }

    let allMemories =
        JSON.parse(localStorage.getItem("memories")) || {};

    if (!allMemories[user]) {
        allMemories[user] = [];
    }

    const userMemories = allMemories[user];

    const existingIndex = userMemories.findIndex(
        mem => mem.date === date
    );

    if (existingIndex !== -1) {

        userMemories[existingIndex].content = content;

    } else {

        userMemories.push({
            date: date,
            content: content
        });

    }

    localStorage.setItem(
        "memories",
        JSON.stringify(allMemories)
    );

    alert("Memory Saved");
}

// ---------------- SHOW MEMORIES ----------------

function loadMemories() {

    const user = localStorage.getItem("currentUser");

    const allMemories =
        JSON.parse(localStorage.getItem("memories")) || {};

    const userMemories = allMemories[user] || [];

    const memoryList =
        document.getElementById("memoryList");

    if (!memoryList) return;

    memoryList.innerHTML = "";

    userMemories.reverse().forEach(memory => {

        memoryList.innerHTML += `
        
        <div class="memoryCard">

            <button class="dateButton"
            onclick="openMemory('${memory.date}')">

                ${memory.date}

            </button>

        </div>
        
        `;
    });
}

// ---------------- OPEN MEMORY ----------------

function openMemory(date) {

    localStorage.setItem("selectedDate", date);

    window.location.href = "write.html";
}

// ---------------- LOAD MEMORY TO EDIT ----------------

function loadSelectedMemory() {

    const user = localStorage.getItem("currentUser");

    const selectedDate =
        localStorage.getItem("selectedDate");

    if (!selectedDate) return;

    const allMemories =
        JSON.parse(localStorage.getItem("memories")) || {};

    const userMemories = allMemories[user] || [];

    const found = userMemories.find(
        mem => mem.date === selectedDate
    );

    if (found) {

        document.getElementById("memoryDate").value =
            found.date;

        document.getElementById("memoryText").value =
            found.content;
    }
}

// ---------------- SEARCH ----------------

function searchMemory() {

    const searchDate =
        document.getElementById("searchInput").value;

    if (searchDate === "") {
        loadMemories();
        return;
    }

    const buttons =
        document.querySelectorAll(".dateButton");

    buttons.forEach(btn => {

        if (
            btn.innerText.includes(searchDate)
        ) {
            btn.parentElement.style.display = "block";
        } else {
            btn.parentElement.style.display = "none";
        }
    });
}

// ---------------- DELETE ----------------

function deleteMemory() {

    const user = localStorage.getItem("currentUser");

    const date =
        document.getElementById("memoryDate").value;

    let allMemories =
        JSON.parse(localStorage.getItem("memories")) || {};

    let userMemories = allMemories[user] || [];

    userMemories = userMemories.filter(
        mem => mem.date !== date
    );

    allMemories[user] = userMemories;

    localStorage.setItem(
        "memories",
        JSON.stringify(allMemories)
    );

    alert("Deleted");

    window.location.href = "memories.html";
}

// ---------------- LOGOUT ----------------

function logout() {

    localStorage.removeItem("currentUser");

    window.location.href = "index.html";
}