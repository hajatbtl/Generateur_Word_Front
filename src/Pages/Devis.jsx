import React, { useState, useEffect } from 'react';
import { SettingOutlined, LogoutOutlined, FileDoneOutlined, CodepenOutlined, UserOutlined, BarChartOutlined, UploadOutlined, FormOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Layout, Avatar, Menu, theme, Dropdown, Steps, Select, DatePicker, Upload } from 'antd';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';
import { Content } from 'antd/es/layout/layout';
import { MDBInput, MDBValidation, MDBValidationItem } from 'mdb-react-ui-kit';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import { saveAs } from 'file-saver';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

import 'dayjs/locale/fr';
import locale from 'antd/es/date-picker/locale/fr_FR';




var ImageModule = require('docxtemplater-image-module-free');


const { Header } = Layout;
const UserList = ['U', 'Lucy', 'Tom', 'Edward'];
const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
const GapList = [4, 3, 2, 1];




function loadFile(url, callback) {
    PizZipUtils.getBinaryContent(url, callback);
}

const Devis = () => {

    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');

    const handleFileUpload = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const image = new Image();
            image.src = reader.result;
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const aspectRatio = image.width / image.height;
                const targetWidth = 700;
                const targetHeight = targetWidth / aspectRatio;
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
                const resizedDataURL = canvas.toDataURL('image/jpeg');
                setFile(resizedDataURL);
                setFormValue({ ...formValue, image: resizedDataURL });
                setFileName(file.name); // Ajout du nom du fichier
            };
        };
        reader.readAsDataURL(file);
    };


    const navigate = useNavigate()
    useEffect(() => {
        if (!Cookies.get('token')) {
            navigate('/')
        }
    })




    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const [user, setUser] = useState(UserList[0]);
    const [color, setColor] = useState(ColorList[0]);
    const [gap, setGap] = useState(GapList[0]);
    const [prestations, setPrestations] = useState([])
    const [prestationsList, setPrestationsList] = useState([])
    const [current, setCurrent] = useState(0);
    const changeUser = () => {
        const index = UserList.indexOf(user);
        setUser(index < UserList.length - 1 ? UserList[index + 1] : UserList[0]);
        setColor(index < ColorList.length - 1 ? ColorList[index + 1] : ColorList[0]);
    };

    const handleMenuClick = (e) => {
        if (e.key === 'logout') {
            Cookies.remove('token')
            Cookies.remove('nom')
            Cookies.remove('prenom')
            Cookies.remove('id')
            Cookies.remove('tel')
            Cookies.remove('email')
            navigate('/')
            console.log('Déconnexion');
        }
    };

    const menu = (
        <Menu onClick={handleMenuClick}>

            <Menu.Item key="logout" icon={<LogoutOutlined />} >

                Déconnexion

            </Menu.Item>

        </Menu>
    );
    const [currentStep, setCurrentStep] = useState(0);

    const handleStepChange = (step) => {
        setCurrentStep(step);
    };
    const [formValue, setFormValue] = useState({
        date: '',
        référence: '',
        nomi: Cookies.get("nom") || '',
        prénomi: Cookies.get("prenom") || '',
        teli: Cookies.get("tel") || '',
        maili: Cookies.get("email") || '',
        nom: '',
        prenom: '',
        mission: '',
        adresse: '',
        client: '',
        tel: '',
        mail: '',
        adressef: '',

    });

    const onChange = (e) => {
        setFormValue({ ...formValue, [e.target.name]: e.target.value });
    };
    const next = () => {
        setCurrentStep(currentStep + 1);
    };


    useEffect(() => {
        console.log(formValue);
    }, [formValue])


    const generateDevis = () => {

        const imageOptions = {
            centered: false,
            getImage(url) {
                return new Promise(function (resolve, reject) {
                    loadFile(
                        url,
                        function (error, content) {
                            if (error) {
                                return reject(error);
                            }
                            return resolve(content);
                        }
                    );
                });
            },
            getSize(img, url, tagName) {
                return new Promise(function (resolve, reject) {
                    const image = new Image();
                    image.src = url;
                    image.onload = function () {
                        resolve([image.width, image.height]);
                    };
                    image.onerror = function (e) {
                        console.log(
                            "img, url, tagName : ",
                            img,
                            url,
                            tagName
                        );
                        alert(
                            "An error occured while loading " +
                            url
                        );
                        reject(e);
                    };
                });
            },
        };

        loadFile(
            require('../../src/devis.docx'),
            function (error, content) {
                if (error) {
                    console.error(error);
                    return;
                }

                const zip = new PizZip(content);
                const doc = new Docxtemplater(zip, {
                    modules: [new ImageModule(imageOptions)],
                });

                doc.renderAsync(formValue).then(function () {
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

    const getPrestation = () => {
        fetch('https://api.boring-hermann.212-227-197-242.plesk.page/api/prestation')
            .then(response => response.json())
            .then(data => {
                const formattedData = data.map(item => {
                    return {
                        value: item.id_p,
                        label: item.titre,
                    };
                });
                setPrestations(formattedData);
                setPrestationsList(data)
            })
            .catch(error => console.error(error));
    }



    const onSelect = (e) => {

        const element = prestationsList.find(item => item.id_p === e);

        setFormValue({ ...formValue, titre: element.titre, text: element.texte, prix: element.pris, tva: element.tva, });

    }

    const addClient = () => {
        fetch('https://api.boring-hermann.212-227-197-242.plesk.page/api/client/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nom: formValue.nom,
                prenom: formValue.prenom,
                nom_c: formValue.nom_c,
                adresse: formValue.adresse,
                tel: formValue.tel,
                mail: formValue.mail,
                adressef: formValue.adressef,
                mission: formValue.mission,

            }),
        })
            .then(response => response.json())
           
            .catch(error => {
                console.error(error);
                // Gestion des erreurs
            });
    };

    useEffect(() => {
        getPrestation()
    }, [])


    return (


        <Layout>
            <Sidebar />

            <Layout className="site-layout " style={{ backgroundColor: '#001529' }}>
                <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 100 }}>
                    <span style={{ fontSize: '17px', color: 'white' }}>
                        <SettingOutlined className='fs-3 pe-4' />
                        Crée un devis
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


                    <Steps
                        className='mt-4'
                        current={currentStep}
                        items={[
                            {
                                title: 'Devis',
                                description: '',
                            },
                            {
                                title: 'Interlocuteur',
                            },
                            {
                                title: 'Client',

                            },
                            {
                                title: 'Prestation',
                            },
                            {
                                title: 'Telecharger fichier Word',
                            },
                        ]}
                    />

                    <hr className='mt-5'></hr>



                    {currentStep === 0 &&
                        <>
                            <Row className='mt-5'>
                                <div className='d-flex align-items-center gap-4'>
                                    <FileDoneOutlined className='fs-1' />
                                    <h4>Devis</h4>
                                </div>
                            </Row>
                            <Row>
                                <MDBValidation onSubmit={(e) => {
                                    let form = document.querySelector('.needs-validation')
                                    if (form.checkValidity()) {
                                        next()
                                    }
                                }} className='row g-3'>

                                    <MDBValidationItem feedback='Merci de remplire la date.' invalid>
                                        <Col xl={6}> <label>Date de devis</label> </Col>

                                        <DatePicker format="DD-MM-YYYY" locale={locale} className='col-6' onChange={(v) => { setFormValue({ ...formValue, date: dayjs(v).format('DD-MM-YYYY') }) }} />

                                    </MDBValidationItem>
                                    <MDBValidationItem feedback='Merci de remplire La référence Devis.' invalid>

                                        <Col xl={6}> <label>Référence Devis</label> </Col>
                                        <Col xl={6}>
                                            <MDBInput
                                                value={formValue.référence}
                                                name='référence'
                                                onChange={onChange}
                                                id='validationCustom02'
                                                required

                                            /></Col>
                                    </MDBValidationItem>
                                    <div className='col-12'>
                                        <Button type='submit'>Suivant</Button>

                                    </div>
                                </MDBValidation>
                            </Row>





                        </>}


                    {currentStep === 1 &&
                        <>
                            <Row className='mt-5'>
                                <div className='d-flex align-items-center gap-4'>
                                    <UserSwitchOutlined className='fs-1' />
                                    <h4>Interlocuteur privilégié</h4>
                                </div>
                            </Row>
                            <Row>
                                <MDBValidation onSubmit={(e) => {
                                    let form = document.querySelector('.needs-validation')
                                    if (form.checkValidity()) {
                                        next()
                                    }
                                }} className='row g-3'>

                                    <MDBValidationItem className='col-md-6' feedback="Merci de remplire le nom de l'nterlocuteur ." invalid>
                                        <label>Nom :</label>
                                        <MDBInput
                                            className='mt-2'
                                            value={formValue.nomi}
                                            name='nomi'
                                            onChange={onChange}
                                            id='validationCustom03'
                                            required
                                        />
                                    </MDBValidationItem>
                                    <MDBValidationItem className='col-md-6' feedback="Merci de remplire le prénom de l'nterlocuteur ." invalid>
                                        <label>Prénom:</label>
                                        <MDBInput
                                            className='mt-2'
                                            value={formValue.prénomi}
                                            name='prénomi'
                                            onChange={onChange}
                                            id='validationCustom04'
                                            required
                                            placeholder='Prénom'
                                        />
                                    </MDBValidationItem>
                                    <MDBValidationItem className='col-md-6' feedback="Merci de remplire le Téléphone de l'nterlocuteur ." invalid>
                                        <label>Téléphone</label>
                                        <MDBInput
                                            className='mt-2'
                                            value={formValue.teli}
                                            name='teli'
                                            onChange={onChange}
                                            id='validationCustom05'
                                            required
                                            type='tel'
                                            placeholder='+33'
                                        />
                                    </MDBValidationItem>

                                    <MDBValidationItem className='col-md-6' feedback="Merci de remplire le mail de l'nterlocuteur ." invalid>
                                        <label>Mail</label>
                                        <MDBInput
                                            className='mt-2'
                                            value={formValue.maili}
                                            name='maili'
                                            onChange={onChange}
                                            id='validationCustom06'
                                            required
                                            placeholder='Mail'
                                            type='email'
                                        />
                                    </MDBValidationItem>

                                    <div className='d-flex gap-2'>
                                        <Button onClick={() => setCurrentStep(currentStep - 1)}>Précedent</Button>

                                        <Button type='submit'>Suivant</Button>
                                    </div>
                                </MDBValidation>
                            </Row>

                        </>}


                    {currentStep === 2 &&
                        <>
                            <Row className='mt-5'>
                                <div className='d-flex align-items-center gap-4'>
                                    <CodepenOutlined className='fs-1' />
                                    <h4>Client</h4>
                                </div>
                            </Row>
                            <Row>
                                <MDBValidation onSubmit={(e) => {
                                    let form = document.querySelector('.needs-validation')
                                    if (form.checkValidity()) {
                                        next()
                                    }
                                }} className='row g-3'>



                                    <MDBValidationItem className='col-md-6' feedback='Merci de remplire Le nom.' invalid>
                                        <MDBInput
                                            value={formValue.nom}
                                            name='nom'
                                            onChange={onChange}
                                            id='validationCustom07'
                                            required
                                            label='Nom'
                                        />
                                    </MDBValidationItem>
                                    <MDBValidationItem className='col-md-6' feedback='Merci de remplire Le prénom.' invalid>
                                        <MDBInput
                                            value={formValue.prenom}
                                            name='prenom'
                                            onChange={onChange}
                                            id='validationCustom08'
                                            required
                                            label='Prénom'
                                        />
                                    </MDBValidationItem>
                                    <MDBValidationItem className='col-md-6' feedback='Merci de remplire La Mission.' invalid>
                                        <MDBInput
                                            value={formValue.mission}
                                            name='mission'
                                            onChange={onChange}
                                            id='validationCustom09'
                                            required
                                            label='Mission'
                                        />
                                    </MDBValidationItem>
                                    <MDBValidationItem className='col-md-6' feedback="Merci de remplire L'adresse." invalid>
                                        <MDBInput
                                            value={formValue.adresse}
                                            name='adresse'
                                            onChange={onChange}
                                            id='validationCustom10'
                                            required
                                            label='Adresse'
                                        />
                                    </MDBValidationItem>
                                    <MDBValidationItem className='col-md-6' feedback="Merci de remplire Le nom de l'entreprise." invalid>
                                        <MDBInput
                                            value={formValue.nom_c}
                                            name='nom_c'
                                            onChange={onChange}
                                            id='validationCustom11'
                                            required
                                            label='Client'
                                        />
                                    </MDBValidationItem>
                                    <MDBValidationItem className='col-md-6' feedback='Merci de remplire Le Téléphone.' invalid>
                                        <MDBInput
                                            value={formValue.tel}
                                            name='tel'
                                            onChange={onChange}
                                            id='validationCustom12'
                                            required
                                            label='Téléphone'
                                        />
                                    </MDBValidationItem>
                                    <MDBValidationItem className='col-md-6' feedback="Merci de remplire Le mail." invalid>
                                        <MDBInput
                                            value={formValue.mail}
                                            name='mail'
                                            onChange={onChange}
                                            id='validationCustom13'
                                            required
                                            label='Mail'
                                            type='email'
                                        />
                                    </MDBValidationItem>
                                    <MDBValidationItem className='col-md-6' feedback="Merci de remplire L'adresse (Facturation)." invalid>
                                        <MDBInput
                                            value={formValue.adressef}
                                            name='adressef'
                                            onChange={onChange}
                                            id='validationCustom14'
                                            required
                                            label='Adresse(Facturation)'
                                        />
                                    </MDBValidationItem>

                                    <MDBValidationItem className='col-md-6' feedback="Merci de remplire L'adresse (Facturation)." invalid>
                                        <div>
                                            <div className='d-flex gap-3 align-items-baseline'>
                                                <label>Image</label>
                                                <Upload
                                                    beforeUpload={(file) => false}
                                                    onChange={({ file }) => handleFileUpload(file)}
                                                    showUploadList={false}
                                                >
                                                    <Button icon={<UploadOutlined />}>Cliquez pour télécharger</Button>
                                                </Upload>
                                            </div>
                                            <p style={{ color: 'red' }}>{fileName}</p>


                                        </div>

                                    </MDBValidationItem>



                                    <div className='mt-5 d-flex gap-2'>
                                        <Button onClick={() => setCurrentStep(currentStep - 1)}>Précedent</Button>

                                        <Button type='submit'>Suivant</Button>
                                    </div>


                                </MDBValidation>
                            </Row>

                        </>
                    }





                    {currentStep === 3 &&
                        <>
                            <Row className='mt-5'>
                                <div className='d-flex align-items-center gap-4'>
                                    <BarChartOutlined className='fs-1' />
                                    <h4>Prestation</h4>
                                </div>
                            </Row>
                            <Row>
                                <MDBValidation onSubmit={(e) => {
                                    let form = document.querySelector('.needs-validation')
                                    if (form.checkValidity()) {
                                        next()
                                    }
                                }} className='row g-3'>


                                    <MDBValidationItem className='col-md-6' feedback='Merci de remplire La Mission.' invalid>
                                        <Select
                                            defaultValue="Prestation"
                                            style={{ width: 200 }}
                                            onSelect={onSelect}
                                            options={prestations}
                                        />
                                    </MDBValidationItem>


                                    <div className='d-flex gap-2'>
                                        <Button onClick={() => setCurrentStep(currentStep - 1)}>Précedent</Button>

                                        <Button type='submit'>Suivant</Button>
                                    </div>

                                </MDBValidation>
                            </Row>

                        </>

                    }

                    {currentStep === 4 &&
                        <>
                            <Row className='mt-5'>
                                <div className='d-flex align-items-center gap-4'>
                                    <FormOutlined className='fs-1' />
                                    <h4>Télécharger fichier word</h4>
                                </div>
                            </Row>
                            <Row>
                                <MDBValidation onSubmit={(e) => {
                                    let form = document.querySelector('.needs-validation')
                                    if (form.checkValidity()) {
                                        next()
                                    }
                                }} className='row g-3'>










                                    <div className='d-flex gap-2'>
                                        <Button onClick={() => setCurrentStep(currentStep - 1)}>Précedent</Button>

                                        <div className='col-12'>
                                            <Button onClick={() => { generateDevis(); addClient(); }}> <UploadOutlined className='me-2' /> Cliquez pour télécharger</Button>

                                        </div>
                                    </div>

                                </MDBValidation>
                            </Row>

                        </>

                    }







                </Content>

            </Layout>
        </Layout >

    );

}

export default Devis;






