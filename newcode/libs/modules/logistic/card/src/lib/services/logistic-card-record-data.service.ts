/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ILogisticCardActivityEntity, ILogisticCardRecordEntity } from '@libs/logistic/interfaces';
import { LogisticCardActivityComplete } from '../model/logistic-card-activity-complete.class';
import { LogisticCardActivityDataService } from './logistic-card-activity-data.service';
import { LogisticCardRecordReadonlyProcessorService } from './logistic-card-record-readonly-processor.service';
import { IIdentificationData } from '@libs/platform/common';
import { IMaterialGroupEntity } from '@libs/basics/shared';

@Injectable({
	providedIn: 'root'
})

export class LogisticCardRecordDataService extends DataServiceFlatLeaf<ILogisticCardRecordEntity, ILogisticCardActivityEntity, LogisticCardActivityComplete>{

	public constructor(parentDataService: LogisticCardActivityDataService) {
		const options: IDataServiceOptions<ILogisticCardRecordEntity>  = {
			apiUrl: 'logistic/card/record',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
				prepareParam: ident => {
					return {
						PKey1 : ident.pKey1,
						PKey2 : ident.pKey2
					};
				}
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
			roleInfo: <IDataServiceChildRoleOptions<ILogisticCardRecordEntity, ILogisticCardActivityEntity, LogisticCardActivityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Records',
				parent: parentDataService,
			},
		};

		super(options);
		this.processor.addProcessor(new LogisticCardRecordReadonlyProcessorService(this));
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(complete: LogisticCardActivityComplete, modified: ILogisticCardRecordEntity[], deleted: ILogisticCardRecordEntity[]) {
		if (modified && modified.length > 0) {
			complete.RecordsToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.RecordsToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: LogisticCardActivityComplete): ILogisticCardRecordEntity[] {
		if (complete && complete.RecordsToSave) {
			return complete.RecordsToSave;
		}

		return [];
	}

	public override isParentFn(parentKey: IMaterialGroupEntity, entity: ILogisticCardRecordEntity): boolean {
		return entity.JobCardActivityFk === parentKey.Id;
	}
}








