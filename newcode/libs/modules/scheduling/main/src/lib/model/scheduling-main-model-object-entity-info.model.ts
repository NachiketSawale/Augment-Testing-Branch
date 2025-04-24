/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IActivity2ModelObjectEntity, SCHEDULING_MAIN_ACTIVITY_2MODEL_OBJECT_LOOKUP_PROVIDER_TOKEN } from '@libs/scheduling/interfaces';
import { SchedulingMainModelObjectDataService } from '../services/scheduling-main-model-object-data.service';
import { SchedulingMainModelObjectValidationService } from '../services/validations/scheduling-main-model-object-validation.service';
import { MODEL_LOOKUP_PROVIDER_TOKEN } from '@libs/model/interfaces';
import { ILayoutConfiguration } from '@libs/ui/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ESTIMATE_LINE_ITEM_LOOKUP_PROVIDER_TOKEN } from '@libs/basics/interfaces';

export const SCHEDULING_MAIN_MODELOBJECT_ENTITY_INFO: EntityInfo = EntityInfo.create<IActivity2ModelObjectEntity> ({
	grid: {
		title: {key: 'scheduling.main' + '.objectBaseSimulationListTitle'},
	},
	// form: {
	// 	title: { key: 'scheduling.main' + '.observationDetailTitle' },
	// 	containerUuid: 'ee68ae76fefe4b758c282594a1746480',
	// },
	dataService: ctx => ctx.injector.get(SchedulingMainModelObjectDataService),
	validationService: ctx => ctx.injector.get(SchedulingMainModelObjectValidationService),
	dtoSchemeId: {moduleSubModule: 'Scheduling.Main', typeName: 'Activity2ModelObjectDto'},
	permissionUuid: '7BACDAB1A06B439895ACBA767E42205E',
	layoutConfiguration: async ctx => {
		const modelLookupProvider = await ctx.lazyInjector.inject(MODEL_LOOKUP_PROVIDER_TOKEN);
		const objectLookupProvider = await ctx.lazyInjector.inject(SCHEDULING_MAIN_ACTIVITY_2MODEL_OBJECT_LOOKUP_PROVIDER_TOKEN);
		const lineItemLookupProvider = await ctx.lazyInjector.inject(ESTIMATE_LINE_ITEM_LOOKUP_PROVIDER_TOKEN);

		return <ILayoutConfiguration<IActivity2ModelObjectEntity>> {
		groups: [
			{
				gid: 'default-group',
				attributes: ['MdlModelFk', 'ObjectFk', 'PlannedStart', 'PlannedFinish', 'PlannedDuration', 'CurrentStart', 'CurrentFinish',
					          'CurrentDuration', 'ExecutionStarted', 'ExecutionFinished', 'ActualStart', 'ActualFinish', 'ActualDuration',
					          'PlannedQuantity', 'PCo', 'BasUomFk', 'PlannedSequence', 'ActualSequence', 'EstHeaderCode',
					          'EstHeaderDesc', 'EstLineItemFk', 'EstLineItemCode', 'EstLineItemDescription']
			}
		],
		overloads: {
			MdlModelFk: modelLookupProvider.generateModelLookup(),
			ObjectFk: objectLookupProvider.generateSchedulingMainActivity2ModelObjectLookup(),
			BasUomFk: BasicsSharedLookupOverloadProvider.provideUoMReadonlyLookupOverload(),
			EstLineItemFk: lineItemLookupProvider.GenerateEstimateLineItemLookup(),
		},
		labels: {
			...prefixAllTranslationKeys('scheduling.main.', {
				EstHeaderFk: {key: 'entityEstimationHeader'},
				EstLineItemFk: {key: 'entityLineItem'},
				ObjectFk: {key: 'ObjectFk'},
				MdlModelFk: {key: 'ModelFk'},
				Work: {key: 'work'},
				PlannedStart: {key: 'plannedStart'},
				PlannedFinish: {key: 'plannedFinish'},
				PlannedDuration: {key: 'plannedDuration'},
				ActualStart: {key: 'actualStart'},
				ActualFinish: {key: 'actualFinish'},
				ActualDuration: {key: 'actualDuration'},
				CurrentStart: {key: 'currentStart'},
				CurrentFinish: {key: 'currentFinish'},
				CurrentDuration: {key: 'currentDuration'},
				ExecutionStarted: {key: 'executionStarted'},
				ExecutionFinished: {key: 'executionFinished'},
				PerformanceDate: {key: 'entityPerformanceDate'},
				PlannedQuantity: {key: 'PlannedQuantity'},
				RemainingQuantity: {key: 'entityRemainingQuantity'},
				PCo: {key: 'entityPCo'},
				RemainingPCo: {key: 'entityRemainingPCo'},
				PlannedWork: {key: 'PlannedWork'},
				RemainingWork: {key: 'entityRemainingWork'},
				PlannedSequence: {key: 'PlannedSequence'},
				ActualSequence: {key: 'ActualSequence'}
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				BasUomFk: {key: 'entityUoM'},
				Quantity: {key: 'entityQuantity'}
			}),
		}
		};
	}
});