import React, { PureComponent, Suspense, lazy } from 'react';
import { Modal, Drawer } from 'antd';
import { connect } from 'react-redux';

import { ResponsiveContext } from "../contexts/Responsive";
import { drawerState, drawerData } from '../selectors';
import { closeDrawer } from '../actions';

import FallbackLoading from './FallbackLoading';

const Set = lazy(() => import('./Set' /* webpackChunkName: "set" */));
const AddSet = lazy(() => import('./AddSet' /* webpackChunkName: "addSet" */));
const EditSet = lazy(() => import('./EditSet' /* webpackChunkName: "editSet" */));
const AddAttribute = lazy(() => import('./AddAttribute' /* webpackChunkName: "addAttribute" */));
const EditAttribute = lazy(() => import('./EditAttribute' /* webpackChunkName: "editAttribute" */));

const confirm = Modal.confirm;

class GloableDrawer extends PureComponent {
    
    canClose = () => true; 

    onClose = () => null; 

    getContent = (props) => {    
        this.canClose = () => true;
        if(!props.visible) return [null, null];

        const { data } = props;

        if(data.type === 'set') {
            return [
                `Edit "${data.set.name}" set`, 
                <Set 
                    {...data} 
                    close={this.close} 
                    canClose={ state => (this.canClose = state) } 
                    onClose={ func => (this.onClose = func ) }
                />
            ];
        } else if(data.type === 'addSet') {
            return [
                `Add Set`, 
                <AddSet 
                    {...data}
                    close={this.close} 
                    canClose={ state => (this.canClose = state) } 
                    onClose={ func => (this.onClose = func ) }
                />
            ];
        } else if(data.type === 'editSet') {
            return [
                `Edit Set`, 
                <EditSet 
                    {...data}
                    close={this.close} 
                    canClose={ state => (this.canClose = state) } 
                    onClose={ func => (this.onClose = func ) }
                />
            ];
        } else if(data.type === 'addAttribute') {
            return [
                `Add Attribute`, 
                <AddAttribute 
                    {...data}
                    close={this.close} 
                    canClose={ state => (this.canClose = state) } 
                    onClose={ func => (this.onClose = func ) }
                />
            ];
        } else if(data.type === 'editAttribute') {
            return [
                `Edit Attribute`, 
                <EditAttribute 
                    {...data}
                    close={this.close} 
                    canClose={ state => (this.canClose = state) } 
                    onClose={ func => (this.onClose = func ) }
                />
            ];
        } else {
            return [null , null];
        }        
    }

    close = () => {
        if(this.canClose()) {
            this.onClose();
            this.props.dispatch(closeDrawer());
        } else {
            confirm({
                title: 'Are you sure to close this task?',
                content: 'You have unsaved data.',
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk: () => {
                    this.onClose();
                    this.props.dispatch(closeDrawer());
                },
                onCancel() {                  
                },
            });
        }
    }

    render() {
        const [title, content] = this.getContent(this.props);
        return (
            <ResponsiveContext.Consumer>
                {(size) => (
                    <Drawer
                        title={title}
                        placement="right"
                        closable={false}
                        width={size === 'small'? '90%': '65%'}               
                        onClose={this.close}
                        visible={this.props.visible}
                    >
                        <Suspense fallback={<FallbackLoading />}>
                            {this.props.visible ? content: null }
                        </Suspense>
                    </Drawer>
                )}
            </ResponsiveContext.Consumer>
        )
    }
} 

const mapStateToProps  = (state) => {
    return {
        visible: drawerState(state),
        data: drawerData(state)
    }
}

export default connect(mapStateToProps)(GloableDrawer);