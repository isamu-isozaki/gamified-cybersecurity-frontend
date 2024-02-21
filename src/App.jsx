/**
 * Author: Isamu Isozaki
 */
import React, {useState} from 'react';
import Console from './app/screens/Console';
import LabSelectContainer from "./app/screens/LabSelect";
import io from 'socket.io-client';
import { getBackendUrl } from './lib/utils';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
    {
        path: "/",
        element: <LabSelectContainer />,
    },
    {
        path: "/:labid",
        element: <Console />,
    },
])

function App() {
    return <RouterProvider router={router} />
}

export default App;