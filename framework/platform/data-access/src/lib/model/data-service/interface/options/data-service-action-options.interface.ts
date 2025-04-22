/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Interface providing the different options about actions which can be carried out like create / delete
 * @typeParam T -  entity type handled by the data service
 */
export interface IDataServiceActionOptions {
	readonly createSupported?: boolean;
	readonly createDynamicDialogSupported?: boolean
	readonly deleteSupported?: boolean;
}
