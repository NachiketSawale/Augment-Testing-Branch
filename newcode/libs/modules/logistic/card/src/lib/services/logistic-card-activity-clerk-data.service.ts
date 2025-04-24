/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { LogisticCardActivityDataService } from './logistic-card-activity-data.service';
import { ILogisticCardActClerkEntity, ILogisticCardActivityEntity } from '@libs/logistic/interfaces';
import { LogisticCardActivityComplete } from '../model/logistic-card-activity-complete.class';
import { IIdentificationData } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})

export class LogisticCardActivityClerkDataService extends DataServiceFlatLeaf<ILogisticCardActClerkEntity, ILogisticCardActivityEntity, LogisticCardActivityComplete>{

	public constructor(parentDataService: LogisticCardActivityDataService) {
		const options: IDataServiceOptions<ILogisticCardActClerkEntity>  = {
			apiUrl: 'logistic/card/clerk/activity',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
			},
			createInfo: <IDataServiceEndPointOptions>{
				prepareParam: (ident: IIdentificationData) => {
					const selection = parentDataService.getSelectedEntity();
					return {
						PKey1: selection?.Id,
						Pkey2: selection?.JobCardFk
					};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<ILogisticCardActClerkEntity, ILogisticCardActivityEntity, LogisticCardActivityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'JobCardActClerk',
				parent: parentDataService,
			},

		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(complete: LogisticCardActivityComplete, modified: ILogisticCardActClerkEntity[], deleted: ILogisticCardActClerkEntity[]) {
		if (modified && modified.length > 0) {
			complete.JobCardActClerkToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.JobCardActClerkToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: LogisticCardActivityComplete): ILogisticCardActClerkEntity[] {
		if (complete && complete.JobCardActClerkToSave) {
			return complete.JobCardActClerkToSave;
		}

		return [];
	}
	public override isParentFn(parentKey: ILogisticCardActivityEntity, entity: ILogisticCardActClerkEntity): boolean {
		return entity.JobCardActivityFk === parentKey.Id;
	}
}








