import { Injectable } from '@angular/core';
import { FieldType, ILookupConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IBasicsTaxCodeEntity } from '../model/entities/basics-tax-code-entity.interface';

@Injectable({
	providedIn: 'root'
})

export class TaxCodeLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IBasicsTaxCodeEntity, TEntity> {
	public constructor() {

		const endpoint = { httpRead: { route: 'basics/lookupdata/master/', endPointRead: 'getlist?lookup=taxcode'} };

		const gridConfig: ILookupConfig<IBasicsTaxCodeEntity, TEntity> = {
			uuid: '4943282fe43a49f2b34bb2b9f6c536e9',
			idProperty: 'Id',
			readonly: false,
			valueMember: 'Id',
			displayMember: 'Code',

			gridConfig: {
				uuid: '4943282fe43a49f2b34bb2b9f6c536e9',
				columns: [
					{id: 'Status', model: 'DescriptionInfo.Description', type: FieldType.Description, label: {text: 'Description'}, sortable: true, visible: true, readonly: true},
					{id: 'Status', model: 'Code', type: FieldType.Description, label: {text: 'Code'}, sortable: true, visible: true, readonly: true},
				],
			},
			dialogOptions: {
				headerText: 'Tax code',
				alerts: []
			},
			// showGrid: true,
			showDialog: true,
		};

		super(endpoint, gridConfig);
	}
}