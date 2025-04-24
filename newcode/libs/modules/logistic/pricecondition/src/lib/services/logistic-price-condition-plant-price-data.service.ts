/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable} from '@angular/core';



import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ILogisticPlantPriceEntity, IPriceConditionEntity } from '@libs/logistic/interfaces';
import { LogisticPriceConditionDataService } from './logistic-price-condition-data.service';
import { IIdentificationData } from '@libs/platform/common';
import {PriceConditionUpdateEntity} from '../model/price-condition-update-entity';



@Injectable({
	providedIn: 'root'
})

export class LogisticPriceConditionPlantPriceDataService extends DataServiceFlatLeaf<ILogisticPlantPriceEntity,IPriceConditionEntity, PriceConditionUpdateEntity >{

	public constructor() {
		const options: IDataServiceOptions<ILogisticPlantPriceEntity>  = {
			apiUrl: 'logistic/pricecondition/plantprice',
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
			roleInfo: <IDataServiceChildRoleOptions<ILogisticPlantPriceEntity,IPriceConditionEntity, PriceConditionUpdateEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'PlantPrices',
				parent: inject(LogisticPriceConditionDataService),
			},
		};
		super(options);
	}
	public override isParentFn(parentKey: IPriceConditionEntity, entity: ILogisticPlantPriceEntity): boolean {
		return entity.PriceConditionFk === parentKey.Id;
	}

}



