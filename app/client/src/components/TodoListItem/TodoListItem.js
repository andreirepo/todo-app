import React from 'react';
import './TodoListItem.css';
import Moment from 'react-moment';

const TodoListItem = ({ todo, onRemovePressed, onCompletedPressed, className }) => (
	<div className={`todo-item-container ${className}`}>
		<h3
			className={`${className}-title`}>{todo.text} </h3>
		<p>
			Created at:&nbsp;
			<Moment format="YYYY/MM/DD">{todo.date}</Moment>
		</p>
		<div className="buttons-container">
			{todo.isCompleted ? null : (
				<button
					onClick={() => onCompletedPressed(todo._id)}
					className="completed-button"
				>
					<i className="far fa-check-circle"></i>
				</button>
			)}
			<button
				onClick={() => onRemovePressed(todo._id)}
				className="remove-button"
			>
				<i className="far fa-trash-alt "></i>
			</button>
		</div>
	</div>
);

export default TodoListItem;
