"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustache = require("mustache"); // Me permite manejar templates de html, evitando que se queme código html en el js
var Properties = /** @class */ (function () {
    function Properties() {
    }
    Properties.getAddTaskButton = function () {
        return document.getElementById('addTask');
    };
    Properties.getInputTaskButton = function () {
        return document.getElementById('inputTask');
    };
    Properties.getTaskListUl = function () {
        return document.getElementById('taskList');
    };
    Properties.getYourTaskBadgeSpam = function () {
        return document.getElementById('yourTaskBadge');
    };
    Properties.getTemplateTaskItem = function () {
        return document.getElementById('template-task-item');
    };
    Properties.getTaskListItems = function () {
        return document.getElementsByClassName('list-group-item');
    };
    Properties.getMarkTaskAsDoneButtons = function () {
        return document.getElementsByClassName('markTaskAsDone');
    };
    Properties.getRemoveTaskButtons = function () {
        return document.getElementsByClassName('removeTask');
    };
    return Properties;
}());
/**
 * Clase con las funciones que le permiten el funcionamiento
 * a una tarea
 *
 * @class Tasks
 */
var Tasks = /** @class */ (function () {
    function Tasks() {
        this._idCount = 0;
        this._tasks = [];
        this._uiInteractor = new Tasks_UIInteraction();
    }
    Tasks.prototype.add = function (task) {
        task.id = ++this._idCount;
        task.done = false;
        this._tasks.push(task);
        this._uiInteractor.add(task);
    };
    return Tasks;
}());
/**
 * Clase con la responsabilidad de administrar todas las interacciones
 * de los usuarios
 *
 * @class Tasks_UIInteraction
 */
var Tasks_UIInteraction = /** @class */ (function () {
    function Tasks_UIInteraction() {
    }
    /**
     * Método que me permite agregar una nueva tarea
     *
     * @param {Task} task Datos de la tarea
     * @memberof Tasks_UIInteraction
     */
    Tasks_UIInteraction.prototype.add = function (task) {
        // Obtengo el código html del template de los items de las tareas
        var template = Properties.getTemplateTaskItem().innerHTML;
        // Le indico a mustache el template en el que vamos a trabajar
        mustache.parse(template);
        // Asigno los valores en los tokens especificados en el template
        var rendered = mustache.render(template, task);
        // Agrego al div taskList el template renderizado
        Properties.getTaskListUl().innerHTML = rendered;
        // Limpio el elemento donde se especifican las tareas
        Properties.getInputTaskButton().value = '';
        // Aumento el numero de tareas nuevas en el contador
        this.addAmountToBadge(1);
        // Obtengo todas la tareas
        var tasks = Properties.getTaskListItems();
        // Obtengo los botones usados para marcar la tarea como realizada
        var markAsDoneButtons = Properties.getMarkTaskAsDoneButtons();
        // Obtengo los botones usados para eliminar tareas
        var removeTaskButtons = Properties.getRemoveTaskButtons();
        // Asigno a los botones los eventos click respectivos
        for (var i = 0; i < markAsDoneButtons.length; i++) {
            var button = markAsDoneButtons[i];
            button.addEventListener('click', this.handleMarkAsDoneClick.bind(this));
        }
        for (var i = 0; i < removeTaskButtons.length; i++) {
            var button = markAsDoneButtons[i];
            button.addEventListener('click', this.handleRemoveTaskClick.bind(this));
        }
    };
    /**
     * Actualiza el numero de tareas pendientes
     *
     * @param {number} amount Cantidad de tareas en las que se va a aumentar o disminuir
     * @memberof Tasks_UIInteraction
     */
    Tasks_UIInteraction.prototype.addAmountToBadge = function (amount) {
        var currentValueTaskBadge = Number(Properties.getYourTaskBadgeSpam().innerHTML);
        Properties.getYourTaskBadgeSpam().innerHTML = (currentValueTaskBadge + amount).toString();
    };
    /**
     * Evento que permite marcar una tarea como realizada
     *
     * @private
     * @param {Event} event
     * @memberof Tasks_UIInteraction
     */
    Tasks_UIInteraction.prototype.handleMarkAsDoneClick = function (event) {
        var target = event.currentTarget;
        var button = target;
        var row = button.parentElement.parentElement;
        if (!row.classList.contains('task-done')) {
            row.classList.add('task-done');
            this.addAmountToBadge(-1);
        }
    };
    /**
     * Evento que permite marcar una tarea como realizada
     *
     * @private
     * @param {Event} event
     * @memberof Tasks_UIInteraction
     */
    Tasks_UIInteraction.prototype.handleRemoveTaskClick = function (event) {
        var target = event.currentTarget;
        var button = target;
        var row = button.parentElement.parentElement;
        if (!row.classList.contains('task-done')) {
            this.addAmountToBadge(-1);
        }
        row.remove();
    };
    return Tasks_UIInteraction;
}());
var tasks = new Tasks();
// El signo de adminración se usa para indicar a intelisense que definitivamente el elemento
// existe para que así pueda indicar los métodos que tiene asociado el getElementById
Properties.getAddTaskButton().addEventListener('click', handleAddTaskClick);
/**
 * Función que permite agregar una tarea a la lista
 *
 */
function handleAddTaskClick() {
    var inputTask = Properties.getInputTaskButton();
    var value = inputTask.value;
    if (value.length == 0) {
        return;
    }
    var task = {
        id: 0,
        description: value,
        done: false
    };
    tasks.add(task);
}
