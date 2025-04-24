/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Interface for create entity lookup.
 */
export interface IWorkflowEntityActionsLookupItem {

	/**
	 * Entity (uu)id.
	 */
	Id: string;

	/**
	 * Entity display value.
	 */
	DisplayValue: string;

	/**
	 * Entity name.
	 */
	EntityName: string;

	/**
	 * Entity module name.
	 */
	ModuleName?: string;
}