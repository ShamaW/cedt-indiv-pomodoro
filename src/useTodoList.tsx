import { useState, useEffect } from 'react';
import { TodoItem } from './interface';
import { invoke } from '@tauri-apps/api/core';

const useTodoList = () => {
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [newTodoTitle, setNewTodoTitle] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => { loadTodos(); }, []);

    const loadTodos = async() => {
        setIsLoading(true);
        const loadedTodos: TodoItem[] = await invoke('get_todos');
        setTodos(loadedTodos);
        setIsLoading(false);
    };

    const addTodo = async() => {
        if (!newTodoTitle.trim()) return;

        const updateTodos: TodoItem[] = await invoke('add_todo', {
            title: newTodoTitle
        });

        setTodos(updateTodos);
        setNewTodoTitle("");
    }

    const toggleTodo = async(id: string) => {
        const updateTodos: TodoItem[] = await invoke('toggle_todo', { id });
        setTodos(updateTodos);
    }

    const deleteTodo = async(id: string) => {
        const updateTodos: TodoItem[] = await invoke('delete_todo', { id });
        setTodos(updateTodos);
    }

    return {todos, newTodoTitle, isLoading, setTodos, setNewTodoTitle, setIsLoading, loadTodos, addTodo, toggleTodo, deleteTodo};
}

export default useTodoList;