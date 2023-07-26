import React, { useState, useEffect } from 'react';
import { SettingOutlined, UserOutlined, LogoutOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Layout, Avatar, Menu, theme, Dropdown, Table, Space, Input } from 'antd';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';
import { Content } from 'antd/es/layout/layout';
import Cookies from 'js-cookie';

import { Link, useNavigate, useParams } from 'react-router-dom';


const { Header } = Layout;
const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
const GapList = [4, 3, 2, 1];

const Lprestations = () => {
    const [data, setData] = useState([]);

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
        texte: '',
        prix: '',
        tva: '',
        titre: '',
    });
    const navigate = useNavigate();

    const handleModifierClick = (id) => {
        // Perform any necessary logic before navigating
        // Navigate to the "Prestation" page with pre-filled fields


        navigate(`/prestation/?id=${id}`);
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

    const getPrestation = () => {
        fetch('http://localhost:5000/api/prestation')
            .then(response => response.json())
            .then(data => {
                setData(data);
            })
            .catch(error => console.error(error));
    }
    useEffect(() => {
        getPrestation()

    }, [])

    const columns1 = [
        {
            title: 'id',
            dataIndex: 'id_p',
            key: 'id_p',
        },
        {
            title: 'Texte',
            dataIndex: 'texte',
            key: 'texte',
        },
        {
            title: 'Prix',
            dataIndex: 'prix',
            key: 'prix',
        },
        {
            title: 'TVA',
            dataIndex: 'tva',
            key: 'tva',
        },
        {
            title: 'Titre',
            dataIndex: 'titre',
            key: 'titre',
        },
        {
            title: 'Action',

            render: (_, record) => (
                <Space size="middle">
                    <Button size="sm" variant="danger" onClick={() => {

                        let id = record.id_p;

            fetch('http://localhost:5000/api/prestation/delete/' + id, {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' }
                        })
                            .then(response => response.json())
                            .then(data => {
                                console.log(data)
                                getPrestation()
                            });

                    }}>
                        <DeleteOutlined className='fs-5 m-1' ></DeleteOutlined></Button>
                    <Button size="sm" className="bg-success " onClick={() => handleModifierClick(record.id_p)}>
                        < EditOutlined className='fs-5 m-1' ></EditOutlined>
                    </Button>
                </Space>
            ),
        }]

    return (

        <Layout>
            <Sidebar />

            <Layout className="site-layout " style={{ backgroundColor: '#001529' }}>
                <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 100 }}>
                    <span style={{ fontSize: '17px', color: 'white' }}>
                        <SettingOutlined className='fs-3 pe-4' />
                        Les préstations
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
                ><Row>
                        <div className='d-flex justify-content-between align-items-center'>
                            <div >
                                <Link to="/prestation">
                                    <Button><PlusOutlined />Nouveau préstation</Button>
                                </Link>
                            </div>

                            {/* <div>
                                <label>Trier par le titre</label>

                                <Input placeholder="Basic usage" />
                            </div> */}


                        </div>


                    </Row>

                    <Row className='justify-content-center align-items-center'>
                        <Table  scroll={{ x: '100%' }} className='mt-5' columns={columns1} dataSource={data} />
                    </Row>
                </Content>

            </Layout>
        </Layout>

    );
};
export default Lprestations;