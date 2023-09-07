//make new task
submitTask.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskName = newName.value
    // if (h2.textContent === "Update Task") return
    // if (taskName === null || taskName === '') return
    const task = createTask()
    newName.value = null
    renderAndSave()
  
  
  })
  
  
  function createTask() {
    return {
      id: Date.now().toString(), //this creates new id based on unix epoch timestamp
      name: newName.value,
      date: newDate.value,
      priority: newPriority.value,
      descrption: newDescription.value,
      complete: false
    
  
    }
  }
  
  