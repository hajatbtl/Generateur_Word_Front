import { Layout, Menu } from 'antd';
import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Nav } from 'react-bootstrap';
import img1 from '../img/logo2.png';

import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined,
    SettingOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';


const { Header, Content, Footer, Sider } = Layout;

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(true);
    const [collapsedWidth, setCollapseWidth] = useState(0);

    useEffect(() => {
        checkWindowSize();
    }, [])

    useEffect(() => {

        window.addEventListener('resize', checkWindowSize);
        return () => {
            window.removeEventListener('resize', checkWindowSize);
        };
    });

    const checkWindowSize = () => {
        if (window.innerWidth > 1200) {
            setCollapsed(false);
            setCollapseWidth(70)
        } else if (window.innerWidth > 992 || window.innerWidth > 768) {
            setCollapsed(true);
            setCollapseWidth(70)
        } else if (window.innerWidth < 768) {
            setCollapsed(true);
            setCollapseWidth(1)
        }
    }

    function getItem(label, key, className, icon, onClick, children, type) {
        return {
            key,
            icon,
            className,
            children,
            onClick,
            label,
            type,
        };
    }

    const items = [
      
       
        getItem('Les devis', '/Devis/Liste', 'my-3', <PieChartOutlined className='fs-5 pe-2' />, () => { navigate('/Devis/Liste') }),
        getItem('Les prestations', '/Prestations/Liste', 'my-3', <PieChartOutlined className='fs-5 pe-2' />, () => { navigate('/Prestations/Liste') }),
        getItem('Les notats', '/Notats/Liste', 'my-3', <PieChartOutlined className='fs-5 pe-2' />, () => { navigate('/Notats/Liste') }),

        getItem('Configuration du compte', '/settings', 'my-3', <SettingOutlined className='fs-5 pe-2' />, () => { navigate('/settings') }),


        { type: 'divider' },
        getItem('Se deconnecter', 'logout', 'my-3 mt-4', <LogoutOutlined className='fs-5 pe-2' />, () => {
            Cookies.remove('token')
            Cookies.remove('nom')
            Cookies.remove('prenom')
            Cookies.remove('id')
            Cookies.remove('tel')
            Cookies.remove('email')
            navigate('/')
        }),
    ];

    return (
        <Sider className='vh-100' theme='light' width={280} breakpoint='lg' collapsedWidth={collapsedWidth} collapsed={collapsed}
        >
            <div className='p-2 text-center float-end toggle-menu'>
                {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                    className: 'trigger',
                    onClick: () => setCollapsed(!collapsed),
                })}
            </div>
            <div className="logo text-center my-3 mt-5" >
                <img src={img1} className="img-fluid" style={{ height: 90 }} />
            </div>
            <Menu
                theme="light"
                mode="inline"
                defaultSelectedKeys={[location.pathname]}
                items={items}

            />
        </Sider>



    );
};
export default Sidebar