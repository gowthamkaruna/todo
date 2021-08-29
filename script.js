class ToDo {
  constructor(toDoList) {
    this.toDoList = toDoList;
    this.id = 0;
    this.item = 0;
    this.draggables;
    this.checkboxes;
    this.removeBtns;
    this.checkboxesArray = [];
    this.uncheckedCheckboxesArray = [];
    this.checkedCheckboxesArray = [];
  }

  addNewTodo(newToDo) {
    this.id += 1;
    this.item += 1;
    const newDiv = document.createElement("div");
    newDiv.classList = "todo draggable";
    newDiv.draggable = true;
    const newToDoCheckbox = document.createElement("input");
    const label = document.createElement("label");
    const removeBtn = document.createElement("button");
    const removeImg = document.createElement("img");
    newToDoCheckbox.type = "checkbox";
    newToDoCheckbox.id = `todo-${this.id}`;
    newToDoCheckbox.name = "todo-list";
    newToDoCheckbox.value = `todo-${this.id}`;
    newToDoCheckbox.classList = "checkbox-round";
    removeBtn.classList = "remove-todo-btn";
    removeImg.classList = "remove-icon";
    removeImg.src = "https://svgur.com/i/_bQ.svg";
    label.htmlFor = `todo-${this.id}`;
    label.appendChild(document.createTextNode(newToDo));
    removeBtn.appendChild(removeImg);
    newDiv.appendChild(newToDoCheckbox);
    newDiv.appendChild(label);
    newDiv.appendChild(removeBtn);
    this.toDoList.appendChild(newDiv);
    this.renderItem();
  }

  renderItem() {
    itemEl.innerHTML = this.item;
  }

  updateDraggables() {
    this.draggables = this.toDoList.querySelectorAll(".draggable");

    this.draggables.forEach((draggable) => {
      draggable.addEventListener("dragstart", function () {
        draggable.classList.add("dragging");
      });

      draggable.addEventListener("dragend", function () {
        draggable.classList.remove("dragging");
      });
    });
  }

  updateRemoveBtn() {
    this.removeBtns = this.toDoList.querySelectorAll(".remove-todo-btn");
    this.removeBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.target.closest(".todo").remove();
        this.updateCheckboxes();
      });
    });
  }

  renderRemoveBtn() {
    this.draggables.forEach((draggable) => {
      draggable.addEventListener("mouseover", function () {
        draggable.classList.add("show");
      });
      draggable.addEventListener("mouseout", function () {
        draggable.classList.remove("show");
      });
    });
  }

  getDragAfterEl(y) {
    const draggableEl = [
      ...this.toDoList.querySelectorAll(".draggable:not(.dragging)"),
    ];
    return draggableEl.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  updateCheckboxes() {
    this.checkboxes = this.toDoList.querySelectorAll("input[type='checkbox']");
    this.checkboxesArray = Array.apply(null, this.checkboxes);
    this.uncheckedCheckboxesArray = this.checkboxesArray.filter(
      (checkbox) => !checkbox.checked
    );
    this.checkedCheckboxesArray = this.checkboxesArray.filter(
      (checkbox) => checkbox.checked
    );

    this.item = this.uncheckedCheckboxesArray.length;

    this.renderItem();
  }

  filterAll() {
    if (!this.checkboxes) return;
    this.checkboxes.forEach((checkbox) => {
      checkbox.closest(".todo").style.display = "grid";
    });
  }

  filterActive() {
    if (!this.checkboxes) return;
    this.checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        checkbox.closest(".todo").style.display = "none";
      } else {
        checkbox.closest(".todo").style.display = "grid";
      }
    });
  }

  filterCompleted() {
    if (!this.checkboxes) return;
    this.checkboxes.forEach((checkbox) => {
      if (!checkbox.checked) {
        checkbox.closest(".todo").style.display = "none";
      } else {
        checkbox.closest(".todo").style.display = "grid";
      }
    });
  }

  clearCompleted() {
    if (!this.checkboxes) return;
    this.checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        checkbox.closest(".todo").remove();
      }
    });
  }
}

const body = document.querySelector("body");
const toDoList = document.querySelector(".todo-list");
const userInputEl = document.querySelector(".user-input");
const itemEl = document.querySelector(".item-left");
const themeBtn = document.querySelector(".theme-btn");
const allBtn = document.querySelector(".filter-btn--all");
const activeBtn = document.querySelector(".filter-btn--active");
const completedBtn = document.querySelector(".filter-btn--completed");
const clearCompletedBtn = document.querySelector(".clear-completed-btn");

const toDoApp = new ToDo(toDoList);

// Add new todo
userInputEl.addEventListener("keyup", function (e) {
  e.preventDefault();
  if (e.key === "Enter") {
    const newToDo = userInputEl.value;
    toDoApp.addNewTodo(newToDo);
    userInputEl.value = "";
    toDoApp.updateDraggables();
    toDoApp.updateCheckboxes();
    toDoApp.updateRemoveBtn();
    toDoApp.renderRemoveBtn();

    toDoApp.checkboxes.forEach((checkbox) => {
      checkbox.addEventListener(
        "change",
        toDoApp.updateCheckboxes.bind(toDoApp)
      );
    });
  }
});

// Filter button
allBtn.addEventListener("click", function () {
  allBtn.classList.add("filter-btn--selected");
  activeBtn.classList.remove("filter-btn--selected");
  completedBtn.classList.remove("filter-btn--selected");
  toDoApp.filterAll();
});

activeBtn.addEventListener("click", function () {
  activeBtn.classList.add("filter-btn--selected");
  allBtn.classList.remove("filter-btn--selected");
  completedBtn.classList.remove("filter-btn--selected");
  toDoApp.filterActive();
});

completedBtn.addEventListener("click", function () {
  allBtn.classList.remove("filter-btn--selected");
  activeBtn.classList.remove("filter-btn--selected");
  completedBtn.classList.add("filter-btn--selected");
  toDoApp.filterCompleted();
});

clearCompletedBtn.addEventListener("click", function () {
  toDoApp.clearCompleted();
});

// Dragging feature
toDoApp.toDoList.addEventListener("dragover", function (e) {
  e.preventDefault();
  const afterEl = toDoApp.getDragAfterEl(e.clientY);
  const draggable = document.querySelector(".dragging");
  if (afterEl == null) {
    toDoApp.toDoList.appendChild(draggable);
  } else {
    toDoApp.toDoList.insertBefore(draggable, afterEl);
  }
});

// Theme change
themeBtn.addEventListener("click", function () {
  body.classList.toggle("dark");
  body.classList.toggle("light");
});
