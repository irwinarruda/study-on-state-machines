'use client';

import { useMachine } from '@xstate/react';
import { todoMachine } from '~/todoMachine';

export default function Home() {
  const [current, send] = useMachine(todoMachine);
  console.log('c', current.context.todos);
  console.log('v', current.value);
  const states = current.context;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {current.matches('waitingTodos') && (
        <button onClick={() => send('FETCH')}>Start</button>
      )}
      {current.matches('loadingTodos') && <span>Loading...</span>}
      {current.matches('getTodos') && (
        <div>
          <span>
            Success! <button onClick={() => send('RETRY')}>Retry</button>
          </span>
          <ul>
            {states.todos.map((todo) => (
              <li
                key={todo.id}
                style={{
                  color: states.selectedTodoId === todo.id ? 'green' : 'black',
                }}
              >
                {states.selectedTodoId !== todo.id && (
                  <button onClick={() => send('SELECT', { data: todo.id })}>
                    Select
                  </button>
                )}
                {states.selectedTodoId === todo.id && (
                  <button onClick={() => send('UNSELECT')}>Unselect</button>
                )}
                {todo.description}{' '}
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={(e) =>
                    send('SET_COMPLETE', {
                      data: { checked: e.currentTarget.checked, id: todo.id },
                    })
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      {current.matches('error') && (
        <div>
          <span>
            Error! <button onClick={() => send('RETRY')}>Retry</button>
          </span>
          <pre style={{ color: 'red' }}>{states.errorMessage}</pre>
        </div>
      )}
      {current.matches('getTodos.loadingTodo') && (
        <div>
          <span>Waiting todo...</span>
        </div>
      )}
      {current.matches('getTodos.getTodo') && (
        <div>
          <p>{states.selectedTodo!.id}</p>
          <p>{states.selectedTodo!.description}</p>
          <p>{states.selectedTodo!.completed ? 'Sim' : 'Não'}</p>
        </div>
      )}
    </main>
  );
}
