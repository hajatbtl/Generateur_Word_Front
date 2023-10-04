import React, { useState, useEffect } from 'react';
import { LogoutOutlined, FileDoneOutlined, CodepenOutlined, UserOutlined, BarChartOutlined, CheckCircleOutlined, CloseOutlined, UploadOutlined, FormOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { Layout, Avatar, Menu, theme, Dropdown, Steps, Select, DatePicker, Upload, Radio, Modal, Input, Slider, notification, InputNumber } from 'antd';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';
import { Content } from 'antd/es/layout/layout';
import { MDBValidation, MDBValidationItem } from 'mdb-react-ui-kit';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import { saveAs } from 'file-saver';
import Cookies from 'js-cookie';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import { MDBInput } from 'mdb-react-ui-kit';

import 'dayjs/locale/fr';
import locale from 'antd/es/date-picker/locale/fr_FR';
import axios from 'axios';




var ImageModule = require('docxtemplater-image-module-free');
dayjs.locale('fr');

const { Header } = Layout;
const UserList = ['U', 'Lucy', 'Tom', 'Edward'];
const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
const GapList = [4, 3, 2, 1];




function loadFile(url, callback) {
    PizZipUtils.getBinaryContent(url, callback);
}

const Devis = () => {

    const [file, setFile] = useState(null);
    const [date, setDate] = useState(null);
    const [fileName, setFileName] = useState('');
    const [imageDataUrl, setImageDataUrl] = useState(null);
    const [selectPrestationsOption, setSelectPrestationsOption] = useState([]);
    const { TextArea } = Input;
    const [disabled, setDisabled] = useState(false);
    const onChangeSlider = (v) => {
        setFormValue({ ...formValue, accompte: v });
    };

    const onChangeInput = (value) => {
        setFormValue({ ...formValue, accompte: value });
    };
    const onChangeradiovisite = (e) => {
        console.log('radio checked', e.target.value);
        setFormValue({ ...formValue, has_visite: e.target.value })

    };
    const onChangeradioprevue = (e) => {
        console.log('radio checked', e.target.value);
        setFormValue({ ...formValue, has_prevue: e.target.value })
    };



    // const handleFileUpload = async (file) => {
    //     const formData = new FormData();
    //     formData.append("file", file);
    //     const res = await axios.post("http://localhost:5000/api/upload", formData);
    //     setFileName(res.data);

    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //         const image = new Image();
    //         image.src = reader.result;
    //         image.onload = () => {
    //             const dataUrl = reader.result;
    //             setImageDataUrl(dataUrl);

    //             // Calculate target width and height based on the desired height of 500 pixels
    //             const targetHeight = 300;
    //             const aspectRatio = image.width / image.height;
    //             const targetWidth = targetHeight * aspectRatio;

    //             const canvas = document.createElement('canvas');
    //             const ctx = canvas.getContext('2d');

    //             canvas.width = targetWidth;
    //             canvas.height = targetHeight;

    //             // Draw the image with the calculated dimensions
    //             ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

    //             // Get the resized data URL
    //             const resizedDataURL = canvas.toDataURL('image/jpeg');

    //             setFile(resizedDataURL);
    //             setFormValue({ ...formValue, image: resizedDataURL });
    //             // setFileName(file.name); // Ajout du nom du fichier
    //         };
    //     };
    //     reader.readAsDataURL(file);
    // };

    const handleFileUpload = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await axios.post("http://localhost:5000/api/upload", formData);
            setFileName(res.data);

            const reader = new FileReader();
            reader.onloadend = () => {
                const image = new Image();
                image.src = reader.result;
                image.onload = () => {
                    const dataUrl = reader.result;
                    setImageDataUrl(dataUrl);

                    // Calculate target width and height based on the desired height of 500 pixels
                    const targetHeight = 300;
                    const aspectRatio = image.width / image.height;
                    const targetWidth = targetHeight * aspectRatio;

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    canvas.width = targetWidth;
                    canvas.height = targetHeight;

                    // Draw the image with the calculated dimensions
                    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

                    // Get the resized data URL
                    const resizedDataURL = canvas.toDataURL('image/jpeg');

                    setFile(resizedDataURL);
                    setFormValue({ ...formValue, image: resizedDataURL });
                    // setFileName(file.name); // Ajout du nom du fichier
                };
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Error handling file upload:", error);
        }
    };

    const handleFileUploads = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const dataUrl = reader.result;
            // Use the dataUrl as needed (e.g., set state)
            setImageDataUrl(dataUrl)
        };
        reader.readAsDataURL(file);
    };

    const navigate = useNavigate()
    useEffect(() => {
        if (!Cookies.get('token')) {
            navigate('/')
        }
    }, [])

    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const [user, setUser] = useState(UserList[0]);
    const [color, setColor] = useState(ColorList[0]);
    const [gap, setGap] = useState(GapList[0]);
    const [prestations, setPrestations] = useState([])
    const [notats, setNotats] = useState([])
    const [prestationsList, setPrestationsList] = useState([])
    const [notatsList, setNotatsList] = useState([])
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
        titre_d: '',
        référence: '',
        nomi: Cookies.get("nom") || '',
        prénomi: Cookies.get("prenom") || '',
        teli: Cookies.get("tel") || '',
        maili: Cookies.get("email") || '',
        texte_prerequis: '',
        objet_mission: 'Nous faisons suite à votre demande. Vous avez souhaité nous missionner ',
        texte_visite: '',
        texte_missiondce: '',
        texte_preavis: '',
        accompte: '',
        notation: '',
        has_visite: '',
        has_prevue: '',




        nom: '',
        prenom: '',
        mission: '',
        adresse: '',
        client: '',
        nom_c: '',
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

        prestationslist: [],
        notatslist: [],



    });


    const onChange = (e) => {
        setFormValue({ ...formValue, [e.target.name]: e.target.value });
    };
    const next = () => {
        setCurrentStep(currentStep + 1);
    };

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const iddevis = queryParams.get('id');



    useEffect(() => {
        if (iddevis !== null) {
            fetch('http://localhost:5000/api/devis/devisall/' + iddevis, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
                .then(response => response.json())
                .then((data) => {
                    if (data) {
                        console.log('babababab:   , ', data.devis)
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
                            texte_prerequis: data.devis.prerequis,
                            objet_mission: data.devis.objet_mission,
                            notation: data.devis.notation,
                            has_visite: data.devis.has_visite,
                            has_prevue: data.devis.has_prevue,
                            texte_visite: data.devis.visite,
                            texte_preavis: data.devis.preavis,
                            texte_missiondce: data.devis.mission_dec,
                            accompte: data.devis.accompte

                        });



                        setDate(dayjs(data.devis.date))

                        // const formattedData = data.prestation.map(item => {
                        //     return {
                        //         value: item.id_p,
                        //         label: item.titre,
                        //         prix: item.prix,
                        //         tva: item.tva,
                        //     };
                        // });

                        // setPrestations(formattedData);

                        let presta = []
                        data?.prestation?.forEach(d => {
                            presta.push(d.id_p)
                        });
                        setSelectPrestationsOption(presta)

                        let notats = []
                        data?.notats?.forEach(d => {
                            notats.push(d.id_n)
                        });
                        setSelectNotatsOption(notats)



                        // let optionsNotes = [];
                        // data.notats.forEach(element => {
                        //     optionsNotes.push(element);
                        // });
                        // setNotats(optionsNotes);



                    } else {
                        // Handle the case when data is empty
                        // For example, set default values or show an error message
                        console.log("Data is empty");
                    }
                })
                .catch(error => {
                    // Handle any fetch errors here
                    console.error('Error fetching data:', error);
                });
        }
    }, []);



    function updateDevisWithClient() {
        const imgUrl = (!file || file === "") ? "" : fileName;
        fetch('http://localhost:5000/api/devis/update/all/' + iddevis, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                date: dayjs(formValue.date).format('DD-MM-YYYY'),
                titre_d: formValue.titre_d,
                reference: formValue.référence,
                nom_inter: formValue.nom_inter,
                prenom_inter: formValue.prenom_inter,
                mail_inter: formValue.mail_inter,
                tel_inter: formValue.tel_inter,
                prerequis: formValue.texte_prerequis,
                objet_mission: formValue.objet_mission,
                notation: formValue.notation,
                has_visite: formValue.has_visite,
                has_prevue: formValue.has_prevue,
                visite: formValue.texte_visite,
                mission_dec: formValue.texte_missiondce,
                preavis: formValue.texte_preavis,
                accompte: formValue.accompte,

                nom_c: formValue.nom_c,
                adresse: formValue.adresse,
                tel: formValue.tel,
                mail: formValue.mail,
                adressef: formValue.adressef,
                mission: formValue.mission,
                nom: formValue.nom,
                prenom: formValue.prenom,
                image: imgUrl,


            }),
        })
            .then(response => response.json())
            .then((data) => {
                devisWithPrestation(iddevis);
                devisWithNotats(iddevis);

                notification.success({

                    description: 'Vous avez bien modifié le devis',
                    placement: 'bottomRight',
                    icon: <CheckCircleOutlined style={{ color: '#fffff' }} />,
                    style: { background: '#7ae700', color: '#fff' },
                    closeIcon: <CloseOutlined style={{ color: '#ffff' }} />

                })
                navigate('/Devis/Liste');


            })
            .catch(error => {
                console.error(error);
            });

    }

    function deleteDevisWithPrestation() {

        fetch('http://localhost:5000/api/devisWithPrestation/delete/' + iddevis, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                deleteDevisWithNotats();
                updateDevisWithClient();
            });


    }

    function deleteDevisWithNotats() {

        fetch('http://localhost:5000/api/devisWithNotats/delete/' + iddevis, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)

            });


    }


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
                // return 0;
                const doc = new Docxtemplater(zip, {
                    modules: [new ImageModule(imageOptions)],
                });


                setTimeout(() => {
                    doc.renderAsync(formValue).then(function () {
                        const out = doc.getZip().generate({
                            type: 'blob',
                            mimeType:
                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        });
                        saveAs(out, "generated.docx");
                    });
                }, 1000);
            }
        );
    };

    const getPrestation = () => {
        fetch('http://localhost:5000/api/prestation')
            .then(response => response.json())
            .then(data => {
                const formattedData = data.map(item => {
                    return {
                        value: item.id_p,
                        label: item.titre,
                        prix: item.prix,
                        tva: item.tva,
                    };
                });
                setPrestations(formattedData);
                setPrestationsList(data)
            })
            .catch(error => console.error(error));
    }
    const getNotats = () => {
        fetch('http://localhost:5000/api/notats')
            .then(response => response.json())
            .then(data => {
                const formattedData = data.map(item => {
                    return {
                        value: item.id_n,
                        label: item.titre_n,

                    };
                });
                setNotats(formattedData);
                setNotatsList(data)
            })
            .catch(error => console.error(error));
    }

    // const onSelect = (e) => {
    //     localStorage.setItem('selectedPresId', e);
    //     const element = prestationsList.find(item => item.id_p === e);
    //     setFormValue({ ...formValue, titre: element.titre, texte: element.texte, prix: element.prix, tva: element.tva, });
    // }

    const addClient = () => {

        let selectedPresId = localStorage.getItem('selectedPresId');
        fetch('http://localhost:5000/api/client/add', {
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
                image: fileName,
            }),
        })
            .then(response => response.json())
            .then(data => {
                const clientId = data.insertId;
                localStorage.setItem('idClient', clientId);
                addDevis(clientId);
            })
            .catch(error => {
                console.error(error);

            });
    };

    useEffect(() => {
        console.log(formValue)
        if (formValue.prestationslist.length > 0) {
            let accompteCond = formValue.accompte == 100 ? false : true
            let totalHT = 0
            let totalTTC = 0
            let tva = 0
            formValue?.prestationslist.forEach(presta => {
                totalHT += presta.prix
            });
            tva = totalHT * 20 / 100
            totalTTC = tva + totalHT

            setFormValue({
                ...formValue,
                totalHT: totalHT,
                totalTTC: totalTTC,
                tva: tva,
                accompteCond: accompteCond
            })
        }
    }, [formValue])

    const devisWithPrestation = (id) => {

        let arrayAux = [];
        selectPrestationsOption.forEach(element => {
            arrayAux.push(element);
        });
        arrayAux.forEach(element => {
            fetch('http://localhost:5000/api/devisWithPrestation/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_d: id,
                    id_p: element,
                }),
            })
                .then(response => response.json())
                .then(data => {
                })
                .catch(error => {
                    console.error(error);

                });
        });



    };
    const devisWithNotats = (id) => {

        let arrayAux = [];
        selectNotatsOption.forEach(element => {
            arrayAux.push(element);
        });
        arrayAux.forEach(element => {
            fetch('http://localhost:5000/api/devisWithNotats/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_d: id,
                    id_n: element,
                }),
            })
                .then(response => response.json())
                .then(data => {

                })
                .catch(error => {
                    console.error(error);

                });
        });



    };
    // const updatedevisWithPrestation = () => {
    //     let arrayAux = [];
    //     selectPrestationsOption.forEach(element => {
    //         arrayAux.push(element);
    //     });
    //     arrayAux.forEach(element => {
    //         fetch('http://localhost:5000/api/devisWithPrestation/update/' + iddevis, {
    //             method: 'PUT',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({

    //                 id_d: localStorage.getItem('idDevis'),
    //                 id_p: element,
    //             }),
    //         })
    //             .then(response => response.json())
    //             .then(data => {
    //                 devisWithPrestation();

    //             })
    //             .catch(error => {
    //                 console.error(error);

    //             });
    //     });
    // };
    const updatedevisWithNotats = () => {
        let arrayAux = [];
        selectPrestationsOption.forEach(element => {
            arrayAux.push(element);
        });
        arrayAux.forEach(element => {
            fetch('http://localhost:5000/api/devisWithNotats/update/' + iddevis, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({

                    id_d: localStorage.getItem('idDevis'),
                    id_n: element,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    devisWithNotats()

                })
                .catch(error => {
                    console.error(error);

                });
        });
    };
    function addDevis(idClient) {
        fetch('http://localhost:5000/api/devis/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                reference: formValue.référence,
                date: dayjs(formValue.date).format('DD-MM-YYYY'),
                titre_d: formValue.titre_d,
                nom_inter: formValue.nom_inter,
                prenom_inter: formValue.prenom_inter,
                tel_inter: formValue.tel_inter,
                mail_inter: formValue.mail_inter,
                prerequis: formValue.texte_prerequis,
                objet_mission: formValue.objet_mission,
                notation: formValue.notation,
                has_visite: formValue.has_visite,
                has_prevue: formValue.has_prevue,
                visite: formValue.texte_visite,
                mission_dec: formValue.texte_missiondce,
                preavis: formValue.texte_preavis,
                accompte: formValue.accompte,


                id_u: Cookies.get("id"),
                id_c: idClient,
            }),
        })
            .then(response => response.json())
            .then(data => {
                notification.success({

                    description: 'Vous avez bien telecharger et enregistrer votre devis',
                    placement: 'bottomRight',
                    icon: <CheckCircleOutlined style={{ color: '#fffff' }} />,
                    style: { background: '#7ae700', color: '#fff' },
                    closeIcon: <CloseOutlined style={{ color: '#ffff' }} />

                })


                const devisId = data.insertId;
                localStorage.setItem('idDevis', devisId);
                devisWithPrestation(devisId)
                devisWithNotats(devisId);
                generateDevis();
                navigate('/Devis/Liste');




            })
            .catch(error => {
                console.error(error);

            });
    }
    useEffect(() => {
        getPrestation()
        getNotats()
    }, [])


    useEffect(() => {
        console.log(formValue)
    }, [formValue])


    const options = [];
    for (let i = 10; i < 36; i++) {
        options.push({
            label: i.toString(36) + i,
            value: i.toString(36) + i,
        });
    }

    const handleChange = (value, text) => {

        let arrayAux = [];

        let X = []
        text.forEach((element) => {
            const selectedPrestation = prestationsList.find((p) => p.id_p === element.value);
            if (selectedPrestation) {
                X.push({
                    titre: element.label,
                    texte: selectedPrestation.texte,
                    prix: selectedPrestation.prix,
                    tva: selectedPrestation.tva
                });
            } else {
                console.log(`Selected element ${element.label} with value ${element.value} not found in prestationsList.`);
            }
        });


        value.forEach((element, index) => {
            arrayAux.push(element);
        });


        console.log("X:", X);

        setFormValue({ ...formValue, prestationslist: X });


        setSelectPrestationsOption(arrayAux);

    };
    const [selectNotatsOption, setSelectNotatsOption] = useState([]);
    const handleChangenotats = (value) => {
        let arrayAux = [];
        value.forEach((element, index) => {
            arrayAux.push(element);
        });
        setFormValue({ ...formValue, [notatsList]: arrayAux });

        setSelectNotatsOption(arrayAux);

    };

    useEffect(() => {
        console.log('setSelectPrestationsOption', selectPrestationsOption);
    }, [selectPrestationsOption], [selectNotatsOption])


    const handleDateChange = (selectedDate) => {
        const formattedDate = dayjs(selectedDate).format('DD-MM-YYYY');
        setFormValue({ ...formValue, date: formattedDate });

        setDate(dayjs(selectedDate))
    };



    return (
        <Layout>
            <Sidebar />
            <Layout className="site-layout " style={{ backgroundColor: '#001529' }}>
                <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 100 }}>
                    <span style={{ fontSize: '17px', color: 'white' }}>
                        <FormOutlined className='fs-3 pe-4' />
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
                                title: 'Information de devis',

                            },
                            // {
                            //     title: 'Délais d\'intervention',
                            // },
                            // {
                            //     title: 'Notats',
                            // },
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
                                        {/* <DatePicker value={formValue.date ? dayjs(formValue.date) : null} locale={locale} className='col-6' onChange={(v) => { setFormValue({ ...formValue, date: dayjs(v).format() }) }} /> */}
                                        <DatePicker value={date} locale={locale} className='col-6' onChange={(v) => handleDateChange(v)} format={'DD-MM-YYYY'}/>

                                    </MDBValidationItem>
                                    <MDBValidationItem className='col-md-6' feedback="Merci de remplire le nom de l'nterlocuteur ." invalid>
                                        <label>Titre de Devis :</label>
                                        <MDBInput
                                            className='mt-2'
                                            value={formValue.titre_d}
                                            name='titre_d'
                                            onChange={onChange}
                                            id='validationCustom02'
                                            required
                                        />
                                    </MDBValidationItem>
                                    <MDBValidationItem feedback='Merci de remplire La référence Devis.' invalid>

                                        <Col xl={6}> <label>Référence Devis</label> </Col>
                                        <Col xl={6}>
                                            <MDBInput
                                                value={formValue.référence}
                                                name='référence'
                                                onChange={onChange}
                                                id='validationCustom03'
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
                                            value={formValue.nom_inter}
                                            name='nom_inter'
                                            onChange={onChange}
                                            id='validationCustom03'
                                            required
                                        />
                                    </MDBValidationItem>
                                    <MDBValidationItem className='col-md-6' feedback="Merci de remplire le prénom de l'nterlocuteur ." invalid>
                                        <label>Prénom:</label>
                                        <MDBInput
                                            className='mt-2'
                                            value={formValue.prenom_inter}
                                            name='prenom_inter'
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
                                            value={formValue.tel_inter}
                                            name='tel_inter'
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
                                            value={formValue.mail_inter}
                                            name='mail_inter'
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

                                        </div>
                                        <div className='mt-5 col-md-4 ' style={{ border: '1px solid #ccc', margin: '10px', padding: '10px', borderRadius: '20px', textAlign: 'center', backgroundColor: '#e8f0fe' }}>

                                            <p style={{ color: 'red' }}>{fileName}</p>
                                            <img
                                                src={imageDataUrl ? imageDataUrl : `/upload/${formValue?.image}`}
                                                alt=""
                                                style={{ maxWidth: '100%', maxWidth: '100%', borderRadius: '4px' }}
                                            />
                                        </div>
                                    </MDBValidationItem>
                                    <div className='d-flex gap-2'>
                                        <Button onClick={() => setCurrentStep(currentStep - 1)}>Précedent</Button>

                                        <Button type='submit'>Suivant</Button>
                                    </div>
                                </MDBValidation>
                            </Row>
                        </>
                    }
                    {currentStep === 3 && <>

                        <Row className='mt-5'>
                            <div className='d-flex align-items-center gap-4'>
                                <CodepenOutlined className='fs-1' />
                                <h4>Information de devis</h4>
                            </div>
                        </Row>
                        <Row>
                            <MDBValidation onSubmit={(e) => {
                                let form = document.querySelector('.needs-validation')
                                if (form.checkValidity()) {
                                    next()
                                }
                            }} className='row g-3'>


                                <MDBValidationItem feedback='Merci de remplire le texte.' invalid>
                                    <Col xl={6}> <h6>Objet de mission </h6> </Col>

                                    <Col xl={6}>

                                        <TextArea
                                            value={formValue.objet_mission}
                                            name='objet_mission'
                                            onChange={onChange}
                                            id='validationCustom15'
                                            required
                                        />

                                    </Col>

                                </MDBValidationItem>
                                <MDBValidationItem feedback='Merci de remplire le texte.' invalid>
                                    <Col xl={6}> <h6>Données d'entrée & Pré-requis</h6> </Col>

                                    <Col xl={6}>

                                        <TextArea
                                            value={formValue.texte_prerequis}
                                            name='texte_prerequis'
                                            onChange={onChange}
                                            id='validationCustom15'
                                            required
                                        />

                                    </Col>

                                </MDBValidationItem>



                                <MDBValidationItem feedback='Merci de remplire La Mission.' invalid>
                                    <Col xl={6}> <h6>Prestation</h6> </Col>
                                    <Col xl={6}> <Select
                                        mode="multiple"
                                        value={selectPrestationsOption}
                                        style={{ width: 200 }}
                                        onChange={handleChange}
                                        options={prestations}
                                    /></Col>
                                </MDBValidationItem>
                                <h6>Délais d'intervention</h6>
                                <MDBValidationItem feedback='Merci de remplire le texte.' invalid>
                                    <Col xl={6}> <label>Visite</label> </Col>

                                    <Col xl={6}>

                                        <TextArea
                                            value={formValue.texte_visite}
                                            name='texte_visite'
                                            onChange={onChange}
                                            id='validationCustom16'
                                            required
                                        />

                                    </Col>

                                </MDBValidationItem>
                                <MDBValidationItem feedback='Merci de remplire le texte.' invalid>
                                    <Col xl={6}> <label>Mission </label> </Col>

                                    <Col xl={6}>

                                        <TextArea
                                            value={formValue.texte_missiondce}
                                            name='texte_missiondce'
                                            onChange={onChange}
                                            id='validationCustom17'
                                            required
                                        />

                                    </Col>

                                </MDBValidationItem>
                                
                                <MDBValidationItem feedback='Merci de remplire le texte.' invalid>
                                <label className='mb-3'>Condition d'execution</label>
                                    <Col xl={6}> <label>Préavis</label> </Col>

                                    <Col xl={6}>

                                        <TextArea
                                            value={formValue.texte_preavis}
                                            name='texte_preavis'
                                            onChange={onChange}
                                            id='validationCustom18'
                                            required
                                        />

                                    </Col>

                                </MDBValidationItem>

                                <MDBValidationItem feedback='Merci de remplire le texte.' invalid>

                                    <Col xl={6}> <label>Condition d'execution </label> </Col>

                                    <Col xl={6} className='mt-3'>
                                        <Radio.Group onChange={onChangeradiovisite} value={formValue.has_visite}>
                                            <Radio value={'avec une visite préalable'}>Avec une visite préalable</Radio>
                                            <Radio value={'sans une visite préalable'}>Sans une visite préalable</Radio>
                                        </Radio.Group>

                                    </Col>

                                </MDBValidationItem>
                                
                                    <Col xl={6}> <label>Texte libre  </label> </Col>

                                    <Col xl={12}>

                                        <TextArea
                                            value={formValue.notation}
                                            name='notation'
                                            onChange={onChange}
                                        />

                                    </Col>

                                
                                <h6>Précisions & Exclusion</h6>
                                <MDBValidationItem feedback='Merci de remplire le texte.' invalid>



                                    <Col xl={6}>
                                        <Radio.Group onChange={onChangeradioprevue} value={formValue.has_prevue}>
                                            <Radio value={'N\'est pas prévue dans notre offre'}>N'est pas prévue dans notre offre</Radio>
                                            <Radio value={'C\'est prévue dans notre offre'}>C'est prévue dans notre offre</Radio>
                                        </Radio.Group>

                                    </Col>

                                </MDBValidationItem>

                                <MDBValidationItem feedback='Merci de choisir Accompte.' invalid>

                                    <Col xl={6}> <label>Accompte</label> </Col>

                                    <Col xl={6}>
                                        <Slider
                                            onChange={onChangeSlider}
                                            value={formValue.accompte}
                                            step={5}
                                            defaultValue={formValue.accompte}
                                        />
                                    </Col>
                                    <Col span={4}>
                                        <InputNumber
                                            min={0}
                                            max={1}
                                            style={{ margin: '0 16px' }}
                                            step={5}
                                            value={formValue.accompte}
                                            onChange={onChangeInput}
                                        />
                                    </Col>
                                </MDBValidationItem>





                                <div className='d-flex gap-2'>
                                    <Button onClick={() => setCurrentStep(currentStep - 1)}>Précedent</Button>

                                    <Button type='submit'>Suivant</Button>
                                </div>




                            </MDBValidation>
                        </Row>
                    </>}
                    {/* {currentStep === 4 &&
                        <>
                            <Row className='mt-5'>
                                <div className='d-flex align-items-center gap-4'>
                                    <BarChartOutlined className='fs-1' />
                                    <h4>Délais d'intervention</h4>
                                </div>
                            </Row>
                            <Row>
                                <MDBValidation onSubmit={(e) => {
                                    let form = document.querySelector('.needs-validation')
                                    if (form.checkValidity()) {
                                        next()
                                    }
                                }} className='row g-3'>


                                    <MDBValidationItem feedback='Merci de remplire le texte.' invalid>
                                        <Col xl={6}> <label>Visite</label> </Col>

                                        <Col xl={6}>

                                            <TextArea
                                                value={formValue.texte_visite}
                                                name='texte_visite'
                                                onChange={onChange}
                                                id='validationCustom16'
                                                required
                                            />

                                        </Col>

                                    </MDBValidationItem>
                                    <MDBValidationItem feedback='Merci de remplire le texte.' invalid>
                                        <Col xl={6}> <label>Mission </label> </Col>

                                        <Col xl={6}>

                                            <TextArea
                                                value={formValue.texte_missiondce}
                                                name='texte_missiondce'
                                                onChange={onChange}
                                                id='validationCustom17'
                                                required
                                            />

                                        </Col>

                                    </MDBValidationItem>
                                    <h6>Condition d'execution</h6>
                                    <MDBValidationItem feedback='Merci de remplire le texte.' invalid>



                                        <Col xl={6}>
                                            <Radio.Group onChange={onChangeradiovisite} value={valuevisite}>
                                                <Radio value={1}>Avec une visite préavis</Radio>
                                                <Radio value={2}>Sans une visite préavis</Radio>
                                            </Radio.Group>

                                        </Col>

                                    </MDBValidationItem>
                                    <MDBValidationItem feedback='Merci de remplire le texte.' invalid>
                                        <Col xl={6}> <label>Notation (Facultative) </label> </Col>

                                        <Col xl={6}>

                                            <TextArea
                                                value={formValue.texte_notation}
                                                name='texte_notation'
                                                onChange={onChange}
                                                id='validationCustom17'
                                                required
                                            />

                                        </Col>

                                    </MDBValidationItem>
                                    <h6>Précisions & Exclusion</h6>
                                    <MDBValidationItem feedback='Merci de remplire le texte.' invalid>



                                        <Col xl={6}>
                                            <Radio.Group onChange={onChangeradioprevue} value={valueprevue}>
                                                <Radio value={1}>N'est pas prévue dans notre offre</Radio>
                                                <Radio value={2}>C'est prévue dans notre offre</Radio>
                                            </Radio.Group>

                                        </Col>

                                    </MDBValidationItem>





                                    <div className='d-flex gap-2'>
                                        <Button onClick={() => setCurrentStep(currentStep - 1)}>Précedent</Button>

                                        <Button type='submit'>Suivant</Button>
                                    </div>

                                </MDBValidation>
                            </Row>

                        </>

                    }

                    {currentStep === 5 &&
                        <>
                            <Row className='mt-5'>
                                <div className='d-flex align-items-center gap-4'>
                                    <BarChartOutlined className='fs-1' />
                                    <h4>Notats</h4>
                                </div>
                            </Row>
                            <Row>
                                <MDBValidation onSubmit={(e) => {
                                    let form = document.querySelector('.needs-validation')
                                    if (form.checkValidity()) {
                                        next()
                                    }
                                }} className='row g-3'>


                                    <MDBValidationItem className='col-md-6' feedback='Merci de remplire La Notats.' invalid>
                                        <Select
                                            mode="multiple"
                                            value={selectNotatsOption}
                                            style={{ width: 200 }}
                                            onChange={handleChangenotats}
                                            options={notats}
                                        />
                                    </MDBValidationItem>


                                    <div className='d-flex gap-2'>
                                        <Button onClick={() => setCurrentStep(currentStep - 1)}>Précedent</Button>

                                        <Button type='submit'>Suivant</Button>
                                    </div>

                                </MDBValidation>
                            </Row>

                        </>
                    } */}
                    {/* {currentStep === 5 &&
                        <>
                            <Row className='mt-5'>
                                <div className='d-flex align-items-center gap-4'>
                                    <BarChartOutlined className='fs-1' />
                                    <h4>Notats</h4>
                                </div>
                            </Row>
                            <Row>
                                <MDBValidation onSubmit={(e) => {
                                    let form = document.querySelector('.needs-validation')
                                    if (form.checkValidity()) {
                                        next()
                                    }
                                }} className='row g-3'>


                                    <MDBValidationItem className='col-md-6' feedback='Merci de remplire La Notats.' invalid>
                                        <Select
                                            mode="multiple"
                                            value={selectNotatsOption}
                                            style={{ width: 200 }}
                                            onChange={handleChangenotats}
                                            options={notats}
                                        />
                                    </MDBValidationItem>


                                    <div className='d-flex gap-2'>
                                        <Button onClick={() => setCurrentStep(currentStep - 1)}>Précedent</Button>

                                        <Button type='submit'>Suivant</Button>
                                    </div>

                                </MDBValidation>
                            </Row>

                        </>
                    } */}


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

                                        {iddevis == null && (
                                            <div className='col-12'>
                                                <Button onClick={() => { addClient(); }}> <UploadOutlined className='me-2' /> Cliquez pour enregister et télécharger</Button>

                                            </div>
                                        )}
                                        {iddevis != null && (
                                            <div className='col-12'>
                                                <Button onClick={() => {
                                                    generateDevis(); deleteDevisWithPrestation();
                                                }} type='submit'>Modifier</Button>

                                            </div>
                                        )}
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






