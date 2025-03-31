import React from 'react';
import TodoList from '../components/TodoList';
import useTodoList from '../hooks/useTodoList';

const TodoPage = () => {
    const todoProps = useTodoList();
    
    return (
        <div className="todo-page">
            <h1>Todo List</h1>
            <TodoList {...todoProps} />
        </div>
    );
};

export default TodoPage;
