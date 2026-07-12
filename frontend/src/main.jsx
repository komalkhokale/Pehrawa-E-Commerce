import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/index.css'
import App from './app/App.jsx'
import { Provider } from 'react-redux'
import { store } from './app/app.store.js'
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  
    <Provider store={store}>
      <App />
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1b1c1a",
            color: "#fff",
           
            // border: "1px solid #C9A96E",
          },
        }}
      />
    </Provider>
  
);