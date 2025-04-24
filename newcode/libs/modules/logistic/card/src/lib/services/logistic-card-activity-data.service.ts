/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatNode,ServiceRole,IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { ILogisticCardActivityEntity, ILogisticCardEntity } from '@libs/logistic/interfaces';
import { LogisticCardActivityComplete } from '../model/logistic-card-activity-complete.class';
import { LogisticCardComplete } from '../model/logistic-card-complete.class';
import { LogisticCardDataService } from './logistic-card-data.service';
import { LogisticCardActivityReadonlyProcessorService } from './logistic-card-activity-readonly-processor.service';
import { IIdentificationData } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})

export class LogisticCardActivityDataService extends DataServiceFlatNode<ILogisticCardActivityEntity, LogisticCardActivityComplete, ILogisticCardEntity, LogisticCardComplete>{

	public constructor(parentDataService: LogisticCardDataService) {
		const options: IDataServiceOptions<ILogisticCardActivityEntity>  = {
			apiUrl: 'logistic/card/activity',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
				prepareParam: ident => {
					return { PKey1: ident.pKey1 };
				}
			},
			createInfo: <IDataServiceEndPointOptions>{
				prepareParam: (ident: IIdentificationData) => {
					return {
						PKey1: ident.pKey1,
					};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<ILogisticCardActivityEntity, ILogisticCardEntity, LogisticCardComplete>>{
				role: ServiceRole.Node,
				itemName: 'Activities',
				parent: parentDataService,
			},
		};

		super(options);
		this.processor.addProcessor(new LogisticCardActivityReadonlyProcessorService(this));
	}

	public override createUpdateEntity(modified: ILogisticCardActivityEntity | null): LogisticCardActivityComplete {
		const complete = new LogisticCardActivityComplete();
		if (modified !== null) {
			complete.JobCardActivityId = modified.Id;
			complete.Activities = modified;
		}

		return complete;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(complete: LogisticCardComplete, modified: LogisticCardActivityComplete[], deleted: ILogisticCardActivityEntity[]) {
		if (modified && modified.length > 0) {
			complete.ActivitiesToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.ActivitiesToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: LogisticCardComplete): ILogisticCardActivityEntity[] {
		if (complete && complete.ActivitiesToSave) {
			return complete.ActivitiesToSave.flatMap(e => e.Activities ? e.Activities : []);
		} else {
			return [];
		}
	}

	public override getModificationsFromUpdate(complete: LogisticCardActivityComplete): ILogisticCardActivityEntity[] {
		if (complete.Activities === null) {
			return [];
		}

		return [complete.Activities];
	}


	public override isParentFn(parentKey: ILogisticCardEntity, entity: ILogisticCardActivityEntity): boolean {
		return entity.JobCardFk === parentKey.Id;
	}

}










