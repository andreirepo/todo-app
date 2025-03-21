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
        <div className={`todo-item-container ${className}`}>
            <h3
                className={`${className}-title todo-text`}>{todo.text} </h3>
            <p>{'Created at: '}<Moment format="YYYY/MM/DD">{todo.date}</Moment>
            </p>
            <div className="buttons-container">
                {todo.isCompleted ? null : (
                    <button
                        onClick={handleComplete}
                        className="completed-button"
                        data-testid="complete-button"
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
                    data-testid="remove-button"
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
