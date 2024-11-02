const itemsArray = localStorage.getItem("items")
  ? JSON.parse(localStorage.getItem("items"))
  : [];

console.log(itemsArray);

const form = document.querySelector("form");
const itemInput = document.querySelector("#item");
const errorMessage = document.createElement("p");
errorMessage.textContent = "Please enter a task!";
errorMessage.style.color = "red";
errorMessage.style.display = "none";
form.appendChild(errorMessage);

form.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    document.querySelector("#enter").click();
  }
});

document.querySelector("#enter").addEventListener("click", () => {
  if (itemInput.value.trim() === "") {
    showError();
  } else {
    createItem(itemInput);
  }
});

function displayItems() {
  let items = "";
  for (let i = 0; i < itemsArray.length; i++) {
    items += `<div class="item">
      <div class="input-controller">
        <textarea disabled>${itemsArray[i]}</textarea>
        <div class="edit-controller">
          <i class="fa-solid fa-check deleteBtn"></i>
          <i class="fa-solid fa-pen-to-square editBtn"></i>
        </div>
      </div>
      <div class="update-controller">
        <button class="saveBtn">Save</button>
        <button class="cancelBtn">Cancel</button>
      </div>
    </div>`;
  }
  document.querySelector(".to-do-list").innerHTML = items;
  activateDeleteListeners();
  activateEditListeners();
  activateSaveListeners();
  activateCancelListeners();
}

function showError() {
  window.alert(errorMessage.textContent);
}

function hideError() {
  errorMessage.style.display = "none";
}

function activateCancelListeners() {
  const cancelBtn = document.querySelectorAll(".cancelBtn");
  const updateController = document.querySelectorAll(".update-controller");
  const inputs = document.querySelectorAll(".input-controller textarea");
  cancelBtn.forEach((cB, i) => {
    cB.addEventListener("click", () => {
      updateController[i].style.display = "none";
      inputs[i].disabled = true;
      inputs[i].style.border = "none";
    });
  });
}

function createItem(item) {
  itemsArray.push(item.value);
  localStorage.setItem("items", JSON.stringify(itemsArray));
  item.value = "";
  hideError();
  displayItems();
}

function activateDeleteListeners() {
  const deleteBtns = document.querySelectorAll(".deleteBtn");
  deleteBtns.forEach((db, i) => {
    db.addEventListener("click", () => {
      deleteItem(i);
    });
  });
}

function activateEditListeners() {
  const editBtns = document.querySelectorAll(".editBtn");
  const updateControllers = document.querySelectorAll(".update-controller");
  const inputs = document.querySelectorAll(".input-controller textarea");

  editBtns.forEach((eb, i) => {
    eb.addEventListener("click", () => {
      updateControllers[i].style.display = "block";
      inputs[i].disabled = false;
    });
  });
}

function activateSaveListeners() {
  const saveBtns = document.querySelectorAll(".saveBtn");
  const inputs = document.querySelectorAll(".input-controller textarea");

  saveBtns.forEach((sb, i) => {
    sb.addEventListener("click", () => {
      updateItem(inputs[i].value, i);
    });
  });
}

function updateItem(text, i) {
  itemsArray[i] = text;
  localStorage.setItem("items", JSON.stringify(itemsArray));
  location.reload();
}

function deleteItem(i) {
  itemsArray.splice(i, 1);
  localStorage.setItem("items", JSON.stringify(itemsArray));
  location.reload();
}

function displayDate() {
  let date = new Date();
  date = date.toString().split(" ");
  document.querySelector(
    "#date"
  ).innerHTML = `${date[1]} ${date[2]} ${date[3]}`;
}
function filterOldTasks() {
  const todayDate = new Date().toISOString().split("T")[0];
  const lastCleanupDate = localStorage.getItem("lastCleanupDate");

  // Run cleanup only if today's date is different from the last cleanup date
  if (lastCleanupDate !== todayDate) {
    const filteredArray = itemsArray.filter((item) => item.date === todayDate);
    localStorage.setItem("items", JSON.stringify(filteredArray));
    localStorage.setItem("lastCleanupDate", todayDate); // Update the last cleanup date
  }
}

window.onload = function () {
  filterOldTasks();
  displayDate();
  displayItems();
};
