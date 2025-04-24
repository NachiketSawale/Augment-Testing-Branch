/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ILogisticSundryServicePriceEntity } from '@libs/logistic/interfaces';
import { IPriceConditionEntity } from '@libs/logistic/interfaces';
import { LogisticPriceConditionDataService } from './logistic-price-condition-data.service';
import { IIdentificationData } from '@libs/platform/common';
import {PriceConditionUpdateEntity} from '../model/price-condition-update-entity';

@Injectable({
	providedIn: 'root'
})

export class LogisticPriceConditionSundryServicePriceDataService extends DataServiceFlatLeaf<ILogisticSundryServicePriceEntity,IPriceConditionEntity, PriceConditionUpdateEntity >{

	public constructor() {
		const options: IDataServiceOptions<ILogisticSundryServicePriceEntity>  = {
			apiUrl: 'logistic/pricecondition/sundryserviceprice',
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
			roleInfo: <IDataServiceChildRoleOptions<ILogisticSundryServicePriceEntity,IPriceConditionEntity, PriceConditionUpdateEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'SundryServicePrices',
				parent: inject(LogisticPriceConditionDataService),
			},
		};
		super(options);
	}
	public override isParentFn(parentKey: IPriceConditionEntity, entity: ILogisticSundryServicePriceEntity): boolean {
		return entity.PriceConditionFk === parentKey.Id;
	}

}



