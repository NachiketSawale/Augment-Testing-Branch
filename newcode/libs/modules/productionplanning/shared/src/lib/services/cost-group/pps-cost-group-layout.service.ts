/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { /*FieldType,*/ ILayoutConfiguration } from '@libs/ui/common';
import { IPpsCostGroupEntity } from '../../model/cost-group/pps-cost-group.interface';

/**
 * Shared PPS cost group layout service
 */
@Injectable({
	providedIn: 'root'
})
export class PpsCostGroupLayoutService {
	public generateLayout(): ILayoutConfiguration<IPpsCostGroupEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						'key': 'cloud.common.entityProperties',
						'text': 'Basic Data'
					},
					attributes: [
						'Code',
						'DescriptionInfo',
						'CostGroupFk',
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					baseGroup: { key: 'entityProperties', text: '*Basic Data' },
					DescriptionInfo: { text: '*Description', key: 'entityDescription' },
					Code: { text: '*Code', key: 'entityCode' },
				}),
				...prefixAllTranslationKeys('productionplanning.common.', {
					CostGroupFk: { key: 'costgroup', text: '*Cost Group' },
				}),
			},
			overloads: {
				Code: {
					readonly: true
				},
				DescriptionInfo: {
					readonly: true
				},

				/*
				CostGroupFk:{
					// type: FieldType.Lookup,
					// lookupOptions: // todo... wait for cost group lookup providing from basics costgroups module
					additionalFields: [
						{
							displayMember: 'Description',
							label: {
								// key: '?',
								text: 'Cost Group-Description'
							},
							column: true,
							singleRow: true,
						},
					],
				}
				*/

			}
		};
	}

}