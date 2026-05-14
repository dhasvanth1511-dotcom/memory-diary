/* =========================================
   CURRENT USER
========================================= */

let currentUser =
localStorage.getItem("currentUser");
let memoryKey =
`memories_${currentUser}`;


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


    let today =
    new Date()
    .toISOString()
    .split("T")[0];


    if(
        content.trim() === ""
    ){

        showToast(
            "Please write your memory"
        );

        return;
    }


    let memories =
    JSON.parse(
        localStorage.getItem(memoryKey)
    ) || [];


    let alreadyExists =
    memories.find(memory =>

        memory.date === today
    );

    if(alreadyExists){

        showToast(
            "Today's memory already exists"
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

            title:
            title.trim() === ""
            ? "Untitled Memory"
            : title,

            content:content,

            mood:mood,

            date:today,

            favorite:favorite,

            locked:locked,

            image:imageData
        };

        memories.push(memory);

        localStorage.setItem(
            memoryKey,

            JSON.stringify(memories)
        );


        localStorage.removeItem(
            "draftMemory"
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
        localStorage.getItem(memoryKey)
    ) || [];


    container.innerHTML = "";


    if(memories.length === 0){

        container.innerHTML =

        `
        <div class="memoryCard">

            <h2>
                📭 No memories yet
            </h2>

            <p>
                Start writing your first memory ✨
            </p>

        </div>
        `;

        return;
    }


    memories
    .slice()
    .reverse()
    .forEach((memory,index)=>{

        createMemoryCard(
            memory,
            container,
            memories.length - 1 - index
        );
    });
}


/* =========================================
   CREATE MEMORY CARD
========================================= */

function createMemoryCard(
    memory,
    container,
    index
){

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
        😊 Mood:
        ${memory.mood}
    </p>

    <p>
        ${memory.content}
    </p>

    ${favoriteHTML}

    ${lockedHTML}

<div class="memoryButtons">

    <button
        onclick="editMemory(${index})"
    >
        ✏ Edit
    </button>


    <button
        onclick="deleteMemory(${index})"
    >
        🗑 Delete
    </button>

</div>
    `;

    container.appendChild(card);
}


/* =========================================
   DELETE MEMORY
========================================= */

function deleteMemory(index){

    let confirmDelete =
    confirm(
        "Delete this memory?"
    );

    if(!confirmDelete) return;


    let memories =
    JSON.parse(
        localStorage.getItem(memoryKey)
    ) || [];


    memories.splice(index,1);


    localStorage.setItem(
        memoryKey,  

        JSON.stringify(memories)
    );


    loadMemories();

    showToast(
        "Memory deleted"
    );
}


/* =========================================
   SEARCH MEMORIES
========================================= */

function searchMemories(){

    let input =
    document.getElementById("searchInput")
    .value
    .toLowerCase()
    .trim();

    let cards =
    document.querySelectorAll(".memoryCard");

    let found = false;


    cards.forEach(card=>{

        let text =
        card.innerText.toLowerCase();

        if(text.includes(input)){

            card.style.display =
            "block";

            found = true;

        }else{

            card.style.display =
            "none";
        }
    });


    let noResults =
    document.getElementById("noResults");


    if(!found){

        noResults.innerHTML =

        `
        <div class="memoryCard">

            <h2>
                📭 No diary entries found
            </h2>

            <p>
                No memories were written
                for this keyword or date.
            </p>

        </div>
        `;

        noResults.style.display =
        "block";

    }else{

        noResults.style.display =
        "none";
    }
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
        localStorage.getItem(memoryKey)
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
/* =========================================
   SEARCH BY DATE
========================================= */

function searchByDate(){

    let selectedDate =
    document.getElementById("dateSearch")
    .value;

    let cards =
    document.querySelectorAll(".memoryCard");

    let found = false;


    cards.forEach(card=>{

        let text =
        card.innerText;

        if(text.includes(selectedDate)){

            card.style.display =
            "block";

            found = true;

        }else{

            card.style.display =
            "none";
        }
    });


    let noResults =
    document.getElementById("noResults");


    if(!found){

        noResults.innerHTML =

        `
        <div class="memoryCard">

            <h2>
                📅 No diary entries found
            </h2>

            <p>
                No memories were written
                on this date.
            </p>

        </div>
        `;

        noResults.style.display =
        "block";

    }else{

        noResults.style.display =
        "none";
    }
}
/* =========================================
   EDIT MEMORY
========================================= */

function editMemory(index){

    let memories =
    JSON.parse(
        localStorage.getItem(memoryKey)
    ) || [];

    let memory =
    memories[index];


    let newTitle =
    prompt(
        "Edit Title",
        memory.title
    );

    if(newTitle === null) return;


    let newContent =
    prompt(
        "Edit Memory",
        memory.content
    );

    if(newContent === null) return;


    let newMood =
    prompt(
        "Edit Mood",
        memory.mood
    );

    if(newMood === null) return;


    memories[index].title =
    newTitle;

    memories[index].content =
    newContent;

    memories[index].mood =
    newMood;


    localStorage.setItem(

        memoryKey,

        JSON.stringify(memories)
    );


    loadMemories();

    showToast(
        "Memory updated ✨"
    );
}