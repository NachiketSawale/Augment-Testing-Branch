import { Injectable } from '@angular/core';
import { IOrdStatusEntity } from '@libs/sales/interfaces';
import { FieldType, ILookupConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})

export class OrdStatusLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IOrdStatusEntity, TEntity> {
	public constructor() {

		const endpoint = { httpRead: { route: 'sales/contract/status/', endPointRead: 'list'} };

		const gridConfig: ILookupConfig<IOrdStatusEntity, TEntity> = {
			uuid: '9c2e1cfbe6ee4bbc807a9b8382336fdb',
			idProperty: 'Id',
			readonly: false,
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Description',

			gridConfig: {
				uuid: '9c2e1cfbe6ee4bbc807a9b8382336fdb',
				columns: [
					{id: 'Status', model: 'DescriptionInfo.Description', type: FieldType.Description, label: {text: 'Status Name'}, sortable: true, visible: true, readonly: true},
				],
			},
			dialogOptions: {
				headerText: 'Contract status',
				alerts: []
			},
			// showGrid: true,
			showDialog: true,
		};

		super(endpoint, gridConfig);
	}
}