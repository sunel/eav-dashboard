import React, { PureComponent } from 'react';
import { Input, Skeleton, Icon } from 'antd';
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { FixedSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import AutoSizer from "react-virtualized-auto-sizer";
import { fromJS } from 'immutable';
import debounce from 'lodash.debounce';

import { fetchAttributes } from '../utils/WebAPI';

const Container = styled.div`
    margin-left: 20px;
    margin-bottom: 10px;
`;

const List = styled.div`
    overflow: auto;
    height: calc(90vh - 108px);
    padding: 8px;
    border-radius: 6px;
    border: 1px solid #e8e8e8;
`;

const AttributeItem = styled.div`
    border-radius: 6px;
    margin-bottom: 8px;
    padding: 10px;
    background-color: ${props  => props.isDisabled ? '#e8e8e8' : '#fff' };
    border: 1px solid #e8e8e8;
`;

class AttributeList extends PureComponent {

    state = {
        hasNextPage: true,
        isNextPageLoading: false,
        attributes: fromJS([]),
        selected: [],
        loading: false,
        search: '',
    }

    constructor(props) {
        super(props);

        this.props.getAttributes(this.getAttributes);
        this.props.updateAttributes(this.updateAttributes);
        this.props.reload(this.reload);
        this.requestData = debounce(this.requestData, 800);
    }

    getAttributes = () => {
        return this.state.attributes;
    }

    reload = () => {
        this.requestData(1);
    }

    updateAttributes = (item, removed=false) => {

        let selected = this.state.selected;

        if (removed) {            
            selected = selected.filter(x => x !== item.get('id'));
        } else {
            selected.push(item.get('id'))
        }

        this.setState({
            selected,
        });
    }

    requestData = async (page) => {
        let attributes = page === 1? { attributes: fromJS([]) } : {};
        this.setState({ isNextPageLoading: true, loading: true, ...attributes });

        const { data, meta } = await fetchAttributes(
            { entity: this.props.entity }, 
            { 'page[size]': 25, 'page[number]': page, 'filter[unassigned]': 1, 'filter[set]': this.props.set.id, 'filter[search]': this.state.search }
        );

        const { current_page , last_page } = meta.paginated;
        let hasNextPage = false;
        if(current_page < last_page) {
            hasNextPage = true;
        }
        this.setState({ attributes: this.state.attributes.concat(fromJS(data)), isNextPageLoading: false, loading: false, hasNextPage, current_page });
    }

    onSearch = (input) => {
        this.setState({ search: input.target.value });
        this.requestData(1);
    }

    isItemLoaded = index => !this.state.hasNextPage || index < this.state.attributes.size;

    loadNextPage = (...args) => {
       return this.requestData((args[0]/25)+1);
    }

    render() {
        const Item = ({ index, style }) => {
            let content;
            if (!this.isItemLoaded(index)) {
                content = <Skeleton active paragraph={false}/>;
            } else {
                const item = this.state.attributes.get(index);
                const isDisabled = this.state.selected.includes(item.get('id'));
                content =  (<Draggable key={item.get('id')} draggableId={item.get('id')} index={index} isDragDisabled={isDisabled}>
                    {(provided, snapshot) => (
                        <AttributeItem
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            isDisabled={isDisabled}
                        >
                            {`${item.get('frontend_label')} (${item.get('attribute_code')})`}
                        </AttributeItem>
                    )}
                </Draggable>);
            }
            return <div style={style}>{content}</div>;
        }

        const loadMoreItems = this.state.isNextPageLoading ? () => {} : this.loadNextPage;
        const itemCount = this.state.hasNextPage ? this.state.attributes.size + 1 : this.state.attributes.size;
        const suffix = this.state.loading ? <Icon type="loading" /> : null;

        return (
            <div>
                <Container>
                    <Input
                        placeholder="input search text"
                        onChange={this.onSearch}
                        suffix={suffix}
                    />
                </Container>
                <Container>
                    <Droppable droppableId="attributes" type="attributes">
                        {(provided, snapshot) => (
                            <List
                                ref={provided.innerRef}
                            >
                                <AutoSizer>
                                    {({ height, width }) => (
                                        <InfiniteLoader
                                            isItemLoaded={this.isItemLoaded}
                                            itemCount={itemCount}
                                            loadMoreItems={loadMoreItems}
                                        >
                                            {({ onItemsRendered, ref }) => (                                                
                                                <FixedSizeList
                                                    itemCount={itemCount}
                                                    onItemsRendered={onItemsRendered}
                                                    height={height}
                                                    width={width}
                                                    itemSize={50}
                                                    ref={ref}
                                                    style={{
                                                        willChange: "unset"
                                                    }}
                                                >
                                                    {Item}
                                                </FixedSizeList>                                                    
                                            )}
                                        </InfiniteLoader>
                                    )}
                                </AutoSizer>
                                {provided.placeholder}
                            </List>
                        )}
                    </Droppable>
                </Container>
            </div>
        );
    }
}

export default AttributeList;
