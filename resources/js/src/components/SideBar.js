import React, { memo } from 'react';
import { Layout, Menu, Icon } from 'antd';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { matchPath } from 'react-router';
import { push } from 'connected-react-router';

import { sideBarState, getLocation } from '../selectors/cockpit';
import { ResponsiveContext } from "../contexts/Responsive";

const Logo = styled.div`
  height: 32px;
  color: #000;
  margin: 14px;
  text-align: center;
  font-size: 1.75rem;
  font-weight: lighter;
`;

const menuLinks = {
    1: '/entity',
    2: '/attributes',
}

const SideBar = memo((props) => {
    const onMenuSelect = ({ item, key, keyPath }) => {        
        props.dispatch(push(menuLinks[key]));
    }

    const getSelectedKey = () => {

        const found = Object.keys(menuLinks).find((item) => {
            const match  = matchPath(props.location.pathname, {
                path: menuLinks[item],
                exact: true,
            });

            return (match && true) || false;
        });        

        return (found && [found]) || ['1'];
    }
    return (
        <ResponsiveContext.Consumer>
            {(size) => (
                <Layout.Sider
                    theme="light"
                    trigger={null}
                    collapsible
                    collapsed={ size === 'small' ? true : props.collapsed }
                    >
                    <Logo>EAV</Logo>
                    <Menu theme="light" mode="inline" selectedKeys={getSelectedKey()} onSelect={onMenuSelect}>
                        <Menu.Item key="1">
                            <Icon type="database" />
                            <span>Entities</span>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Icon type="profile" />
                            <span>Attributes</span>
                        </Menu.Item>
                    </Menu>
                </Layout.Sider>
            )}
        </ResponsiveContext.Consumer>
    );
});

const mapStateToProps  = (state) => {
    return {
        collapsed: sideBarState(state),
        location: getLocation(state),
    }
}

export default connect(mapStateToProps)(SideBar);