/*
 * Copyright(c) RIB Software GmbH
 */

import {
	IEntityModification,
	IEntitySelection,
	IEntityCreate,
	IEntityCreateChild,
	IEntityDelete,
	IEntityList,
	IEntityTree,
	IEntityRuntimeDataRegistry, IEntityDataCreateConfiguration,
	IEntityNavigation,
} from '@libs/platform/data-access';

function isEntityModification<T extends object>(ds: unknown): ds is IEntityModification<T> {
	if (typeof ds === 'object' && ds !== null) {
		// looks like IEntityModification?
		return 'setModified' in ds && 'removeModified' in ds && 'hasModifiedFor' in ds;
	}

	return false;
}

function isEntityCreate<T extends object>(ds: unknown): ds is IEntityCreate<T> {
	if (typeof ds === 'object' && ds !== null) {
		return 'create' in ds && 'canCreate' in ds;
	}

	return false;
}

function isEntityCreateChild<T extends object>(ds: unknown): ds is IEntityCreateChild<T> {
	if (typeof ds === 'object' && ds !== null) {
		return 'createChild' in ds && 'canCreateChild' in ds;
	}

	return false;
}

function isEntityDataConfiguration<T extends object>(ds: unknown): ds is IEntityDataCreateConfiguration<T> {
	if (typeof ds === 'object' && ds !== null) {
		return 'createByConfiguration' in ds && 'supportsConfiguredCreate' in ds;
	}

	return false;
}

function isEntityDelete<T extends object>(ds: unknown): ds is IEntityDelete<T> {
	if (typeof ds === 'object' && ds !== null) {
		return 'delete' in ds && 'canDelete' in ds;
	}

	return false;
}

function isEntityList<T extends object>(ds: unknown): ds is IEntityList<T> {
	if (typeof ds === 'object' && ds !== null) {
		return 'getList' in ds && 'listChanged$' in ds;
	}

	return false;
}

function isEntityTree<T extends object>(ds: unknown): ds is IEntityTree<T> {
	if (typeof ds === 'object' && ds !== null) {
		return 'rootEntities' in ds && 'childrenOf' in ds && 'parentOf' in ds;
	}

	return false;
}

function isEntityRuntimeDataRegistry<T extends object>(ds: unknown): ds is IEntityRuntimeDataRegistry<T> {
	if (typeof ds === 'object' && ds !== null) {
		return 'addInvalid' in ds && 'setEntityReadOnly' in ds;
	}

	return false;
}

function isEntityNavigation<T extends object>(ds: unknown): ds is IEntityNavigation<T> {
	if (typeof ds === 'object' && ds !== null) {
		return 'preparePinningContext' in ds;
	}
	return false;
}

export interface IDataServiceContainer<T extends object> {

	entitySelection: IEntitySelection<T>;

	entityModification?: IEntityModification<T>;

	entityCreate?: IEntityCreate<T>;

	entityCreateChild?: IEntityCreateChild<T>;

	entityDataConfiguration?: IEntityDataCreateConfiguration<T>;

	entityDelete?: IEntityDelete<T>;

	entityList?: IEntityList<T>;

	entityTree?: IEntityTree<T>;

	entityRuntimeDataRegistry?: IEntityRuntimeDataRegistry<T>;

	entityNavigation?: IEntityNavigation<T>;
}

export function generateDataServiceContainer<T extends object>(ds: IEntitySelection<T>): IDataServiceContainer<T> {
	const result: IDataServiceContainer<T> = {
		entitySelection: ds
	};

	if (isEntityModification<T>(ds)) {
		result.entityModification = ds;
	}

	if (isEntityCreate<T>(ds)) {
		result.entityCreate = ds;
	}

	if (isEntityCreateChild<T>(ds)) {
		result.entityCreateChild = ds;
	}

	if (isEntityDelete<T>(ds)) {
		result.entityDelete = ds;
	}

	if (isEntityList<T>(ds)) {
		result.entityList = ds;
	}

	if (isEntityTree<T>(ds)) {
		result.entityTree = ds;
	}

	if (isEntityRuntimeDataRegistry<T>(ds)) {
		result.entityRuntimeDataRegistry = ds;
	}

	if (isEntityDataConfiguration<T>(ds)) {
		result.entityDataConfiguration = ds;
	}

	if (isEntityNavigation<T>(ds)) {
		result.entityNavigation = ds;
	}

	return result;
}
