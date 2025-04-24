/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { TimekeepingTimeSymbol2WorkTimeModelDataService } from '../services/timekeeping-time-symbol2-work-time-model-data.service';
import { ITimeSymbol2WorkTimeModelEntity } from './entities/time-symbol-2work-time-model-entity.interface';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { TIME_SYMBOL_LOOKUP_PROVIDER_TOKEN, WORK_TIME_MODEL_LOOKUP_PROVIDER_TOKEN } from '@libs/timekeeping/interfaces';
import { TimekeepingTimeSymbol2WorkTimeModelValidationService } from '../services/timekeeping-time-symbol2-work-time-model-validation.service';


export const TIMEKEEPING_TIME_SYMBOL2_WORK_TIME_MODEL_ENTITY_INFO: EntityInfo = EntityInfo.create<ITimeSymbol2WorkTimeModelEntity>({
	grid: {
		title: {key: 'timekeeping.worktimemodel.timeSymbol2WorkTimeModelListTitle'},
	},
	form: {
		title: {key: 'timekeeping.worktimemodel.timeSymbol2WorkTimeModelDetailTitle'},
		containerUuid: '79369d99b969492b830da0e62aea78bd',
	},
	dataService: ctx => ctx.injector.get(TimekeepingTimeSymbol2WorkTimeModelDataService),
	validationService: ctx => ctx.injector.get(TimekeepingTimeSymbol2WorkTimeModelValidationService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.WorkTimeModel', typeName: 'TimeSymbol2WorkTimeModelDto'},
	permissionUuid: 'b3aa28b1d5db4b4b884679a95c3a32b8',
	layoutConfiguration: async ctx=> {
		const timekeepingWorkTimeModelLookupProvider = await ctx.lazyInjector.inject(WORK_TIME_MODEL_LOOKUP_PROVIDER_TOKEN);
		const timeSymbolLookupProvider = await ctx.lazyInjector.inject(TIME_SYMBOL_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<ITimeSymbol2WorkTimeModelEntity>>{
			groups: [
				{gid: 'default', attributes: ['TimeSymbolFk', 'WorkingTimeModelFk', 'EvaluatePositiveHour', 'CommentText']}],
			overloads: {
				TimeSymbolFk: timeSymbolLookupProvider.generateTimeSymbolLookup({
					preloadTranslation: 'timekeeping.worktimemodel.entity'
				}),
				WorkingTimeModelFk: timekeepingWorkTimeModelLookupProvider.generateWorkTimeModelLookup({
					IsFallback: false
				})
			},
			labels: {
				...prefixAllTranslationKeys('timekeeping.worktimemodel.', {
					CommentText: {key: 'entityCommentText'},
					EvaluatePositiveHour: {key: 'evaluatePositiveHour'},
					TimeSymbolFk: {key: 'entityTimeSymbol'},
					WorkingTimeModelFk: {key: 'workingTimeModelFk'}

				})
			}
		};
	},
});