import * as mustache from 'mustache'; // Me permite manejar templates de html, evitando que se queme código html en el js

/**
 * Interfaz que identifica una tarea
 *
 * @interface Task
 */
interface Task {
    id: number,
    description: string,
    done: boolean
}

class Properties {
    public static getAddTaskButton(){
        return document.getElementById('addTask');
    }

    public static getInputTaskButton(){
        return document.getElementById('inputTask');
    }

    public static getTaskListUl(){
        return document.getElementById('taskList');
    }

    public static getYourTaskBadgeSpam(){
        return document.getElementById('yourTaskBadge');
    }

    public static getTemplateTaskItem(){
        return document.getElementById('template-task-item');
    }

    public static getTaskListItems(){
        return document.getElementsByClassName('list-group-item');
    }

    public static getMarkTaskAsDoneButtons(){
        return document.getElementsByClassName('markTaskAsDone');
    }

    public static getRemoveTaskButtons(){
        return document.getElementsByClassName('removeTask');
    }
}

/**
 * Clase con las funciones que le permiten el funcionamiento
 * a una tarea
 *
 * @class Tasks
 */
class Tasks {
    private _idCount: number = 0;
    private _tasks: Array<Task> = [];
    private _uiInteractor = new Tasks_UIInteraction();

    public add(task: Task){
        task.id = ++this._idCount;
        task.done = false;

        this._tasks.push(task);
        this._uiInteractor.add(task);
    }
}

/**
 * Clase con la responsabilidad de administrar todas las interacciones
 * de los usuarios
 *
 * @class Tasks_UIInteraction
 */
class Tasks_UIInteraction {
    /**
     * Método que me permite agregar una nueva tarea
     *
     * @param {Task} task Datos de la tarea
     * @memberof Tasks_UIInteraction
     */
    public add(task: Task) {
        // Obtengo el código html del template de los items de las tareas
        let template: string = Properties.getTemplateTaskItem()!.innerHTML;
        // Le indico a mustache el template en el que vamos a trabajar
        mustache.parse(template);
        // Asigno los valores en los tokens especificados en el template
        let rendered: string = mustache.render(template, task);
        // Agrego al div taskList el template renderizado
        Properties.getTaskListUl()!.innerHTML = rendered;
        // Limpio el elemento donde se especifican las tareas
        (<HTMLInputElement>Properties.getInputTaskButton()!).value = '';

        // Aumento el numero de tareas nuevas en el contador
        this.addAmountToBadge(1);

        // Obtengo todas la tareas
        let tasks = Properties.getTaskListItems();
        // Obtengo los botones usados para marcar la tarea como realizada
        let markAsDoneButtons = Properties.getMarkTaskAsDoneButtons();
        // Obtengo los botones usados para eliminar tareas
        let removeTaskButtons = Properties.getRemoveTaskButtons();
        // Asigno a los botones los eventos click respectivos
        for (let i = 0; i < markAsDoneButtons.length; i++) {
            const button = markAsDoneButtons[i];
            button.addEventListener('click', this.handleMarkAsDoneClick.bind(this));
        }

        for (let i = 0; i < removeTaskButtons.length; i++) {
            const button = markAsDoneButtons[i];
            button.addEventListener('click', this.handleRemoveTaskClick.bind(this));
        }
    }

    /**
     * Actualiza el numero de tareas pendientes
     *
     * @param {number} amount Cantidad de tareas en las que se va a aumentar o disminuir
     * @memberof Tasks_UIInteraction
     */
    public addAmountToBadge(amount: number) {
        let currentValueTaskBadge = Number(Properties.getYourTaskBadgeSpam()!.innerHTML);
        Properties.getYourTaskBadgeSpam()!.innerHTML = (currentValueTaskBadge + amount).toString();
    }
    
    /**
     * Evento que permite marcar una tarea como realizada
     *
     * @private
     * @param {Event} event
     * @memberof Tasks_UIInteraction
     */
    private handleMarkAsDoneClick(event: Event) {
        let target = event.currentTarget;
        let button = <HTMLButtonElement>target;
        let row = button.parentElement!.parentElement!;
        
        if (!row.classList.contains('task-done')) {
            row.classList.add('task-done');
            this.addAmountToBadge(-1);
        }
    }

    /**
     * Evento que permite marcar una tarea como realizada
     *
     * @private
     * @param {Event} event
     * @memberof Tasks_UIInteraction
     */
    private handleRemoveTaskClick(event: Event) {
        let target = event.currentTarget;
        let button = <HTMLButtonElement>target;
        let row = button.parentElement!.parentElement!;
        
        if (!row.classList.contains('task-done')) {
            this.addAmountToBadge(-1);
        }

        row.remove();
    }
}

let tasks = new Tasks();

// El signo de adminración se usa para indicar a intelisense que definitivamente el elemento
// existe para que así pueda indicar los métodos que tiene asociado el getElementById
Properties.getAddTaskButton()!.addEventListener('click', handleAddTaskClick);

/**
 * Función que permite agregar una tarea a la lista
 *
 */
function handleAddTaskClick() {
    let inputTask: HTMLInputElement = <HTMLInputElement>Properties.getInputTaskButton();
    let value = inputTask.value;
    if(value.length == 0){
        return
    }

    let task: Task = {
        id: 0,
        description: value,
        done: false
    };

    tasks.add(task);
}