import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { IControllingUnitEntity } from '@libs/controlling/structure';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainControllingUnitsLayoutService {
	public static generateConfig(): ILayoutConfiguration<IControllingUnitEntity> {
		return {
			groups: [
				{
					gid: 'baseGroup',
					title: {
						text: 'Controlling Units',
						key: 'estimate.main.boqContainer',
					},
					attributes: ['Code', 'DescriptionInfo'], // todo : 'Param'

				},
			],
			labels: {
				...prefixAllTranslationKeys('estimate.main.', {
					Description: { key: 'DescriptionInfo' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Code: { key: 'entityCode' },
				}),
			},
			transientFields: [
				{
					id: 'Parameters',
					model: 'Parameters',
					type: FieldType.Composite,
					label: { key: 'constructioinsystem.main.createCosInstanceDefaultInputDialog.parameters'}
				},
				{
					id: 'filter',
					model: 'Filter',
					type: FieldType.Radio,
				}
			]
		};
	}
}