/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ILogisticEquipmentCatalogPriceEntity } from '@libs/logistic/interfaces';
import { IJobEntity } from '@libs/logistic/interfaces';
import { JobComplete } from '../model/logistic-job-complete.class';
import { LogisticJobDataService } from './logistic-job-data.service';
import { IIdentificationData } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})

export class LogisticJobEquipmentCatPriceDataService extends DataServiceFlatLeaf<ILogisticEquipmentCatalogPriceEntity,IJobEntity, JobComplete >{

	public constructor(logisticJobDataService:LogisticJobDataService) {
		const options: IDataServiceOptions<ILogisticEquipmentCatalogPriceEntity>  = {
			apiUrl: 'logistic/job/equipmentcatalogprice',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
				prepareParam: ident => {
					return { PKey1 : ident.pKey1 };
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
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<ILogisticEquipmentCatalogPriceEntity,IJobEntity, JobComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'EquipmentCatPrices',
				parent: logisticJobDataService,
			},
		};
		super(options);
	}



	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(complete: JobComplete, modified: ILogisticEquipmentCatalogPriceEntity[], deleted: ILogisticEquipmentCatalogPriceEntity[]) {
		if (modified && modified.length > 0) {
			complete.EquipmentCatPricesToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.EquipmentCatPricesToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: JobComplete): ILogisticEquipmentCatalogPriceEntity[] {
		if (complete && complete.EquipmentCatPricesToSave) {
			return complete.EquipmentCatPricesToSave;
		}

		return [];
	}
	public override isParentFn(parentKey: IJobEntity, entity: ILogisticEquipmentCatalogPriceEntity): boolean {
		return entity.JobFk === parentKey.Id;
	}

}



