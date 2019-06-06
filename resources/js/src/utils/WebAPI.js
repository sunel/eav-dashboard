import { request, url, urlWithQuery } from "./request";
import JsonApi from '../utils/jsonapi';

const dataFormatter = new JsonApi();

const fetchData = (type, params, query) => {
    return request(urlWithQuery(url(type, params), query))
            .then(json => {
                const data = dataFormatter.deserialize(json);
                return Promise.resolve({ 
                    data,
                    params,
                    links: json.links,
                    meta: json.meta
                });
            });
};

export const fetchEnities = query => {
    return fetchData('list_enitity', {}, query);
};

export const fetchSets = (params, query) => {
    return fetchData('list_set', params, query);
};

export const fetchGroups = (params, query) => {
    return fetchData('list_group', params, query);
};

export const fetchGroupsAttributes = (params, query) => {
    return fetchData('list_group_attributes', params, query);
};

export const fetchAttributes = (params, query) => {
    return fetchData('list_attributes', params, query);
};

export const fetchAttribute = (params) => {
    return fetchData('fetch_attribute', params, {});
};

export const deleteAttribute = (params) => {
    return request(urlWithQuery(url('delete_attribute', params), {}), {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",                    
                }
            })
            .then(json => {
                return Promise.resolve({});
            });
};

const presistData = (type, params, post, query, method="POST") => {    
    return request(urlWithQuery(url(type, params), query), {
                method,
                headers: {
                    "Content-Type": "application/json",                    
                },
                body: JSON.stringify(post),
            })
            .then(json => {
                const data = dataFormatter.deserialize(json);
                return Promise.resolve({ 
                    data,
                    params,
                    links: json.links,
                    meta: json.meta
                });
            });
};


export const presistSet = (params, post, query) => {
    return presistData('create_set', params, post, query);
};

export const presistGroup = (params, post, query) => {
    return presistData('create_group', params, post, query);
};

export const presistAttribute = (params, post, query) => {
    return presistData('create_attribute', params, post, query);
};

export const presistExistingAttribute = (params, post, query) => {
    return presistData('update_attribute', params, post, query, 'PUT');
};

export const persistSet = (params, post, query) => {
    const postData = { data: dataFormatter.serialize(post, ['attributes']) };    
    return request(urlWithQuery(url('update_set', params), query), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",                    
                },
                body: JSON.stringify(postData),
            })
            .then(json => {
                return Promise.resolve({});
            });
};

const fetchConfig = (type) => {
    return request(url(type))
            .then(json => {
                return Promise.resolve({ 
                    data:json
                });
            });
};

export const fetchBackendTypes = () => {
    return fetchConfig('backend_type');
};

export const fetchFrontendTypes = () => {
    return fetchConfig('frontend_type');
};

export const fetchSelectSources = () => {
    return fetchConfig('select_sources');
};
