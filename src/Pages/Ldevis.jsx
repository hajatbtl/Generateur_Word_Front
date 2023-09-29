import React, { useState, useEffect, useRef } from 'react';
import { FormOutlined, UserOutlined, LogoutOutlined, PlusOutlined, EditOutlined, DownloadOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Layout, Avatar, Menu, theme, Dropdown, Table, Space, Modal, Input } from 'antd';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

import Highlighter from 'react-highlight-words';
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
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const [modal] = Modal.useModal();

    var ImageModule = require('docxtemplater-image-module-free');

    const navigate = useNavigate();

    const handleModifierClick = (id) => {// Replace with your desired ID value
        navigate(`/devis/?id=${id}`); // Navigates to "/other-page/123" (example URL)
    };
    const [isModalOpen, setIsModalOpen] = useState(false);




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
        date: '',
        titre_d: '',
        référence: '',
        nomi: Cookies.get("nom") || '',
        prénomi: Cookies.get("prenom") || '',
        teli: Cookies.get("tel") || '',
        maili: Cookies.get("email") || '',
        texte_prerequis: '',
        objet_mission:'',
        texte_visite: '',
        texte_missiondce: '',
        texte_preavis: '',
        accompte: '',



        nom: '',
        prenom: '',
        mission: '',
        adresse: '',
        client: '',
        tel: '',
        mail: '',
        adressef: '',
        image: '',
        titre: '',
        reference: '',
        titre_n: '',
        texte_n: '',
        id_d: '',
        id_p: '',

        nom_inter: Cookies.get("nom") || '',
        prenom_inter: Cookies.get("prenom") || '',
        mail_inter: Cookies.get("email") || '',
        tel_inter: Cookies.get("tel") || '',


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
            apiUrl = `http://localhost:5000/api/devis/reff/${searchValue}`;
        } else {
            apiUrl = `http://localhost:5000/api/devis/ref`;
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
            ...getColumnSearchProps('reference'),

        },
        {
            title: 'Client',
            dataIndex: 'nom_client',
            key: 'nom_client',
            ...getColumnSearchProps('nom_client'),
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (date) => <a>{dayjs(date).format('DD-MM-YYYY')}</a>,
            ...getColumnSearchProps('date'),

        },
        {
            title: 'Interlocuteur',
            dataIndex: 'nom_inter',
            key: 'nom',
            ...getColumnSearchProps('nom_inter'),
        },

        {
            title: 'Action',

            render: (_, record) => (

                <Space size="middle">

                    <Button size="sm" onClick={async () => {
                        let clientId = record.id_c;
                        await getData(clientId, record.id_d);

                        console.log(record)
                    }}>
                        < DownloadOutlined className='fs-5 m-1' ></DownloadOutlined > </Button>


                    <Button size="sm" className="bg-success " onClick={() => {
                        handleModifierClick(record.id_d);
                        console.log('devisIddd :  ', record.id_d);
                    }} >
                        < EditOutlined className='fs-5 m-1' ></EditOutlined> </Button>


                    <Button size="sm" variant="danger"
                        onClick={() => {

                            Modal.confirm({
                                icon: <DeleteOutlined className='text-danger' />,
                                okButtonProps: { className: 'btn-danger' },
                                content: 'Êtes-vous certain de vouloir supprimer ce devis ?',
                                okText: 'Supprimer',
                                cancelText: 'Annuler',
                                onOk: () => {
                                    let id = record.id_d;

                                    fetch('http://localhost:5000/api/devis/delete/' + id, {
                                        method: 'DELETE',
                                        headers: { 'Content-Type': 'application/json' }
                                    })
                                        .then(response => response.json())
                                        .then(data => {
                                            getReferance()
                                        });

                                }
                            });


                        }}
                    >
                        <DeleteOutlined className='fs-5 m-1' ></DeleteOutlined></Button>
                </Space>
            ),
        }

    ]

    const getData = async (id, idDevis) => {
        await fetch('http://localhost:5000/api/devis/devisall/' + idDevis, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then((data) => {
                if (data) {
                    console.log('babababab:   , ', data)
                    setFormValue({
                        ...formValue,
                        date: data.devis.date,
                        référence: data.devis.reference,
                        titre_d: data.devis.titre_d,
                        // nomi: data.devis.nom_inter,
                        // prénomi: data.devis.prenom_inter,
                        // teli: data.devis.tel_inter,
                        // maili: data.devis.mail_inter,
                        adressef: data.client.adressef,
                        mail: data.client.mail,
                        tel: data.client.tel,
                        adresse: data.client.adresse,
                        mission: data.client.mission,
                        nom: data.client.nom,
                        prenom: data.client.prenom,
                        nom_c: data.client.nom_c,
                        image: data.client.image,
                        nom_inter: data.devis.nom_inter,
                        prenom_inter: data.devis.prenom_inter,
                        mail_inter: data.devis.mail_inter,
                        tel_inter: data.devis.tel_inter,
                        prestationslist: data.prestation,
                        notatslist: data.notats,
                        texte_prerequis: data.devis.prerequis,
                        objet_mission: data.devis.objet_mission,
                        texte_visite: data.devis.visite,
                        texte_missiondce: data.devis.mission_dce,
                        texte_preavis: data.devis.preavis,
                        accompte: data.devis.accompte,
                    });
                    generateDevis({
                        ...formValue,
                        date: data.devis.date,
                        référence: data.devis.reference,
                        titre_d: data.devis.titre_d,
                        // nomi: data.devis.nom_inter,
                        // prénomi: data.devis.prenom_inter,
                        // teli: data.devis.tel_inter,
                        // maili: data.devis.mail_inter,
                        adressef: data.client.adressef,
                        mail: data.client.mail,
                        tel: data.client.tel,
                        adresse: data.client.adresse,
                        mission: data.client.mission,
                        nom: data.client.nom,
                        prenom: data.client.prenom,
                        nom_c: data.client.nom_c,
                        image: data.client.image,
                        nom_inter: data.devis.nom_inter,
                        prenom_inter: data.devis.prenom_inter,
                        mail_inter: data.devis.mail_inter,
                        tel_inter: data.devis.tel_inter,
                        prestationslist: data.prestation,
                        notatslist: data.notats,
                        texte_prerequis: data.devis.prerequis,
                        objet_mission: data.devis.objet_mission,
                        texte_visite: data.devis.visite,
                        texte_missiondce: data.devis.mission_dce,
                        texte_preavis: data.devis.preavis,
                        accompte: data.devis.accompte,

                    });
                }
            })
        // setFormValue({
        //     ...formValue,
        //     date: res.data[0].date,
        //     référence: res.data[0].reference,
        //     titre_d: res.data[0].titre_d,
        //     nomi: res.data[0].nom,
        //     prénomi: res.data[0].prenom,
        //     teli: res.data[0].tel_c,
        //     maili: res.data[0].mail_c,
        //     adressef: res.data[0].adressef,
        //     mail: res.data[0].mail_c,
        //     tel: res.data[0].tel_c,
        //     adresse: res.data[0].adresse,
        //     mission: res.data[0].mission,
        //     nom_c: res.data[0].nom_client,
        //     prenom: res.data[0].prenom_c,
        //     nom: res.data[0].nom_c,
        //     image: res.data[0].image,
        //     titre: res.data[0].titre,
        //     prix: res.data[0].prix,
        //     tva: res.data[0].tva,
        //     texte: res.data[0].texte,
        //     idp: res.data[0].id_p,
        // });

    }

    useEffect(() => {
        console.log(formValue)
    }, [formValue])

    const generateDevis = async (record) => {

        console.log(record)
        loadFile(
            require('../../src/devis.docx'),
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
                        <FormOutlined className='fs-3 pe-4' />
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
                        <div className='d-flex  justify-content-between align-items-center'>
                            <div >
                                <Link to="/devis">
                                    <Button  ><PlusOutlined className='mx-2 ' />Nouveau devis</Button>
                                </Link>
                            </div>

                            {/* <div>
                                <label>Rechercher par la référance</label>

                                <Input name='reference' onChange={(e) => setSearchValue(e.target.value)} placeholder="Référance" />
                            </div> */}


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