import {auth, signInWithEmailAndPassword} from './firebase.js'

let signIn = () => {
    let signinEmail = document.getElementById("lemail")
    let signinPass = document.getElementById("lpass")

    signInWithEmailAndPassword(auth, signinEmail.value, signinPass.value)
    .then((userCredential) => {
    const user = userCredential.user;
    console.log("Signin:-", user);
    location.href = "profile.html";
    })
    .catch((error) => {
    console.log("Error", error);
    });
}

let signinBtn = document.getElementById("signinBtn")
signinBtn && signinBtn.addEventListener("click", signIn)   