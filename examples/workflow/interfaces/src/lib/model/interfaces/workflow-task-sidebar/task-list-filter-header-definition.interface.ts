import { ITaskListFilterDefs } from './task-list-filter-definition.interface';

/**
 * Copyright(c) RIB Software GmbH
 */
export interface ITaskListFilterDefinition {
	/**
	 * moduleName
	 */
	moduleName: string,
	/**
	 * filterName
	 */
	filterName: string,
	/**
	 * accessLevel
	 */
	accessLevel: string,
	/**
	 * filterDef
	 */
	filterDef: ITaskListFilterDefs
}