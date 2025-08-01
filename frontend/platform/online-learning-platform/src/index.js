import React from 'react';
import ReactDOM from 'react-dom/client';
import {  BrowserRouter,Route, Routes } from 'react-router-dom';
import { Link,useNavigate } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Header from './Header';
import './fonts/AtFontFace.css';
import Home from './Home';
import Instructors from './Instructors';
import Information from './Information';
import Contact from './Contact';
import Language from './Language';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <BrowserRouter>
  <Routes>
    <Route path="/" index element={<Home />} />
    <Route path="instructors" element={<Instructors />} />    
    <Route path="information" element={<Information />} />    
    <Route path="contact" element={<Contact />} />    
    <Route path="language" element={<Language />} />    

  </Routes> 
  </BrowserRouter>
</React.StrictMode>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
