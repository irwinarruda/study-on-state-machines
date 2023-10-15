'use client';

import { useMachine } from '@xstate/react';
import { CountingStates, countingMachine } from '~/counterMachine';

export default function Home() {
  const [state, send] = useMachine(countingMachine);
  console.log('c', state.context.count);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button onClick={() => send(CountingStates.DECREMENT)}>Decrement</button>
      <span>{state.context.count}</span>
      <button onClick={() => send(CountingStates.INCREMENT)}>Increment</button>
      <button onClick={() => send(CountingStates.TOGGLE)}>
        {state.matches('Paused') ? 'Voltar' : 'Pausar'}
      </button>
    </main>
  );
}
