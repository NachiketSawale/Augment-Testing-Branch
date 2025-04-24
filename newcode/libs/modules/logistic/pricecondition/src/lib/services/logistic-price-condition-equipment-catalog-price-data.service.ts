/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ILogisticEquipCatalogPriceEntity, IPriceConditionEntity } from '@libs/logistic/interfaces';
import { LogisticPriceConditionDataService } from './logistic-price-condition-data.service';
import { IIdentificationData } from '@libs/platform/common';
import {PriceConditionUpdateEntity} from '../model/price-condition-update-entity';

@Injectable({
	providedIn: 'root'
})

export class LogisticPriceConditionEquipmentCatalogPriceDataService extends DataServiceFlatLeaf<ILogisticEquipCatalogPriceEntity,IPriceConditionEntity, PriceConditionUpdateEntity >{

	public constructor() {
		const options: IDataServiceOptions<ILogisticEquipCatalogPriceEntity>  = {
			apiUrl: 'logistic/pricecondition/equipmentcatalogprice',
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
			roleInfo: <IDataServiceChildRoleOptions<ILogisticEquipCatalogPriceEntity,IPriceConditionEntity, PriceConditionUpdateEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'EquipmentCatalogPrices',
				parent: inject(LogisticPriceConditionDataService),
			},
		};
		super(options);
	}
	public override isParentFn(parentKey: IPriceConditionEntity, entity: ILogisticEquipCatalogPriceEntity): boolean {
		return entity.PriceConditionFk === parentKey.Id;
	}
}



