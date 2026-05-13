/* =========================================
   MEMORY DIARY - COMPLETE SCRIPT
========================================= */


/* =========================================
   CURRENT USER
========================================= */

let currentUser =
localStorage.getItem("currentUser");


/* =========================================
   LOGIN
========================================= */

function login(){

    let username =
    document.getElementById("loginUsername").value;

    let password =
    document.getElementById("loginPassword").value;

    let users =
    JSON.parse(
        localStorage.getItem("users")
    ) || [];

    let validUser =
    users.find(user =>

        user.username === username &&
        user.password === password

    );

    if(validUser){

        localStorage.setItem(
            "currentUser",
            username
        );

        showToast(
            "Login successful ✨"
        );

        setTimeout(()=>{

            window.location.href =
            "home.html";

        },1000);

    }else{

        alert(
            "Invalid username or password"
        );
    }
}


/* =========================================
   SIGNUP
========================================= */

function signup(){

    let username =
    document.getElementById("signupUsername").value;

    let password =
    document.getElementById("signupPassword").value;

    let confirmPassword =
    document.getElementById("confirmPassword").value;

    if(
        username.trim() === "" ||
        password.trim() === ""
    ){

        alert(
            "Please fill all fields"
        );

        return;
    }

    if(password !== confirmPassword){

        alert(
            "Passwords do not match"
        );

        return;
    }

    let users =
    JSON.parse(
        localStorage.getItem("users")
    ) || [];

    let userExists =
    users.find(user =>

        user.username === username
    );

    if(userExists){

        alert(
            "Username already exists"
        );

        return;
    }

    users.push({

        username:username,
        password:password
    });

    localStorage.setItem(

        "users",

        JSON.stringify(users)
    );

    showToast(
        "Account created successfully ✨"
    );

    setTimeout(()=>{

        window.location.href =
        "index.html";

    },1000);
}


/* =========================================
   LOGOUT
========================================= */

function logout(){

    localStorage.removeItem(
        "currentUser"
    );

    window.location.href =
    "index.html";
}


/* =========================================
   SAVE MEMORY
========================================= */

function saveMemory(){

    let title =
    document.getElementById("title").value;

    let content =
    document.getElementById("content").value;

    let mood =
    document.getElementById("mood").value;

    let imageInput =
    document.getElementById("image");

    let favorite =
    document.getElementById("favorite").checked;

    let locked =
    document.getElementById("locked").checked;


    /* AUTO TODAY DATE */

    let today =
    new Date()
    .toISOString()
    .split("T")[0];


    /* VALIDATION */

    if(
        title.trim() === "" ||
        content.trim() === ""
    ){

        showToast(
            "Please fill all fields"
        );

        return;
    }


    /* GET MEMORIES */

    let memories =
    JSON.parse(
        localStorage.getItem("memories")
    ) || [];


    /* ONLY ONE ENTRY PER DAY */

    let alreadyExists =
    memories.find(memory =>

        memory.date === today
    );

    if(alreadyExists){

        showToast(
            "You already wrote today's diary ✨"
        );

        return;
    }


    let imageData = "";


    if(
        imageInput &&
        imageInput.files[0]
    ){

        let reader =
        new FileReader();

        reader.onload = function(e){

            imageData =
            e.target.result;

            saveFinalMemory();
        };

        reader.readAsDataURL(
            imageInput.files[0]
        );

    }else{

        saveFinalMemory();
    }


    function saveFinalMemory(){

        let memory = {

            title:title,

            content:content,

            mood:mood,

            date:today,

            favorite:favorite,

            locked:locked,

            image:imageData
        };

        memories.push(memory);

        localStorage.setItem(

            "memories",

            JSON.stringify(memories)
        );

        showToast(
            "Memory saved successfully ✨"
        );

        setTimeout(()=>{

            window.location.href =
            "memories.html";

        },1000);
    }
}


/* =========================================
   LOAD MEMORIES
========================================= */

function loadMemories(){

    let container =
    document.getElementById("memoryContainer");

    if(!container) return;

    let memories =
    JSON.parse(
        localStorage.getItem("memories")
    ) || [];

    container.innerHTML = "";

    if(memories.length === 0){

        container.innerHTML =

        `
        <div class="memoryCard">
            <h2>No memories yet ✨</h2>
        </div>
        `;

        return;
    }

    memories
    .slice()
    .reverse()
    .forEach((memory,index)=>{

        let card =
        document.createElement("div");

        card.className =
        "memoryCard";

        let imageHTML = "";

        if(memory.image){

            imageHTML =

            `
            <img
                src="${memory.image}"
                class="memoryImage"
            >
            `;
        }

        let favoriteHTML = "";

        if(memory.favorite){

            favoriteHTML =

            `
            <span class="favoriteTag">
                ⭐ Favorite
            </span>
            `;
        }

        let lockedHTML = "";

        if(memory.locked){

            lockedHTML =

            `
            <span class="favoriteTag">
                🔒 Locked
            </span>
            `;
        }

        card.innerHTML =

        `
        ${imageHTML}

        <h2>${memory.title}</h2>

        <p>
            📅 ${memory.date}
        </p>

        <p>
            😊 Mood: ${memory.mood}
        </p>

        <p>
            ${memory.content}
        </p>

        ${favoriteHTML}

        ${lockedHTML}

        <button
            onclick="deleteMemory(${memories.length - 1 - index})"
        >
            Delete Memory
        </button>
        `;

        container.appendChild(card);
    });
}


/* =========================================
   DELETE MEMORY
========================================= */

function deleteMemory(index){

    let memories =
    JSON.parse(
        localStorage.getItem("memories")
    ) || [];

    let confirmDelete =
    confirm(
        "Delete this memory?"
    );

    if(confirmDelete){

        memories.splice(index,1);

        localStorage.setItem(

            "memories",

            JSON.stringify(memories)
        );

        loadMemories();

        showToast(
            "Memory deleted"
        );
    }
}


/* =========================================
   FAVORITES
========================================= */

function loadFavorites(){

    let container =
    document.getElementById("memoryContainer");

    if(!container) return;

    let memories =
    JSON.parse(
        localStorage.getItem("memories")
    ) || [];

    let favorites =
    memories.filter(memory =>

        memory.favorite
    );

    container.innerHTML = "";

    if(favorites.length === 0){

        container.innerHTML =

        `
        <div class="memoryCard">
            <h2>No favorite memories ⭐</h2>
        </div>
        `;

        return;
    }

    favorites
    .slice()
    .reverse()
    .forEach(memory=>{

        createMemoryCard(
            memory,
            container
        );
    });
}


/* =========================================
   LOCKED MEMORIES
========================================= */

function loadLocked(){

    let container =
    document.getElementById("memoryContainer");

    if(!container) return;

    let memories =
    JSON.parse(
        localStorage.getItem("memories")
    ) || [];

    let lockedMemories =
    memories.filter(memory =>

        memory.locked
    );

    container.innerHTML = "";

    if(lockedMemories.length === 0){

        container.innerHTML =

        `
        <div class="memoryCard">
            <h2>No locked memories 🔒</h2>
        </div>
        `;

        return;
    }

    lockedMemories
    .slice()
    .reverse()
    .forEach(memory=>{

        createMemoryCard(
            memory,
            container
        );
    });
}


/* =========================================
   MEMORY CARD CREATOR
========================================= */

function createMemoryCard(memory,container){

    let card =
    document.createElement("div");

    card.className =
    "memoryCard";

    let imageHTML = "";

    if(memory.image){

        imageHTML =

        `
        <img
            src="${memory.image}"
            class="memoryImage"
        >
        `;
    }

    let favoriteHTML = "";

    if(memory.favorite){

        favoriteHTML =

        `
        <span class="favoriteTag">
            ⭐ Favorite
        </span>
        `;
    }

    let lockedHTML = "";

    if(memory.locked){

        lockedHTML =

        `
        <span class="favoriteTag">
            🔒 Locked
        </span>
        `;
    }

    card.innerHTML =

    `
    ${imageHTML}

    <h2>${memory.title}</h2>

    <p>
        📅 ${memory.date}
    </p>

    <p>
        😊 Mood: ${memory.mood}
    </p>

    <p>
        ${memory.content}
    </p>

    ${favoriteHTML}

    ${lockedHTML}
    `;

    container.appendChild(card);
}


/* =========================================
   HOME DASHBOARD
========================================= */

function loadHome(){

    let username =
    localStorage.getItem("currentUser");

    let welcomeText =
    document.getElementById("welcomeText");

    if(welcomeText){

        welcomeText.innerHTML =

        `✨ Welcome, ${username}`;
    }

    let memories =
    JSON.parse(
        localStorage.getItem("memories")
    ) || [];

    let favorites =
    memories.filter(memory =>

        memory.favorite
    );

    let locked =
    memories.filter(memory =>

        memory.locked
    );

    let totalMemories =
    document.getElementById("totalMemories");

    let favoriteCount =
    document.getElementById("favoriteCount");

    let lockedCount =
    document.getElementById("lockedCount");

    if(totalMemories){

        totalMemories.innerHTML =
        memories.length;
    }

    if(favoriteCount){

        favoriteCount.innerHTML =
        favorites.length;
    }

    if(lockedCount){

        lockedCount.innerHTML =
        locked.length;
    }
}


/* =========================================
   SEARCH MEMORIES
========================================= */

function searchMemories(){

    let input =
    document.getElementById("searchInput")
    .value
    .toLowerCase();

    let cards =
    document.querySelectorAll(".memoryCard");

    cards.forEach(card=>{

        let text =
        card.innerText.toLowerCase();

        if(text.includes(input)){

            card.style.display =
            "block";

        }else{

            card.style.display =
            "none";
        }
    });
}


/* =========================================
   TOAST
========================================= */

function showToast(message){

    let toast =
    document.createElement("div");

    toast.className =
    "toast";

    toast.innerText =
    message;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.remove();

    },3000);
}