import { useState } from 'react';

function App(): JSX.Element {
  const [count, setCount] = useState<number>(0);

  return (
    <>
      <h1>Vite + React</h1>

      <div className="card">
        <button
          type="button"
          onClick={() => setCount((prevCount) => prevCount + 1)}
        >
          <span>count is </span>
          {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </>
  );
}

export default App;
