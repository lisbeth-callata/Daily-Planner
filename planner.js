let currentProgress = 0;

// ===== FUNCIONES PRINCIPALES ===== //

function updateDate() {
  const dateBox = document.getElementById('current-date');
  const today = new Date();
  const optionsDay = { weekday: 'long' };
  const optionsMonth = { month: 'long' };
  
  const dayName = today.toLocaleDateString('es-ES', optionsDay);
  const dayNumber = today.getDate();
  const monthName = today.toLocaleDateString('es-ES', optionsMonth);

  dateBox.innerHTML = `
    <div class="day">${dayName.split(',')[0]}</div>
    <div class="number">${dayNumber}</div>
    <div class="month">${monthName}</div>
  `;
}

// Actualizar barra de progreso
function updateProgressBar() {
  const tasks = document.querySelectorAll('.task-item');
  const totalTasks = tasks.length;
  const completedTasks = document.querySelectorAll('.task-item input:checked').length;
  currentProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  document.getElementById('progress').style.width = `${currentProgress}%`;
  document.getElementById('progress-text').textContent = `${Math.round(currentProgress)}% completado`;
}

// Cambiar entre pantallas
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.add('hidden');
  });
  document.getElementById(screenId).classList.remove('hidden');
}

// ===== MANEJADORES DE EVENTOS ===== //

// Botones de ventana (minimizar/cerrar)
document.getElementById('minimize-button').addEventListener('click', () => {
  window.electronAPI.minimize();
});

document.getElementById('close-button').addEventListener('click', () => {
  window.electronAPI.close();
});

// Añadir nueva tarea
document.getElementById('add-task').addEventListener('click', addNewTask);

// Permitir "Enter" para añadir tarea
document.getElementById('new-task').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addNewTask();
});

// Función para añadir tarea
function addNewTask() {
  const taskInput = document.getElementById('new-task');
  const taskText = taskInput.value.trim();

  if (taskText) {
    const taskList = document.getElementById('task-list');
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    taskItem.innerHTML = `
      <input type="checkbox">
      <span class="task-text">${taskText}</span>
      <button class="delete-task"><i class="fas fa-trash-alt"></i></button>
    `;
    taskList.appendChild(taskItem);
    taskInput.value = '';

    // Evento para checkbox (actualizar progreso)
    const checkbox = taskItem.querySelector('input');
    checkbox.addEventListener('change', updateProgressBar);

    // Evento para eliminar tarea
    const deleteBtn = taskItem.querySelector('.delete-task');
    deleteBtn.addEventListener('click', () => {
      taskItem.remove();
      updateProgressBar();
    });
  }
}

// Navegación entre pantallas
document.getElementById('start-button').addEventListener('click', () => {
  showScreen('planner-screen');
});

document.getElementById('finish-button').addEventListener('click', () => {
  document.getElementById('progress-percentage').textContent = `${Math.round(currentProgress)}%`;
  showScreen('finish-screen');
});

document.getElementById('return-button').addEventListener('click', () => {
  showScreen('welcome-screen');
  document.getElementById('task-list').innerHTML = ''; // Limpiar tareas al regresar
  currentProgress = 0;
  updateProgressBar();
});

// ===== INICIALIZACIÓN ===== //
updateDate();
showScreen('welcome-screen'); // Pantalla de bienvenida al inicio