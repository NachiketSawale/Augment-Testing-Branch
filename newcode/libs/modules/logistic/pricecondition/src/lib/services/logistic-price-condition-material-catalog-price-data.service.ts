/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { LogisticPriceConditionDataService } from './logistic-price-condition-data.service';
import { ILogisticMaterialCatalogPriceEntity } from '@libs/logistic/interfaces';
import { IPriceConditionEntity } from '@libs/logistic/interfaces';
import { IIdentificationData } from '@libs/platform/common';
import {PriceConditionUpdateEntity} from '../model/price-condition-update-entity';

@Injectable({
	providedIn: 'root'
})

export class LogisticPriceConditionMaterialCatalogPriceDataService extends DataServiceFlatLeaf<ILogisticMaterialCatalogPriceEntity,IPriceConditionEntity, PriceConditionUpdateEntity >{

	public constructor() {
		const options: IDataServiceOptions<ILogisticMaterialCatalogPriceEntity>  = {
			apiUrl: 'logistic/pricecondition/materialcatalogprice',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
				prepareParam: ident => {
					return {
						PKey1 : ident.pKey1};
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
			roleInfo: <IDataServiceChildRoleOptions<ILogisticMaterialCatalogPriceEntity,IPriceConditionEntity, PriceConditionUpdateEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'MaterialCatalogPrices',
				parent: inject(LogisticPriceConditionDataService),
			},
		};

		super(options);
	}
	public override isParentFn(parentKey: IPriceConditionEntity, entity: ILogisticMaterialCatalogPriceEntity): boolean {
		return entity.PriceConditionFk === parentKey.Id;
	}

}



