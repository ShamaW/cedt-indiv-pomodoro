import React from 'react';
import { TodoListProps } from '../utils/interface';
import '../styles/TodoList.css'
import { Button, Input, Checkbox } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const TodoList = ({
    todos,
    newTodoTitle,
    isLoading,
    showInput = false,
    editingId,
    editValue,
    setNewTodoTitle,
    handleShowInput,
    toggleTodo,
    deleteTodo,
    handleKeyPress,
    handleEditStart,
    handleEditChange,
    handleEditBlur,
    handleEditKeyPress
}: TodoListProps) => {
    return (
        <div className='todo-container'>
            <div>
                {!showInput && (
                    <Button
                        onClick={() => handleShowInput(true)}
                    >
                        <PlusOutlined /> Add Task
                    </Button>
                )}
            </div>

            {showInput && (
                <div >
                    <Input
                        type='text'
                        value={newTodoTitle}
                        onChange={(e) => setNewTodoTitle(e.target.value)}
                        onPressEnter={handleKeyPress}
                        placeholder='Enter task here and press Enter'
                        autoFocus
                        className="todo-input"
                    />
                </div>
            )}

            {isLoading ? (
                <p className="loading-message">Loading tasks...</p>
            ) : (
                <ul className="todo-list">
                    {todos && todos.length > 0 ? todos.map((todo) => (
                        <li
                            key={todo.id}
                            className={`todo-item ${todo.completed ? 'completed' : ''}`}
                        >
                            <div className="todo-content">
                                <Checkbox
                                    checked={todo.completed}
                                    onChange={() => toggleTodo(todo.id)}
                                    className='todo-checkbox'
                                />
                                
                                {editingId === todo.id ? (
                                    <input
                                        type="text"
                                        value={editValue}
                                        placeholder='edit-text'
                                        onChange={handleEditChange}
                                        onBlur={() => handleEditBlur(todo.id)}
                                        onKeyPress={(e) => handleEditKeyPress(e, todo.id)}
                                        className="todo-edit-input"
                                        autoFocus
                                    />
                                ) : (
                                    <span
                                        className="todo-title"
                                        onClick={() => handleEditStart(todo)}
                                    >
                                        {todo.title}
                                    </span>
                                )}
                                
                                <Button
                                    onClick={() => deleteTodo(todo.id)}
                                    className="delete-btn"
                                >
                                    <DeleteOutlined />
                                </Button>
                            </div>
                        </li>
                    )) : (
                        <li className="no-tasks">No tasks available</li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default TodoList;