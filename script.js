// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-analytics.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtputm7vY8T7PA3v9IyKnUWdUOKPKWI3A",
  authDomain: "fir-99b9e.firebaseapp.com",
  databaseURL: "https://fir-99b9e-default-rtdb.firebaseio.com",
  projectId: "fir-99b9e",
  storageBucket: "fir-99b9e.appspot.com",
  messagingSenderId: "988477661424",
  appId: "1:988477661424:web:8cd07e7425a7d8b6176235",
  measurementId: "G-0Y6KEYBJH4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase();
const userRef = ref(db, "users");
//Tạo mới bản ghi
const buttonCreate = document.querySelector(".button-create");
buttonCreate.addEventListener("click", () => {
  const dataUser = {
    fullName: "Trinh Tran Trung Duc",
    email: "trintrantrungduc@gmail.com",
  };
  const newUserRef = push(userRef);
  set(newUserRef, dataUser);
});
// Lấy ra danh sách bản ghi
onValue(userRef, (items) => {
  items.forEach((item) => {
    console.log(item.key);
    console.log(item.val());
  });
});
// Lấy ra chi tiết 1 bản ghi
onValue(ref(db, "/users/" + "-O9oHpScBk7ssGUjdCMA"), (item) => {
  console.log(item);
});
// Cập nhật bản ghi
const buttonUpdate = document.querySelector(".button-update");
buttonUpdate.addEventListener("click", () => {
  const id = "-O9oHpScBk7ssGUjdCMA";
  const dataUpdate = {
    fullName: "VangReal",
  };
  update(ref(db, "/users/" + id), dataUpdate);
});
// Xóa bản ghi
const buttonDelete = document.querySelector(".button-delete");
buttonDelete.addEventListener("click", () => {
  const id = "-O9oHpScBk7ssGUjdCMA";
  remove(ref(db, "/users/" + id));
});
