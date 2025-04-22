import { Injectable } from '@angular/core';
import { FieldType, ILookupConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IBasicsCustomizeValueTypeEntity } from '@libs/basics/interfaces';

@Injectable({
	providedIn: 'root'
})

export class GeneralTypeLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeValueTypeEntity, TEntity> {
	public constructor() {

		const endpoint = { httpRead: { route: 'basics/lookupdata/master/', endPointRead: 'getlist?lookup=generalsvaluetype'} };

		const gridConfig: ILookupConfig<IBasicsCustomizeValueTypeEntity, TEntity> = {
			uuid: 'f514db8c2a0d4247a1f608eaacb7b99e',
			idProperty: 'Id',
			readonly: false,
			valueMember: 'Id',
			displayMember: 'Code',

			gridConfig: {
				uuid: 'f514db8c2a0d4247a1f608eaacb7b99e',
				columns: [
					{id: 'Status', model: 'DescriptionInfo.Description', type: FieldType.Description, label: {text: 'Description'}, sortable: true, visible: true, readonly: true},
					{id: 'Status', model: 'Code', type: FieldType.Description, label: {text: 'Code'}, sortable: true, visible: true, readonly: true},
				],
			},
			dialogOptions: {
				headerText: 'Value type',
				alerts: []
			},
			showDialog: true,
		};

		super(endpoint, gridConfig);
	}
}