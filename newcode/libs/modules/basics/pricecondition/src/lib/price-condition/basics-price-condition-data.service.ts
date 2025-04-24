/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';
import { IPriceConditionEntity } from '../model/entities/price-condition-entity.interface';
import { PriceConditionComplete } from '../model/complete-class/price-condition-complete.class';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import { ISearchResult } from '@libs/platform/common';
import { get } from 'lodash';

@Injectable({
	providedIn: 'root',
})
export class BasicsPriceConditionDataService extends DataServiceFlatRoot<IPriceConditionEntity, PriceConditionComplete> {
	public constructor() {
		const options: IDataServiceOptions<IPriceConditionEntity> = {
			apiUrl: 'basics/pricecondition',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update',
				usePost: true,
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceRoleOptions<IPriceConditionEntity>>{
				role: ServiceRole.Root,
				itemName: 'PriceCondition',
			},
		};

		super(options);
	}

	/**
	 * Convert http response of searching to standard search result
	 * @param loaded
	 * @protected
	 */
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IPriceConditionEntity> {
		const fr = get(loaded, 'FilterResult')!;
		return {
			FilterResult: fr,
			dtos: loaded as IPriceConditionEntity[],
		};
	}

	public override createUpdateEntity(modified: IPriceConditionEntity | null): PriceConditionComplete {
		return new PriceConditionComplete(modified);
	}

	public override getModificationsFromUpdate(complete: PriceConditionComplete): IPriceConditionEntity[] {
		if (complete.PriceCondition === null || complete.PriceCondition === undefined) {
			return [];
		}

		return [complete.PriceCondition];
	}
}
