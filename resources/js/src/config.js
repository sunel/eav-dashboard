export default {
    'base_url': `${process.env.REACT_APP_API_URL}api/eav/`,
    urls: {
        'list_enitity': 'entities',       
        'list_group': 'entities/{entity}/set/{set}/group',
        'list_group_attributes': 'entities/{entity}/set/{set}/group/{group}/attributes',
        'create_group': 'entities/{entity}/set/{set}/group',
        'list_attributes': 'entities/{entity}/attributes',
        'create_attribute': 'entities/{entity}/attributes',
        'fetch_attribute': 'entities/{entity}/attributes/{code}',
        'update_attribute': 'entities/{entity}/attributes/{code}',
        'delete_attribute': 'entities/{entity}/attributes/{code}',
        'list_set': 'entities/{entity}/set',
        'create_set': 'entities/{entity}/set',
        'update_set': 'entities/{entity}/set/{set}',
        'backend_type': 'backend/types',
        'frontend_type': 'frontend/types',
        'select_sources': 'select/sources',
    }   
};