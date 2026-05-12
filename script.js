let users = JSON.parse(localStorage.getItem("users")) || [];

let diaries = JSON.parse(localStorage.getItem("diaries")) || [];





function saveUsers(){

    localStorage.setItem(

        "users",

        JSON.stringify(users)

    );

}





function saveDiaries(){

    localStorage.setItem(

        "diaries",

        JSON.stringify(diaries)

    );

}





function createUser(){

    let username =

    document.getElementById(
        "signupUsername"
    ).value.trim();



    let password =

    document.getElementById(
        "signupPassword"
    ).value.trim();



    let pin =

    document.getElementById(
        "signupPin"
    ).value.trim();



    if(

        username === "" ||

        password === "" ||

        pin === ""

    ){

        alert("Fill all details");

        return;

    }



    let existingUser = users.find(

        user => user.username === username

    );



    if(existingUser){

        alert("Username already exists");

        return;

    }



    users.push({

        username:username,

        password:password,

        pin:pin

    });



    saveUsers();



    alert("User created successfully");



    window.location.href =

    "index.html";

}





function login(){

    let username =

    document.getElementById(
        "loginUsername"
    ).value.trim();



    let password =

    document.getElementById(
        "loginPassword"
    ).value.trim();



    let foundUser = users.find(

        user =>

        user.username === username &&

        user.password === password

    );



    if(foundUser){

        localStorage.setItem(

            "currentUser",

            username

        );



        window.location.href =

        "home.html";

    }

    else{

        alert("Wrong username or password");

    }

}





function loadHome(){

    let currentUser =

    localStorage.getItem(
        "currentUser"
    );



    document.getElementById(
        "welcomeText"
    ).innerHTML =

    `✨ Welcome ${currentUser}`;



    calculateStreak();



    checkTodayReminder();

}





function calculateStreak(){

    let currentUser =

    localStorage.getItem(
        "currentUser"
    );



    let userDiaries = diaries.filter(

        diary => diary.username === currentUser

    );



    let streak = userDiaries.length;



    document.getElementById(
        "streakText"
    ).innerHTML =

    `🔥 ${streak} Memory Streak`;

}





function checkTodayReminder(){

    let currentUser =

    localStorage.getItem(
        "currentUser"
    );



    let today =

    new Date().toISOString().split("T")[0];



    let todayDiary = diaries.find(

        diary =>

        diary.username === currentUser &&

        diary.date === today

    );



    if(!todayDiary){

        setTimeout(() => {

            alert(

                "✨ You haven't written today's memory yet."

            );

        }, 1200);

    }

}





function logout(){

    localStorage.removeItem(
        "currentUser"
    );



    window.location.href =

    "index.html";

}





function loadTodayDiary(){

    let todayInput =

    document.getElementById(
        "diaryDate"
    );



    let today =

    new Date().toISOString().split("T")[0];



    let editDate =

    localStorage.getItem(
        "editDate"
    );



    if(editDate){

        todayInput.value = editDate;

        localStorage.removeItem(
            "editDate"
        );

    }

    else{

        todayInput.value = today;

    }



    loadDiaryByDate();



    todayInput.addEventListener(

        "change",

        loadDiaryByDate

    );



    loadDraft();

}





function loadDiaryByDate(){

    let currentUser =

    localStorage.getItem(
        "currentUser"
    );



    let selectedDate =

    document.getElementById(
        "diaryDate"
    ).value;



    let existingDiary = diaries.find(

        diary =>

        diary.username === currentUser &&

        diary.date === selectedDate

    );



    if(existingDiary){

        document.getElementById(
            "diaryTitle"
        ).value = existingDiary.title;



        document.getElementById(
            "diaryContent"
        ).value = existingDiary.content;



        document.getElementById(
            "diaryMood"
        ).value = existingDiary.mood;



        document.getElementById(
            "favoriteCheck"
        ).checked = existingDiary.favorite;



        document.getElementById(
            "lockedCheck"
        ).checked = existingDiary.locked;

    }

    else{

        document.getElementById(
            "diaryTitle"
        ).value = "";



        document.getElementById(
            "diaryContent"
        ).value = "";



        document.getElementById(
            "diaryMood"
        ).value = "😊 Happy";



        document.getElementById(
            "favoriteCheck"
        ).checked = false;



        document.getElementById(
            "lockedCheck"
        ).checked = false;

    }

}





function saveDiary(){

    let currentUser =

    localStorage.getItem(
        "currentUser"
    );



    let today =

    document.getElementById(
        "diaryDate"
    ).value;



    let title =

    document.getElementById(
        "diaryTitle"
    ).value;



    let content =

    document.getElementById(
        "diaryContent"
    ).value;



    let mood =

    document.getElementById(
        "diaryMood"
    ).value;



    let favorite =

    document.getElementById(
        "favoriteCheck"
    ).checked;



    let locked =

    document.getElementById(
        "lockedCheck"
    ).checked;



    let imageInput =

    document.getElementById(
        "memoryImage"
    );



    let imageFile =

    imageInput.files[0];



    if(content.trim() === ""){

        alert("Write something");

        return;

    }



    let existingDiary = diaries.find(

        diary =>

        diary.username === currentUser &&

        diary.date === today

    );



    if(imageFile){

        let reader = new FileReader();



        reader.onload = function(e){

            saveDiaryData(e.target.result);

        };



        reader.readAsDataURL(imageFile);

    }

    else{

        saveDiaryData(null);

    }



    function saveDiaryData(imageData){

        if(existingDiary){

            existingDiary.title = title;

            existingDiary.content = content;

            existingDiary.mood = mood;

            existingDiary.favorite = favorite;

            existingDiary.locked = locked;



            if(imageData){

                existingDiary.image = imageData;

            }

        }

        else{

            diaries.push({

                id:Date.now(),

                username:currentUser,

                date:today,

                title:title,

                content:content,

                mood:mood,

                favorite:favorite,

                locked:locked,

                image:imageData

            });

        }



        saveDiaries();



        alert("Diary saved successfully");



        window.location.href =

        "timeline.html";

    }

}





function createMemoryCard(diary){

    return `

    <div class="memoryCard">

        ${diary.image ?

        `<img
            src="${diary.image}"
            class="memoryImage"
        >`

        :

        ""
        }

        <h3>
            ${diary.title || "Untitled"}
        </h3>

        <p>
            📅 ${diary.date}
        </p>

        <p>
            ${diary.mood}
        </p>

        <p>
            ${diary.content.substring(0,120)}...
        </p>

        <button onclick="openDiary(${diary.id})">

            Open Diary

        </button>

    </div>

    `;

}





function loadTimeline(){

    let currentUser =

    localStorage.getItem(
        "currentUser"
    );



    let allContainer =

    document.getElementById(
        "timelineContainer"
    );



    allContainer.innerHTML = "";



    let userDiaries = diaries.filter(

        diary => diary.username === currentUser

    );



    userDiaries.reverse();



    userDiaries.forEach(diary => {

        allContainer.innerHTML +=

        createMemoryCard(diary);

    });

}





function loadFavorites(){

    let currentUser =

    localStorage.getItem(
        "currentUser"
    );



    let favoriteContainer =

    document.getElementById(
        "favoriteContainer"
    );



    favoriteContainer.innerHTML = "";



    let favoriteDiaries = diaries.filter(

        diary =>

        diary.username === currentUser &&

        diary.favorite === true

    );



    favoriteDiaries.reverse();



    favoriteDiaries.forEach(diary => {

        favoriteContainer.innerHTML +=

        createMemoryCard(diary);

    });

}





function loadLocked(){

    let currentUser =

    localStorage.getItem(
        "currentUser"
    );



    let lockedContainer =

    document.getElementById(
        "lockedContainer"
    );



    lockedContainer.innerHTML = "";



    let lockedDiaries = diaries.filter(

        diary =>

        diary.username === currentUser &&

        diary.locked === true

    );



    lockedDiaries.reverse();



    lockedDiaries.forEach(diary => {

        lockedContainer.innerHTML +=

        createMemoryCard(diary);

    });

}





function searchTimeline(){

    let searchText =

    document.getElementById(
        "searchInput"
    ).value.toLowerCase();



    let cards =

    document.querySelectorAll(
        ".memoryCard"
    );



    cards.forEach(card => {

        if(

            card.innerText
            .toLowerCase()
            .includes(searchText)

        ){

            card.style.display = "block";

        }

        else{

            card.style.display = "none";

        }

    });

}





function searchByDate(){

    let selectedDate =

    document.getElementById(
        "searchDate"
    ).value;



    let cards =

    document.querySelectorAll(
        ".memoryCard"
    );



    cards.forEach(card => {

        if(

            card.innerText.includes(selectedDate)

        ){

            card.style.display = "block";

        }

        else{

            card.style.display = "none";

        }

    });

}





function openDiary(id){

    localStorage.setItem(

        "openedDiary",

        id

    );



    window.location.href =

    "view.html";

}





function loadViewDiary(){

    let diaryId =

    Number(

        localStorage.getItem(
            "openedDiary"
        )

    );



    let diary = diaries.find(

        d => d.id === diaryId

    );



    let container =

    document.getElementById(
        "viewContainer"
    );



    if(!diary){

        container.innerHTML =

        "<h2>Diary not found</h2>";

        return;

    }



    container.innerHTML = `

        ${diary.image ?

        `<img
            src="${diary.image}"
            class="viewImage"
        >`

        :

        ""
        }

        <h1>
            ${diary.title}
        </h1>

        <p>
            📅 ${diary.date}
        </p>

        <p>
            ${diary.mood}
        </p>

        <hr>

        <p>
            ${diary.content}
        </p>

    `;

}





function editOpenedDiary(){

    let diaryId =

    Number(

        localStorage.getItem(
            "openedDiary"
        )

    );



    let diary = diaries.find(

        d => d.id === diaryId

    );



    if(!diary){

        return;

    }



    localStorage.setItem(

        "editDate",

        diary.date

    );



    window.location.href =

    "editor.html";

}





function deleteDiary(){

    let confirmDelete = confirm(

        "Delete this diary permanently?"

    );



    if(!confirmDelete){

        return;

    }



    let diaryId =

    Number(

        localStorage.getItem(
            "openedDiary"
        )

    );



    diaries = diaries.filter(

        diary => diary.id !== diaryId

    );



    localStorage.setItem(

        "diaries",

        JSON.stringify(diaries)

    );



    alert("Diary deleted");



    window.location.href =

    "timeline.html";

}





function loadDraft(){

    let draft =

    JSON.parse(

        localStorage.getItem(
            "draftDiary"
        )

    );



    if(draft){

        document.getElementById(
            "diaryTitle"
        ).value = draft.title;



        document.getElementById(
            "diaryContent"
        ).value = draft.content;

    }

}





setInterval(() => {

    let titleBox =

    document.getElementById(
        "diaryTitle"
    );



    let contentBox =

    document.getElementById(
        "diaryContent"
    );



    if(titleBox && contentBox){

        localStorage.setItem(

            "draftDiary",

            JSON.stringify({

                title:titleBox.value,

                content:contentBox.value

            })

        );

    }

}, 2000);