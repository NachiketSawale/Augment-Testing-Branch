/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IVacationAccountEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingEmployeeVacationAccountDataService } from '../services';
import { ILayoutConfiguration } from '@libs/ui/common';
import { TIME_SYMBOL_LOOKUP_PROVIDER_TOKEN } from '@libs/timekeeping/interfaces';


export const TimekeepingEmployeeVacationAccountEntityInfo: EntityInfo = EntityInfo.create<IVacationAccountEntity> ({
	grid: {
		title: {key: 'timekeeping.employee.vacationAccount'},
	},
	form: {
		title: { key: 'timekeeping.employee.vacationAccountDetailTitle' },
		containerUuid: '1829a2061c0f45a790536a4741ec897c',
	},
	dataService: ctx => ctx.injector.get(TimekeepingEmployeeVacationAccountDataService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.Employee', typeName: 'VacationAccountDto'},
	permissionUuid: 'k9903131mo4a48l1a6524c4927252f47',

	layoutConfiguration: async ctx => {
		const timeSymbolLookupProvider = await ctx.lazyInjector.inject(TIME_SYMBOL_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<IVacationAccountEntity>>{
			groups: [
				{
					gid: 'default-group',
					attributes: ['BookingDate', 'TimesymbolFk', 'Duration', 'Comment', 'IsYearlyStartScheduleEntry', 'IsYearlyExpireScheduleEntry']
				}
			],
			labels: {
				...prefixAllTranslationKeys('timekeeping.employee.', {
					TimesymbolFk: {key: 'entityTimeSymbol'},
					BookingDate: {key: 'BookingDate'},
					Duration: {key: 'entityDuration'},
					IsYearlyStartScheduleEntry: {key: 'entityIsYearlyStartScheduleEntry'},
					IsYearlyExpireScheduleEntry: {key: 'entityIsYearlyEndScheduleEntry'}
				})
			},
			overloads: {
				TimesymbolFk: timeSymbolLookupProvider.generateTimeSymbolLookup({
					preloadTranslation: 'timekeeping.worktimemodel.entity',
					readonly: true
				}),
				BookingDate: {readonly: true},
				Duration: {readonly: true},
				IsYearlyStartScheduleEntry: {readonly: true},
				IsYearlyExpireScheduleEntry: {readonly: true},
				Comment: {readonly: true}
			}
		};
	}
});