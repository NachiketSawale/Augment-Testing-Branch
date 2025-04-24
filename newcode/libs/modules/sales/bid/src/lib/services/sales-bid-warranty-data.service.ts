/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { get } from 'lodash';
import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IBidHeaderEntity, IBidWarrantyEntity } from '@libs/sales/interfaces';
import { SalesBidBidsDataService } from './sales-bid-bids-data.service';
import { BidHeaderComplete } from '../model/complete-class/bid-header-complete.class';

@Injectable({
	providedIn: 'root',
})
/**
 * Sales bid warranty data service
 */
export class SalesBidWarrantyDataService extends DataServiceFlatLeaf<IBidWarrantyEntity, IBidHeaderEntity,BidHeaderComplete> {
	public constructor(private bidDataService: SalesBidBidsDataService) {
		const options: IDataServiceOptions<IBidWarrantyEntity> = {
			apiUrl: 'sales/bid/warranty',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
			},
			createInfo: {
				prepareParam: (ident) => {
					return {
						Pkey1: ident.pKey1!,
					};
				},
			},
			roleInfo: <IDataServiceChildRoleOptions<IBidWarrantyEntity, IBidHeaderEntity, BidHeaderComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'BidWarranty',
				parent: bidDataService,
			},
		};
		super(options);
	}

	/**
	 * Provide the payload for the load request
	 * @returns {object}
	 */
	protected override provideLoadPayload(): object {
		const parentSelection = this.bidDataService.getSelection()[0];
		return {
			Pkey1: parentSelection?.Id,
			filter: '',
		};
	}

	/**
	 * On load succeeded
	 * @param {object} loaded
	 * @returns  {IBidWarrantyEntity[]}
	 */
	protected override onLoadSucceeded(loaded: object): IBidWarrantyEntity[] {
		if (!loaded) {
			return [];
		}
		return get(loaded, 'Main', []);
	}

	/**
	 * Determines if the given warranty entity is associated with the specified bid header entity.
	 * @param {IBidHeaderEntity} parentKey
	 * @param {IBidWarrantyEntity} entity
	 * @returns {boolean}
	 */
	public override isParentFn(parentKey: IBidHeaderEntity, entity: IBidWarrantyEntity): boolean {
		return entity.BidHeaderFk === parentKey.Id;
	}
}
