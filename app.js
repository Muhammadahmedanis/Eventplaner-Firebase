import {auth, onAuthStateChanged, signOut, getDoc, db, doc} from'./firebase.js'

let userImg = document.getElementById("userImg")
let loginLink = document.getElementById("loginLink")
onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        getData(uid);
        if(loginLink && userImg){
            loginLink.style.display = "none";
            userImg.style.display = "inline-block";
        }
        // if(location.pathname !== '/profile.html')
        // {
        //     // location.href ="profile.html";
        // }

        console.log("Login");
    } else {
        if(userImg && loginLink){
            loginLink.style.display = "inline-block";
            userImg.style.display = "none";
        }
        // if (location.pathname != "/signin.html"){
        //     window.location.href ="signin.html";
        // }
        console.log("not login");
    }
  });

let Logout = () => {
    signOut(auth)
    location.href ="signin.html";
}  

let logoutBtn = document.getElementById("logoutBtn");
logoutBtn && logoutBtn.addEventListener("click", Logout);


let getData = async(uid) => {
    const docRef = doc(db, "user", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.data()) {
        userImg.src = docSnap.data().image;
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }   
}