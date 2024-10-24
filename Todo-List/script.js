// Nhập các hàm cần thiết từ SDK của Firebase
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

// Cấu hình Firebase của bạn
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

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(); // Khởi tạo cơ sở dữ liệu
const todoRef = ref(db, "todos"); // Tham chiếu đến nút "todos" trong cơ sở dữ liệu

// Hàm hiển thị thông báo
const showAlert = (content = null, time = 3000) => {
  if (content) {
    const newAlert = document.createElement("div"); // Tạo một div thông báo mới
    newAlert.setAttribute("class", "alert alert--success"); // Đặt class cho thông báo

    // Đặt nội dung HTML cho thông báo
    newAlert.innerHTML = `
        <span class="alert__content">${content}</span>
        <span class="alert__close"><i class="fa-solid fa-xmark"></i></span>
    `;
    const alertList = document.querySelector(".alert-list"); // Lấy phần tử danh sách thông báo

    alertList.appendChild(newAlert); // Thêm thông báo mới vào danh sách
    const alertClose = newAlert.querySelector(".alert__close"); // Lấy nút đóng thông báo
    alertClose.addEventListener("click", () => {
      alertList.removeChild(newAlert); // Xóa thông báo khi nút đóng được nhấn
    });

    // Tự động xóa thông báo sau thời gian chỉ định
    setTimeout(() => {
      alertList.removeChild(newAlert);
    }, time);
  }
};
// Hàm closeModal
const closeModal = (element) => {
  const body = document.querySelector("body");
  // Lấy các phần tử trong modal
  const modalClose = element.querySelector(".modal__close");
  const buttonClose = element.querySelector(".button__close");
  const modalOverlay = element.querySelector(".modal__overlay");

  // Sự kiện cho nút đóng modal
  modalClose.addEventListener("click", () => {
    body.removeChild(element);
  });
  buttonClose.addEventListener("click", () => {
    body.removeChild(element);
  });
  // Đóng modal khi nhấp vào overlay
  modalOverlay.addEventListener("click", () => {
    body.removeChild(element);
  });
};
// Hàm hiển thị modal xác nhận để xóa todo
const showConfirmDelete = (id) => {
  const elementConfirm = document.createElement("div"); // Tạo phần tử modal
  const body = document.querySelector("body");
  elementConfirm.classList.add("modal"); // Thêm class modal cho phần tử

  // Đặt nội dung HTML cho modal xác nhận
  elementConfirm.innerHTML = `
    <div class="modal__main">
        <button class="modal__close">
            <i class="fa-solid fa-xmark"></i>
        </button>
        <div class="modal__content">
            <div class="modal__text">
                Bạn có chắc muốn xóa công việc này?
            </div>
            <button class="button__close">Hủy</button>
            <button class="button__agree">Đồng ý</button>
        </div>
    </div>
    <div class="modal__overlay"></div>
  `;
  body.appendChild(elementConfirm); // Thêm modal vào body
  closeModal(elementConfirm);
  const buttonAgree = elementConfirm.querySelector(".button__agree");
  // Sự kiện cho nút đồng ý xóa
  buttonAgree.addEventListener("click", () => {
    remove(ref(db, "/todos/" + id)).then(() => {
      // Xóa todo khỏi cơ sở dữ liệu
      body.removeChild(elementConfirm); // Đóng modal
      showAlert("Xóa thành công", 5000); // Hiển thị thông báo thành công
    });
  });
};

// Hàm hiển thị modal chỉnh sửa cho todo
const showFormEdit = (id) => {
  const elementEdit = document.createElement("div"); // Tạo phần tử modal
  const body = document.querySelector("body");
  elementEdit.classList.add("modal"); // Thêm class modal cho phần tử

  // Đặt nội dung HTML cho modal chỉnh sửa
  elementEdit.innerHTML = `
        <div class="modal__main">
            <button class="modal__close">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <div class="modal__content">
                <div class="modal__text">
                    Chỉnh sửa công việc...
                </div>
                <input name="content" class="edit"> 
                <button class="button__close">Hủy</button>
                <button class="button__agree">Cập nhật</button>
            </div>
        </div>
        <div class="modal__overlay"></div>
      `;
  body.appendChild(elementEdit); // Thêm modal vào body
  closeModal(elementEdit);
  const buttonAgree = elementEdit.querySelector(".button__agree");
  // Placeholder cho chức năng cập nhật
  buttonAgree.addEventListener("click", () => {
    const content = elementEdit.querySelector("input[name='content'").value;
    if (content) {
      const dataUpdate = {
        content: content,
      };
      update(ref(db, "/todos/" + id), dataUpdate).then(() => {
        body.removeChild(elementEdit);
        showAlert("Chỉnh sửa thành công", 5000); // Hiển thị thông báo thành công
      });
    }
  });
  onValue(ref(db, "/todos/" + id), (item) => {
    const data = item.val();
    elementEdit.querySelector("input[name='content']").value = data.content;
  });
};

// Thêm công việc mới
const todoAppCreate = document.querySelector("#todo-app-create");
if (todoAppCreate) {
  todoAppCreate.addEventListener("submit", (event) => {
    event.preventDefault(); // Ngăn chặn gửi form mặc định
    const content = todoAppCreate.content.value; // Lấy giá trị từ ô input
    if (content) {
      const data = {
        content: content,
        complete: false, // Đặt trạng thái hoàn thành là false
      };
      const newTodoRef = push(todoRef); // Tạo tham chiếu mới cho todo
      set(newTodoRef, data).then(() => {
        showAlert("Tạo thành công", 5000); // Hiển thị thông báo thành công
      });
      todoAppCreate.content.value = ""; // Xóa giá trị ô input sau khi thêm
    }
  });
}

// Lấy ra danh sách công việc
onValue(todoRef, (items) => {
  const htmls = [];
  items.forEach((item) => {
    const key = item.key; // Lấy khóa của todo
    const data = item.val(); // Lấy dữ liệu của todo
    let buttonComplete = "";
    if (!data.complete) {
      buttonComplete = `
        <button class="todo-app__item-button todo-app__item-button--complete" button-complete="${key}">
            <i class="fa-solid fa-check"></i>
        </button>
        `;
    } else {
      buttonComplete = `
        <button class="todo-app__item-button todo-app__item-button--undo" button-undo="${key}">
          <i class="fa-solid fa-rotate-left"></i>
        </button>
      `;
    }
    let html = `
        <div class="todo-app__item ${data.complete ? "todo-app__item--complete" : ""}">
            <span class="todo-app__item-content">${data.content}</span>
            <div class="todo-app__item-actions">
                <button class="todo-app__item-button todo-app__item-button--edit" button-edit="${key}">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                ${buttonComplete}
                <button class="todo-app__item-button todo-app__item-button--delete" button-remove="${key}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    htmls.push(html); // Thêm HTML của todo vào danh sách
  });
  const todoAppList = document.querySelector("#todo-app-list");
  todoAppList.innerHTML = htmls.reverse().join(""); // Cập nhật danh sách công việc

  // Tính năng hoàn thành công việc
  const listButtonComplete = document.querySelectorAll("[button-complete]");
  listButtonComplete.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("button-complete"); // Lấy id của todo
      const dataUpdate = {
        complete: true, // Đặt trạng thái hoàn thành là true
      };
      update(ref(db, "/todos/" + id), dataUpdate).then(() => {
        showAlert("Cập nhật thành công", 5000); // Hiển thị thông báo thành công
      });
    });
  });

  // Tính năng hoàn tác công việc
  const listButtonUndo = document.querySelectorAll("[button-undo]");
  listButtonUndo.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("button-undo"); // Lấy id của todo
      const dataUpdate = {
        complete: false, // Đặt trạng thái hoàn thành là false
      };
      update(ref(db, "/todos/" + id), dataUpdate).then(() => {
        showAlert("Hoàn tác thành công", 5000); // Hiển thị thông báo thành công
      });
    });
  });

  // Tính năng xóa công việc
  const listButtonRemove = document.querySelectorAll("[button-remove]");
  listButtonRemove.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("button-remove"); // Lấy id của todo
      showConfirmDelete(id); // Hiển thị modal xác nhận xóa
    });
  });
  // Tính năng chỉnh sửa công việc
  const listButtonEdit = document.querySelectorAll("[button-edit]");
  listButtonEdit.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("button-edit"); // Lấy id của todo
      showFormEdit(id); // Hiển thị modal xác nhận xóa
    });
  });
});
