import { FieldType, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { IHsqCheckListEntity } from '@libs/hsqe/interfaces';

@Injectable({
	providedIn: 'root',
})
export class HsqeChecklistLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<IHsqCheckListEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('CheckList', {
			uuid: '7870b4229eab47dbaeafe2199a05f0b4',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			showDialog: true,
			dialogOptions: {
				headerText: {
					text: 'Check List Search Dialog',
					key: 'hsqe.checklist.title.checkListLookupDialog',
				},
			},
			gridConfig: {
				columns: [
					{
						type: FieldType.Code,
						id: 'code',
						model: 'Code',
						label: { text: 'Code', key: 'cloud.common.entityCode' },
						width: 100,
						sortable: true,
						visible: true,
					},
					{
						type: FieldType.Description,
						id: 'description',
						model: 'DescriptionInfo.Translated',
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						width: 100,
						sortable: true,
						visible: true,
					},
				],
			},
			// width: 500,
			//  height: 200,
		});
	}
}
