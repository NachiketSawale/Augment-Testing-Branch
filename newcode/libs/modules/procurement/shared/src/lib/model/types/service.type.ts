/*
 * Copyright(c) RIB Software GmbH
 */

import {
    IEntityCreate,
    IEntityDelete,
    IEntityList,
    IEntityModification,
    IEntitySelection,
    IParentRole
} from '@libs/platform/data-access';
import {CompleteIdentification, INavigationBarControls} from '@libs/platform/common';

/**
 * Readonly data service type, an alias for following union types
 */
export type IReadonlyDataService<T extends object> = IEntitySelection<T> & IEntityList<T>;

/**
 * Readonly data service type, an alias for following union types
 */
export type IEditableDataService<T extends object> = IReadonlyDataService<T> & IEntityCreate<T> & IEntityDelete<T> & IEntityModification<T>;

/**
 * Readonly parent data service type, an alias for following union types
 */
export type IReadonlyParentService<T extends object, U extends CompleteIdentification<T>> = IParentRole<T, U> & IReadonlyDataService<T>;

/**
 * Editable parent service type, an alias for following union types
 */
export type IEditableParentService<T extends object, U extends CompleteIdentification<T>> = IParentRole<T, U> & IEditableDataService<T>;

/**
 * Readonly root data service type, an alias for following union types
 */
export type IReadonlyRootService<T extends object, U extends CompleteIdentification<T>> = IReadonlyParentService<T, U> & INavigationBarControls;

/**
 * Editable root service type, an alias for following union types
 */
export type IEditableRootService<T extends object, U extends CompleteIdentification<T>> = IEditableParentService<T, U> & INavigationBarControls;