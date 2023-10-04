import React, { useState, useEffect } from 'react';
import { SettingOutlined, UserOutlined, LogoutOutlined, PlusOutlined, EditOutlined, DownloadOutlined } from '@ant-design/icons';
import { Layout, Avatar, Menu, theme, Dropdown, Table, Space, Input } from 'antd';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';
import { Content } from 'antd/es/layout/layout';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import { Link, useNavigate } from 'react-router-dom';


import Docxtemplater from 'docxtemplater';

import PizZip from 'pizzip';

import PizZipUtils from 'pizzip/utils/index.js';

import { saveAs } from 'file-saver';
import axios from 'axios';

const { Header } = Layout;
const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
const GapList = [4, 3, 2, 1];



function loadFile(url, callback) {
    PizZipUtils.getBinaryContent(url, callback);
}


const Ldevis = () => {
    var ImageModule = require('docxtemplater-image-module-free');

    const navigate = useNavigate();

    const handleModifierClick = (id) => {// Replace with your desired ID value
        navigate(`/devis/?id=${id}`); // Navigates to "/other-page/123" (example URL)
    };




    const [data, setData] = useState([]);
    const [searchValue, setSearchValue] = useState(null);
    const [filtredData, setFiltredData] = useState([]);

    useEffect(() => {
        const filterByRef = data.filter(item => item.reference.includes(searchValue));
        setFiltredData(filterByRef);
    }, [searchValue])

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
    const [allData, setAllData] = useState({});
    const [formValue, setFormValue] = useState({
        date: '2023-01-01',
        nomi: Cookies.get("nom") || '',
        prénomi: Cookies.get("prenom") || '',
        teli: Cookies.get("tel") || '',
        maili: Cookies.get("email") || '',
        nom: '',
        prenom: '',
        mission: '',
        adresse: '',
        nom_c: '',
        tel: '',
        mail: '',
        adressef: '',
        référence: '',


    });

    const menu = (
        <Menu onClick={handleMenuClick}>

            <Menu.Item key="logout" icon={<LogoutOutlined />}>
                Déconnexion
            </Menu.Item>
        </Menu>
    );

    const getReferance = () => {
        setData()
        let apiUrl
        if (searchValue) {
            apiUrl = `https://api.boring-hermann.212-227-197-242.plesk.page/api/devis/reff/${searchValue}`;
        } else {
            apiUrl = `https://api.boring-hermann.212-227-197-242.plesk.page/api/devis/ref`;
        }

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setData(data);
            })
            .catch(error => {
                console.error(error);
            });
    };



    useEffect(() => {
        getReferance()

    }, [])

    const columns1 = [
        {
            title: 'Référance',
            dataIndex: 'reference',
            key: 'reference',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => <a>{dayjs(date).format('DD-MM-YYYY')}</a>,
        },
        {
            title: 'Interlocuteur',
            dataIndex: 'nom',
            key: 'nom',
        },
        {
            title: 'Client',
            dataIndex: 'nom_client',
            key: 'nom_client',
        },
        {
            title: 'Action',

            render: (_, record) => (



                <Space size="middle">
                    <Button size="sm" onClick={async () => {
                        // let clientId = record.id_c;
                        // await getData(clientId , record.id_d);
                        generateDevis(record);
                        console.log(record)
                    }}>
                        < DownloadOutlined className='fs-5 m-1' ></DownloadOutlined > </Button>
                    <Button size="sm" className="bg-success " onClick={() => {
                        handleModifierClick(record.id_d);
                        console.log('devisIddd :  ', record.id_d);
                    }} >
                        < EditOutlined className='fs-5 m-1' ></EditOutlined> </Button>
                </Space>
            ),
        }

    ]

    // const getData = async (id, idDevis) => {
    //     const res = await axios.get('https://api.boring-hermann.212-227-197-242.plesk.page/api/client/' + id);
    //     console.log(res.data)
    //     const res1 = await axios.get('https://api.boring-hermann.212-227-197-242.plesk.page/api/devis/' + idDevis);
    //     setFormValue(prevState => ({
    //         ...prevState,
    //         nom: res.data[0].nom,
    //         prenom: res.data[0].prenom,
    //         mission: res.data[0].mission,
    //         adresse: res.data[0].adresse,
    //         nom_c: res.data[0].nom_c,
    //         mail: res.data[0].mail,
    //         adressef: res.data[0].adressef,
    //         référence: res1.data[0].reference,
    //     }));
    //     setAllData({
    //         nom: res.data[0].nom,
    //         prenom: res.data[0].prenom,
    //         mission: res.data[0].mission,
    //         adresse: res.data[0].adresse,
    //         nom_c: res.data[0].nom_c,
    //         mail: res.data[0].mail,
    //         adressef: res.data[0].adressef,
    //         référence: res1.data[0].reference,
    //     })
    // }

    const generateDevis = async (record) => {

        loadFile(
            require('../../src/devis2.docx'),
            function (error, content) {
                if (error) {
                    console.error(error);
                    return;
                }

                const zip = new PizZip(content);
                const doc = new Docxtemplater(zip);
                // console.log(formValue)
                doc.renderAsync(record).then(function () {
                    const out = doc.getZip().generate({
                        type: 'blob',
                        mimeType:
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    });
                    saveAs(out, "generated.docx");
                });
            }
        );

    };

    return (

        <Layout>
            <Sidebar />

            <Layout className="site-layout " style={{ backgroundColor: '#001529' }}>
                <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 100 }}>
                    <span style={{ fontSize: '17px', color: 'white' }}>
                        <SettingOutlined className='fs-3 pe-4' />
                        Les devis
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
                                <Link to="/devis">
                                    <Button  ><PlusOutlined />Nouveau devis</Button>
                                </Link>
                            </div>

                            <div>
                                <label>Rechercher par la référance</label>

                                <Input name='reference' onChange={(e) => setSearchValue(e.target.value)} placeholder="Référance" />
                            </div>


                        </div>


                    </Row>

                    <Row className='justify-content-center align-items-center'>
                        <Table className='mt-5' style={{ width: '100%' }} columns={columns1} dataSource={filtredData.length > 0 ? filtredData : data} />
                    </Row>
                </Content>

            </Layout>
        </Layout>

    );
};
export default Ldevis;