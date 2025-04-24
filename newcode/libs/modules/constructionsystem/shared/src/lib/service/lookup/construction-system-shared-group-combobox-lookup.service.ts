import { FieldType, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { ICosGroupEntity } from '../../model/entities/cos-group-entity.interface';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemSharedGroupComboboxLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<ICosGroupEntity, TEntity> {
	public constructor() {
		super('constructionsystemmastergroup', {
			uuid: '381b12d5faf34d7b846b479538cabf3f',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'code',
						model: 'Code',
						type: FieldType.Code,
						sortable: false,
						width: 50,
						label: { key: 'cloud.common.entityCode' },
					},
					{
						id: 'desc',
						model: 'DescriptionInfo.Translated',
						type: FieldType.Description,
						sortable: false,
						width: 120,
						label: { key: 'cloud.common.entityDescription' },
					},
				],
			},
			treeConfig: {
				parentMember: 'CosGroupFk',
				childMember: 'GroupChildren',
			},
			showGrid: true,
		});
	}
}