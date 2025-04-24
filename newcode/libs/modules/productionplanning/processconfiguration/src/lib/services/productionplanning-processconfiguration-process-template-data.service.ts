/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {
	DataServiceFlatRoot,
	IDataServiceEndPointOptions,
	IDataServiceOptions,
	IDataServiceRoleOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {ProcessTemplateEntity} from '../model/process-template-entity.class';
import {ProcessTemplateEntityComplete} from '../model/process-template-entity-complete.class';

@Injectable({providedIn: 'root'})
export class ProductionplanningProcessconfigurationProcessTemplateDataService extends DataServiceFlatRoot<ProcessTemplateEntity, ProcessTemplateEntityComplete> {
	public constructor() {
		const options: IDataServiceOptions<ProcessTemplateEntity> = {
			apiUrl: 'productionplanning/processconfiguration/processtemplate',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update'
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create'
			},
			roleInfo: <IDataServiceRoleOptions<ProcessTemplateEntity>> {
				role: ServiceRole.Root,
				itemName: 'ProcessTemplate'
			}
		};
		super(options);
	}

	public override createUpdateEntity(modified: ProcessTemplateEntity | null): ProcessTemplateEntityComplete {
		const complete = new ProcessTemplateEntityComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.ProcessTemplate = [modified];
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: ProcessTemplateEntityComplete): ProcessTemplateEntity[] {
		if (complete.ProcessTemplate === null) {
			complete.ProcessTemplate = [];
		}

		return complete.ProcessTemplate;
	}
}
