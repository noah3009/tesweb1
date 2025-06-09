document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty-image');
    const todosContainer = document.querySelector('.todos-container');
    const progressBar = document.getElementById('progress');
    const progressNumbers = document.getElementById('numbers');
    
    const toggleEmptyState = () => {
        emptyImage.style.display = taskList.children.length === 0 ? 'block' : 'none';
        todosContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
    };

    const updateProgress = () => {
        const totalTasks = taskList.children.length;
        const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;
        
        progressBar.style.width = totalTasks ? `${(completedTasks / totalTasks) * 100}%` : '0%';
        progressNumbers.textContent = `${completedTasks} / ${totalTasks}`;
    };
    
    const saveTasksToLocalStorage = () => {
        const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
            text: li.querySelector('span').textContent,
            completed: li.querySelector('.checkbox').checked
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };
    
    const loadTasksFromLocalStorage = () => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(task => {
            addTask(task.text, task.completed);
        });
        toggleEmptyState();
        updateProgress();
    };

    const addTask = (text, completed = false) => {
        const taskText = text || taskInput.value.trim();
        if (!taskText) return;
        
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}>
            <span>${taskText}</span>
            <div class="task-buttons">
                <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>  
        `; 
        
        const checkbox = li.querySelector('.checkbox');
        const editBtn = li.querySelector('.edit-btn');
        const deleteBtn = li.querySelector('.delete-btn');
        const taskSpan = li.querySelector('span');

        if (completed) {
            li.classList.add('completed');
            editBtn.disabled = true;
            editBtn.style.opacity = '0.5';
            editBtn.style.pointerEvents = 'none';
        }
        
        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;
            li.classList.toggle('completed', isChecked);
            
            editBtn.disabled = isChecked;
            editBtn.style.opacity = isChecked ? '0.5' : '1';
            editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';
            
            updateProgress();
            saveTasksToLocalStorage();
        });
        
        editBtn.addEventListener('click', () => {
            if (!checkbox.checked) {
                const newText = prompt('Edit tugas:', taskSpan.textContent);
                if (newText !== null && newText.trim() !== '') {
                    taskSpan.textContent = newText.trim();
                    saveTasksToLocalStorage();
                }
            }
        });

        deleteBtn.addEventListener('click', () => {
            li.style.animation = 'fadeOut 0.3s forwards';
            setTimeout(() => {
                li.remove();
                toggleEmptyState();
                updateProgress();
                saveTasksToLocalStorage();
            }, 300);
        });
        
        taskList.appendChild(li);
        
        // Hanya reset input jika menambahkan task baru (bukan dari localStorage)
        if (!text) {
            taskInput.value = '';
        }
        
        toggleEmptyState();
        updateProgress();
        saveTasksToLocalStorage();
    };

    addTaskBtn.addEventListener('click', () => addTask());
    
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });

    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeOut {
            to { 
                opacity: 0; 
                transform: translateY(-20px); 
                height: 0;
                padding: 0;
                margin: 0;
                border: none;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Muat tugas dari localStorage saat halaman dimuat
    loadTasksFromLocalStorage();
});