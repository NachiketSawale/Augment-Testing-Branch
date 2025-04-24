import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';

export interface IProjectInstanceHeaderEntity {
	Id: number;
	ProjectFk: number;
	EstHeaderFk: number;
	ModelFk: number;
	Code: string;
	Description: string | null;
	PsdScheduleFk: number | null;
	BoqHeaderFk: number | null;
}

@Injectable({ providedIn: 'root' })
export class ConstructionSystemSharedProjectInstanceHeaderLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IProjectInstanceHeaderEntity, TEntity> {
	public constructor() {
		super('InstanceHeader', {
			uuid: '54f0d34a3d054217aa8c8c292a81f6ae',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			showDialog: false,
			gridConfig: {
				columns: [
					{
						id: 'code',
						model: 'Code',
						label: { key: 'cloud.common.entityCode' },
						width: 100,
						type: FieldType.Code,
						sortable: false,
					},
					{
						id: 'description',
						model: 'Description',
						label: { key: 'cloud.common.entityDescription' },
						width: 150,
						type: FieldType.Description,
						sortable: false,
					},
				],
			},
		});
	}
}
