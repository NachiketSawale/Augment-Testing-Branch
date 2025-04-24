/*
 * Copyright(c) RIB Software GmbH
 */

import { ISearchPayload } from '../../interfaces/search-payload.interface';
import { IFilterResult } from '../../interfaces/filter-result.interface';

/**
 * Provides the function connection of root data services to search sidebar
 */
export interface ISidebarSearchSupport {

	/**
	 * Does a search for root entity data according the user search configuration in the sidebar
	 * @param payload the search configured by the user in the sidebar
	 */
	executeSidebarSearch(payload: ISearchPayload): Promise<IFilterResult>

	/**
	 * Does a search for root entity data according the user search configuration in the sidebar
	 */
	supportsSidebarSearch(): boolean
}
