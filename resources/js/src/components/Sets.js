import React, { Component, Fragment } from 'react';
import { Row, Col, Table, Button, Input, Popconfirm, notification, message  } from 'antd';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';

import { openDrawer } from '../actions';
import { fetchSets, deleteSet } from '../utils/WebAPI';

const SearchWarpper = styled.div`
  width: 200px;
  margin-bottom: 0.75rem;
`;

const TableWrapper = styled.div`
  @media (max-width: 480px) {
    width: 100%;
    overflow-x: auto;
  }
`;

const Title = styled.span`
  color: #3eaf7c;  
  text-transform: uppercase;
`;

const ActionMenu = styled.div`
  display: inline;
  margin-left: 1rem;
`

class Sets extends Component {

  state = {
    listSize: 10,
    currentPageNo: 1,
    data: [],
    loading: false,
    total: null,
    showMenu: null,
  }

  componentDidMount() {
    this.requestData(this.state.listSize, 1);
  }

  requestData = async (size, number, search = {}) => {
    this.setState({ loading: true });
    const { data, meta } = await fetchSets({ entity: this.props.entity.entity_code }, {'page[size]': size, 'page[number]': number, ...search });
    this.setState({ data, loading: false, currentPageNo: meta.paginated.current_page, total: meta.paginated.total });
  }

  search = (value) => {
    this.requestData(this.state.listSize, 1, { 'filter[search]': value });
  }

  viewSet = (item) => {
    this.props.dispatch(openDrawer({ type: 'set', entity: this.props.entity.entity_code, set: item }));
  }

  updateSet = (response, index) => {
    if(!index) {
      this.setState((state) => {
        return {
            ...state,
            data: [
            ...state.data,
            response.data
          ]
        };
      })
    } else {
      this.setState((state) => {
        let data = state.data;
        data[`${index}`] = response.data
        return {
          ...state,
          data: [
            ...data
          ]
        };
      })
    }
  }

  addSet = () => {
    this.props.dispatch(openDrawer({ type: 'addSet', entity: this.props.entity, updateSet: this.updateSet }));
  }

  editSet = (rowIndex, id, name) => {
    this.props.dispatch(openDrawer({ type: 'editSet', entity: this.props.entity, updateSet: this.updateSet, id, name, index: rowIndex }));
  }

  addAttribute = () => {
    this.props.dispatch(openDrawer({ type: 'addAttribute', entity: this.props.entity.entity_code }));
  }

  viewAttributes = () => {
    this.props.dispatch(push(`/attributes?entity=${this.props.entity.entity_code}`));
  }

  handleDelete = async (set) => {
    
    this.setState((state) => {
        return {
          ...state,
          loading: true,
        } 
    });

    const hide = message.loading('Deleting..', 0);

    try {
        
        await deleteSet({ entity: this.props.entity.entity_code, set });

        hide();

        this.requestData(this.props.listSize, 1);

        message.success('Set deleted.', 2);

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
              ...state,
              loading: false,
            } 
        });
    }
  }

  render() {
    const columns = [{
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record, rowIndex) => (
        <>
          <Title>{text}</Title>
          {(this.state.showMenu === rowIndex) && (
            <ActionMenu>
              <Button type="dashed" size="small"  onClick={() => this.viewSet(record)}>
                View
              </Button>
              <Button type="primary" icon="edit" size="small" style={{ marginLeft: 8 }} onClick={() => this.editSet(rowIndex, record.id, text)}>
                Edit Name
              </Button>
              <Popconfirm 
                  title="Sure to delete?"
                  onConfirm={() => this.handleDelete(record.id)}
                >
                <Button type="danger" icon="delete" size="small" style={{ marginLeft: 8 }}>
                  Delete
                </Button>
              </Popconfirm>    
            </ActionMenu>
          )}
        </>
      ),
    }];

    return (
      <Fragment>
        <Row type="flex" justify="space-around">
          <Col span={24} md={12}>
            <Row type="flex" justify="start">
              <Col span={6}>
                <SearchWarpper>
                  <Input.Search
                    placeholder="Search Set"
                    size="large"
                    onSearch={this.search}
                  />
                </SearchWarpper>
              </Col>
            </Row>
          </Col>
          <Col span={24} md={12}>
            <Row type="flex" justify="space-around">
              <Button type="dashed" style={{ marginBottom: 8 }} onClick={this.viewAttributes}>
                View Attributes
              </Button>
              <Button type="primary" icon="plus" style={{ marginBottom: 8 }} onClick={this.addSet}>
                Set
              </Button>
              <Button type="primary" icon="plus" style={{ marginBottom: 8 }} onClick={this.addAttribute}>
                Attribute
              </Button>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col>
            <TableWrapper>
              <Table
                onRow={(record, rowIndex) => {
                  return {
                    onMouseEnter: event =>  this.setState({ showMenu: rowIndex }),
                    onMouseLeave: event =>  this.setState({ showMenu: null })
                  };
                }}
                pagination={{
                  onChange: (page) => {
                    this.requestData(this.state.listSize, page);
                  },
                  current: this.state.currentPageNo,
                  pageSize: this.state.listSize,
                  size: 'small',
                  showQuickJumper: true,
                  showLessItems: true,
                  total: this.state.total
                }}
                loading={this.state.loading}
                bordered
                showHeader={false}
                rowKey="id"
                title={() => 'Sets'}
                dataSource={this.state.data}
                columns={columns} />
              </TableWrapper>
          </Col>
        </Row>
      </Fragment>
    );
  }
}


export default connect()(Sets);