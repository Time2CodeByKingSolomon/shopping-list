const itemForm = document.getElementById("item-form");
const itemInput = document.getElementById("item-input");
const itemList = document.getElementById("item-list");

function createItem(item) {
  const li = document.createElement("li");
  li.innerHTML = `
    ${item}
    <button class="remove-item btn-link text-red"><i class="fa-solid fa-xmark"></i></button>
  `;
  return li;
}

function addItem(e) {
  e.preventDefault();
  const newItem = itemInput.value;
  if (newItem === "") {
    alert("Please add an item");
    return;
  }
  const li = createItem(newItem);
  itemList.appendChild(li);
  itemInput.value = "";
}

itemForm.addEventListener("submit", addItem);
