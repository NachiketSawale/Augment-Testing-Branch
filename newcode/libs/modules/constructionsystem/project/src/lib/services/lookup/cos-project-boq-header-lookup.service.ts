import { FieldType, UiCommonLookupItemsDataService } from '@libs/ui/common';
import { IPrcBoqExtendedEntity } from '@libs/procurement/interfaces';
import { IInstanceHeaderEntity } from '@libs/constructionsystem/shared';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class CosProjectBoqHeaderLookupService extends UiCommonLookupItemsDataService<IPrcBoqExtendedEntity, IInstanceHeaderEntity> {
	public constructor() {
		super([], {
			// todo chi: the array should be boq data list
			valueMember: 'Id',
			displayMember: 'BoqRootItem.Reference',
			uuid: '911680ea1cd444b8ab3b7c0684d2a1a6',
			gridConfig: {
				columns: [
					{
						id: 'Reference',
						model: 'BoqRootItem.Reference',
						width: 200,
						label: 'cloud.common.entityReference',
						type: FieldType.Description,
						sortable: true,
						visible: true,
					},
					{
						id: 'BriefInfo',
						width: 250,
						model: 'BoqRootItem.BriefInfo.Translated',
						label: 'cloud.common.entityBrief',
						type: FieldType.Description,
						sortable: true,
						visible: true,
					},
				],
			},
		});
	}
}