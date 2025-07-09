import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// ? Importa el AuthProvider desde context
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </StrictMode>
);