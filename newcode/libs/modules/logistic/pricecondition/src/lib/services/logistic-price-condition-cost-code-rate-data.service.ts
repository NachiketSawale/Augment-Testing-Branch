/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ILogisticCostCodeRateEntity, IPriceConditionEntity } from '@libs/logistic/interfaces';
import {PriceConditionUpdateEntity} from '../model/price-condition-update-entity';
import { LogisticPriceConditionDataService } from './logistic-price-condition-data.service';
import { IIdentificationData } from '@libs/platform/common';


@Injectable({
	providedIn: 'root'
})


export class LogisticPriceConditionCostCodeRateDataService extends DataServiceFlatLeaf<ILogisticCostCodeRateEntity,IPriceConditionEntity, PriceConditionUpdateEntity >{

	public constructor() {
		const options: IDataServiceOptions<ILogisticCostCodeRateEntity>  = {
			apiUrl: 'logistic/pricecondition/costcoderate',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
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
			roleInfo: <IDataServiceChildRoleOptions<ILogisticCostCodeRateEntity,IPriceConditionEntity, PriceConditionUpdateEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'CostCodeRates',
				parent: inject(LogisticPriceConditionDataService),
			},
		};
		super(options);
	}
	public override isParentFn(parentKey: IPriceConditionEntity, entity: ILogisticCostCodeRateEntity): boolean {
		return entity.PriceConditionFk === parentKey.Id;
	}

}



