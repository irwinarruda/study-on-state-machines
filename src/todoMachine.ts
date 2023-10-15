import { UUID } from 'crypto';
import { createMachine } from 'xstate';
import { uuidv4 } from '~/uuidv4';

class Todo {
  public id: UUID;
  constructor(public description: string, public completed: boolean) {
    this.id = uuidv4();
  }
}

const todos = [
  new Todo('Buy milk', false),
  new Todo('Buy eggs', false),
  new Todo('Buy bread', true),
  new Todo('Buy candy', false),
  new Todo('Buy chips', true),
  new Todo('Buy salsa', false),
  new Todo('Buy cheese', false),
  new Todo('Buy crackers', false),
  new Todo('Buy soda', true),
];

async function fetchTodos() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const random = Math.random();
  if (random > 0.8) throw 'Falha ao carregar todos';
  return todos;
}

async function fetchTodo(id: UUID) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const random = Math.random();
  if (random > 0.8) throw 'Falha ao carregar todo';
  return todos.find((todo) => todo.id === id)!;
}

export type TodoMachineContext = {
  todos: Todo[];
  selectedTodoId: UUID | undefined;
  selectedTodo: Todo | undefined;
  errorMessage: string | undefined;
};

export type TodoMachineEvents =
  | {
      type: 'FETCH';
    }
  | {
      type: 'RETRY';
    }
  | {
      type: 'SELECT';
      data: UUID;
    }
  | {
      type: 'UNSELECT';
    }
  | {
      type: 'SET_COMPLETE';
      data: {
        id: UUID;
        checked: boolean;
      };
    };

export type TodoMachineServices = {
  getTodos: { data: Todo[] };
  getTodo: { data: Todo };
};

export const todoMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QBcD2FUFkCGBjAFgJYB2YAdAO7aHIlQAq6qsAxAGICi9AwgBIDaABgC6iUAAdmNQqmJiQAD0QBGAJwBmMoICsAFgBsADn3r1h7aoBMl-QBoQAT0SGzZAOwvBg1css63NgC+gfZoGDgEJOQANqjYEHSMGKwYpGQkAG6oANbkMMhJzEKiSCCSsNKy8koI2pb2Tgj6qoZk2uqWph5u7W4+waFMEURpsfGJTKxgAE7TqNNk4tHYyABm8wC2ZPmFsMXy5ZVypTV1DSqWboJkli4uLTaqgsoDIGFYeCN5YAWTLADKXAA+twAPKYAAKABkuBx9qVDrQqidELc3Dc-Opnqp2roPDjzghDMoyMpieZycoDPpLNpXu9hlFtj9diwAEpcNkATXhEikSOOoBq+gMpN0gn0AW8+KMhLq2jI4r6Rj0T30LxCbyGnyZO0mlGotGIDCYAI4MO49F5ZX5MkFilRFjIxKegj6ul05mecssukVOnU2mMxLMOPp2siaT1yTIYwSxsKLFS5EyOXIDJ1UZZ+rjEwwCFTuBWduK1sRduqjtUzrUXndnu03sciFMrUMLvUHhpFl0l3D4Uz31+MdzCdNMzmCyWK3W0y2GcjQ92sbi8ZN+cLxdkpZEB1tyKFiBF+jFEqlqhlhkJunUfqp6n0RiMhj8ym0+n7H0XzOHzB-icBC0rV3BF93tGpaWrF061UD0vWUa8sTFGkPG0NDDACQxP0ZLNf1gf9TQAVQAOUAjhLTLMDKwQSCa1det4MJX0-RpW5BAwsxlDcT0sM1BcvjICd5nZTkeRAvkKgFaiaUJXxLBJQRTF7D03E7B83GCTViHQOB5H4qI90kisUQQABaOxmzMhVVBs2y7Ls9RsMHA1pDHZJDKOaje0JO4yEfOCPB0QxvCc79R3XZgPKkkyehPNDVICLjdG0DwEMs5oT3YkwNDJTsz1CgTo0i0CjIPB1alUWSUsVcVVBpYKRVvRy+IjQrsxjKhXIiqLjMPBBlDdOVRT6XxlElAb2N0ArdXav9wsKHqypqXQyWdFLJUMZL9D0fzEJJZo3CuQNgvUNQUum3DlyKxbwIuBVdB8biGrgwR6ksy50XbHQ-EUh9Hgu8ghOmG7qPkk8Hu2m9YJfFSr0suTrh8B7PTdAxb00wIgA */
    tsTypes: {} as import('./todoMachine.typegen').Typegen0,
    schema: {
      context: {} as TodoMachineContext,
      events: {} as TodoMachineEvents,
      services: {} as TodoMachineServices,
    },
    context: {
      todos: [],
      selectedTodoId: undefined,
      selectedTodo: undefined,
      errorMessage: undefined,
    },
    id: 'todoMachine',
    initial: 'waitingTodos',
    states: {
      waitingTodos: {
        on: {
          FETCH: 'loadingTodos',
        },
      },
      loadingTodos: {
        invoke: {
          id: 'getTodos',
          src: 'getTodos',
          onDone: {
            target: 'getTodos',
            actions: 'saveTodos',
          },
          onError: {
            target: 'error',
            actions: 'setError',
          },
        },
      },
      getTodos: {
        initial: 'waitingTodo',
        states: {
          waitingTodo: {
            on: {
              SELECT: {
                target: 'loadingTodo',
                actions: 'selectTodo',
              },
            },
          },
          loadingTodo: {
            invoke: {
              src: 'getTodo',
              onDone: {
                target: 'getTodo',
                actions: 'saveTodo',
              },
              onError: {
                target: '#todoMachine.error',
                actions: 'setError',
              },
            },
          },
          getTodo: {
            on: {
              SELECT: {
                target: 'loadingTodo',
                actions: 'selectTodo',
              },
              UNSELECT: {
                target: '#todoMachine.getTodos',
                actions: 'unselectTodo',
              },
            },
          },
        },
        on: {
          SET_COMPLETE: {
            actions: 'setCompleted',
          },
          RETRY: 'loadingTodos',
        },
      },
      error: {
        on: {
          RETRY: 'loadingTodos',
        },
      },
    },
  },
  {
    services: {
      getTodos: async () => await fetchTodos(),
      getTodo: async (context) => await fetchTodo(context.selectedTodoId!),
    },
    actions: {
      setCompleted: (context, event) => {
        context.todos = context.todos.map((todo) => {
          if (todo.id === event.data.id) {
            todo.completed = event.data.checked;
          }
          return todo;
        });
      },
      selectTodo: (context, event) => {
        context.selectedTodoId = event.data;
      },
      unselectTodo: (context) => {
        context.selectedTodoId = undefined;
      },
      saveTodos: (context, event) => {
        context.todos = event.data;
      },
      saveTodo: (context, event) => {
        context.selectedTodo = event.data;
      },
      setError: (context, event) => {
        context.errorMessage = event.data as string;
        context.selectedTodo = undefined;
        context.selectedTodoId = undefined;
      },
    },
  },
);
