import React from 'react';
import Moment from 'react-moment';
import './TodoListItem.css';

const TodoListItem = ({ todo, onRemovePressed, onCompletedPressed, className }) => (
	<div className={`todo-item-container ${className}`}>
		<h3
			className={`${className}-title todo-text`}>{todo.text} </h3>
		<p>{'Created at: '}<Moment format="YYYY/MM/DD">{todo.date}</Moment>
		</p>
		<div className="buttons-container">
			{todo.isCompleted ? null : (
				<button
					onClick={() => onCompletedPressed(todo._id)}
					className="completed-button"
					data-testid="complete-button"
				>
					<i className="far fa-check-circle"></i>
				</button>
			)}
			<button
				onClick={() => onRemovePressed(todo._id)}
				className="remove-button"
				data-testid="remove-button"
			>
				<i className="far fa-trash-alt "></i>
			</button>
		</div>
	</div>
);

export default TodoListItem;
