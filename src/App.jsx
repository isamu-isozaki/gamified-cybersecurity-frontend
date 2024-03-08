import { Lab } from '@/screens/lab';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import LabSelectContainer from './app/screens/LabSelect';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LabSelectContainer />,
  },
  {
    path: '/:labId',
    element: <Lab />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
