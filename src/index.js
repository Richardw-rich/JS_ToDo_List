import './styles/style.css';
import './styles/fonts.css';

//sidebar
const taskContainer = document.querySelector('#task-container')
const newList = document.querySelector('#new-list')
const deleteListButton = document.querySelector('.delete-btn')
const newListForm = document.querySelector('[data-new-list-form]')

//searchbar
const searchBar = document.querySelector('#search')
const searchEnter = document.querySelector('#submit-search')

//todos
const addTask = document.querySelector('.add-btn')
const removeTask = document.querySelector('.clear-btn')
const taskDiv = document.querySelector('.todo-list')
const taskTitle = document.querySelector('[data-list-title]')
const taskCounter = document.querySelector('[data-list-count]')
const newTaskForm = document.querySelector('#new-task')
const belowTodo = document.querySelector('.below-todo')
const todoHeader = document.querySelector('#todo-header')
const taskTemplate = document.querySelector('#task-template')

//modal
const overlay = document.querySelector('#overlay')
const modalContainer = document.querySelector('.container')
const modal = document.querySelector('#modal')
const newName = document.querySelector('#name')
const newDate  = document.querySelector('#date')
const newPriority = document.querySelector('#priority')
const newDescription = document.querySelector('#description')
const closeButton = document.querySelector('.close')
const submitTask = document.querySelector('#submit')
const h2 = document.querySelector('.container h2');

let lists = []
let modalOpen = false 
let selectedListId = localStorage.getItem('task.selectedListId')
let taskIdToEdit = null
let isEditMode = false

window.addEventListener('load', () => {
let savedLists = JSON.parse(localStorage.getItem('task.lists')) || [];
lists.push(...savedLists)
render()
displayTaskCounter(selectedListId)
})

function renderAndSave() {
  render()
  saveListsToLocal();
  displayTaskCounter(selectedListId)
}

function saveListsToLocal() {
  localStorage.setItem('task.lists', JSON.stringify(lists));
  localStorage.setItem('task.selectedListId', selectedListId)
}

addTask.addEventListener('click', () => {
  if(lists.length === 0 || selectedListId === null) {
      return
  } else {
      openOrCloseAddTaskForm()
  }
})

closeButton.addEventListener('click', () => {
  closeModal()
})


function closeModal() {
  modalContainer.style.transform = "scale(0)";
  overlay.style.opacity = 0;
  modalOpen = false
}

function clearModal() {
  newName.value = ''
  newDate.value = '';
  newDescription.value = ''
  newPriority.value = '';
}

function openOrCloseAddTaskForm() {
     
  if (modalOpen) {
    modalContainer.style.pointerEvents = "none"
    modalContainer.style.transform = "scale(0)"
    overlay.style.opacity = 0
    modalOpen = false
    modal.classList.remove('active')
  } else {
    modalContainer.style.pointerEvents = "auto"
    modalContainer.style.transform = "scale(1)"
    h2.textContent = "New Task"
    submitTask.value = "submit"
    overlay.style.opacity = 1
    modalOpen = true
    modal.classList.add('active')
  }
}

function openOrCloseUpdateTaskForm() {
  if (modalOpen){
    modalContainer.style.pointerEvents = "none";
    modalContainer.style.display = "scale(0)";
    overlay.style.opacity = 0;
    modalOpen = false
    modal.classList.remove('active')
    
  } else {
    modalContainer.style.pointerEvents = "auto"
    modalContainer.style.transform = "scale(1)"
    h2.textContent = "Update Task"
    submitTask.value = "Update"
    overlay.style.opacity = 1
    modalOpen = true
    modal.classList.add('active')

  }
}

function clearElements(element) {
  while(element.firstChild) {
    element.removeChild(element.firstChild)
  }
}

newListForm.addEventListener('submit', (e) => {
    e.preventDefault();
      const listName = newList.value;
      if (listName === null || listName === '') return;
      const list = createList();
      newList.value = null;
      lists.push(list);
      localStorage.setItem("task.lists", JSON.stringify(lists))
      renderAndSave()
      displayTaskTitle()
  })

newTaskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const taskName = newName.value;
  if (taskName === null || taskName === '') return;

  if (isEditMode) {
    const selectedList = lists.find((list) => list.id === selectedListId);
    const taskToEdit = selectedList.tasks.find((task) => task.id === taskIdToEdit);

    if (taskToEdit) {
      taskToEdit.name = taskName;
      taskToEdit.date = newDate.value;
      taskToEdit.description = newDescription.value;
      taskToEdit.priority = newPriority.value;
    }
    
    isEditMode = false;
    taskIdToEdit = null;
  }else {
    const task = createTask();
    const selectedList = lists.find((list) => list.id === selectedListId);
    selectedList.tasks.push(task);
  }

  renderAndSave();
  closeModal();
  clearModal();
  })

function createList () {
  return {id: Date.now().toString(), name: newList.value, tasks: []}
}

function createTask () {
  return {
    id: Date.now().toString(),
    name: newName.value,
    date: newDate.value,
    priority: newPriority.value,
    description: newDescription.value,
    complete: false,
  }
}

function render() {
  clearElements(taskContainer);
  clearElements(taskDiv)
  renderLists();

  if (selectedListId === null) {
    belowTodo.style.display = "none";
    taskDiv.style.display = "none";
    todoHeader.style.display = "none";
    taskTitle.textContent = ""; 
  } else {
    const list = lists.find((list) => list.id === selectedListId);
    if (list) {
      belowTodo.style.display = "";
      taskDiv.style.display = "";
      todoHeader.style.display = "";
      taskTitle.textContent = list.name; 
    } else {
      belowTodo.style.display = "none";
      taskDiv.style.display = "none";
      todoHeader.style.display = "none";
      taskTitle.textContent = ""; 
    }
  }
  renderTasks(selectedListId)
}

function renderLists() {
  lists.forEach(list => {
    const listElement = document.createElement("li")
    listElement.innerText = list.name;
    listElement.classList.add('listItem')
    listElement.dataset.listId = list.id;
    taskContainer.appendChild(listElement)
    if (listElement.dataset.listId === selectedListId) {
      listElement.classList.add('list-active');
    }
    });
}

function displayTaskTitle() {
  if (selectedListId === null) {
    taskTitle.textContent = "";
  } else {
    const list = lists.find((list) => list.id === selectedListId);
    if (list) {
      taskTitle.textContent = list.name;
    } else {
      taskTitle.textContent = "";
    }}
}
taskContainer.addEventListener('click', (e) => {
  const clickedListItem = e.target.closest('.listItem')
  if(clickedListItem) {
    selectedListId = clickedListItem.dataset.listId;
    saveListsToLocal()
    clearElements(taskContainer)
    render()
    displayTaskCounter(selectedListId)
  }
})

deleteListButton.addEventListener('click', () => {


  if (selectedListId) {
    

      lists = lists.filter(list => list.id !== selectedListId);

      displayTaskTitle();
      render();
    

    selectedListId = null;
    clearElements(taskContainer);
    clearElements(taskDiv);
    saveListsToLocal()
    renderLists();
    
  }
});

function renderTasksFromList(tasks) {
  const list = lists.find((list) => list.id === selectedListId);
  if(selectedListId === null) {
    return
  } else {
  taskTitle.textContent = list.name
}
  (console.log(tasks.length))
  tasks.forEach((task) => {
    const taskElement = document.importNode(taskTemplate.content, true);
    const checkbox = taskElement.querySelector('input');
    checkbox.id = task.id;
    checkbox.checked = task.complete;
    checkbox.addEventListener('change', () => {
      handleCheckboxChange(task, checkbox)
    });
    taskColor(task, checkbox);
    const label = taskElement.querySelector('label');
    label.htmlFor  = task.id;

    const lineBreak = document.createElement('br');
    label.append(task.name, ", ", task.date, lineBreak, task.description);
    const editButton = document.createElement('p');
    editButton.innerHTML = "Edit Task";
    editButton.classList.add('edit');
    editButton.addEventListener('click', () => editTask(task, label));
    const todoTask = taskElement.querySelector('.task');
    todoTask.append(editButton);
    taskDiv.appendChild(taskElement);

  })
}

function renderTasks(selectedListId) {
  if (selectedListId === null) {
    return
  } else {
    const list = lists.find((list) => list.id === selectedListId);
    console.log(list)
    if(list) {
      renderTasksFromList(list.tasks);
      
    }   
  }
}

function taskColor(task, checkbox) {
  if (task.priority === "Low"){
    checkbox.classList.add('low')

  } else if (task.priority === "Medium") {
    checkbox.classList.add('medium')
    
  } else {
    checkbox.classList.add('high')
  }
}

function handleCheckboxChange(task) {
task.complete = !task.complete
  saveListsToLocal()
  renderAndSave()
}

function displayTaskCounter(selectedListId) {
  if(selectedListId === null){
    return;
  } else {
    const selectedList = lists.find((list) => list.id === selectedListId);
    if (selectedList) {
      const completedTasks = selectedList.tasks.filter((task) => task.complete);
      const count = completedTasks.length;
      const taskDisplayCount = (selectedList.tasks.length - count)
      if(taskDisplayCount < 1 && selectedList.tasks.length === 0) {
        taskCounter.textContent = "0 tasks"
      } else if (taskDisplayCount === 1){
        taskCounter.textContent = `1 task remaining`;

      } else {
        taskCounter.textContent = `${taskDisplayCount} tasks remaining`;

      }
    }
  }
}

function editTask (task) {
  isEditMode = true;
  taskIdToEdit = task.id
  
  openOrCloseUpdateTaskForm()

  newName.value = task.name;
  newDate.value = task.date;
  newDescription.value = task.description;
  newPriority.value = task.priority;
}

removeTask.addEventListener('click', (e) => {
  e.preventDefault();
  const selectedList = lists.find((list) => list.id === selectedListId);

  const taskElementsToRemove =[];

  selectedList.tasks.forEach((task) => {
    if (task.complete) {
      const taskCardElement = document.getElementById(task.id);
      const idParentElement = taskCardElement.parentNode;
      console.log(idParentElement)
      if (idParentElement) {
        idParentElement.classList.add('slide-up');
        taskElementsToRemove.push(idParentElement)
      console.log(taskElementsToRemove)

      }
    }
  });
  setTimeout(() => {
    taskElementsToRemove.forEach((idParentElement) => {
      idParentElement.remove();
    });
    handleDelete();
  }, 300);
});

function handleDelete() {
  if(selectedListId === null){
    return;
  } else {
    const selectedList = lists.find((list) => list.id === selectedListId);
    if (selectedList) {
    }
      selectedList.tasks = selectedList.tasks.filter((task) => !task.complete);
    }
    renderAndSave()
  }

  searchBar.addEventListener('keyup', (e) => {
    console.log('search')
    const selectedList = lists.find((list) => list.id === selectedListId)
    const searchString = e.target.value.toLowerCase();

    const searchedTasks = selectedList.tasks.filter((task) => {
      return (
        task.name.toLowerCase().includes(searchString) ||
        task.description.toLowerCase().includes(searchString)
      )
    })
    renderSearch(searchedTasks)
  })

function renderSearch (searchedTasks) {
  clearElements(taskContainer)
  renderLists();
  const selectedList = lists.filter((list) => list.id === selectedListId)

  if (selectedList === null) {
    belowTodo.style.display = "none";
    taskDiv.style.display = "none";
    todoHeader.style.display = "none";
    taskTitle.textContent = "";
  } else {
    belowTodo.style.display = "";
    taskDiv.style.display = "";
    todoHeader.style.display = "";
    taskTitle.textContent = selectedList.name;
    clearElements(taskDiv)
    renderTasksFromList(searchedTasks)
  }

}

