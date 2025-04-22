/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { LazyInjectable, PlatformModuleManagerService } from '@libs/platform/common';
import { isBusinessModuleInfo } from '@libs/ui/business-base';
import { ITaskSidebarTabService, TASK_SIDEBAR_TAB_SERVICE } from '@libs/workflow/interfaces';

@LazyInjectable({
	token: TASK_SIDEBAR_TAB_SERVICE,
	useAngularInjection: true
})

@Injectable({
	providedIn: 'root'
})
export class WorkflowTaskSidebarTabService implements ITaskSidebarTabService {

	private readonly platformModuleManager = inject(PlatformModuleManagerService);

	public constructor() { }

	/**
	 * This function provides Ids or Id of selected rows from a module container.
	 * @returns
	 */
	public getEntityIdListForActionInstances(): number[] | undefined {
		const activeModule = this.platformModuleManager.activeModule;
		const mainItemIds: number[] = [];
		if (activeModule && isBusinessModuleInfo(activeModule)) {
			activeModule.entities.forEach((entity) => {
				const entityFacadeEntityId = entity.getEntityFacade().getSelectedId()?.id;
				if (entityFacadeEntityId) {
					mainItemIds.push(entityFacadeEntityId);
				}
			});
		}
		return mainItemIds;
	}
}
