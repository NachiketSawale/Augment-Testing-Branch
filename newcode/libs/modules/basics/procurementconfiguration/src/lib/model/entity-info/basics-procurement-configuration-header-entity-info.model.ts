/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsProcurementConfigurationHeaderDataService } from '../../services/basics-procurement-configuration-header-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { IPrcConfigHeaderEntity } from '../entities/prc-config-header-entity.interface';

export const BASICS_PROCUREMENT_CONFIGURATION_HEADER_ENTITY_INFO = EntityInfo.create<IPrcConfigHeaderEntity>({
	grid: {
		title: { text: 'Configuration Header', key: 'basics.procurementconfiguration.headerGridTitle' },
	},
	form: {
		containerUuid: 'fcd50b078ff54a9287562dad42bb7814',
		title: { text: 'Configuration Header Detail', key: 'basics.procurementconfiguration.headerFormTitle' },
	},
	dataService: (ctx) => ctx.injector.get(BasicsProcurementConfigurationHeaderDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.ProcurementConfiguration', typeName: 'PrcConfigHeaderDto' },
	permissionUuid: 'df77f013b424438aa053518cbacafb01',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				title: {
					key: 'cloud.common.entityProperties',
					text: 'Basic Data',
				},
				attributes: [
					'DescriptionInfo',
					'Sorting',
					'IsDefault',
					'AutoCreateBoq',
					'IsFreeItemsAllowed',
					'IsConsolidateChange',
					'IsChangeFromMainContract',
					'IsConsolidatedTransaction',
					'TransactionItemInc',
					'PrcConfigHeaderTypeFk',
					'BasConfigurationTypeFk',
					'IsInheritUserDefined',
				],
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
			}),
			...prefixAllTranslationKeys('basics.procurementconfiguration.', {
				IsDefault: {
					key: 'entityIsDefault',
					text: 'Is Default',
				},
				AutoCreateBoq: {
					key: 'entityAutoCreateBoQ',
					text: 'Auto Create BoQ',
				},
				IsFreeItemsAllowed: {
					key: 'entityIsFreeItemsAllowed',
					text: 'Is Free Items Allowed',
				},
				IsConsolidateChange: {
					key: 'entityIsConsolidateChange',
					text: 'Is Consolidate Change',
				},
				IsChangeFromMainContract: {
					key: 'entityIsChangeFromMainContract',
					text: 'Changes from Main Contract',
				},
				IsConsolidatedTransaction: {
					key: 'entityIsConsolidatedTransaction',
					text: 'Is Consolidated Transaction',
				},
				TransactionItemInc: {
					key: 'entityTransactionItemInc',
					text: 'Transaction Item Inc',
				},
				PrcConfigHeaderTypeFk: {
					key: 'entityPrcConfigHeaderTypeFk',
					text: 'Procurement Config Header Type',
				},
				BasConfigurationTypeFk: {
					key: 'entityBasConfigurationTypeFk',
					text: 'Configuration Type',
				},
				IsInheritUserDefined: {
					key: 'entityIsInheritUserDefined',
					text: 'Inherit Header User Defined Fields',
				},
			}),
		},
		overloads: {
			PrcConfigHeaderTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideProcurementConfigurationHeaderTypeLookupOverload(true),
			BasConfigurationTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideConfigurationTypeLookupOverload(false),
		},
	},
});
