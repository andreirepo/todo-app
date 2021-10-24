import {
	loadTodosInProgress,
	loadTodosSuccess,
	loadTodosFailure,
	createTodo,
	removeTodo,
	markTodoAsCompleted,
} from '../actions';

export const loadTodos = () => async (dispatch) => {
	try {
		dispatch(loadTodosInProgress());
		const response = await fetch('http://localhost:5000/api/todos');
		const todos = await response.json();

		dispatch(loadTodosSuccess(todos));
	} catch (err) {
		dispatch(loadTodosFailure());
		dispatch(displayAlert(err));
	}
};

export const addTodoRequest = (text) => async (dispatch) => {
	try {
		const body = JSON.stringify({ text });
		const response = await fetch('http://localhost:5000/api/todos', {
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'post',
			body,
		});
		const todo = await response.json();
		dispatch(createTodo(todo));
	} catch (err) {
		dispatch(displayAlert(err));
	}
};

export const removeTodoRequest = (id) => async (dispatch) => {
	try {
		const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
			method: 'delete',
		});
		const removedTodo = await response.json();
		dispatch(removeTodo(removedTodo));
	} catch (err) {
		dispatch(displayAlert(err));
	}
};

export const markTodoAsCompletedRequest = (id) => async (dispatch) => {
	try {
		const response = await fetch(
			`http://localhost:5000/api/todos/${id}/completed`,
			{
				method: 'post',
			}
		);
		const updatedTodo = await response.json();
		dispatch(markTodoAsCompleted(updatedTodo));
	} catch (err) {
		dispatch(displayAlert(err));
	}
};

export const displayAlert = (text) => () => {
	alert(text);
};
