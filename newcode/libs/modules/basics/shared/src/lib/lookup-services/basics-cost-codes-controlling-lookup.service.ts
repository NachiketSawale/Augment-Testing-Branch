/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, IGridConfiguration, UiCommonLookupTypeLegacyDataService, createLookup } from '@libs/ui/common';
import { IBasicsUomEntity, IControllingCostCodes } from '@libs/basics/interfaces';
import { BasicsSharedUomLookupService } from './basics-uom-lookup.service';

/**
 * Basics Cost Codes Controlling Lookup
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsCostCodesControllingLookup<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<IControllingCostCodes, TEntity> {
	public configuration!: IGridConfiguration<IControllingCostCodes>;
	public constructor() {
		super('ControllingCostCode', {
			uuid: '050d808504d34d7c8bfdfa897637ee8a',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Id', key: 'cloud.common.entityCode' },
						sortable: true,
						visible: true
					},

					{
						id: 'Description',
						model: 'DescriptionInfo.Translated',
						type: FieldType.Translation,
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						sortable: true,
						visible: true
					},
					{
						id: 'UomFk',
						model: 'UomFk',
						type: FieldType.Lookup,
						label: { text: 'Uom', key: 'basics.costcodes.uoM' },
						lookupOptions: createLookup<IControllingCostCodes, IBasicsUomEntity>({
							dataServiceToken: BasicsSharedUomLookupService,
							showClearButton: true,
						}),
						sortable: true,
						visible: true,
						readonly: true
					},

					{
						id: 'Comments',
						model: 'CommentText',
						type: FieldType.Comment,
						label: { text: 'Uom', key: 'cloud.common.entityComment' },
						sortable: true,
						visible: true
					},
				],

				treeConfiguration: {
					parent: (entity) => {
						if (entity.ContrCostCodeParentFk) {
							return this.configuration.items?.find((item) => item.Id === entity.ContrCostCodeParentFk) || null;
						}
						return null;
					},

					children: (entity) => entity.ContrCostCodeChildrens ?? [],
					collapsed: true
				}
			},
			dialogOptions: {
				headerText: {
					text: '  Controlling Cost Codes'
				}
			},
			showDialog: true
		});
	}
}
