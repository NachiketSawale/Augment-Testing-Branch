import { Injectable } from '@angular/core';
import { IOrdAdvanceStatusEntity } from '@libs/sales/interfaces';
import { FieldType, ILookupConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})

export class OrdAdvanceLineStatusLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IOrdAdvanceStatusEntity, TEntity> {
	public constructor() {

		const endpoint = { httpRead: { route: 'basics/common/status/', endPointRead: 'list?statusName=salescontractadvance'} };

		const gridConfig: ILookupConfig<IOrdAdvanceStatusEntity, TEntity> = {
			uuid: '43c9f9e6389c48698887abfbbb60f3f0',
			idProperty: 'Id',
			readonly: false,
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Description',

			gridConfig: {
				uuid: '43c9f9e6389c48698887abfbbb60f3f0',
				columns: [
					{id: 'Status', model: 'DescriptionInfo.Description', type: FieldType.Description, label: {text: 'Status Name'}, sortable: true, visible: true, readonly: true},
				],
			},
			dialogOptions: {
				headerText: 'Contract advance line status',
				alerts: []
			},
			// showGrid: true,
			showDialog: true,
		};

		super(endpoint, gridConfig);
	}
}