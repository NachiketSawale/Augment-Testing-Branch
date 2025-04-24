/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { TimekeepingTimeSymbols2GroupDataService } from '../services/timekeeping-time-symbols2-group-data.service';

import {ILayoutConfiguration } from '@libs/ui/common';
import { TimekeepingTimeSymbols2GroupValidationService } from '../services/timekeeping-time-symbols2-group-validation.service';
import { ITimeSymbol2GroupEntity, TIMEKEEPING_GROUP_LOOKUP_PROVIDER_TOKEN } from '@libs/timekeeping/interfaces';


export const TIMEKEEPING_TIME_SYMBOLS2_GROUP_ENTITY_INFO: EntityInfo = EntityInfo.create<ITimeSymbol2GroupEntity>({
	grid: {
		title: { key: 'timekeeping.timesymbols' + '.timeSymbol2GroupListTitle'},
	},
	form: {
		title: { key: 'timekeeping.timesymbols' + '.timeSymbol2GroupDetailTitle' },
		containerUuid: '609d6bbd14914574b5e8e173548a2bde',
	},
	dataService: ctx => ctx.injector.get(TimekeepingTimeSymbols2GroupDataService),
	validationService: ctx => ctx.injector.get(TimekeepingTimeSymbols2GroupValidationService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.TimeSymbols', typeName: 'TimeSymbol2GroupDto'},
	permissionUuid: '535fb8d5c72e47d0b34bc50cf3d03798',
	layoutConfiguration : async (ctx:IInitializationContext) => {

		const timekeepingGroupLookupProvider = await ctx.lazyInjector.inject(TIMEKEEPING_GROUP_LOOKUP_PROVIDER_TOKEN);

		return <ILayoutConfiguration<ITimeSymbol2GroupEntity>>{
			groups: [
				{gid: 'default',attributes: ['TimekeepingGroupFk','Comment']},
			],
			overloads: {
				TimekeepingGroupFk: timekeepingGroupLookupProvider.generateTimekeepingGroupLookup(),
			},
			labels: {
				...prefixAllTranslationKeys('timekeeping.timesymbols.',{
					TimekeepingGroupFk :{ key: 'entityTimekeepingGroup'}
				})
			}
		};
	}

});