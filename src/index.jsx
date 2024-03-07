import React from "react";
import ReactDOM from "react-dom";
import "./app/styles/globals.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// eslint-disable-next-line react/no-deprecated
ReactDOM.render(
  <React.StrictMode>
    <TooltipProvider>
      <App />
    </TooltipProvider>
    <Toaster position="bottom-right" richColors closeButton expand />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
