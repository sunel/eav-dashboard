(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{549:function(e,t,a){"use strict";a.r(t);a(286);var n=a(288),r=(a(104),a(16)),i=(a(365),a(371)),s=a(7),u=a.n(s),o=a(102),c=a(282),d=a(39),l=a(40),g=a(82),b=a(81),p=a(83),f=a(30),h=a(0),m=a.n(h),v=a(31),x=a(341),j=a(542),O=a(543),E=a(544),P=a(11),w=a(332),y=a.n(w),D=a(51);function N(){var e=Object(f.a)(["\n    border-radius: 6px;\n    margin-bottom: 8px;\n    padding: 10px;\n    background-color: ",";\n    border: 1px solid #e8e8e8;\n"]);return N=function(){return e},e}function I(){var e=Object(f.a)(["\n    overflow: auto;\n    height: calc(90vh - 108px);\n    padding: 8px;\n    border-radius: 6px;\n    border: 1px solid #e8e8e8;\n"]);return I=function(){return e},e}function L(){var e=Object(f.a)(["\n    margin-left: 20px;\n    margin-bottom: 10px;\n"]);return L=function(){return e},e}var S=v.a.div(L()),k=v.a.div(I()),q=v.a.div(N(),function(e){return e.isDisabled?"#e8e8e8":"#fff"}),A=function(e){function t(e){var a;return Object(d.a)(this,t),(a=Object(g.a)(this,Object(b.a)(t).call(this,e))).state={hasNextPage:!0,isNextPageLoading:!1,attributes:Object(P.b)([]),selected:[],loading:!1,search:""},a.getAttributes=function(){return a.state.attributes},a.reload=function(){a.requestData(1)},a.updateAttributes=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=a.state.selected;t?n=n.filter(function(t){return t!==e.get("id")}):n.push(e.get("id")),a.setState({selected:n})},a.requestData=function(){var e=Object(c.a)(u.a.mark(function e(t){var n,r,i,s,c,d,l,g;return u.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=1===t?{attributes:Object(P.b)([])}:{},a.setState(Object(o.a)({isNextPageLoading:!0,loading:!0},n)),e.next=4,Object(D.e)({entity:a.props.entity},{"page[size]":25,"page[number]":t,"filter[unassigned]":1,"filter[set]":a.props.set.id,"filter[search]":a.state.search});case 4:r=e.sent,i=r.data,s=r.meta,c=s.paginated,d=c.current_page,l=c.last_page,g=!1,d<l&&(g=!0),a.setState({attributes:a.state.attributes.concat(Object(P.b)(i)),isNextPageLoading:!1,loading:!1,hasNextPage:g,current_page:d});case 11:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}(),a.onSearch=function(e){a.setState({search:e.target.value}),a.requestData(1)},a.isItemLoaded=function(e){return!a.state.hasNextPage||e<a.state.attributes.size},a.loadNextPage=function(){return a.requestData((arguments.length<=0?void 0:arguments[0])/25+1)},a.props.getAttributes(a.getAttributes),a.props.updateAttributes(a.updateAttributes),a.props.reload(a.reload),a.requestData=y()(a.requestData,800),a}return Object(p.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){var e=this,t=function(t){var a,n=t.index,r=t.style;if(e.isItemLoaded(n)){var s=e.state.attributes.get(n),u=e.state.selected.includes(s.get("id"));a=m.a.createElement(x.b,{key:s.get("id"),draggableId:s.get("id"),index:n,isDragDisabled:u},function(e,t){return m.a.createElement(q,Object.assign({ref:e.innerRef},e.draggableProps,e.dragHandleProps,{isDisabled:u}),"".concat(s.get("frontend_label")," (").concat(s.get("attribute_code"),")"))})}else a=m.a.createElement(i.a,{active:!0,paragraph:!1});return m.a.createElement("div",{style:r},a)},a=this.state.isNextPageLoading?function(){}:this.loadNextPage,s=this.state.hasNextPage?this.state.attributes.size+1:this.state.attributes.size,u=this.state.loading?m.a.createElement(r.a,{type:"loading"}):null;return m.a.createElement("div",null,m.a.createElement(S,null,m.a.createElement(n.a,{placeholder:"input search text",onChange:this.onSearch,suffix:u})),m.a.createElement(S,null,m.a.createElement(x.c,{droppableId:"attributes",type:"attributes"},function(n,r){return m.a.createElement(k,{ref:n.innerRef},m.a.createElement(E.a,null,function(n){var r=n.height,i=n.width;return m.a.createElement(O.a,{isItemLoaded:e.isItemLoaded,itemCount:s,loadMoreItems:a},function(e){var a=e.onItemsRendered,n=e.ref;return m.a.createElement(j.a,{itemCount:s,onItemsRendered:a,height:r,width:i,itemSize:50,ref:n,style:{willChange:"unset"}},t)})}),n.placeholder)})))}}]),t}(h.PureComponent);t.default=A}}]);