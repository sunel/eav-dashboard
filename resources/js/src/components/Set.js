import React, { Fragment, PureComponent, Suspense, lazy } from 'react';
import { Row, Col, Button, Drawer, Empty, notification, message } from 'antd';
import { connect } from 'react-redux';
import styled from 'styled-components';
import isEqual from 'lodash.isequal';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import { listGroups, reorderSet, saveGroupAttributes, dataChanged } from '../actions';
import { selectGroups, selectGroupAttributes, selectAttributes } from '../selectors/entity';
import { persistSet } from '../utils/WebAPI';
import { hasChanges } from '../selectors/cockpit';
import { updateSequence } from '../utils/common';
import { ResponsiveContext } from "../contexts/Responsive";

import FallbackLoading from './FallbackLoading';

import Group from './Group';

const AddGroup = lazy(() => import('./AddGroup' /* webpackChunkName: "addGroup" */));
const AttributeList = lazy(() => import('./AttributeList' /* webpackChunkName: "attributeList" */));
const AddAttribute = lazy(() => import('./AddAttribute' /* webpackChunkName: "addAttribute" */));

const Container = styled.div`
    background-color: #fff;
`;

const GroupPanelWrapper = styled.div`
    height: calc(90vh - 108px);
    overflow: auto;
`;

const reorder = (list, startIndex, endIndex) => {
    let result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return updateSequence(result);
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    let destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = updateSequence(destClone);
    result['moved'] = removed;

    return result;
};

class Set extends PureComponent {

    state = { 
        subDrawer: false,
        subDrawerContent: null,
        subDrawerTitle: null,
        loading: false,
    };

    getAttributes = () => [];
    updateAttributes = () => null;

    componentDidMount = () => {
        this.props.dispatch(listGroups({ params: { entity: this.props.entity, set: this.props.set.id }}));

        this.props.canClose(() => !this.props.hasChanges);

        this.props.onClose(() => this.props.dispatch(dataChanged({ type: 'entityViewer', changed: false})));
    }

    addGroup = () => {
        this.setState({            
            subDrawerContent: 'addGroup',
            subDrawerTitle: 'Add Group',
            subDrawer: true,
        });
    }

    addAttribute = () => {
        this.setState({            
            subDrawerContent: 'addAttribute',
            subDrawerTitle: 'Add Attribute',
            subDrawer: true,
        });
    }

    onSubDrawerClose = () => {
        this.setState({
            subDrawer: false,
            subDrawerContent: null,
            subDrawerTitle: null,
        });
    };

    getDrawerContent = () => {
        let content;
        switch(this.state.subDrawerContent) {
            case 'addGroup':
                content = <AddGroup entity={this.props.entity} set={this.props.set} close={this.onSubDrawerClose}/>;
            break;
            case 'addAttribute':
                content = <AddAttribute entity={this.props.entity} close={this.onSubDrawerClose}/>;
            break;
            default:
                content = null;
        }
        return content;
    }

    sortGroups = (source, destination) => {
        const items = reorder(
            this.props.groups,
            source.index,
            destination.index
        );

        if(!isEqual(items, this.props.groups.toArray())) {
            this.props.dispatch(reorderSet({ set: this.props.set.id, groups: items }));   
        }
    }

    sortAttributes = (source, destination) => {
        // eslint-disable-next-line no-unused-vars
        const [ type, id ] = source.droppableId.split('-');

        const attributes = this.props.getGroupAttr(id);
            
        const items = reorder(
            attributes,
            source.index,
            destination.index
        );

        if(!isEqual(items, attributes.toArray())) {
            this.props.dispatch(saveGroupAttributes({ id, attributes: items }));
        }
    }

    moveAttribute = (source, destination) => {
        // eslint-disable-next-line no-unused-vars
        const [ type, id ] = destination.droppableId.split('-');

        const attributes = this.props.getGroupAttr(id);
        
        const result = move(
            this.getAttributes(),
            attributes,
            source,
            destination
        );

        this.props.dispatch(saveGroupAttributes({ id, attributes: result[`group-${id}`] }));

        this.updateAttributes(result['moved']);
    }

    removeAttribute = (source, destination) => {
        // eslint-disable-next-line no-unused-vars
        const [ type, id ] = source.droppableId.split('-');

        const attributes = this.props.getGroupAttr(id);

        const result = move(
            attributes,
            this.getAttributes(),
            source,
            destination
        );
        
        this.props.dispatch(saveGroupAttributes({ id, attributes: result[`group-${id}`] }));

        this.updateAttributes(result['moved'], true);
    }

    reGroup = (source, destination) => {
        // eslint-disable-next-line no-unused-vars
        const [ stype, sid ] = source.droppableId.split('-');
        // eslint-disable-next-line no-unused-vars
        const [ dtype, did ] = destination.droppableId.split('-');

        const sAttributes = this.props.getGroupAttr(sid);
        const dAttributes = this.props.getGroupAttr(did);

        const result = move(
            sAttributes,
            dAttributes,
            source,
            destination
        );
        
        this.props.dispatch(saveGroupAttributes({ id: sid, attributes: result[`group-${sid}`] }));
        this.props.dispatch(saveGroupAttributes({ id: did, attributes: result[`group-${did}`] }));
    }

    onDragEnd = result => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {

            if(destination.droppableId === 'attributes') return;

            if(destination.droppableId === 'groups-droppable') {
                return this.sortGroups(source, destination);
            };

            this.sortAttributes(source, destination);

        } else {

            // New attribute is assigned to a group

            if(source.droppableId === 'attributes') {
                this.moveAttribute(source, destination);    
            }   

            // Attribute is removed from a group

            else if(destination.droppableId === 'attributes') { 
                this.removeAttribute(source, destination);
            }

            // Move between groups

            else {
                 this.reGroup(source, destination);
            }
        }
    };

    onCancel = () => {
        this.props.close();
    }

    onSave = async () => {

        this.setState((state) => {
            return {
                loading: true,
            } 
        });

        const hide = message.loading('Saving changes..', 0);

        let groups = updateSequence(this.props.groups);

        groups = groups.toJS().map(group => {
            const attributes = updateSequence(this.props.getGroupAttr(group.id)).map(attribute => {
                return {
                    id: attribute.get('id'),
                    type: attribute.get('type'),
                    sequence: attribute.get('sequence'),
                }
            });

            group['attributes'] = attributes.toJS();

            return group;
        });

        try {
            await persistSet({ entity: this.props.entity, set: this.props.set.id }, groups, {});

            this.props.dispatch(dataChanged({ type: 'entityViewer', changed: false}));

            hide();

            message.success('Changes has been saved.');

        } catch (error) {
            let message, description;
            if(error.type === 'network') {
                message = 'Network Error';
                description = error.message;
            } 
            else if(error.type === 'server' && error.status === 500) {
                message = error.error.errors[0].title;
                description = error.error.errors[0].detail;
            }
            notification.error({
                message,
                description,
                duration: 0
            });
        }

        this.setState((state) => {
            return {
                loading: false,
            } 
        });
    }

    render() {
        return (
            <Fragment>
                <ResponsiveContext.Consumer>
                    {(size) => (
                        <Drawer
                            title={this.state.subDrawerTitle}
                            placement="right"
                            maskClosable={false}
                            width={size === 'small'? '80%': '65%'} 
                            closable={false}
                            onClose={this.onSubDrawerClose}
                            visible={this.state.subDrawer}
                        >
                            <Suspense fallback={<FallbackLoading />}>
                                {this.state.subDrawer && this.getDrawerContent()}
                            </Suspense>
                        </Drawer>
                    )}
                </ResponsiveContext.Consumer>                
                <Row>
                    <DragDropContext onDragEnd={this.onDragEnd}>
                        <Col span={24} md={16}>                      
                            <Container>
                                {(!this.props.loadingGroup && !this.props.groups.size) && (
                                  <Empty
                                    style={{ textAlign: "center" }}
                                    description={
                                        <span>
                                           No Groups
                                        </span>
                                    }
                                  >
                                    <Button type="primary" icon="plus" style={{ marginRight: 8 }} onClick={this.addGroup}>
                                        Group
                                    </Button> 
                                  </Empty>
                                )}
                                {this.props.loadingGroup && (
                                    <FallbackLoading />
                                )}                                
                                <Droppable droppableId="groups-droppable" type="groups">
                                    {(provided, snapshot) => (
                                        <GroupPanelWrapper ref={provided.innerRef}>
                                            {this.props.groups.map((group, index) => (
                                                <Group 
                                                    key={index} 
                                                    entity={this.props.entity} 
                                                    set={this.props.set.id}  
                                                    group={group} 
                                                    index={index} 
                                                />
                                            ) )}            
                                            {provided.placeholder}
                                        </GroupPanelWrapper>
                                    )}
                                </Droppable>
                            </Container>
                        </Col>
                        <Col span={24} md={8}>
                            <Suspense fallback={<FallbackLoading />}>
                                <AttributeList 
                                    entity={this.props.entity}  
                                    set={this.props.set} 
                                    getAttributes={(call)=>this.getAttributes=call} 
                                    updateAttributes={(call)=>this.updateAttributes=call}
                                />
                            </Suspense>
                        </Col>
                    </DragDropContext>
                </Row>
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        bottom: 0,
                        width: '100%',
                        borderTop: '1px solid #e9e9e9',
                        padding: '10px 16px',
                        background: '#fff',
                        textAlign: 'right',
                    }}
                >
                    <Button style={{ marginRight: 8 }} onClick={this.onCancel}>
                        Close
                    </Button>
                    <Button type="primary" icon="plus" style={{ marginRight: 8 }} onClick={this.addAttribute}>
                        Attribute
                    </Button>
                    <Button type="primary" icon="plus" style={{ marginRight: 8 }} onClick={this.addGroup}>
                        Group
                    </Button>                    
                    <Button icon="save" type="primary" loading={this.state.loading} disabled={!this.props.hasChanges} onClick={this.onSave}>
                        Save
                    </Button>
                </div>
            </Fragment>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
      attributes: selectAttributes(state, ownProps.entity),
      hasChanges: hasChanges(state, 'entityViewer'),
      groups: selectGroups(state, ownProps.set.id),
      loadingGroup:  state.app.getIn(['sets', 'loading']),
      getGroupAttr: (id) => {
          return selectGroupAttributes(state, id)
      }
    };
}

export default connect(mapStateToProps)(Set);