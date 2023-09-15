import React, { useState, useEffect } from 'react';
import { SettingOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Avatar, Menu, theme, Dropdown, Modal, Input } from 'antd';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';
import { Content } from 'antd/es/layout/layout';
import Cookies from 'js-cookie';
import { MDBValidation, MDBValidationItem } from 'mdb-react-ui-kit';
import { useLocation } from 'react-router-dom';

import { Link, useNavigate, useParams } from 'react-router-dom';
import {MDBInput} from 'mdb-react-ui-kit';


const { Header } = Layout;
const UserList = ['U', 'Lucy', 'Tom', 'Edward'];
const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
const GapList = [4, 3, 2, 1];


const Notats = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const idNot = queryParams.get('id');


    const { TextArea } = Input;

    useEffect(() => {
        fetch('http://localhost:5000/api/notats/' + idNot, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then((data) => {
                console.log("aaaaaaaaa : ", data[0]);


                setFormValue({ ...formValue, titre_n: data[0].titre_n, texte_n: data[0].texte_n });


                const formattedData = data.map(item => {
                    return {
                        value: item.id_n,
                        label: item.titre_n,
                    };
                });
            })
            .catch(error => {
                console.error(error);
                // Gestion des erreurs
            });
    }, []);

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
        texte_n: '',
        titre_n: '',
    });
    const addNotats = () => {
        if (formValue.texte_n && formValue.titre_n) {
            // Tous les champs sont remplis
            fetch('http://localhost:5000/api/notats/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    texte_n: formValue.texte_n,
                    titre_n: formValue.titre_n,
                }),
            })
                .then(response => response.json())
                .then((data) => {
                    Modal.info({
                        title: '',
                        content: (
                            <div>
                                <p>Vous avez bien ajouté la notats</p>
                            </div>
                        ),
                        onOk() {
                            setFormValue({
                                texte_n: '',
                                titre_n: '',
                            });
                        }
                    });
                    navigate('/lnotats');
                })
                .catch(error => {
                    console.error(error);
                    // Gestion des erreurs
                });
        } else {
            // Au moins un champ est vide
            Modal.error({
                title: 'Erreur',
                content: 'Tous les champs doivent être remplis.',
            });
        }
    };



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


    const navigate = useNavigate()

    function updateNotats() {
        if (formValue.texte_n && formValue.titre_n) {
            // Tous les champs sont remplis
            fetch('http://localhost:5000/api/notats/update/' + idNot, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({

                    texte_n: formValue.texte_n,
                    titre_n: formValue.titre_n,
                }),
            })
                .then(response => response.json())
                .then((data) => {
                    Modal.info({
                        title: '',
                        content: (
                            <div>
                                <p>Vous avez bien modifié la notats</p>
                            </div>
                        ),
                        onOk() {
                            setFormValue({
                                texte_n: '',
                                titre_n: '',
                            });
                        }

                    });
                    navigate('/lnotats');
                })
                .catch(error => {
                    console.error(error);
                    // Gestion des erreurs
                });
        } else {
            // Au moins un champ est vide
            Modal.error({
                title: 'Erreur',
                content: 'Tous les champs doivent être remplis.',
            });
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
                    <Row className='justify-content-center align-items-center'>
                        <Row className='mt-5'>
                            <div className='d-flex align-items-center gap-4'>
                                <UserOutlined className='fs-1' />
                                <h4>Notats</h4>
                            </div>
                        </Row>
                        <Row>
                            <MDBValidation className='row g-3'>

                                <MDBValidationItem feedback='Merci de remplire Le titre.' invalid>

                                    <Col xl={6}> <label>Titre</label> </Col>
                                    <Col xl={6}>
                                        <MDBInput
                                            value={formValue.titre_n}
                                            name='titre_n'
                                            onChange={onChange}
                                            id='validationCustom01'
                                            required

                                        />
                                    </Col>
                                </MDBValidationItem>


                                
                                <MDBValidationItem feedback='Merci de remplire le texte.' invalid>
                                    <Col xl={6}> <label>Texte</label> </Col>

                                    <Col xl={6}>
                                        {/* <MDBInput
                                            value={formValue.texte}
                                            name='texte'
                                            onChange={onChange}
                                            id='validationCustom01'
                                            required

                                        /> */}

                                        <TextArea
                                            value={formValue.texte_n}
                                            name='texte_n'
                                            onChange={onChange}
                                            id='validationCustom02'
                                            required
                                        />

                                    </Col>
                                </MDBValidationItem>






                                {idNot == null && (
                                    <div className='col-12'>
                                        <Button onClick={() => {
                                            addNotats();
                                        }} type='submit'>Ajouter</Button>

                                    </div>
                                )}

                                {idNot != null && (
                                    <div className='col-12'>
                                        <Button onClick={() => {
                                            updateNotats();
                                        }} type='submit'>Modifier</Button>

                                    </div>
                                )}

                            </MDBValidation>
                        </Row>
                    </Row>
                </Content>

            </Layout>
        </Layout>

    );
};
export default Notats;