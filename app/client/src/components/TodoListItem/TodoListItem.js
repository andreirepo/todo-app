import React, { useState } from 'react';
import Moment from 'react-moment';
import './TodoListItem.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TodoListItem = ({ todo, onRemovePressed, onCompletedPressed, className }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

	const handleRemove = async () => {
		setIsDeleting(true);
		try {
			await onRemovePressed(todo._id);
			toast.success('Todo deleted successfully!');
		} catch (error) {
			toast.error('Failed to delete todo');
		} finally {
			setIsDeleting(false);
		}
	};
	
	const handleComplete = async () => {
		setIsCompleting(true);
		try {
			await onCompletedPressed(todo._id);
			toast.success('Todo marked as completed!');
		} catch (error) {
			toast.error('Failed to complete todo');
		} finally {
			setIsCompleting(false);
		}
	};

    return (
        <div className={`todo-item-container ${className}`} data-id="todo-item-container">
            <div className="todo-content-wrapper">
                <h3 className={`${className}-title todo-text`} data-id="todo-item-text">{todo.text}</h3>
                <p className="todo-date">{'Created at: '}<Moment format="YYYY/MM/DD">{todo.date}</Moment></p>
            </div>
            <div className="buttons-container">
                {todo.isCompleted ? null : (
                    <button
                        onClick={handleComplete}
                        className="completed-button"
                        data-id="todo-item-checkbox"
                        disabled={isCompleting}
                    >
                        {isCompleting ? (
                            <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                            <i className="far fa-check-circle"></i>
                        )}
                    </button>
                )}
                <button
                    onClick={handleRemove}
                    className="remove-button"
                    data-id="todo-item-delete"
                    disabled={isDeleting}
                >
                    {isDeleting ? (
                        <i className="fas fa-spinner fa-spin"></i>
                    ) : (
                        <i className="far fa-trash-alt"></i>
                    )}
                </button>
            </div>
        </div>
    );
};

export default TodoListItem;
