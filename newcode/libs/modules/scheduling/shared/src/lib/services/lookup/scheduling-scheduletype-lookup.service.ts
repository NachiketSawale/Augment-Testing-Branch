/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import { FieldType, ILookupSearchRequest, UiCommonLookupEndpointDataService } from '@libs/ui/common';

/**
 * Employee lookup service
 */
@Injectable({
	providedIn: 'root'
})

export class SchedulingScheduletypeLookup<TEntity extends object> extends UiCommonLookupEndpointDataService<TEntity> {

	public constructor() {
		super({ httpRead: {route:'basics/customize/scheduletype/',endPointRead:'list'},
				filterParam: true,
				prepareListFilter: context => {
					return {
						PKey1: null,
						PKey2:null,
						PKey3:null,  // could be from entity context
						customIntegerProperty:'BAS_SCHEDULING_CONTEXT_FK'
					};
				}
			},
			{
				uuid: 'ee9f50d284b64120b367df5d094d0eb0',
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				gridConfig:{
					columns: [
						{
							id: 'descriptionInfo',
							model: 'DescriptionInfo',
							type: FieldType.Translation,
							label: {text: 'Description',key:'cloud.common.entityDescription'},
							sortable: true,
							visible: true
						}
					]
				},
				showGrid:true,
				showDialog: false,

			});
	}


	protected override prepareSearchFilter(request: ILookupSearchRequest): string | object | undefined {
		return {
			PKey1: null,
			PKey2:null,
			PKey3:null,  // could be from entity context
			customIntegerProperty:'BAS_SCHEDULING_CONTEXT_FK'
		};
	}
}