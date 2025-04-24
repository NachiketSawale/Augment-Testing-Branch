/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IActivityProgressReportEntity, PROGRESS_REPORT_LINE_ITEM_HEADER_LOOKUP_PROVIDER_TOKEN, SCHEDULING_MAIN_ACTIVITY_2MODEL_OBJECT_LOOKUP_PROVIDER_TOKEN } from '@libs/scheduling/interfaces';
import { SchedulingProgressReportDataService } from '../services/scheduling-progress-report-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { SchedulingMainProgressReportValidationService } from '../services/validations/scheduling-main-progress-report-validation.service';
import { ILayoutConfiguration } from '@libs/ui/common';
import { ESTIMATE_LINE_ITEM_LOOKUP_PROVIDER_TOKEN } from '@libs/basics/interfaces';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';

export const SCHEDULING_PROGRESS_REPORT_ENTITY_INFO: EntityInfo = EntityInfo.create<IActivityProgressReportEntity> ({
	grid: {
		title: {key: 'scheduling.main' + '.progressReport'},
	},
	form: {
		title: { key: 'scheduling.main' + '.detailProgressReportTitle' },
		containerUuid: '27c823ef3d0a4fe3b38d43957b5c86d6',
	},
	dataService: ctx => ctx.injector.get(SchedulingProgressReportDataService),
	validationService: ctx => ctx.injector.get(SchedulingMainProgressReportValidationService),
	dtoSchemeId: {moduleSubModule: 'Scheduling.Main', typeName: 'ActivityProgressReportDto'},
	permissionUuid: '04cbfbacb07c4fba922a9f2b91206657',
	layoutConfiguration: async ctx => {
		const estLineItemLookupProvider = await ctx.lazyInjector.inject(ESTIMATE_LINE_ITEM_LOOKUP_PROVIDER_TOKEN);
		const estLineItemHeaderLookupProvider = await ctx.lazyInjector.inject(PROGRESS_REPORT_LINE_ITEM_HEADER_LOOKUP_PROVIDER_TOKEN);
		const activity2ModelObjectLookupProvider = await ctx.lazyInjector.inject(SCHEDULING_MAIN_ACTIVITY_2MODEL_OBJECT_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<IActivityProgressReportEntity>>{
			groups: [
				{
					gid: 'default-group',
					attributes: ['Description', 'EstLineItemFk', 'EstHeaderFk', 'QuantityTotal', 'BasUomFk', 'PerformanceDate',
						'PlannedQuantity', 'Quantity', 'RemainingQuantity', 'PCo', 'RemainingPCo', 'PlannedWork', 'Work', 'RemainingWork',
						'WorkTotal', 'Activity2ModelObjectFk']
				}
			],
			overloads: {
				EstLineItemFk: estLineItemLookupProvider.GenerateEstimateLineItemLookup(),
				EstHeaderFk: estLineItemHeaderLookupProvider.generateProgressReportLineItemHeaderLookup({
					readonly: true
				}),
				BasUomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				Activity2ModelObjectFk: activity2ModelObjectLookupProvider.generateSchedulingMainActivity2ModelObjectLookup(),
				PlannedQuantity: {readonly: true},
				PlannedWork: {readonly: true}
			},
			labels: {
				...prefixAllTranslationKeys('scheduling.main.', {
					PerformanceDate: {key: 'entityPerformanceDate'},
					PlannedQuantity: {key: 'PlannedQuantity'},
					RemainingQuantity: {key: 'entityRemainingQuantity'},
					ActivityFk: {key: 'entityActivity'},
					ScheduleFk: {key: 'schedule'},
					EstLineItemFk: {key: 'entityLineItem'},
					EstHeaderFk: {key: 'entityEstimationHeader'},
					PCo: {key: 'entityPCo'},
					RemainingPCo: {key: 'entityRemainingPCo'},
					PlannedWork: {key: 'PlannedWork'},
					RemainingWork: {key: 'entityRemainingWork'},
					QuantityTotal: {key: 'entityQuantityTotal'},
					Work: {key: 'work'},
					WorkTotal: {key: 'entityWorkTotal'},
					Activity2ModelObjectFk: {key: 'activity2ModelObjectFk'}
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					BasUomFk: {key: 'entityUoM'},
					Quantity: {key: 'entityQuantity'}
				}),
			}
		};
	}
});