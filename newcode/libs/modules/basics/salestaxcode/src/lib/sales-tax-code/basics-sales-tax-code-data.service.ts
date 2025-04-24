/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceRoleOptions} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import { ISearchResult } from '@libs/platform/common';
import { get } from 'lodash';
import { MdcSalesTaxCodeComplete } from '../model/entities/complete-class/mdc-sales-tax-code-complete.class';
import { IMdcSalesTaxCodeEntity } from '@libs/basics/interfaces';

@Injectable({
	providedIn: 'root',
})
export class BasicsSalesTaxCodeDataService extends DataServiceFlatRoot<IMdcSalesTaxCodeEntity, MdcSalesTaxCodeComplete> {
	public constructor() {
		const options: IDataServiceOptions<IMdcSalesTaxCodeEntity> = {
			apiUrl: 'basics/salestaxcode',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true,
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'updatetx',
				usePost: true
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createnew',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceRoleOptions<IMdcSalesTaxCodeEntity>>{
				role: ServiceRole.Root,
				itemName: 'MdcSalesTaxCode',
			},
		};

		super(options);
	}


	/**
	 * Convert http response of searching to standard search result
	 * @param loaded
	 * @protected
	 */
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IMdcSalesTaxCodeEntity> {
		const fr = get(loaded, 'FilterResult')!;
		return {
			FilterResult: fr,
			dtos: get(loaded, 'dtos')! as IMdcSalesTaxCodeEntity[]
		};
	}

	public override createUpdateEntity(modified: IMdcSalesTaxCodeEntity | null): MdcSalesTaxCodeComplete {
		return new MdcSalesTaxCodeComplete(modified);
	}

	public override getModificationsFromUpdate(complete: MdcSalesTaxCodeComplete): IMdcSalesTaxCodeEntity[] {
		if (complete.MdcSalesTaxCode === null || complete.MdcSalesTaxCode === undefined) {
			return [];
		}

		return [complete.MdcSalesTaxCode];
	}
}