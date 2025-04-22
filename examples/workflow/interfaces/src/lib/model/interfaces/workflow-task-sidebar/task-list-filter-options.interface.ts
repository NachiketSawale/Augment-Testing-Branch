/**
 * Copyright(c) RIB Software GmbH
 */
export interface ITaskListFilterOptions {
	grouping: string,
	sorting: string,
	sortingAscending: boolean,
	filterDefinitionName: string,
	mainEntityFiltered: boolean,
	taskListIsLoaded: boolean,
	useFilterDefinitions: boolean
}