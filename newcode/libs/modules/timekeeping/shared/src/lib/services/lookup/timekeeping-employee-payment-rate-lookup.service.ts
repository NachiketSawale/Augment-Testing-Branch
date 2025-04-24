/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import { createLookup, FieldType, ILookupSearchRequest, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { BasicsCompanyLookupService, BasicsSharedTimekeepingSurchargeTypeLookupService } from '@libs/basics/shared';
/*import { IPaymentGroupRateEntity } from '@libs/timekeeping/paymentgroup';*/

/**
 * Payment Rate lookup service
 */
@Injectable({
	providedIn: 'root'
})

export class TimekeepingEmployeePaymentRateLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<TEntity> {

	public constructor() {
		super({httpRead: {route:'timekeeping/paymentgroup/rate/',endPointRead:'paymentgroupratelist',usePostForRead: true},
				filterParam: true,
				prepareListFilter: () => {
					return {
						PKey1:1 ,
					};
				}
			},
			{
				uuid: '4f934589ab69498cb55da56755edee9a',
				idProperty: 'Id',
				valueMember: 'Id',
				displayMember: 'Rate',
				gridConfig:{
					uuid: '4f934589ab69498cb55da56755edee9a',
					columns: [
						{
							id: 'companyCode',
							model: 'CompanyFk',
							width: 120,
							label: { key: 'cloud.common.entityCompanyCode' },
							sortable: true,
							visible: true,
							readonly: true,
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: BasicsCompanyLookupService,
							}),
						},
						{
							id: 'validFrom',
							model: 'ValidFrom',
							type: FieldType.Date,
							label: {text: 'Valid From', key: 'basics.clerk.entityValidFrom'},
							sortable: true,
							visible: true,
							readonly: true
						},
						{
							id: 'Comments',
							model: 'CommentText',
							type: FieldType.Comment,
							label: { text: 'Uom', key: 'cloud.common.entityComment' },
							sortable: true,
							visible: true
						},
						{
							id: 'Surcharge',
							model: 'SurchargeTypeFk',
							width: 120,
							label: { key: 'timekeeping.paymentgroup.surchargeTypeFk' },
							sortable: true,
							visible: true,
							readonly: true,
							type: FieldType.Lookup,
							lookupOptions: createLookup({
								dataServiceToken: BasicsSharedTimekeepingSurchargeTypeLookupService,
							}),
						},
					]
				},
				showGrid:true,
				showDialog: false,

			});


	}
	protected override prepareSearchFilter(request: ILookupSearchRequest): string | object | undefined {
		//const filterValue = get(request.additionalParameters, 'filterValue');
		return {
			PKey1: 1,
		};
	}
}