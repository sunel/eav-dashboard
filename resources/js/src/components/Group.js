import React, { PureComponent } from 'react';
import { Button, Icon, Skeleton, Popconfirm, Divider } from 'antd';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import { listGroupsAttributes } from '../actions';
import { selectGroupAttributes } from '../selectors/entity';

const Panel = styled.div`
    background: #f7f7f7;
    border-radius: 4px;
    margin-bottom: 24px;
    border: 0px;
    overflow: hidden;
`;

const Header = styled.div`
    line-height: 22px;
    padding: 12px 0 12px 40px;
    color: rgba(0, 0, 0, 0.85);
    position: relative;
    transition: all 0.3s;
`;

const Content = styled.div`
    padding: 4px 16px 16px 16px;
    display: flex;
    flex-wrap: wrap;
`;

const Drag = styled(Icon)`
    font-style: normal;
    vertical-align: -0.125em;
    text-align: center;
    text-transform: none;
    line-height: 0;
    text-rendering: optimizeLegibility;
    font-size: 12px;
    position: absolute;
    display: inline-block;
    line-height: 46px;
    vertical-align: top;
    top: 50%;
    transform: translateY(-50%);
    left: 16px;
`;

const Edit = styled(Button)`
    margin-left: 24px;
    cursor: pointer;
`;

const Item = styled.div`
    border-radius: 6px;
    margin-right: 8px;
    margin-bottom: 8px;
    padding: 10px;
    background-color: white;
    border: 1px solid #e8e8e8;
`;

class GroupPanel extends PureComponent {

    componentDidMount() {
        this.props.dispatch(listGroupsAttributes({ params: { entity: this.props.entity, set: this.props.set, group: this.props.group.get('id') }}));
    }
    
    render() {
        const group = this.props.group;
        const index = this.props.index;
        return (
            <Draggable key={group.get('id')} draggableId={`group-${group.get('id')}`} index={index}>
                {(provided, snapshot) => (
                    <Panel ref={provided.innerRef} {...provided.draggableProps}>
                        <Header>
                            <Drag type="drag" {...provided.dragHandleProps} />
                            <span>{group.get('name')}</span>
                            <Edit type="dashed" shape="circle" icon="edit" size="small" onClick={() => this.props.edit(group.get('id'), group.get('name'), index)}/>
                            <Divider type="vertical" />
                            <Popconfirm 
                                title="Sure to delete?"
                                onConfirm={() => this.props.delete(group.get('id'), index)}
                                >
                                <Icon type="delete" style={{ color: 'red' }}/>
                            </Popconfirm>    
                        </Header>
                        <Droppable droppableId={`group-${group.get('id')}`} type="attributes" direction="horizontal">
                            {(provided, snapshot) => (                               
                                <Content
                                    ref={provided.innerRef}
                                > 
                                    <Skeleton active loading={this.props.loading}>
                                        {this.props.attributes.map((item, index) => (
                                            <Draggable key={item.get('id')} draggableId={`attr-${item.get('id')}`} index={index}>
                                                {(provided, snapshot) => (
                                                    <Item
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        {`${item.get('frontend_label')} (${item.get('attribute_code')})`}
                                                    </Item>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </Skeleton>
                                </Content>
                            )}
                        </Droppable>
                    </Panel>
                )}
            </Draggable>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
      attributes: selectGroupAttributes(state, ownProps.group.get('id')),
      loading: state.app.getIn(['groups', 'attributes', ownProps.group.get('id'), 'loading']),
    };
}


export default connect(mapStateToProps)(GroupPanel);