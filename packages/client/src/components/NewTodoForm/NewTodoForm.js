import React, { useState } from 'react';
import { connect } from 'react-redux';
import { addTodoRequest } from '../../common/thunks/thunks';
import { bindActionCreators } from 'redux';
import { getTodos } from '../../common/selectors/selectors';

import './NewTodoForm.css';

const NewTodoForm = (props) => {
	const [inputValue, setInputValue] = useState('');

	const { todos, onCreatePressed } = props;
	const handleKeyDown = (event) => {
		if (event.key === 'Enter') {
			handleCreateTodo();
		}
	};
	const handleCreateTodo = () => {
		todos && todos.some((todo) => todo.text === inputValue && todo.text === '')
			? null
			: onCreatePressed(inputValue);
		setInputValue('');
	};

	return (
		<div className="new-todo-form">
			<h2>Welcome!</h2>
			<p>To get started, add some items to your list:</p>
			<input
				className="new-todo-input"
				type="text"
				placeholder="What would you like to do?"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyDown={handleKeyDown}
			/>
			<button onClick={handleCreateTodo} className="new-todo-button">
				<i className="fas fa-plus"></i>
			</button>
		</div>
	);
};

const mapStateToProps = (state) => ({
	todos: getTodos(state),
});

const mapDispatchToProps = (dispatch) => ({
	onCreatePressed: (todo) => dispatch(addTodoRequest(todo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewTodoForm);
