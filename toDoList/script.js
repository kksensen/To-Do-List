// --- 1. SELEÇÃO DOS ELEMENTOS DO DOM ---
const addTaskForm = document.getElementById('add-task-form');
const taskTitleInput = document.getElementById('task-title-input');
const taskDescInput = document.getElementById('task-desc-input');
const taskPrioritySelect = document.getElementById('task-priority-select');

const todoList = document.getElementById('todo-list');
const doingList = document.getElementById('doing-list');
const doneList = document.getElementById('done-list');
const columns = document.querySelectorAll('.task-column');

// --- 2. ESTRUTURA DE DADOS ---
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// --- 3. FUNÇÕES ---

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    // Limpa todas as colunas antes de renderizar
    todoList.innerHTML = '';
    doingList.innerHTML = '';
    doneList.innerHTML = '';

    tasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.setAttribute('draggable', 'true');
        taskCard.setAttribute('data-id', task.id);
        
        // Adiciona a classe da prioridade (para a borda inferior)
        taskCard.classList.add(task.priority);

        // Adiciona a classe do status (para a borda lateral)
        taskCard.classList.add(`status-${task.status}`);

         taskCard.innerHTML = `
            <h4 class="task-title">${task.title}</h4>
            <p class="task-description">${task.description}</p>
            <span class="task-priority ${task.priority}">${task.priority}</span>
            <div class="task-actions">
                <button class="action-btn delete-btn">Excluir</button>
            </div>
        `;

        // Coloca o cartão na coluna correta
        if (task.status === 'todo') {
            todoList.appendChild(taskCard);
        } else if (task.status === 'doing') {
            doingList.appendChild(taskCard);
        } else if (task.status === 'done') {
            doneList.appendChild(taskCard);
        }
    });
}

function addTask(title, description, priority) {
    const newTask = {
        id: Date.now(),
        title: title,
        description: description,
        priority: priority,
        status: 'todo'
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
}

// --- 4. LÓGICA DE DRAG AND DROP ---
let draggedTaskId = null;

document.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('task-card')) {
        draggedTaskId = e.target.getAttribute('data-id');
        e.target.classList.add('dragging');
    }
});

document.addEventListener('dragend', (e) => {
    if (e.target.classList.contains('task-card')) {
        e.target.classList.remove('dragging');
    }
});

columns.forEach(column => {
    column.addEventListener('dragover', (e) => {
        e.preventDefault();
        column.classList.add('drag-over');
    });

    column.addEventListener('dragleave', () => {
        column.classList.remove('drag-over');
    });

    column.addEventListener('drop', (e) => {
        e.preventDefault();
        column.classList.remove('drag-over');

        const task = tasks.find(t => t.id == draggedTaskId);
        if (task) {
            const newStatus = column.id.replace('-column', '');
            task.status = newStatus;
            saveTasks();
            renderTasks();
        }
        draggedTaskId = null;
    });
});

// --- 5. EVENT LISTENERS ---

// Adicionar tarefa
addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = taskTitleInput.value.trim();
    const description = taskDescInput.value.trim();
    const priority = taskPrioritySelect.value;
    if (title) {
        addTask(title, description, priority);
        addTaskForm.reset();
    }
});

// Excluir tarefa (usando delegação de eventos)
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const card = e.target.closest('.task-card');
        const taskId = card.getAttribute('data-id');
        
        tasks = tasks.filter(t => t.id != taskId);

        saveTasks();
        renderTasks();
    }
});

// Renderizar tarefas ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
});