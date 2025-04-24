/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { FieldType, IGridConfiguration, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { ICosGlobalParamGroupEntity } from '@libs/constructionsystem/shared';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterGlobalParameterGroupLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<ICosGlobalParamGroupEntity, TEntity> {
	public configuration!: IGridConfiguration<ICosGlobalParamGroupEntity>;

	/**
	 *The constructor
	 */
	public constructor() {
		super('CosMasterGlobalParamGroup', {
			uuid: '0c9a0ec9fab1467b852db6dA11d95b5e',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				treeConfiguration: {
					parent: (entity: ICosGlobalParamGroupEntity) => {
						if (entity.CosGlobalParamGroupFk) {
							return this.configuration?.items?.find((item) => item.Id === entity.CosGlobalParamGroupFk) || null;
						}
						return null;
					},
					children: (entity: ICosGlobalParamGroupEntity) => entity.CosGlobalParamGroupChildren ?? [],
					collapsed: false,
				},
				columns: [
					{
						id: 'code',
						model: 'Code',
						type: FieldType.Code,
						label: {
							text: 'Code',
							key: 'cloud.common.entityCode',
						},
						visible: true,
						sortable: false,
						width: 70,
						readonly: true,
					},
					{
						id: 'desc',
						model: 'DescriptionInfo.Translated',
						type: FieldType.Translation,
						label: {
							text: 'Description',
							key: 'cloud.common.entityDescription',
						},
						visible: true,
						sortable: false,
						width: 100,
						readonly: true,
					},
				],
			},
			showDialog: false,
			showGrid: true,
		});
	}
}
