import React from 'react';
import { TodoListProps } from './interface';

const TodoList = ({
    todos,
    newTodoTitle,
    setTodos,
    setNewTodoTitle,
    setIsLoading,
    loadTodos,
    addTodo,
    toggleTodo,
    deleteTodo
}: TodoListProps) => {
    return(
        <div>
            <p>Task</p>
            <div>
                <input
                    type='text'
                    value={newTodoTitle}
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                    placeholder='Todo Task here'
                />
            </div>
        </div>
    );
    
}

export default TodoList;