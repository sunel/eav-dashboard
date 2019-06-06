import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Table, Button, Input, Popconfirm, Icon, Tooltip, Divider, notification, message } from 'antd';
import styled from 'styled-components';

import { getAttributes, updateListPageNo, openDrawer } from '../actions';
import { selectListPageNo, selectListSize, selectCurrentEntity } from '../selectors/cockpit';
import { selectAttributes } from '../selectors/entity';
import { deleteAttribute } from '../utils/WebAPI';

import Errors from '../components/Errors';
import SelectEntity from '../components/SelectEntity';

const SearchWarpper = styled.div`
  width: 200px;
  margin-bottom: 1rem;
  margin-right: 1rem;
  display: inline-block;
  @media (min-width: 996px) {
    width: 20%;
  }
`;

const TableWrapper = styled.div`
  @media (max-width: 480px) {
    width: 100%;
    overflow-x: auto;
  }
`;

const Code = styled.span`
  color: #6f42c1;  
  background-color: rgba(27,31,35,.05);
  padding: 5px 10px;
  border-radius: 3px;
`;

const StyledIcon = styled(Icon)`
    margin-right: 4px;
`

const Cell = styled.span`
  color: #6f42c1;
`;

class Attributes extends Component {
  state = {
    loading: false,
  }

  componentDidMount() {
    if(
      this.props.entity && (
        !this.props.attributes.size ||
        (this.props.metaPageNo !==  this.props.currentPageNo)
      )
    ) {
      this.requestData(this.props.listSize, this.props.currentPageNo);
    }
  }

  componentWillReceiveProps(newProps) {
    if(newProps.currentPageNo !== this.props.currentPageNo ) {
      this.requestData(this.props.listSize, newProps.currentPageNo);
    }

    this.setState((state) => {
      return {
        loading: newProps.loading
      };
    });
  }

  componentDidUpdate(prevProps) { 
    if(prevProps.entity !== this.props.entity) {
      this.requestData(this.props.listSize, 1);
    }
  }

  requestData = (size, number, search = {}) => {
    this.props.dispatch(getAttributes({ params: { entity: this.props.entity }, query : { 'page[size]': size, 'page[number]': number, ...search } }));
  }

  search = (value) => {
    this.requestData(this.props.listSize, 1, { 'filter[search]': value });
  }

  handleDelete = async (code) => {
    
    this.setState((state) => {
        return {
            loading: true,
        } 
    });

    const hide = message.loading('Deleting..', 0);

    try {
        
        await deleteAttribute({ entity: this.props.entity, code });

        hide();

        this.requestData(this.props.listSize, 1);

        message.success('Attribute deleted.', 2);

    } catch (error) {

        let message, description;
        if(error.type === 'network') {
            message = 'Network Error';
            description = error.message;
        } 
        else if(error.type === 'server') {
            message = error.error.errors[0].title;
            description = error.error.errors[0].detail;
        }

        hide();

        notification.error({
            message,
            description,
            duration: 0
        });

        this.setState((state) => {
            return {
                loading: false,
            } 
        });
    }
  }

  handleEdit = (attribute, index) => {
    this.props.dispatch(openDrawer({ type:'editAttribute', entity:this.props.entity, attribute, index }));
  }

  addAttribute = () => {
    this.props.dispatch(openDrawer({ type:'addAttribute', entity:this.props.entity }));
  }

  render() {
    return (
      <Row>
        <Col span={24}>
          <Row>
            <Col span={18}>
              <SearchWarpper>
                <Input.Search
                  placeholder="Search Entity"
                  size="large"
                  onSearch={this.search}
                />
              </SearchWarpper>
              <SelectEntity />
            </Col>
            <Col span={6} style={{ textAlign: "right" }}>
              <Button type="primary" icon="plus" style={{ marginBottom: 8 }} onClick={this.addAttribute}>
                Attribute
              </Button>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Errors error={this.props.errors} />
          <TableWrapper>
            <Table
              bordered
              rowKey="id"
              pagination={{
                onChange: (page) => {
                  this.requestData(this.props.listSize, page);
                  this.props.dispatch(updateListPageNo({ type: 'attributes', number: page }));
                },
                current: this.props.currentPageNo,
                pageSize: this.props.listSize,
                simple: true,
                total: this.props.total
              }}
              dataSource={this.props.attributes.toJS()}
              loading={this.state.loading}
              columns={[
                {
                  title: 'Label',
                  dataIndex: 'frontend_label',
                  key: 'frontend_label',
                  render: text => <Code>{text}</Code>,
                },{
                  title: 'Code',
                  dataIndex: 'attribute_code',
                  key: 'attribute_code',
                  render: text => <Cell>{text}</Cell>,
                }, {
                  title: 'Frontend Type',
                  dataIndex: 'frontend_type',
                  key: 'frontend_type',
                  render: text => <Cell>{text}</Cell>,
                }, {
                  title: 'Backend Type',
                  dataIndex: 'backend_type',
                  key: 'backend_type',
                  render: text => <Cell>{text}</Cell>,
                }, {
                  title: 'options',
                  key: 'options',
                  render: (text, record) => (
                    <Fragment>      
                      {!!(record.is_searchable) === true && <Tooltip title="Searchable"><StyledIcon type="search" /></Tooltip>}
                      {!!(record.is_filterable) === true && <Tooltip title="Filterable"><StyledIcon type="filter" /></Tooltip>}
                      {!!(record.is_required) === true && <Tooltip title="Required"><StyledIcon type="exclamation-circle" /></Tooltip>}
                    </Fragment>
                  )
                }, {
                  title: 'Action',
                  key: 'action',
                  render: (text, record, index) => (
                    <Fragment>      
                      <Icon type="edit" onClick={() => this.handleEdit(record.attribute_code, index)}/>
                      <Divider type="vertical" />
                      <Popconfirm 
                        title="Sure to delete?"
                        onConfirm={() => this.handleDelete(record.attribute_code)}
                        >
                          <Icon type="delete" style={{ color: 'red' }}/>
                      </Popconfirm>      
                    </Fragment>
                  )
                }
              ]} />
            </TableWrapper>
        </Col>
      </Row>
    );
  }
}


function mapStateToProps(state, ownProps) {
  return {
    attributes: selectAttributes(state, selectCurrentEntity(state)),
    currentPageNo: selectListPageNo('attributes', state),
    listSize: selectListSize('attributes', state),
    entity: selectCurrentEntity(state),
    loading: state.app.getIn(['attributes','loading']),
    total: state.app.getIn(['attributes', 'meta', 'paginated', 'total']),
    errors: state.app.getIn(['attributes','errors']),
    metaPageNo: state.app.getIn(['attributes', 'meta', 'paginated', 'current_page']),
  };
}

export default connect(mapStateToProps)(Attributes);
