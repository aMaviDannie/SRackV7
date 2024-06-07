//Array to hold project slots and variable for search terms
//Hello world nyan :3

let x = 7;

let slots = [];
let searchTerm = '';

const { ipcRenderer } = require('electron');

//Render project slots function
function renderSlots() {
  const container = document.getElementById('slots-container');
  container.innerHTML = '';
  
  const filteredSlots = slots.map((slot, originalIndex) => ({   //'filteredSlots' array includes original index of each slot by mapping the 'slots' array 
    ...slot,                                                    //to an array of objects with the slot data and its original index.  
    originalIndex,
  })).filter(slot => slot.name.toLowerCase().includes(searchTerm.toLowerCase()));
  
  filteredSlots.forEach((slot) => {                              //For search to get exact results of the slot number, slot number is displayed by 'originalIndex' property.
    const statusChangedText = slot.status === 'In use'
    ? `In use since: ${slot.statusChanged}`
    : slot.status === 'Not in use' && slot.statusChanged !== 'N/A'
    ? `Placed back at: ${slot.statusChanged}`
    : 'Status Changed: Not used';

    const slotDiv = document.createElement('div');
    slotDiv.className = 'slot';
    slotDiv.innerHTML = `                                   
      <strong>Slot ${slot.originalIndex + 1}:</strong> ${slot.name}  <br>
      Status: ${slot.status || 'Not in use'}
      <div class="actions">
        <button onclick="editProject(${slot.originalIndex})">Edit Project Name</button>
        <button onclick="deleteProject(${slot.originalIndex})">Clear Project Slot</button>
        <button onclick="activateLED(${slot.originalIndex})">LED Activation</button>
        <button onclick="toggleStatus(${slot.originalIndex})">Toggle Status</button>
      </div>
      <div class="status-changed">
        ${statusChangedText}
      </div>
    `;
    container.appendChild(slotDiv);
  });

  updateCounts();
}

//Display modals with input fields function
function showModal(message, defaultValue = '') {
  return new Promise((resolve) => {
    const modal = document.getElementById('inputModal');
    const modalMessage = document.getElementById('modalMessage');
    const modalInput = document.getElementById('modalInput');
    const modalOkBtn = document.getElementById('modalOkBtn');
    const modalCancelBtn = document.getElementById('modalCancelBtn');
    const modalClose = document.getElementById('modalClose');

    // Set up modal content and show it
    modalMessage.textContent = message;
    modalInput.value = defaultValue;
    modal.style.display = 'block';
    modalInput.focus();

    //Close modal and resolve the promise
    const closeModal = (result) => {
      modal.style.display = 'none';
      resolve(result);
      cleanup();
    };

    const handleOk = () => closeModal(modalInput.value);
    const handleCancel = () => closeModal(null);

    const handleKeydown = (event) => {
      if (event.key === 'Enter') {
        handleOk();
      }
    };

    const handleOutsideClick = (event) => {
      if (event.target === modal) {
        closeModal(null);
      }
    };

    //Cleanup the event listeners
    const cleanup = () => {
      modalOkBtn.removeEventListener('click', handleOk);
      modalCancelBtn.removeEventListener('click', handleCancel);
      modalClose.removeEventListener('click', handleCancel);
      window.removeEventListener('keydown', handleKeydown)
      window.removeEventListener('click', handleOutsideClick);
    };

    //Attach event listeners
    modalOkBtn.addEventListener('click', handleOk);
    modalCancelBtn.addEventListener('click', handleCancel);
    modalClose.addEventListener('click', handleCancel);
    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('click', handleOutsideClick);
  });
}

//Display custom alert modals function
function showAlert(message) {
  return new Promise((resolve) => {
    const modal = document.getElementById('alertModal');
    const alertMessage = document.getElementById('alertMessage');
    const alertOkBtn = document.getElementById('alertOkBtn');

    alertMessage.textContent = message;
    modal.style.display = 'block';

    const closeModal = (event) => {
      if (event) {
        event.preventDefault();
      }
      modal.style.display = 'none';
      resolve();
      cleanup();
    };
    const handleKeydown = (event) => {
      if (event.key === 'Enter') {
        closeModal(event);
      }
    };

    const cleanup = () => {
      alertOkBtn.removeEventListener('click', closeModal);
      window.removeEventListener('keydown', handleKeydown);
    };

    alertOkBtn.addEventListener('click', closeModal);
    window.addEventListener('keydown', handleKeydown);
  });
}

//Display custom comfirmation modals function
function showConfirm(message) {
  return new Promise((resolve) => {
    const modal = document.getElementById('confirmModal');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmYesBtn = document.getElementById('confirmYesBtn');
    const confirmNoBtn = document.getElementById('confirmNoBtn');

    confirmMessage.textContent = message;
    modal.style.display = 'block';
    confirmYesBtn.focus();

    const closeModal = (result) => {
      modal.style.display = 'none';
      resolve(result);
      cleanup();
    };

    const handleYes = () => closeModal(true);
    const handleNo = () => closeModal(false);

    const handleKeydown = (event) => {
      if (event.key ==='Enter') {
        handleYes();
      }
    };

    const cleanup = () => {
      confirmYesBtn.removeEventListener('click', handleYes);
      confirmNoBtn.removeEventListener('click', handleNo);
      window.removeEventListener('keydown', handleKeydown);
    };

    confirmYesBtn.addEventListener('click', handleYes);
    confirmNoBtn.addEventListener('click', handleNo);
    window.addEventListener('keydown', handleKeydown);
  });
}

// Function to add a new project slot and allow 'empty' project names
async function addProject() {
  const projectName = await showModal('Enter project name:');
  if (projectName === null){
    return;
  }

  const newSlot = { name: projectName || '', status: 'Not in Use', lastStatusChange: 'N/A' }
  slots.push(newSlot);
  renderSlots();
  updateCounts();
  saveSlots(); // Save slots after adding
}


async function editProject(index) {
  const newName = await showModal('Edit project name:', slots[index].name);
  if (newName) {
    slots[index].name = newName;
    renderSlots();
    saveSlots();
  }
}

// Function to clear the project name, status and status changed information from the slot. Name may be confusing, correct naming should be 'clearProject' in the future.
async function deleteProject(index) {
  const confirmed = await showConfirm('Are you sure you want to clear this project slot?');
  if (confirmed) {
    slots[index].name = '';
    slots[index].status = 'Not in use';
    slots[index].statusChanged = 'N/A';
    renderSlots();
    saveSlots();
  }
}

// Function to delete the last project slot
async function deleteLastProject() {
  const confirmed = await showConfirm('Are you sure you want to delete the last project slot? Slot content will also be forever lost!');
  if (confirmed && slots.length > 0) {
    slots.pop();
    renderSlots();
    saveSlots();
  }
}

async function activateLED(index) {
  await showAlert(`LED activated for the slot: ${slots[index].name}`);
}

//Function to handle search input and update displayed projects.
function handleSearch() {
  searchTerm = document.getElementById('search-input').value;
  renderSlots();
}

// Function to toggle the status of a project
async function toggleStatus(index) {
  const slot = slots[index];
  if (!slot.name){
    await showAlert("There is no project at the slot to take!");
    return;
  }
  slot.status = slot.status === 'In use' ? 'Not in use' : 'In use';
  slot.statusChanged = new Date().toLocaleString();  // Update status change time
  renderSlots();
  saveSlots();
}

// Save slots data to a file
function saveSlots() {
  ipcRenderer.send('save-slots', slots);
}

// Load slots data from a file
function loadSlots() {
  ipcRenderer.invoke('load-slots').then((loadedSlots) => {
    if (loadedSlots) {
      slots = loadedSlots;
      renderSlots();
      updateCounts();
    }
  });
}

// Call loadSlots when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  loadSlots();
});

// Function to update the slot counts and display them
function updateCounts() {
  const totalSlots = slots.length;
  const emptySlots = slots.filter(slot => !slot.name).length;
  const inUseSlots = slots.filter(slot => slot.name && slot.status === 'In use').length;
  const notInUseSlots = slots.filter(slot => slot.name && slot.status === 'Not in use').length;

  document.getElementById('total-slots').innerText = totalSlots;
  document.getElementById('empty-slots').innerText = emptySlots;
  document.getElementById('in-use-slots').innerText = inUseSlots;
  document.getElementById('not-in-use-slots').innerText = notInUseSlots;
}

// Event listeners(waits for an event to occur) for add project and search actions
document.getElementById('add-project-btn').addEventListener('click', addProject);
document.getElementById('delete-last-project-btn').addEventListener('click', deleteLastProject);
document.getElementById('search-btn').addEventListener('click', handleSearch);
document.getElementById('search-input').addEventListener('input', handleSearch);

renderSlots();
