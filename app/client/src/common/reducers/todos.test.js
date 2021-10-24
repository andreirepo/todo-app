import { expect } from 'chai';
import { todos } from './todos';

describe('The todos reducer', () => {
	it('Add a new todo when CREATE_TODO action is received', () => {
		const fakeTodo = { text: 'hello', isCompleted: false };
		const fakeAction = {
			type: 'CREATE_TODO',
			payload: { todo: fakeTodo },
		};
		const originalState = { isLoading: false, data: [] };
		const expected = {
			isLoading: false,
			data: [fakeTodo],
		};
		const actual = todos(originalState, fakeAction);

		expect(actual).to.deep.eq(expected);
	});
});
