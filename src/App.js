
import './App.css';

import React, { useState, useEffect } from 'react';
import { CalendarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Layout, Input, theme, Radio, Modal, DatePicker, Result, Calendar } from 'antd';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Settings from './Pages/Settings';
import Devis from './Pages/Devis';
import Prestation from './Pages/Prestation';
import Ldevis from './Pages/Ldevis';
import Lprestations from './Pages/Lprestations';
import Notats from './Pages/Notats';
import Lnotats from './Pages/Lnotats';



function App() {
  return (
    <BrowserRouter>
    <Routes>

      <Route path="/Settings" element={(<Settings />)} ></Route>
      <Route path="/Devis" element={(<Devis/>)} ></Route>
      <Route path="/Prestation" element={(<Prestation/>)} ></Route>
      <Route path="/Notats" element={(<Notats/>)} ></Route>
      <Route path="/Devis/Liste" element={(<Ldevis/>)} ></Route>
      <Route path="/Prestations/Liste" element={(<Lprestations/>)} ></Route>
      <Route path="/Notats/Liste" element={(<Lnotats/>)} ></Route>
      <Route path="/" element={(<Login />)} ></Route>

    </Routes >
  </BrowserRouter >
  );
}

export default App;
