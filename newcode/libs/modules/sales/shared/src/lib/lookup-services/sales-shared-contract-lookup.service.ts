import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IOrdHeaderEntity } from '../model/entities/ord-header-entity.interface';

@Injectable({
	providedIn: 'root'
})

export class salesSharedContractLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IOrdHeaderEntity, TEntity> {
	public constructor() {
		super({
			httpRead: {route: 'sales/contract/', endPointRead: 'list'},
			filterParam: 'projectId',
			prepareListFilter: context => {
				// TODO: need to taken over dynamic data here in future this is for trial purpose
				return 'projectId=1016388';
			}
		}, {
			uuid: 'e4e5dd6fedd340e4b854e1af3b8efd79',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{id: 'Status', model: 'Code', type: FieldType.Description, label: {text: 'Code'}, sortable: true, visible: true, readonly: true},
					{id: 'Status', model: 'DescriptionInfo.Description', type: FieldType.Description, label: {text: 'Description'}, sortable: true, visible: true, readonly: true}
				],
			},
		});
	}
}