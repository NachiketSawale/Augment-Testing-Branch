/**
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { LazyLoadedContext } from '@libs/workflow/interfaces';

/**
 * Provides the data for the taskList in sidebar.
 */
@Injectable({
	providedIn: 'root',
})
export class UiSidebarTaskService {

	private readonly httpService = inject(PlatformHttpService);

	/**
	 * Function to delete the selected filter from filter lookup.
	 * @param filterDto
	 */
	public deleteFilterDefinition(filterDto: object) {
		this.httpService.post('basics/workflow/filter/deletefilterdefinition', filterDto);
	}

	/**
	 * This function returns the context for selected task Id.
	 * When any "user task" component is triggered from task-sidebar-tab, the required input ( provider ) data or entity data is served to
	 * it by the context returned by this function.
	 * @param itemId
	 * @returns
	 */
	public loadContext(itemId: number): Promise<LazyLoadedContext> {
		return this.httpService.get<LazyLoadedContext>('basics/workflow/actioninstance/loadContextForTask', { params: { actionInstanceId: itemId } });
	}

	/**
	 * This function returns entity ids  associated to an action instance.
	 * @param actionInstanceIds
	 * @returns
	 */
	public async getEntityIdListForActionInstances(actionInstanceIds: number[]): Promise<{ [key: number]: number[] }> {
		const endpointUrl = 'basics/workflow/actionInstance/getEntityIds';
		return await this.httpService.post<{ [key: number]: number[] }>(endpointUrl, actionInstanceIds);
	}
}