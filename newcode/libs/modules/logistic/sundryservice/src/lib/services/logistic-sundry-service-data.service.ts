/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceRoleOptions, IEntityList } from '@libs/platform/data-access';
import { LogisticSundryServiceComplete } from '../model/logistic-sundry-service-complete.class';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import { ILogisticSundryServiceEntity } from '@libs/logistic/interfaces';

@Injectable({
	providedIn: 'root'
})

export class LogisticSundryServiceDataService extends DataServiceFlatRoot<ILogisticSundryServiceEntity, LogisticSundryServiceComplete> {

	public constructor() {
		const options: IDataServiceOptions<ILogisticSundryServiceEntity> = {
			apiUrl: 'logistic/sundryservice',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<ILogisticSundryServiceEntity>>{
				role: ServiceRole.Root,
				itemName: 'SundryService'
			},
			entityActions: {createSupported: true, deleteSupported: true}
		};

		super(options);
	}

	public override createUpdateEntity(modified: ILogisticSundryServiceEntity | null): LogisticSundryServiceComplete {
		const complete = new LogisticSundryServiceComplete();
		if (modified !== null) {
			complete.SundryServiceId = modified.Id;
			complete.SundryServices = [modified];
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: LogisticSundryServiceComplete): ILogisticSundryServiceEntity[] {
		if (complete.SundryServices === null) {
			complete.SundryServices = [];
		}

		return complete.SundryServices;
	}

	protected override checkCreateIsAllowed(entities: ILogisticSundryServiceEntity[] | ILogisticSundryServiceEntity | null): boolean {
		return entities !== null;
	}

	protected takeOverUpdatedFromComplete(complete: LogisticSundryServiceComplete, entityList: IEntityList<ILogisticSundryServiceEntity>) {
		if (complete && complete.SundryServices && complete.SundryServices.length > 0) {
			entityList.updateEntities(complete.SundryServices);
		}
	}

}
