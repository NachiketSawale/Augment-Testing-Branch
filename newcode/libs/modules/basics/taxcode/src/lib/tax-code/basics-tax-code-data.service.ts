/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';

import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import { ISearchResult } from '@libs/platform/common';
import { get } from 'lodash';
import { IMdcTaxCodeEntity } from '@libs/basics/interfaces';
import { MdcTaxCodeComplete } from '../model/complete-class/mdc-tax-code-complete.class';
@Injectable({
	providedIn: 'root',
})
export class BasicsTaxCodeDataService extends DataServiceFlatRoot<IMdcTaxCodeEntity, MdcTaxCodeComplete> {
	public constructor() {
		const options: IDataServiceOptions<IMdcTaxCodeEntity> = {
			apiUrl: 'basics/taxcode',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true,
			},
			updateInfo: {
				endPoint: 'updatetx',
				usePost: true,
			},
			createInfo: {
				endPoint: 'createnew',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'deletetx',
			},
			roleInfo: <IDataServiceRoleOptions<IMdcTaxCodeEntity>>{
				role: ServiceRole.Root,
				itemName: 'MdcTaxCode',
			},
		};

		super(options);
	}

	/**
	 * Provide the load payload here
	 * @protected
	 */
	protected override provideLoadPayload(): object {
		return {};
	}

	/**
	 * Convert http response of searching to standard search result
	 * @param loaded
	 * @protected
	 */
	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IMdcTaxCodeEntity> {
		const fr = get(loaded, 'FilterResult')!;

		return {
			FilterResult: fr,
			dtos: get(loaded, 'dtos')! as IMdcTaxCodeEntity[],
		};
	}

	public override createUpdateEntity(modified: IMdcTaxCodeEntity | null): MdcTaxCodeComplete {
		return new MdcTaxCodeComplete(modified);
	}

	public override getModificationsFromUpdate(complete: MdcTaxCodeComplete): IMdcTaxCodeEntity[] {
		return complete && complete.MdcTaxCode ? [complete.MdcTaxCode] : [];
	}
}
