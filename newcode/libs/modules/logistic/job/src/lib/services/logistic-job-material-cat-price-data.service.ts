/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatNode,ServiceRole,IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IJobEntity, ILogisticJobMaterialCatalogPriceEntity } from '@libs/logistic/interfaces';
import { LogisticMaterialComplete } from '../model/logistic-material-complete.class';
import { LogisticJobDataService } from './logistic-job-data.service';
import { JobComplete } from '../model/logistic-job-complete.class';
import { IIdentificationData } from '@libs/platform/common';
@Injectable({
	providedIn: 'root'
})

export class LogisticJobMaterialCatPriceDataService extends DataServiceFlatNode<ILogisticJobMaterialCatalogPriceEntity, LogisticMaterialComplete,IJobEntity,JobComplete>{

	public constructor(logisticJobDataService:LogisticJobDataService) {
		const options: IDataServiceOptions<ILogisticJobMaterialCatalogPriceEntity>  = {
			apiUrl: 'logistic/job/materialcatalogprice',
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
			roleInfo: <IDataServiceChildRoleOptions<ILogisticJobMaterialCatalogPriceEntity,IJobEntity, JobComplete>>{
				role: ServiceRole.Node,
				itemName: 'MaterialCatPrices',
				parent: logisticJobDataService,
			},
		};

		super(options);
	}

	public override createUpdateEntity(modified: ILogisticJobMaterialCatalogPriceEntity | null): LogisticMaterialComplete {
		const complete = new LogisticMaterialComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.MaterialCatPrices = [modified];
		}
		return complete;
	}

	public override registerByMethod(): boolean {
		return true;
	}
	public override registerNodeModificationsToParentUpdate(complete: JobComplete, modified: LogisticMaterialComplete[], deleted: ILogisticJobMaterialCatalogPriceEntity[]) {
		if (modified && modified.length > 0) {
			complete.MaterialCatPricesToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.MaterialCatPricesToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: JobComplete): ILogisticJobMaterialCatalogPriceEntity[] {
		if	(complete && complete.MaterialCatPricesToSave) {
			complete.MaterialCatPricesToSave.map(e => e.MaterialCatPrices!);
		}

		return [];
	}
	public override isParentFn(parentKey: IJobEntity, entity: ILogisticJobMaterialCatalogPriceEntity): boolean {
		return entity.JobFk === parentKey.Id;
	}

}





