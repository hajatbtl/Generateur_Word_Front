import React, { useState, useEffect } from 'react';
import { SettingOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Avatar, Menu, theme, Dropdown, Steps } from 'antd';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';
import { Content } from 'antd/es/layout/layout';
import Cookies from 'js-cookie';

import {
    MDBInput,
    MDBCol,
    MDBRow,
    MDBCheckbox,
    MDBBtn
} from 'mdb-react-ui-kit';


const { Header } = Layout;
const UserList = ['U', 'Lucy', 'Tom', 'Edward'];
const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
const GapList = [4, 3, 2, 1];

const Settings = () => {

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [color, setColor] = useState(ColorList[0]);
    const [gap, setGap] = useState(GapList[0]);
    const handleMenuClick = (e) => {
        if (e.key === 'logout') {
            // Logique de déconnexion ici
            console.log('Déconnexion');
        }
    };
    const [formValue, setFormValue] = useState({
        ancienmdp: '',
        mdp: '',


    });
    const onChange = (e) => {
        setFormValue({ ...formValue, [e.target.name]: e.target.value });
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
          
            <Menu.Item key="logout" icon={<LogoutOutlined />}>
                Déconnexion
            </Menu.Item>
        </Menu>
    );

    const updatemdp = (e) => {

        
        e.preventDefault()
        if (formValue.ancienmdp == formValue.mdp) {

            fetch('http://localhost:5000/api/user/update/' + Cookies.get('id'), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        "mdp": formValue.mdp
                    }
                )
            })
                .then(response => response.json())
                .then(data => {

                });
        } else {
            console.log('erreur');
        }



    }


    return (

        <Layout>
            <Sidebar />

            <Layout className="site-layout " style={{ backgroundColor: '#001529' }}>
                <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 100 }}>
                    <span style={{ fontSize: '17px', color: 'white' }}>
                        <SettingOutlined className='fs-3 pe-4' />
                        Configuration du compte
                    </span>
                    <div className='d-flex justify-content-betwen align-items-baseline gap-3'>
                        <p style={{ color: '#ffff' }}>{Cookies.get('nom') + ' ' + Cookies.get('prenom')}</p>

                        <Dropdown overlay={menu} placement="bottomRight">
                            <Avatar
                                style={{
                                    backgroundColor: color,
                                    verticalAlign: 'middle',
                                }}
                                size="large"
                                gap={gap}
                                icon={<UserOutlined />}
                            >

                            </Avatar>

                        </Dropdown>
                    </div>
                </Header>

                <Content

                    className='mb-4'
                    style={{
                        margin: '0px 16px',
                        padding: 24,
                        minHeight: 280,
                        borderRadius: 20,
                        background: '#fff',

                    }}
                >
                    <Row className='justify-content-center align-items-center h-100'>
                        <Col xl={6} >
                            <h5>Changer le mot de passe</h5>

                            <hr></hr>
                            <form className='mt-3' onSubmit={(e) => updatemdp(e)}>

                                <MDBInput className='mb-4' id='validationCustom01' type='password' onChange={onChange} value={formValue.ancienmdp} name='ancienmdp' placeholder='Mot de passe' />
                                <MDBInput className='mb-4' id='validationCustom02' type='password' onChange={onChange} name='mdp' value={formValue.mdp} placeholder='Confirmer le mot de passe' />



                                <Button type='submit' block >
                                    Enregistrer
                                </Button>
                            </form>
                        </Col>
                    </Row>
                </Content>

            </Layout>
        </Layout>

    );
};
export default Settings;