import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { IChangeSetEntity } from '../../model/entities/change-set-entity.interface';

@Injectable({ providedIn: 'root' })
export class ModelSharedChangeSetLookupService<T extends object = object> extends UiCommonLookupTypeDataService<IChangeSetEntity, T> {
	public constructor() {
		super('changeset', {
			uuid: '',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			gridConfig: {
				uuid: '',
				columns: [
					{
						id: 'Id',
						model: 'DescriptionInfo.Translated',
						type: FieldType.Translation,
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						width: 150,
						visible: true,
						sortable: false,
						readonly: true,
					},
				],
			},
			showDialog: false,
		});
	}
}