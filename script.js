// <button class="remove-item btn-link text-red">
//   <i class="fa-solid fa-xmark"></i>
// </button>

const inputItem = document.getElementById("item-input");
const form = document.getElementById("item-form");
const itemList = document.getElementById("item-list");
const clear = document.getElementById("clear");
const filterInput = document.getElementById("filter");
let itemsArray;

initialize();

function saveItems() {
  localStorage.setItem("shopping-items", JSON.stringify(itemsArray));
}

function getItems() {
  return JSON.parse(localStorage.getItem("shopping-items")) || [];
}

function initialize() {
  itemsArray = getItems();
  if (itemsArray.length > 0) {
    showFilter();
    clear.style.display = "block";
  } else {
    hideFilter();
    clear.style.display = "none";
  }
  itemsArray.forEach((item) => {
    itemList.appendChild(createItem(item));
  });
  switchToAddMode();
}

function switchToAddMode() {
  form.querySelector("i").nextSibling.textContent = " Add Item";
  form.dataset.mode = "add";
  clear.dataset.mode = "add";
  clear.textContent = "Clear All";
}

function switchToModeEdit(index) {
  form.querySelector("i").nextSibling.textContent = " Edit Item";
  form.dataset.itemIndex = index;
  form.dataset.mode = "edit";
  clear.dataset.mode = "edit";
}

function diableAllItems() {
  filterInput.style.cursor = "not-allowed";
  const items = itemList.querySelectorAll("li");
  items.forEach((item) => {
    const button = item.querySelector("button");
    const i = item.querySelector("i");
    i.style.cursor = "not-allowed";
    button.style.cursor = "not-allowed";
    i.style.pointerEvents = "none";
    button.disabled = true;
    item.style.pointerEvents = "none";
  });
  filterInput.disabled = true;
}

function enableAllItems() {
  filterInput.style.cursor = "auto";
  const items = itemList.querySelectorAll("li");
  items.forEach((item) => {
    const button = item.querySelector("button");
    const i = item.querySelector("i");
    i.style.cursor = "pointer";
    button.style.cursor = "pointer";
    i.style.pointerEvents = "auto";
    button.disabled = false;
    item.style.pointerEvents = "auto";
    item.style.backgroundColor = "#f5f5f5";
  });
  filterInput.disabled = false;
}

function hideFilter() {
  filterInput.style.display = "none";
}

function showFilter() {
  filterInput.style.display = "block";
}

filterInput.addEventListener("input", function (e) {
  const filterBy = e.target.value.trim().toLowerCase();
  const items = itemList.querySelectorAll("li");
  items.forEach((item) => {
    item.style.display = item.textContent
      .trim()
      .toLowerCase()
      .includes(filterBy)
      ? "flex"
      : "none";
  });
});

function createItem(item) {
  const li = document.createElement("li");
  li.innerHTML = `
    ${item}
    <button class="remove-item btn-link text-red">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;
  return li;
}

inputItem.addEventListener("input", function (e) {
  inputItem.setCustomValidity("");
  inputItem.focus();
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  inputItem.setCustomValidity("Enter Item to shop");
  let itemToAdd = inputItem.value.trim();
  if (itemToAdd === "") {
    inputItem.focus();
    inputItem.reportValidity();
    return;
  }

  if (form.dataset.mode === "add") {
    itemList.appendChild(createItem(itemToAdd));
    itemsArray.push(itemToAdd);
    saveItems();
    inputItem.value = "";
    inputItem.focus();
    showFilter();
    addEventListenerToItems();
    clear.style.display = "block";
  } else {
    switchToAddMode();
    itemToEdit = inputItem.value.trim();
    const index = form.dataset.itemIndex;
    const items = itemList.querySelectorAll("li");
    items[index].innerHTML = `
    ${itemToEdit}
    <button class="remove-item btn-link text-red">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;
    items[index].style.backgroundColor = "#f5f5f5";
    itemsArray[index] = itemToEdit;
    saveItems();
    inputItem.value = "";
    inputItem.focus();
    switchToAddMode();
    enableAllItems();
  }
});

function addEventListenerToItem(e) {
  if (["I", "Button"].indexOf(e.target.tagName) > -1) {
    this.remove();
    const index = itemsArray.indexOf(this.textContent.trim());
    itemsArray.splice(index, 1);
    saveItems();
    if (itemList.querySelectorAll("li").length === 0) {
      hideFilter();
      clear.style.display = "none";
    }
    inputItem.focus();
  }
}

function addItem(item) {
  item.addEventListener("click", addEventListenerToItem);
}

function editItem(item) {
  item.addEventListener("dblclick", function (e) {
    const itemToEdit = item.textContent.trim();
    const index = itemsArray.indexOf(itemToEdit);
    diableAllItems();
    clear.textContent = "Cancel Edit";
    item.style.backgroundColor = "#fff";
    form.querySelector("i").nextSibling.textContent = " Edit Item";
    switchToModeEdit(index);
    inputItem.focus();
    inputItem.value = item.textContent.trim();
  });
}

function addEventListenerToItems() {
  const items = itemList.querySelectorAll("li");
  items.forEach(addItem);
  items.forEach(editItem);
}

clear.addEventListener("click", function (e) {
  if (clear.dataset.mode === "add") {
    while (itemList.querySelectorAll("li").length > 0) {
      itemList.firstElementChild.remove();
      itemsArray.splice(0, 1);
    }
    hideFilter();
    saveItems();
  } else {
    clear.textContent = "Clear All";
    switchToAddMode();
    enableAllItems();
  }
  inputItem.value = "";
  clear.style.display = "none";
});

addEventListenerToItems();
