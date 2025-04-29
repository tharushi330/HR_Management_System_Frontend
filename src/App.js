import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<EmployeeList />} />
                <Route path="/add" element={<EmployeeForm />} />
                <Route path="/edit/:id" element={<EmployeeForm />} />
            </Routes>
        </Router>
    );
}

export default App;
