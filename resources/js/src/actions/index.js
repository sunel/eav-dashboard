import { createRoutine } from 'redux-saga-routines';
import { createAction } from 'redux-actions';

export const toogleSideBar = createAction('MENU/TOOGLE');

export const dataChanged = createAction('DATA/CHANGED');

export const openDrawer = createAction('DRAWER/OPEN');

export const closeDrawer = createAction('DRAWER/CLOSE');

export const expandTable = createAction('EXPAND/TABLE');

export const updateListPageNo = createAction('SAVE/LISTPAGENO');

export const selectedEntity = createAction('SELECTED/ENTITIY');

export const listEntities = createRoutine('LIST/ENTITIES');

export const getEntity = createRoutine('GET/ENTITY');

export const saveEntity = createAction('SAVE/ENTITY');

export const persistEntity = createRoutine('PERSIST/ENTITIES');

export const getAttributes = createRoutine('GET/ATTRIBUTES');

export const saveAttributes = createAction('SAVE/ATTRIBUTES');

export const addAttributes = createAction('ADD/ATTRIBUTES');

export const updateAttribute = createAction('UPDATE/ATTRIBUTE');

export const getSet = createRoutine('GET/SET');

export const saveSet = createAction('SAVE/SET');

export const updateSet = createAction('UPDATE/SET');

export const reorderSet = createAction('REORDER/SET');

export const getGroup = createRoutine('GET/GROUP');

export const listGroups = createRoutine('LIST/GROUP');

export const listGroupsAttributes = createRoutine('LIST/GROUP/ATTRIBUTES');

export const saveGroupAttributes = createAction('SAVE/GROUP/ATTRIBUTES');

export const saveGroup = createAction('SAVE/GROUP');

