import 'node-fetch';
import fetchMock from 'fetch-mock';
import { expect } from 'chai';
import sinon from 'sinon';
import { loadTodos } from './thunks';

describe('The loadTodos thunk', () => {
	it('Dispatches the correct actions in the success scenario', async () => {
		const fakeDispatch = sinon.spy();
		const fakeTodos = [{ text: '1' }, { text: '2' }];

		fetchMock.get('http://localhost:5000/api/todos', fakeTodos);

		const expectedFirstAction = { type: 'LOAD_TODOS_IN_PROGRESS' };
		const expectedSecondAction = {
			type: 'LOAD_TODOS_SUCCESS',
			payload: {
				todos: fakeTodos,
			},
		};

		await loadTodos()(fakeDispatch);

		expect(fakeDispatch.getCall(0).args[0]).to.deep.eq(expectedFirstAction);
		expect(fakeDispatch.getCall(1).args[0]).to.deep.eq(expectedSecondAction);

		fetchMock.reset();
	});
});
