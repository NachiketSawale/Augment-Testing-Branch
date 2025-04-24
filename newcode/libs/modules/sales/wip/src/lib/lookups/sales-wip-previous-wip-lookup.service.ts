/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { FieldType, ILookupConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IBillHeaderEntity } from '../model/entities/bill-header-entity.interface';
import { SalesWipWipsDataService } from '../services/sales-wip-wips-data.service';

@Injectable({
	providedIn: 'root'
})
export class SalesWipPreviousWipLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IBillHeaderEntity, TEntity> {
	public constructor() {
		const dataService = inject(SalesWipWipsDataService);
		const selectedWip = dataService.getSelection()[0];
		const filter = JSON.stringify({
			SearchFields:['Code','DescriptionInfo'],
			SearchText:'',
			FilterKey:'sales-wip-previouswip-filter-by-server',
			AdditionalParameters:{
				WipId:selectedWip.Id,
				ContractId:selectedWip.OrdHeaderFk,
				ProjectId:selectedWip.ProjectFk,
			},
			TreeState:{
				StartId:null,
				Depth:null
			},
			RequirePaging:false
		});
		const endpoint =
			{
				httpRead:
					{
						route: 'basics/lookupdata/master/getsearchlist',
						endPointRead: '?lookup=saleswipv2&filtervalue='+filter,
						usePostForRead: false
					}
			};

		const gridConfig: ILookupConfig<IBillHeaderEntity, TEntity> = {
			uuid: '9d290e62073c46e9bb92ade7394b8728',
			idProperty: 'Id',
			readonly: false,
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				uuid: '9d290e62073c46e9bb92ade7394b8728',
				columns: [
					{id: 'Code', model: 'Code', type: FieldType.Code, label: {text: 'Code', key: 'sales.wip.entityWipCode'}, sortable: true, visible: true, readonly: false, width: 200},
					{id: 'description', model: 'DescriptionInfo.Description', type: FieldType.Description, label: {text: 'Description', key: 'cloud.common.entityDescription'}, sortable: true, visible: true, readonly: true, width: 200}
				],
			},
			dialogOptions: {
				headerText: 'Assign A Wip',
				alerts: []
			},
			showDialog: true,
		};

		super(endpoint, gridConfig);
	}
}