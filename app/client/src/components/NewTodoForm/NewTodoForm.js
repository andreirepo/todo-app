import React, { useState } from 'react';
import { connect } from 'react-redux';
import { addTodoRequest } from '../../common/thunks/thunks';
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
		<div
			className="new-todo-form"
			data-testid="todo-form"
		>
			<div className="new-todo">
				<input
					className="todo-input"
					data-testid="todo-input"
					type="text"
					placeholder="What do you need to do?"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<button onClick={handleCreateTodo} className="new-todo-button" data-testid="create-button" disabled={!inputValue.trim()}>
					<i className="fas fa-plus"></i>
				</button>
			</div>
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
