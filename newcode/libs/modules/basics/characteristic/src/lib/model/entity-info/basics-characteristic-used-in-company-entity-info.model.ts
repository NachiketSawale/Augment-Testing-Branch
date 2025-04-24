/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsCharacteristicUsedInCompanyBehavior } from '../../behaviors/basics-characteristic-used-in-company-behavior.service';
import { BasicsCharacteristicUsedInCompanyDataService } from '../../services/basics-characteristic-used-in-company-data.service';
import { FieldType } from '@libs/ui/common';
import { ICompanyEntity } from '../entities/company-entity.interface';

export const BASICS_CHARACTERISTIC_USED_IN_COMPANY_ENTITY_INFO = EntityInfo.create<ICompanyEntity>({
	grid: {
		title: { text: 'Used In Company', key: 'basics.characteristic.title.usedInCompany' },
		behavior: ctx => ctx.injector.get(BasicsCharacteristicUsedInCompanyBehavior),
		treeConfiguration: true
	},
	dataService: ctx => ctx.injector.get(BasicsCharacteristicUsedInCompanyDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.Characteristic', typeName: 'CompanyDto' },
	permissionUuid: '4307455a185a4d1d84da91ecec793ebb',
	layoutConfiguration: {
		suppressHistoryGroup: true,
		groups: [
			{
				gid: 'basicData',
				title: {
					key: 'cloud.common.entityProperties',
					text: 'Basic Data'
				},
				attributes: [
					'Checked',
					'Id',
					'Code',
					'CompanyName',
				]
			}
		],
		'labels': {
			...prefixAllTranslationKeys('basics.characteristic.', {
				'Code': {
					'key': 'entityCode',
					'text': 'Code'
				}
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				'Checked': {
					'key': 'entityChecked',
					'text': 'Checked'
				},
				'Id': {
					'key': 'entityId',
					'text': 'Id'
				},
				'CompanyName': {
					'key': 'entityCompany',
					'text': 'Company'
				},
			})
		},
		'overloads': {
			'Id': {
				'readonly': true
			},
			'Code': {
				'readonly': true
			},
			'CompanyName': {
				'readonly': true
			}
		},
		transientFields: [{
			id: 'Checked',
			model: 'Checked',
			type: FieldType.Boolean,
			readonly: false,
			pinned: true
		}],
	}
});