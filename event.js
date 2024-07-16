import {ref, storage, uploadBytes, getDownloadURL, db, collection, doc, addDoc, auth} from'./firebase.js'

let eventfile = document.getElementById("eventfile");
let eventTitle = document.getElementById("eventTitle");
let eventDate = document.getElementById("eventDate");
let eventDescription = document.getElementById("eventDescription");

let Even = () => {
    const eventInfo = {
        banner: eventfile.files[0],
        title: eventTitle.value,
        date: eventDate.value,
        des: eventDescription.value, 
        createdBy: auth.currentUser.uid,
        createdByEmail: auth.currentUser.email,
        likes: [],
    }
    console.log(eventInfo);

    const imgRef = ref(storage, eventInfo.banner.name);
    uploadBytes(imgRef, eventInfo.banner).then(() => {
    console.log('Uploaded file');
    getDownloadURL(imgRef).then((downloadURL) => {
        console.log('File available at', downloadURL);
        eventInfo.banner = downloadURL;

        const imgRef = collection(db, "events");
        addDoc(imgRef, eventInfo)
        console.log("uploaded");
        setTimeout(() => {
            location.href = "profile.html";
        }, 1000)
      });
    });

    // (async () => {
    // })

}
    
let eventBtn = document.getElementById("eventBtn");
eventBtn && eventBtn.addEventListener("click", Even);