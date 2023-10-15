import { assign, createMachine } from 'xstate';

export const CountingStates = {
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT',
  STOP: 'STOP',
  TOGGLE: 'TOGGLE',
} as const;

export const countingMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QGMD2BXAdgFzAJwDoBhDHAS0ygGIBJAOSICUBRAWWboBUBtABgF1EoAA6pYZbGVSYhIAB6IALIoIBmAOy8AHOoCMATgBsh-QCZFh0wFYANCACeiXeqsFlvI1v0bdqq-4BfALs0LFxCEjCKagARZiY2Dh4BWVFxSWlZBQRFUztHBC1dAl0irUNeFy9VRW8gkNJw4kboqk4AeQBxToAZZj5BJBA0iSkZIeyDUzdDHUUray8vdXzEUwq1fStFdQ1FUt5DK3qQUJx8AgAFAEN0WEg2rt7+lKGRjPHQSbMZuYWrJb6FYONa6Yq6ea8KyHEyGRSqcxBYIgTCoCBwWRncKpMSjTITRAAWkMqwQhNc+kpVOp1NUJyxF0i5EoOPSYyyiCshgI+m0Wisul4vi0pnKthBCFM6hUml4lT0uisqlUhmc9MaFxud0grLxn3kiFUioIAq55l5ii0qm8pKl6gIpjlHmUvmc8KRASAA */
  tsTypes: {} as import('./counterMachine.typegen').Typegen0,
  id: 'counter',
  initial: 'Counting',
  context: {
    count: 0,
  },
  states: {
    Counting: {
      on: {
        [CountingStates.INCREMENT]: {
          actions: assign({ count: (c) => c.count + 1 }),
        },
        [CountingStates.DECREMENT]: {
          actions: assign({ count: (c) => c.count - 1 }),
        },
        [CountingStates.TOGGLE]: {
          target: 'Paused',
          actions: assign({ count: (c) => 0 }),
        },
      },
    },
    Paused: {
      invoke: {
        id: 'countingInterval',
        src: (_) => (cb) => {
          const interval = setInterval(() => {
            cb(CountingStates.INCREMENT);
          }, 1000);

          return () => {
            clearInterval(interval);
          };
        },
        onDone: {
          target: 'Counting',
        },
      },
      on: {
        [CountingStates.TOGGLE]: 'Counting',
      },
    },
  },
});
