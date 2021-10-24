import React, { useEffect } from 'react';
import { connect } from 'react-redux';
// import styled from 'styled-components';
import NewTodoForm from '../NewTodoForm/NewTodoForm';
import TodoListItem from '../TodoListItem/TodoListItem';
import {
	loadTodos,
	removeTodoRequest,
	markTodoAsCompletedRequest,
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
	}, []);
	const loadingMessage = <div className="loader" data-testid="spinner">Loading...</div>;
	const content = (
		<div className="list-wrapper">
			<NewTodoForm />
			<h3>Incomplete:</h3>
			{incompletedTodos.map((todo) => (
				<TodoListItem
					todo={todo}
					key={todo._id}
					onRemovePressed={onRemovePressed}
					onCompletedPressed={onCompletedPressed}
				/>
			))}
			<h3>Completed:</h3>
			{completedTodos.map((todo) => (
				<TodoListItem
					todo={todo}
					key={todo._id}
					onRemovePressed={onRemovePressed}
					onCompletedPressed={onCompletedPressed}
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
	startLoadingTodos: () => dispatch(loadTodos()),
	onRemovePressed: (id) => dispatch(removeTodoRequest(id)),
	onCompletedPressed: (id) => dispatch(markTodoAsCompletedRequest(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TodoList);
