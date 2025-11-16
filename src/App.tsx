import { BrowserRouter } from 'react-router-dom';
import AppRouter from '@router/AppRouter';

function App() {
  return (
    <BrowserRouter>
      {/* You could add layout components like Header/Footer here */}
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
