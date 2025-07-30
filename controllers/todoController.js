import Todo from "../models/Todo.js";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createTodo(req, res) {
    const { todo } = req.body;
    const newTodo = new Todo({ todo });
    await newTodo.save();
    res.redirect('/todos');
}

export async function updateTodo(req, res) {
    const { todo } = req.body;
    await Todo.findByIdAndUpdate(req.params.id, { todo });
    res.redirect('/todos');
}

export async function editTodoPage(req, res) {
    const todo = await Todo.findById(req.params.id);
    res.render('edit-todo.ejs', { todo });
}

export async function deleteTodo(req, res) {
    await Todo.findByIdAndDelete(req.params.id);
    res.redirect('/todos');
}

export function addTodoPage(req, res) {
    res.sendFile(path.join(__dirname, '..', 'views', 'add-todo.html'));
}

export async function viewTodos(req, res) {
    const todos = await Todo.find();
    res.render('todos.ejs', { todos });
}