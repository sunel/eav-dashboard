import React, { PureComponent } from 'react';
import { Layout, Row, Col, Icon, Menu, Dropdown } from 'antd';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { sideBarState } from '../selectors';
import { toogleSideBar, openDrawer } from '../actions';

const MenuIcon = styled(Icon)`
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color .3s;
`;

const DropdownWrapper = styled(Dropdown)`
    margin-right: 2rem;
`;

const HeaderWrapper = styled(Layout.Header)`
    background: #fff;
    padding: 0;
`;

class Header extends PureComponent {
    render() {

        const menu = (
            <Menu selectedKeys={[]} onClick={({key}) => this.props.dispatch(openDrawer(key))}>
                <Menu.Item key="newAttribute">
                    <span>New Attribute</span>
                </Menu.Item>
                <Menu.Item key="newAttributeSet">
                    <span>New Attribute Set</span>
                </Menu.Item>
                <Menu.Item key="newAttributeGroup">
                    <span>New Attribute Group</span>
                </Menu.Item>
            </Menu>
        );

        return (
            <HeaderWrapper>
                <Row>
                    <Col span={12}>
                        <Row type="flex" justify="start" align="middle">
                            <MenuIcon
                                type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={() => this.props.dispatch(toogleSideBar())}
                            />
                        </Row>
                    </Col>
                    <Col span={12} style={{ display: 'none' }}>
                        <Row type="flex" justify="end" align="middle">
                            <DropdownWrapper overlay={menu}>
                                <MenuIcon type="plus" />
                            </DropdownWrapper> 
                        </Row>
                    </Col>
                </Row>
                
            </HeaderWrapper>
        );
    }
}

const mapStateToProps  = (state) => {
    return {
        collapsed: sideBarState(state)
    }
}

export default connect(mapStateToProps)(Header);