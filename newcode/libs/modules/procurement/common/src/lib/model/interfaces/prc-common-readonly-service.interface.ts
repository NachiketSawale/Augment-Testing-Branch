/*
 * Copyright(c) RIB Software GmbH
 */


/**
 * The interface for procurement header Readonly service
 */
export interface IPrcCommonReadonlyService<T extends object> {

	/**
	 * Return the entity is readonly or not.
	 * If the entity is provided check the given entity. If entity is not provided, check the current selected entity.
	 * @param entity
	 */
	isEntityReadonly(entity?: T): boolean;

}
