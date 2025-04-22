/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IWorkflowClientActionInstanceInterface } from '../model/interfaces/workflow-client-action-instance.interface';
import { PlatformHttpService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})

export class BasicsWorkflowClientActionInstanceDataService extends DataServiceFlatRoot<IWorkflowClientActionInstanceInterface, IWorkflowClientActionInstanceInterface> {

	private readonly httpService = inject(PlatformHttpService);

	/**
	 * Initializes data service
	 */
	public constructor() {
		const option: IDataServiceOptions<IWorkflowClientActionInstanceInterface> = {
			apiUrl: 'basics/workflow/instance/action/client',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			roleInfo: <IDataServiceRoleOptions<IWorkflowClientActionInstanceInterface>>{
				role: ServiceRole.Root,
				itemName: 'ActionInstance',
			},
		};
		super(option);
	}

	/**
	 * Returns the overdueList
	 */
	public getOverdueClientList() {
		return this.httpService.get<IWorkflowClientActionInstanceInterface[]>('basics/workflow/instance/action/client/overduelist');
	}

	/**
	 * Returns the clientActionList
	 */
	public getClientList() {
		return this.httpService.get<IWorkflowClientActionInstanceInterface[]>('basics/workflow/instance/action/client/list');
	}

}