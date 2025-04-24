/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IHsqCheckListGroupEntity } from '@libs/hsqe/interfaces';

@Injectable({
	providedIn: 'root',
})
export class ChecklistGroupLayoutService {
	public generateLayout(): ILayoutConfiguration<IHsqCheckListGroupEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['IsChecked', 'Code', 'DescriptionInfo', 'IsDefault', 'IsLive'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					IsChecked: {
						key: 'Filter_FilterTitle_TXT',
						text: 'Filter',
					},
					Code: {
						key: 'entityCode',
						text: 'Code',
					},
					IsDefault: {
						key: 'entityIsDefault',
						text: 'Is Default',
					},
					IsLive: {
						key: 'entityIsLive',
						text: 'Is Live',
					},
				}),
			},
			overloads: {},
			transientFields: [
				{
					id: 'IsChecked',
					readonly: false,
					model: 'IsChecked',
					type: FieldType.Radio,
					pinned: true,
				},
			],
		};
	}
}
