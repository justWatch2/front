import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './index.css';

import {RecommendationProvider} from "./RecommendationContext";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RecommendationProvider>
        <App />
            </RecommendationProvider>
    </React.StrictMode>
);