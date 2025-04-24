/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';

import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';
import { IRequisitionEntity } from '@libs/resource/interfaces';
import { RequisitionComplete } from '../model/requisition-complete.class';


@Injectable({
	providedIn: 'root'
})

export class ResourceRequisitionDataService extends DataServiceFlatRoot<IRequisitionEntity, RequisitionComplete> {

	public constructor() {
		const options: IDataServiceOptions<IRequisitionEntity> = {
			apiUrl: 'resource/requisition',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IRequisitionEntity>>{
				role: ServiceRole.Root,
				itemName: 'Requisitions',
			}
		};

		super(options);
	}
	public override createUpdateEntity(modified: IRequisitionEntity | null): RequisitionComplete {
		const complete = new RequisitionComplete();
		if (modified !== null) {
			complete.Id = modified.Id;
			complete.Requisitions = [modified];
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: RequisitionComplete): IRequisitionEntity[] {
		if (complete.Requisitions === null) {
			return [];
		}
		return complete.Requisitions ?? [];
	}

	public getProcessors() {
		return this.processor.getProcessors();
	}

}












