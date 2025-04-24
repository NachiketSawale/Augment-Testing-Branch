/*
 * Copyright(c) RIB Software GmbH
 */

import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { IWorkflowActionInstanceTask } from '@libs/workflow/shared';
import { PlatformHttpService } from '@libs/platform/common';

/**
 * Data service used to load workflow action instance data for workflow task module.
 */
@Injectable({
	providedIn: 'root'
})
export class WorkflowTaskActionInstanceDataService extends DataServiceFlatRoot<IWorkflowActionInstanceTask, IWorkflowActionInstanceTask> {
	private readonly httpService = inject(PlatformHttpService);

	/**
	 * Initializes data service.
	 */
	public constructor() {
		const option: IDataServiceOptions<IWorkflowActionInstanceTask> = {
			apiUrl: 'basics/workflow/runningworkflowaction',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'all/list/byfilter',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IWorkflowActionInstanceTask>>{
				role: ServiceRole.Root,
				itemName: 'ActionInstance',
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'save'
			}
		};

		super(option);
	}

	/**
	 * This function continues workflows by action ids in bulk.
	 */
	public async continueWorkflowByActionInBulk(taskIdList: number[]) {
		await this.httpService.post('basics/workflow/instance/continueworkflowbyactioninbulk', { taskIdList });
		//TODO: trigger workflow callback listener (task list count, popUpInterval)
	}

	/**
	 * This function escalates workflows by action ids in bulk.
	 */
	public async escalateTaskInBulk(taskIdList: number[]) {
		await this.httpService.post('basics/workflow/instance/escalatebyactioninbulk', { taskIdList });
		//TODO: trigger workflow callback listener (task list count, popUpInterval)
	}

	public override createUpdateEntity(): IWorkflowActionInstanceTask {
		return {} as IWorkflowActionInstanceTask;
	}
}