import {auth, createUserWithEmailAndPassword, storage, ref, uploadBytesResumable ,getDownloadURL, db, setDoc, doc} from './firebase.js'

let uploadImg = (file) => {
return new Promise((resolve, reject) => {
const storageRef = ref(storage, `user/${auth.currentUser.uid}`);
const uploadTask = uploadBytesResumable(storageRef, file);

uploadTask.on('state_changed', 
  (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

    console.log('Upload is ' + Math.round(progress) + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
    reject("not found")
  }, 
  () => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    resolve(downloadURL);
    });
  }
);
    })
}

let file = document.getElementById("file");

file && file.addEventListener("change", (e) => {
    let img = document.getElementById("img");
    img.src = URL.createObjectURL(e.target.files[0]);
})


let Signup = async() => {
    let Uemail = document.getElementById("email");
    let Upass = document.getElementById("pass");
    try {
        const userCredential =  await createUserWithEmailAndPassword(auth, Uemail.value, Upass.value)
        
        const user = userCredential.user;
        console.log("Signup:-", user);
        const url = await uploadImg(file.files[0])
        console.log(url);
        const userDbRef = doc(db, 'user', user.uid);
        setDoc(userDbRef, { 
          email: user.email,
          image: url,
        });
        
        console.log("user login successdfully");
        setTimeout(() => {
          location.href = "profile.html";
        }, 1500);
      }
      catch(error) {
      console.log("Error:-", error);
    };
} 
let signupBtn = document.getElementById("signupBtn");
signupBtn && signupBtn.addEventListener("click", Signup)