import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import NewTodoForm from '../NewTodoForm/NewTodoForm';
import TodoListItem from '../TodoListItem/TodoListItem';
import {
	fetchTodos,
	removeTodoRequest,
	markTodoAsCompletedRequest
	} from '../../common/thunks/thunks';
import {
	getTodosLoading,
	getCompletedTodos,
	getIncompleteTodos,
} from '../../common/selectors/selectors';
import './TodoList.css';


const TodoList = ({
	completedTodos,
	incompletedTodos,
	onRemovePressed,
	onCompletedPressed,
	isLoading,
	startLoadingTodos,
}) => {
	useEffect(() => {
		startLoadingTodos();
	}, [startLoadingTodos]);

	const loadingMessage = <div className="loader" data-id="spinner">Loading...</div>;
	
	// Safe sort function that handles missing createdAt
	const safeSort = (a, b) => {
		if (!a.createdAt && !b.createdAt) return 0;
		if (!a.createdAt) return 1;
		if (!b.createdAt) return -1;
		return new Date(b.createdAt) - new Date(a.createdAt);
	};
	
	const content = (
		<div className="list-wrapper" data-id="todo-list-container">
			<NewTodoForm />
			{incompletedTodos.length === 0 && completedTodos.length === 0 && (
				<div className="no-todos">
					<p className="no-todos-text">No todos yet</p>
					<p className="no-todos-subtitle">Create your first todo above</p>
				</div>
			)}
			{incompletedTodos.length > 0 && <h2>Pending Tasks</h2>}
			{incompletedTodos.slice().sort(safeSort).map((todo) => (
				<TodoListItem
					todo={todo}
					key={todo._id}
					onRemovePressed={onRemovePressed}
					onCompletedPressed={onCompletedPressed}
				/>
			))}
			{completedTodos.length > 0 && <h2>Completed Tasks</h2>}
			{completedTodos.slice().sort(safeSort).map((todo) => (
				<TodoListItem
					todo={todo}
					key={todo._id}
					onRemovePressed={onRemovePressed}
					onCompletedPressed={onCompletedPressed}
					className="completed"
				/>
			))}
		</div>
	);
	return isLoading ? loadingMessage : content;
};

const mapStateToProps = (state) => ({
	isLoading: getTodosLoading(state),
	completedTodos: getCompletedTodos(state),
	incompletedTodos: getIncompleteTodos(state),
});

const mapDispatchToProps = (dispatch) => ({
	startLoadingTodos: () => dispatch(fetchTodos()),
	onRemovePressed: (id) => dispatch(removeTodoRequest(id)),
	onCompletedPressed: (id) => dispatch(markTodoAsCompletedRequest(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TodoList);