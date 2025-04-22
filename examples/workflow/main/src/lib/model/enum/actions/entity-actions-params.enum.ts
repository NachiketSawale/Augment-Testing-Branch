/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Input/Output parameters for the action 'Get Entity Action'
 */
export enum EntityActionsParamsEnum { //TODO: naming
	EntityIdForCreateEntityAction = 'EntityId',
	EntityIdForGetEntityAction = 'Id',
	EntityName = 'EntityName',
	EntityProperty = 'EntityProperty',
	// eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
	EntityToSave = 'EntityProperty'
}