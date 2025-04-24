/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsProcurementConfigurationPrcTotalTypeDataService } from '../../services/basics-procurement-configuration-prctotaltype-data.service';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { IPrcTotalTypeEntity } from '../entities/prc-total-type-entity.interface';

export const BASICS_PROCUREMENT_CONFIGURATION_PRCTOTALTYPE_ENTITY_INFO = EntityInfo.create<IPrcTotalTypeEntity>({
	grid: {
		title: { text: 'Total Types', key: 'basics.procurementconfiguration.totalTypeGridTitle' },
	},
	form: {
		containerUuid: 'f4f2f0f7da824e5e883bdbea3e3a1bae',
		title: { text: 'Total Type Detail', key: 'basics.procurementconfiguration.totalTypeFormTitle' },
	},
	dataService: (ctx) => ctx.injector.get(BasicsProcurementConfigurationPrcTotalTypeDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.ProcurementConfiguration', typeName: 'PrcTotalTypeDto' },
	permissionUuid: '469e2a7ea19049fda4d5e19424b81cbe',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				title: {
					key: 'cloud.common.entityProperties',
					text: 'Basic Data',
				},
				attributes: ['DescriptionInfo', 'Sorting', 'IsDefault', 'IsBold', 'PrcTotalKindFk', 'IsItalic', 'IsEditableNet', 'IsEditableTax', 'IsEditableGross', 'Code', 'Formula', 'IsAutoCreate', 'SqlStatement', 'IsDashBTotal'],
			},
		],
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				DescriptionInfo: {
					key: 'entityDescription',
					text: 'Description',
				},
				Sorting: {
					key: 'entitySorting',
					text: 'Sorting',
				},
				Code: {
					key: 'entityCode',
					text: 'Code',
				},
			}),

			...prefixAllTranslationKeys('basics.procurementconfiguration.', {
				IsDefault: {
					key: 'entityIsDefault',
					text: 'Is Default',
				},
				IsBold: {
					key: 'entityIsBold',
					text: 'Is Bold',
				},
				PrcTotalKindFk: {
					key: 'entityTotalType',
					text: 'Total Kind',
				},
				IsItalic: {
					key: 'entityIsItalic',
					text: 'Is Italic',
				},
				IsEditableNet: {
					key: 'entityIsEditable',
					text: 'Is Editable (Net)',
				},
				IsEditableTax: {
					key: 'entityIsEditableTax',
					text: 'Is Editable (Tax)',
				},
				IsEditableGross: {
					key: 'entityIsEditableGross',
					text: 'Is Editable (Gross)',
				},
				Formula: {
					key: 'entityFormula',
					text: 'Formula',
				},
				IsAutoCreate: {
					key: 'entityIsAutoCreate',
					text: 'Is Auto Create',
				},
				SqlStatement: {
					key: 'sqlStatement',
					text: 'Sql Statement',
				},
				IsDashBTotal: {
					key: 'entityIsDashBTotal',
					text: 'For Budget In Dashboards',
				},
			}),
		},
		overloads: {
			PrcTotalKindFk: BasicsSharedLookupOverloadProvider.providePrcTotalKindLookupOverload(true),
		},
	},
});
