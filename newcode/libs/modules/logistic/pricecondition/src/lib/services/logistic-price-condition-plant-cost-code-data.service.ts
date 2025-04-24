/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { LogisticPriceConditionDataService } from './logistic-price-condition-data.service';
import { IPlantCostCodeEntity, IPriceConditionEntity } from '@libs/logistic/interfaces';
import {PriceConditionUpdateEntity} from '../model/price-condition-update-entity';

@Injectable({
	providedIn: 'root'
})

export class LogisticPriceConditionPlantCostCodeDataService extends DataServiceFlatLeaf<IPlantCostCodeEntity,IPriceConditionEntity, PriceConditionUpdateEntity >{

	public constructor() {
		const options: IDataServiceOptions<IPlantCostCodeEntity>  = {
			apiUrl: 'logistic/pricecondition/plantcostcode',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IPlantCostCodeEntity,IPriceConditionEntity, PriceConditionUpdateEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'PlantCostCode',
				parent: inject(LogisticPriceConditionDataService),
			},
			entityActions: { createSupported: false, deleteSupported: false },
		};
		super(options);
	}
	public override isParentFn(parentKey: IPriceConditionEntity, entity: IPlantCostCodeEntity): boolean {
		return entity.PriceConditionFk === parentKey.Id;
	}
}



