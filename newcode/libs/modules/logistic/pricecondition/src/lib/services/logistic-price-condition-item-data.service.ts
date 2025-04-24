/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';

import { LogisticPriceConditionDataService } from './logistic-price-condition-data.service';
import { IIdentificationData } from '@libs/platform/common';
import { IPriceConditionEntity, IPriceConditionItemEntity } from '@libs/logistic/interfaces';
import {PriceConditionUpdateEntity} from '../model/price-condition-update-entity';




@Injectable({
	providedIn: 'root'
})


export class LogisticPriceConditionItemDataService extends DataServiceFlatLeaf<IPriceConditionItemEntity,IPriceConditionEntity, PriceConditionUpdateEntity >{

	public constructor() {
		const options: IDataServiceOptions<IPriceConditionItemEntity>  = {
			apiUrl: 'logistic/pricecondition/item',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
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
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<IPriceConditionItemEntity,IPriceConditionEntity, PriceConditionUpdateEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'PriceConditionItems',
				parent: inject(LogisticPriceConditionDataService),
			},
		};
		super(options);
	}
	public override isParentFn(parentKey: IPriceConditionEntity, entity: IPriceConditionItemEntity): boolean {
		return entity.PriceConditionFk === parentKey.Id;
	}

}



