import React from "react";
import ReactDOM from "react-dom/client";
import Home from "../src/components/Home";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 1. Create a new instance of QueryClient
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 2. Wrap your application with the QueryClientProvider and pass the client */}
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  </React.StrictMode>
);

