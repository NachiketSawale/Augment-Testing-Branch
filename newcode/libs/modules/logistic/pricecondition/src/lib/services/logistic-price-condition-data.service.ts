/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';
import { IPriceConditionEntity } from '@libs/logistic/interfaces';
import {PriceConditionUpdateEntity} from '../model/price-condition-update-entity';



@Injectable({
	providedIn: 'root'
})

export class LogisticPriceConditionDataService extends DataServiceFlatRoot<IPriceConditionEntity, PriceConditionUpdateEntity> {

	public constructor() {
		const options: IDataServiceOptions<IPriceConditionEntity> = {
			apiUrl: 'logistic/pricecondition',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IPriceConditionEntity>>{
				role: ServiceRole.Root,
				itemName: 'PriceConditions',
			}
		};

		super(options);
	}

	public override createUpdateEntity(modified: IPriceConditionEntity | null): PriceConditionUpdateEntity {
		const complete = new PriceConditionUpdateEntity();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.PriceConditions = [modified];
		}

		return complete;
	}
	public override getModificationsFromUpdate(complete: PriceConditionUpdateEntity): IPriceConditionEntity[] {
		if (complete.PriceConditions === null) {
			return complete.PriceConditions = [];
		} else {
			return complete.PriceConditions;
		}
	}

}







