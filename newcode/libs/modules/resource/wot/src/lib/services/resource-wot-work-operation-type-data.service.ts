/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IDataServiceEndPointOptions, ServiceRole, IDataServiceOptions, IDataServiceRoleOptions, DataServiceFlatRoot } from '@libs/platform/data-access';
import { IResourceWorkOperationTypeEntity } from '@libs/resource/interfaces';
import { ResourceWorkOperationTypeComplete } from '../model/resource-work-operation-type-complete.class';
import { ResourceWotWorkOperationTypeReadonlyProcessor } from './resource-wot-work-operation-readonly-processor.service';

@Injectable({
	providedIn: 'root'
})
export class ResourceWotWorkOperationTypeDataService extends DataServiceFlatRoot<IResourceWorkOperationTypeEntity,ResourceWorkOperationTypeComplete> {
	public constructor() {
		const options: IDataServiceOptions<IResourceWorkOperationTypeEntity> = {
			apiUrl: 'resource/wot/workoperationtype',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IResourceWorkOperationTypeEntity>>{
				role: ServiceRole.Root,
				itemName: 'WorkOperationType'
			},
			processors: []
		};
		super(options);

		this.processor.addProcessor([
			new ResourceWotWorkOperationTypeReadonlyProcessor(this)
		]);
	}
	public override createUpdateEntity(modified: IResourceWorkOperationTypeEntity | null): ResourceWorkOperationTypeComplete {
		const complete = new ResourceWorkOperationTypeComplete();
		if (modified !== null) {
			complete.WorkOperationTypeId = modified.Id;
			complete.WorkOperationTypes = [modified];
		}

		return complete;
	}
	public override getModificationsFromUpdate(complete: ResourceWorkOperationTypeComplete): IResourceWorkOperationTypeEntity[] {
		if (complete.WorkOperationTypes === null){
			complete.WorkOperationTypes = [];
		}

		return complete.WorkOperationTypes;
	}
}