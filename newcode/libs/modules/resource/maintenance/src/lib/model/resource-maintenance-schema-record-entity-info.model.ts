/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ResourceMaintenanceSchemaRecordDataService } from '../services/data/resource-maintenance-schema-record-data.service';
import { ResourceMaintenanceSchemaRecordValidationService } from '../services/validation/resource-maintenance-schema-record-validation.service';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { LOGISTIC_CARD_TEMPLATE_LOOKUP_PROVIDER_TOKEN } from '@libs/logistic/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IResourceMaintenanceSchemaRecordEntity } from '@libs/resource/interfaces';
import { EntityInfo } from '@libs/ui/business-base';
import { ILayoutConfiguration } from '@libs/ui/common';

export const RESOURCE_MAINTENANCE_SCHEMA_RECORD_ENTITY_INFO = EntityInfo.create({
	grid: {
		title: {
			text: 'MaintenanceSchemaRecord',
			key: 'resource.maintenance.schemaRecordListTitle'
		}
	},
	form: {
		title: {
			text: 'MaintenanceSchemaRecord',
			key: 'resource.maintenance.schemaRecordDetailTitle'
		},
		containerUuid: '03987f82b6b141f8b4481c4f52697c83'
	},
	dataService: (ctx) => ctx.injector.get(ResourceMaintenanceSchemaRecordDataService),
	validationService: (ctx) => ctx.injector.get(ResourceMaintenanceSchemaRecordValidationService),
	dtoSchemeId: {
		moduleSubModule: 'Resource.Maintenance',
		typeName: 'MaintenanceSchemaRecordDto'
	},
	permissionUuid: '1dad2033d1b24f4bac55849d549b9c52',
	layoutConfiguration: async (ctx) => {
		const logisticCardTemplateLookupProvider = await ctx.lazyInjector.inject(LOGISTIC_CARD_TEMPLATE_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<IResourceMaintenanceSchemaRecordEntity>>{
			groups: [
				{
					gid: 'baseGroup',
					attributes: [
						'MaintenanceSchemaFk',
						'Code',
						'DescriptionInfo',
						'IsFixedDays',
						'DaysAfter',
						'IsPerformanceBased',
						'UomFk',
						'Quantity',
						'Duration',
						'JobCardTemplateFk',
						'Remark',
						'Comment',
						'IsRecalcDates',
					]
				},
			],
			overloads: {
				UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				JobCardTemplateFk: logisticCardTemplateLookupProvider.provideJobCardTemplateLookupOverload()
			},
			labels: {
				...prefixAllTranslationKeys('resource.maintenance.', {
					MaintenanceSchemaFk: { key: 'entityMaintenanceSchema' },
					Code: { key: 'entityCode' },
					IsFixedDays: { key: 'fixedDays' },
					DaysAfter: { key: 'daysAfter' },
					IsPerformanceBased: { key: 'performanceBased' },
					Quantity: { key: 'leadQuantity' },
					Duration: { key: 'duration' },
					JobCardTemplateFk: { key: 'jobCardTemplate' },
					Remark: { key: 'entityRemark' },
					Comment: { key: 'entityComment' },
					IsRecalcDates: { key: 'entityIsRecalcDates' }
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					UomFk: { key: 'entityUoM' },
					DescriptionInfo: {key: 'entityDescription'}
				}),
			 }
		};
	}
});