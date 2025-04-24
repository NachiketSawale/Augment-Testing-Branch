/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ILogisticJobMaterialCatalogPriceEntity, ILogisticMaterialRateEntity } from '@libs/logistic/interfaces';
import { LogisticMaterialComplete } from '../model/logistic-material-complete.class';
import { LogisticJobMaterialCatPriceDataService } from './logistic-job-material-cat-price-data.service';
import { IIdentificationData } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})


export class LogisticJobMaterialRateDataService extends DataServiceFlatLeaf<ILogisticMaterialRateEntity,ILogisticJobMaterialCatalogPriceEntity, LogisticMaterialComplete >{

	public constructor(logisticJobMaterialCatPriceDataService:LogisticJobMaterialCatPriceDataService) {
		const options: IDataServiceOptions<ILogisticMaterialRateEntity>  = {
			apiUrl: 'logistic/job/materialrate',
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
			roleInfo: <IDataServiceChildRoleOptions<ILogisticMaterialRateEntity,ILogisticJobMaterialCatalogPriceEntity, LogisticMaterialComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'MaterialRates',
				parent: logisticJobMaterialCatPriceDataService,
			},


		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(complete: LogisticMaterialComplete, modified: ILogisticMaterialRateEntity[], deleted: ILogisticMaterialRateEntity[]) {
		if (modified && modified.length > 0) {
			complete.MaterialRatesToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.MaterialRatesToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: LogisticMaterialComplete): ILogisticMaterialRateEntity[] {
		if (complete && complete.MaterialRatesToSave) {
			return complete.MaterialRatesToSave;
		}

		return [];
	}
	public override isParentFn(parentKey: ILogisticJobMaterialCatalogPriceEntity, entity: ILogisticMaterialRateEntity): boolean {
		return entity.MaterialCatalogPriceFk === parentKey.Id;
	}
}



