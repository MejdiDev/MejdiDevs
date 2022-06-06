import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Project from './project';
import Home from './home';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/project" element={<Project />} />
            </Routes>
        </Router>
    );
}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);