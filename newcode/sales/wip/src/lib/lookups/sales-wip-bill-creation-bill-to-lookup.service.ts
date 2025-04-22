/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILookupConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IWipHeaderEntity } from '../model/entities/wip-header-entity.interface';
import { SalesWipWipsDataService } from '../services/sales-wip-wips-data.service';
import { BusinessPartnerLookupService, BusinesspartnerSharedSubsidiaryLookupService } from '@libs/businesspartner/shared';
import { BasicsSharedCustomerAbcLookupService } from '@libs/basics/shared';

@Injectable({
	providedIn: 'root'
})

export class SalesWipBillCreationBillToLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IWipHeaderEntity, TEntity> {

	public constructor(dataService:SalesWipWipsDataService) {
		const readData = {PKey1:0};
		// const params = dataService.getSelection()[0].ProjectFk;
		const endpoint = {
			httpRead: {
				route: 'project/main/billto/',
				endPointRead: 'listbyparent',
				usePostForRead: true,
			},
			filterParam: true,
			prepareListFilter: function prepareListFilter() {
				readData.PKey1 = dataService.getSelection()[0].ProjectFk;
				return readData;
			}
		};

		const gridConfig: ILookupConfig<IWipHeaderEntity, TEntity> = {
			uuid: 'b71e6d4dbed84341886e3ee4e9315ee0',
			idProperty: 'Id',
			readonly: false,
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				uuid: 'b71e6d4dbed84341886e3ee4e9315ee0',
				columns: [
					{
						id: 'code',
						model: 'Code',
						label: { text: 'Code', key: 'cloud.common.entityReferenceCode' },
						type: FieldType.Code,
						readonly: true,
						sortable: true,
					},
					{
						id: 'Description',
						model: 'Description',
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						type: FieldType.Description,
						readonly: true,
						sortable: true,
					},
					{
						id: 'businesspartner',
						model: 'BusinesspartnerFk',
						label: { text: 'Businesspartner', key: 'cloud.common.entityBusinesspartner' },
						type: FieldType.Lookup,
						readonly: true,
						sortable: true,
						lookupOptions: createLookup({
							dataServiceToken: BusinessPartnerLookupService,
						}),
					},
					{
						id: 'SubsidiaryFk',
						model: 'SubsidiaryFk',
						label: { text: 'Branch', key: 'cloud.common.entitySubsidiary' },
						type: FieldType.Lookup,
						readonly: true,
						sortable: true,
						lookupOptions: createLookup({
							dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
						}),
					},
					{
						id: 'CustomerFk',
						model: 'CustomerFk',
						label: { text: 'Customer', key: 'cloud.common.entityCustomer' },
						type: FieldType.Lookup,
						readonly: true,
						sortable: true,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedCustomerAbcLookupService,
						}),
					},
					{
						id: 'Comment',
						model: 'Comment',
						label: { text: 'Comment', key: 'cloud.common.entityComment' },
						type: FieldType.Comment,
						readonly: true,
						sortable: true,
					},
					{
						id: 'Remark',
						model: 'Remark',
						label: { text: 'Remarks', key: 'cloud.common.entityRemark' },
						type: FieldType.Remark,
						readonly: true,
						sortable: true,
					},
				],
			},
			dialogOptions: {
				headerText: 'BillTo',
				alerts: []
			},
			showDialog: false,
		};

		super(endpoint, gridConfig);
	}
}