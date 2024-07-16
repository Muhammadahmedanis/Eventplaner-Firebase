import {auth, onAuthStateChanged, signOut, getDoc, db, doc, getDocs, collection, updateDoc, arrayRemove, arrayUnion, deleteDoc} from'./firebase.js'

let userImg = document.getElementById("userImg")
let loginLink = document.getElementById("loginLink")
let logoutBtn = document.getElementById("logoutBtn");
let createEvent = document.getElementById("createEvent");

onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        getData(uid);
        if(loginLink || userImg || logoutBtn || createEvent){
            loginLink.style.display = "none";
            userImg.style.display = "inline-block";
            logoutBtn.style.display = "block";
            createEvent.style.display = "block";
        }
        // if(location.pathname !== '/profile.html')
        // {
        //     // location.href ="profile.html";
        // }

        console.log("Login");
    } else {
        if(userImg || loginLink || logoutBtn || createEvent){
            loginLink.style.display = "inline-block";
            userImg.style.display = "none";
            logoutBtn.style.display = "none";
            createEvent.style.display = "none";
        }
        // if (location.pathname != "/signin.html"){
        //     window.location.href ="signin.html";
        // }
        console.log("not login");
    }
  });

let Logout = () => {
    signOut(auth)
    // location.href ="signin.html";
}  

logoutBtn && logoutBtn.addEventListener("click", Logout);


let getData = async(uid) => {
    const docRef = doc(db, "user", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.data() && userImg) {
        userImg.src = docSnap.data().image;
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }   
}


const eventCardContainer = document.getElementById("eventCardContainer");
let getAllEvents = async () => {
    if(eventCardContainer){
        eventCardContainer.innerHTML = '';
    }
    try {      
        const querySnapshot = await getDocs(collection(db, "events"));
        querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());

        const eventData = doc.data();
        // console.log("event:", eventData);

        const {banner, title, des, createdByEmail, date} = eventData;
        if(eventCardContainer){
            eventCardContainer.innerHTML += `
                <div class="w-[300px] bg-white m-2 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <a href="#">
                <img class="h-48 w-full rounded-t-lg" src="${banner}" alt="" />
                </a>
            <div class="p-5">
            <a href="#">
                <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">${title}</h5>
            </a>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">${des}</p>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Date: ${date}</p>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Creator: ${createdByEmail}</p>
            <button id='${doc.id}' onclick= "likeEvent(this)" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                ${auth?.currentUser && eventData?.likes?.includes(auth?.currentUser.uid) ? "liked..." : "like"}
                ${eventData?.likes?.length ? eventData?.likes?.length: ''}
            </button>
            <button id='${doc.id}' onclick= "deleteEvent(this)" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            Delete
            </button>
            </div>
            </div>
            `
            window.likeEvent = likeEvent;
            window.deleteEvent = deleteEvent;
        }
    });
    } catch (e) {
        console.log("Error getting cached document:", e);
    }
}
getAllEvents();

async function likeEvent(e) {
    if(auth.currentUser){
        const docRef = doc(db, "events", e.id);
        if(e.innerText == `liked...`){
            updateDoc(docRef, {
                likes: arrayRemove(auth.currentUser.uid)
            })
            .then(() => {
                e.innerText = "like";
            })
            .catch((error) => alert(error));
        }else{
            updateDoc(docRef, {
                likes: arrayUnion(auth.currentUser.uid)
            })
            .then(() => {
                e.innerText = "liked..."
            })
            .catch((error) => alert(error));
        }
    }else{
        location.href = "signin.html";
    }
}

async function deleteEvent(e) {
    const docRef = doc(db, "events", e.id);
    await deleteDoc(docRef)
    getAllEvents(auth.currentUser.uid)
}
