import React, { useState, useEffect } from 'react';
import { SearchOutlined, PlusOutlined, SnippetsTwoTone, InfoCircleOutlined, MailOutlined, PieChartOutlined } from '@ant-design/icons';
import { Layout, theme, Radio, Modal, DatePicker, Space, Table, Checkbox, TimePicker } from 'antd';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import img1 from '../img/i_login.png';
import img2 from '../img/logo.png';


import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBRow,
    MDBCol,
    MDBIcon,
    MDBInput
}
    from 'mdb-react-ui-kit';
import Cookies from 'js-cookie';
import { decodeToken } from 'react-jwt';
import { useNavigate } from 'react-router-dom';


const Login = () => {

    const navigate = useNavigate()


    useEffect(() => {
        if (Cookies.get('token')) {
            navigate('/devis')
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();

        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            fetch('https://api.boring-hermann.212-227-197-242.plesk.page/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
                .then(response => response.json())
                .then(data => {

                    if (data.accessToken) {
                        let token = decodeToken(data.accessToken)
                        Cookies.set('token', data.accessToken, { expires: 3 })
                        Cookies.set('nom', token.nom, { expires: 3 })
                        Cookies.set('prenom', token.prenom, { expires: 3 })
                        Cookies.set('id', token.id, { expires: 3 })
                        Cookies.set('tel', token.tel, { expires: 3 })
                        Cookies.set('email', token.email, { expires: 3 })
                        navigate('/devis')
                    } else {
                        Modal.error({
                            title: 'votre mail ou mot de passe incorect',
                          
                        });
                    }

                })
        } catch (error) {
            console.error(error);
        }
    };


    return (


        <Layout >

            <MDBContainer className="my-5" >

                <MDBCard >
                    <MDBRow className='g-0' >

                        <MDBCol md='6'>

                            <MDBCardImage src={img1} alt="login form" className='rounded-start w-100' />
                        </MDBCol>

                        <MDBCol md='6'>
                            <Container>
                                <form onSubmit={handleSubmit}>
                                    <MDBCardBody className='d-flex flex-column'>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <img src={img2} style={{ width: '400px', height: 'auto' }} alt="Ma superbe image" />
                                        </div>
                                        <h5 className="fw-normal my-4 pb-3 mt-5" style={{ letterSpacing: '1px' }}>Page de connexion</h5>
                                        <MDBInput wrapperClass='mb-4' label='Identifient ' name='email' id='formControlLg' type='email' size="lg" />
                                        <MDBInput wrapperClass='mb-4' label='Mot de passe' name='password' id='formControlLg' type='password' size="lg" />
                                        <Button className="mb-4  px-4" style={{ backgroundColor: '#858fa2' }} type='submit' size='lg'>Login</Button>
                                    </MDBCardBody>
                                </form>
                            </Container>
                        </MDBCol>

                    </MDBRow>
                </MDBCard>

            </MDBContainer>

        </Layout>

    );

}

export default Login;