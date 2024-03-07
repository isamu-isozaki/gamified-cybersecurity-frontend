import React from "react";
import Console from "./app/screens/console";
import LabSelectContainer from "./app/screens/LabSelect";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LabSelectContainer />,
  },
  {
    path: "/:labId",
    element: <Console />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
