/*
 * Copyright(c) RIB Software GmbH
 */

/**
 *
 */
export interface IWorkflowEntityDataFacade{

	/**
	 * Workflow Entity Data Facade Id.
	 */
	Id: number;

	/**
	 * Workflow Entity Data Facade model name.
	 */
	ModelName: string;

	/**
	 * Workflow Entity Data Facade Entity name.
	 */
	EntityName: string;

	/**
	 * Workflow  Entity Data Facade entity Properties.
	 */
	EntityProperties: string

	/**
	 * Workflow  Entity Data Facade Id Property Names.
	 */
	IdPropertyNames: string;
}