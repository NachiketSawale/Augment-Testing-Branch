/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IDescriptionInfo } from '@libs/platform/common';
import { BusinesspartnerSharedContactLookupService } from '@libs/businesspartner/shared';

/**
 * Contract crew lookup entity interface
 */
export interface IContractCrewLookupEntity {
	Id: number;
	DescriptionInfo: IDescriptionInfo;
	BpdContactFk: number;
}

/**
 * Contract lookup data service
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementCommonContractCrewLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IContractCrewLookupEntity, TEntity> {
	public constructor() {
		super('contractcrew', {
			uuid: '67d75094a15647c3afc2fabc06341307',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
			gridConfig: {
				columns: [
					{
						id: 'Description',
						type: FieldType.Translation,
						label: {key: 'cloud.common.entityDescription'},
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Contact',
						model: 'BpdContactFk',
						type: FieldType.Lookup,
						label: {key: 'procurement.contract.entityBpdContactFk'},
						lookupOptions: createLookup({
							dataServiceToken: BusinesspartnerSharedContactLookupService,
							displayMember: 'FullName',
						}),
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}