import { invoke } from '@tauri-apps/api/core';
import { useEffect, useState } from 'react';
import { TodoItem } from '../utils/interface';

const useTodoList = () => {
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [newTodoTitle, setNewTodoTitle] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [showInput, setShowInput] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const [localShowInput, setLocalShowInput] = useState(false);

    useEffect(() => { loadTodos(); }, []);

    const loadTodos = async() => {
        setIsLoading(true);
        const loadedTodos: TodoItem[] = await invoke('get_todos');
        setTodos(Array.isArray(loadedTodos) ? loadedTodos : []);
        setIsLoading(false);
    };

    const addTodo = async() => {
        if (!newTodoTitle.trim()) return;

        const updateTodos: TodoItem[] = await invoke('add_todo', {
            title: newTodoTitle
        });

        setTodos(Array.isArray(updateTodos) ? updateTodos : []);
        setNewTodoTitle("");
        setShowInput(false);
    }

    const toggleTodo = async(id: string) => {
        const updateTodos: TodoItem[] = await invoke('toggle_todo', { id });
        setTodos(Array.isArray(updateTodos) ? updateTodos : []);
    }

    const deleteTodo = async(id: string) => {
        const updateTodos: TodoItem[] = await invoke('delete_todo', { id });
        setTodos(Array.isArray(updateTodos) ? updateTodos : []);
    }

    const updateTodo = async(id: string, title: string) => {
        const updateTodos: TodoItem[] = await invoke('update_todo', { id, title });
        setTodos(Array.isArray(updateTodos) ? updateTodos : []);
        setEditingId(null);
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') { addTodo(); }
    };

    const handleShowInput = (value: boolean) => {
        setShowInput(value);
    };

    const handleEditStart = (todo: TodoItem) => {
        setEditingId(todo.id);
        setEditValue(todo.title);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditValue(e.target.value);
    };

    const handleEditBlur = (id: string) => {
        if (editValue.trim()) {
            updateTodo(id, editValue);
        }
        setEditingId(null);
    };

    const handleEditKeyPress = (e: React.KeyboardEvent, id: string) => {
        if (editValue.trim()) {
            updateTodo(id, editValue);
        }
        setEditingId(null);

    };

    return {
        todos,
        newTodoTitle,
        isLoading,
        showInput,
        editingId,
        editValue,
        setTodos,
        setNewTodoTitle,
        setIsLoading,
        setShowInput,
        setEditingId,
        loadTodos,
        addTodo,
        toggleTodo,
        deleteTodo,
        updateTodo,
        handleKeyPress,
        handleShowInput,
        handleEditStart,
        handleEditChange,
        handleEditBlur,
        handleEditKeyPress
    };
}

export default useTodoList;