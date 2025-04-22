/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ILookupConfig, ILookupEndpointConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IDataEntityFacade } from '@libs/workflow/interfaces';
import { IEntityContext, LazyInjectable, PlatformModuleManagerService } from '@libs/platform/common';
import { WORKFLOW_ENTITY_FACADE_LOOKUP_SERVICE } from '@libs/workflow/interfaces';
import { WorkflowEntityService } from '../../workflow-entity/workflow-entity.service';
import { Observable } from 'rxjs/internal/Observable';
import { get } from 'lodash';

@LazyInjectable({
	token: WORKFLOW_ENTITY_FACADE_LOOKUP_SERVICE,
	useAngularInjection: true
})

@Injectable({
	providedIn: 'root'
})
export class WorkflowEntityFacadeLookupService<T extends object> extends UiCommonLookupEndpointDataService<IDataEntityFacade, T> {

	public constructor() {
		const options: ILookupEndpointConfig<IDataEntityFacade, T> = {
			httpRead: {route: 'basics/workflow/entity/', endPointRead: 'list'},
		};
		const config: ILookupConfig<IDataEntityFacade, T> = {
			uuid: 'ee9f50d284b64120b367df5d094d0eb4',
			displayMember: 'Description',
			valueMember: 'Id'
		};

		super(options, config);
	}

	private readonly workflowEntityService = inject(WorkflowEntityService);
	private readonly platformModuleManager = inject(PlatformModuleManagerService);

	public override getList(context?: IEntityContext<T>): Observable<IDataEntityFacade[]> {

		const observable = new Observable<IDataEntityFacade[]>((subscriber) => {

			this.workflowEntityService.loadAllEntityFacades().then(() => {
				const moduleName = get(this.platformModuleManager.activeModule?.moduleName, ['text'], '');
				const facade = this.workflowEntityService.entityFacades;
				const allEntities = facade.concat(this.workflowEntityService.dataEntityFacades);
				const filtered = allEntities.filter(e => e.ModuleName === moduleName);
				subscriber.next(filtered);
			});
		});
		return observable;
	}

	public getEntityFacadeById(uuid: string): IDataEntityFacade | undefined {
		return this.workflowEntityService.getFacadeById(uuid);
	}
}