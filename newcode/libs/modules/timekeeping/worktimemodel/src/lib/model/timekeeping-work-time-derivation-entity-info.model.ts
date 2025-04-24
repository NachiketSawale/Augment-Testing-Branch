/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { TimekeepingWorkTimeDerivationDataService } from '../services/timekeeping-work-time-derivation-data.service';
import { IWorkTimeDerivationEntity } from './entities/work-time-derivation-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { SchedulingCalendarWeekdayLookup } from '@libs/scheduling/shared';
import { TimekeepingWorkTimeModelDerivationValidationService } from '../services/timekeeping-work-time-model-derivation-validation.service';
import { TIME_SYMBOL_LOOKUP_PROVIDER_TOKEN } from '@libs/timekeeping/interfaces';


export const TIMEKEEPING_WORK_TIME_DERIVATION_ENTITY_INFO: EntityInfo = EntityInfo.create<IWorkTimeDerivationEntity>({
	grid: {
		title: {key: 'timekeeping.worktimemodel.workTimeDerivationListTitle'},
	},
	form: {
		title: {key: 'timekeeping.worktimemodel.workTimeDerivationDetailTitle'},
		containerUuid: 'f9bd8c7b94a74663900f47f8a2a5bb9e',
	},
	dataService: ctx => ctx.injector.get(TimekeepingWorkTimeDerivationDataService),
	validationService: ctx => ctx.injector.get(TimekeepingWorkTimeModelDerivationValidationService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.WorkTimeModel', typeName: 'WorkTimeDerivationDto'},
	permissionUuid: '099dbd22e4334b27af27d080bee3dd65',

	layoutConfiguration: async ctx => {
		const timeSymbolLookupProvider = await ctx.lazyInjector.inject(TIME_SYMBOL_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<IWorkTimeDerivationEntity>>{
			groups: [
				//TODO FromTime, ToTime not show correctly
				//TODO FromQuantity, ToQuantity not editable
				{gid: 'default', attributes: ['TimeSymbolFk', 'WeekDayIndex', 'FromTime', 'ToTime', 'FromQuantity', 'ToQuantity', 'TimeSymbolDerivedFk']},],
			overloads: {
				TimeSymbolFk: timeSymbolLookupProvider.generateTimeSymbolLookup({
					preloadTranslation: 'timekeeping.worktimemodel.entity'
				}),
				WeekDayIndex: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: SchedulingCalendarWeekdayLookup
					}),
					additionalFields: [
						{
							displayMember: 'DescriptionInfo',
							label: {
								key: 'timekeeping.worktimemodel.entityWeekEndsOnDescription',
							},
							column: true,
							singleRow: true
						}
					]
				},
				TimeSymbolDerivedFk: timeSymbolLookupProvider.generateTimeSymbolLookup({
					preloadTranslation: 'timekeeping.worktimemodel.entityDerived'
				})
			},
			labels: {
				...prefixAllTranslationKeys('timekeeping.worktimemodel.', {
					FromQuantity: {key: 'entityFromQuantity'},
					FromTime: {key: 'entityFromTime'},
					ToQuantity: {key: 'entityToQuantity'},
					ToTime: {key: 'entityToTime'},
					TimeSymbolFk: {key: 'entityTimeSymbol'},
					WeekDayIndex: {key: 'entityWeekDayIndex'},
					TimeSymbolDerivedFk: {key: 'entityTimeSymbolDerivedFk'}

				})
			}
		};
	}
});