import React, { useState } from "react";
import { UserOutlined, MenuOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Menu, Input, Button, Dropdown, Row, Drawer, Divider } from 'antd';

import './Navbars.css';

const Navbars = () => {
    const [current, setCurrent] = useState('mail');
    const [drawerVisible, setDrawerVisible] = useState(false);

    const onClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    const showDrawer = () => {
        setDrawerVisible(true);
    };

    const onCloseDrawer = () => {
        setDrawerVisible(false);
    };

    const hamburgerMenu = (
        <Menu>
            <Menu.Item key="menu1">Home</Menu.Item>
            <Menu.Item key="menu2">About Us</Menu.Item>
            <Menu.Item key="menu3">Blogs</Menu.Item>
            <Menu.Item key="menu4">Career</Menu.Item>
            <Menu.Item key="menu5">Services</Menu.Item>
            <Menu.Item key="menu6">Contact Us</Menu.Item>
        </Menu>
    );

    const userProfileMenu = (
        <Menu>
            <Menu.Item key="mode">Dark Mode</Menu.Item>
            <Menu.Item key="Profile">Profile</Menu.Item>
            <Divider />
            <Menu.Item key="new">What's new</Menu.Item>
            <Menu.Item key="help">Help</Menu.Item>
            <Menu.Item key="feedback">Send Feedback</Menu.Item>
            <Menu.Item key="hints">Hints & Shortcuts</Menu.Item>
            <Divider />
            <Menu.Item key="logout">Logout</Menu.Item>
        </Menu>
    );

    return (
        <section className="navbars" id="navbars">
            <div className="navbars-content">
                <div className="navbar">
                    <Menu mode="horizontal" selectedKeys={[current]}>
                        <Row className="d-flex-btw w-100">
                            <div>
                                <Menu.Item key="hamburger" onClick={showDrawer}>
                                    <MenuOutlined />
                                </Menu.Item>
                                <Menu.Item key="search" onClick={onClick}>
                                    <Input
                                        placeholder="Search"
                                        suffix={<SearchOutlined />}
                                    />
                                </Menu.Item>
                            </div>
                            <div>
                                <Menu.Item key="addMembers" onClick={onClick}>
                                    <Button type="primary"><PlusOutlined /> INVITE TEAM MEMBER</Button>
                                </Menu.Item>
                                <Menu.Item key="userProfile" icon={<UserOutlined />} onClick={onClick}>
                                    <Dropdown overlay={userProfileMenu} placement="bottomLeft" trigger={['click']}>
                                        <a href="/" onClick={(e) => e.preventDefault()}> </a>
                                    </Dropdown>
                                </Menu.Item>
                            </div>
                        </Row>
                    </Menu>
                    <Drawer
                        placement="left"
                        closable={false}
                        onClose={onCloseDrawer}
                        visible={drawerVisible}
                    >
                        {hamburgerMenu}
                    </Drawer>
                </div>
            </div>
        </section>
    );
};

export default Navbars;
