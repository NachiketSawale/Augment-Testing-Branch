/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { TimekeepingWorkTimeModelDtlDataService } from '../services/timekeeping-work-time-model-dtl-data.service';
import { IWorkTimeModelDtlEntity } from './entities/work-time-model-dtl-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { TimekeepingWorkTimeModelDtlValidationService } from '../services/timekeeping-work-time-model-dtl-validation.service';
import { TIME_SYMBOL_LOOKUP_PROVIDER_TOKEN } from '@libs/timekeeping/interfaces';


export const TIMEKEEPING_WORK_TIME_MODEL_DTL_ENTITY_INFO: EntityInfo = EntityInfo.create<IWorkTimeModelDtlEntity>({
	grid: {
		title: {key: 'timekeeping.worktimemodel.workTimeModelDtlListTitle'},
	},
	form: {
		title: {key: 'timekeeping.worktimemodel.workTimeModelDtlDetailTitle'},
		containerUuid: '7a1e913380024d598a65902a6e24fc27',
	},
	dataService: ctx => ctx.injector.get(TimekeepingWorkTimeModelDtlDataService),
	validationService:  ctx => ctx.injector.get(TimekeepingWorkTimeModelDtlValidationService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.WorkTimeModel', typeName: 'WorkTimeModelDtlDto'},
	permissionUuid: 'b49b64d4b0204eb190350168633ef306',
	layoutConfiguration: async ctx => {
		const timeSymbolLookupProvider = await ctx.lazyInjector.inject(TIME_SYMBOL_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<IWorkTimeModelDtlEntity>> {
			groups: [
				{
					gid: 'default',
					attributes: ['ValidFrom', 'TimeSymbolLevelTimesFk']
				},
				{
					gid: 'limits',
					//TODO
					attributes: ['WeeklyLimit', 'MonthlyLimit']
				},
				{
					gid: 'timeSymbolLimits',
					attributes: ['TimeSymbolBdl1Fk', 'TimeSymbolBdl2Fk', 'TimeSymbolRecapBlFk', 'TimeSymbolRecapUlFk']
				},
				{
					gid: 'savingLimits',
					attributes: ['LowerDailySavingLimit', 'UpperDailySavingLimit', 'WeeklySavingLimit',
						'MonthlySavingLimit', 'YearlySavingLimit', 'AccountMinLimit', 'AccountMaxLimit']
				},
				{
					gid: 'timeSymbolSavingLimits',
					attributes: ['TimeSymbolBlsl1Fk', 'TimeSymbolBlsl2Fk', 'TimeSymbolBusl1Fk',
						'TimeSymbolBusl2Fk', 'TimeSymbolAsl1Fk', 'TimeSymbolAsl2Fk', 'TimeSymbolOml1Fk', 'TimeSymbolOml2Fk']
				}
			],
			overloads: {
				TimeSymbolLevelTimesFk: timeSymbolLookupProvider.generateTimeSymbolLookup({
					preloadTranslation: 'timekeeping.worktimemodel.entityTimeSymbolLevelTimesFk'
				}),
				TimeSymbolBdl1Fk: timeSymbolLookupProvider.generateTimeSymbolLookup({
					preloadTranslation: 'timekeeping.worktimemodel.entityTimeSymbolBDL1Fk'
				}),
				TimeSymbolBdl2Fk: timeSymbolLookupProvider.generateTimeSymbolLookup({
					preloadTranslation: 'timekeeping.worktimemodel.entityTimeSymbolBDL2Fk'
				}),
				TimeSymbolRecapBlFk: timeSymbolLookupProvider.generateTimeSymbolLookup({
					preloadTranslation: 'timekeeping.worktimemodel.entityTimeSymbolRecapBlFk'
				}),
				TimeSymbolRecapUlFk: timeSymbolLookupProvider.generateTimeSymbolLookup({
					preloadTranslation: 'timekeeping.worktimemodel.entityTimeSymbolRecapUlFk'
				}),
				TimeSymbolBlsl1Fk: timeSymbolLookupProvider.generateTimeSymbolLookup({
					preloadTranslation: 'timekeeping.worktimemodel.entityTimeSymbolBlsl1Fk'
				}),
				TimeSymbolBlsl2Fk: timeSymbolLookupProvider.generateTimeSymbolLookup({
					preloadTranslation: 'timekeeping.worktimemodel.entityTimeSymbolBlsl2Fk'
				}),
				TimeSymbolBusl1Fk: timeSymbolLookupProvider.generateTimeSymbolLookup({
					preloadTranslation: 'timekeeping.worktimemodel.entityTimeSymbolBusl1Fk'
				}),
				TimeSymbolBusl2Fk: timeSymbolLookupProvider.generateTimeSymbolLookup({
					preloadTranslation: 'timekeeping.worktimemodel.entityTimeSymbolBusl2Fk'
				}),
				TimeSymbolAsl1Fk: timeSymbolLookupProvider.generateTimeSymbolLookup({
					preloadTranslation: 'timekeeping.worktimemodel.entityTimeSymbolAsl1Fk'
				}),
				TimeSymbolAsl2Fk: timeSymbolLookupProvider.generateTimeSymbolLookup({
					preloadTranslation: 'timekeeping.worktimemodel.entityTimeSymbolAsl2Fk'
				}),
				TimeSymbolOml1Fk: timeSymbolLookupProvider.generateTimeSymbolLookup({
					preloadTranslation: 'timekeeping.worktimemodel.entityTimeSymbolOml1Fk'
				}),
				TimeSymbolOml2Fk: timeSymbolLookupProvider.generateTimeSymbolLookup({
					preloadTranslation: 'timekeeping.worktimemodel.entityTimeSymbolOml2Fk'
				})
			},
			labels: {
				...prefixAllTranslationKeys('timekeeping.worktimemodel.', {
					AccountMinLimit: {key: 'entityAccountMinLimit'},
					AccountMaxLimit: {key: 'entityAccountMaxLimit'},
					DailyLimit: {key: 'entityDailyLimit'},
					DailySavingLimit: {key: 'entityDailySavingLimit'},
					LowerDailySavingLimit: {key: 'entityLowerDailySavingLimit'},
					MonthlyLimit: {key: 'entityMonthlyLimit'},
					MonthlySavingLimit: {key: 'entityMonthlySavingLimit'},
					UpperDailySavingLimit: {key: 'entityUpperDailySavingLimit'},
					ValidFrom: {key: 'entityValidFrom'},
					WeeklyLimit: {key: 'entityWeeklyLimit'},
					WeeklySavingLimit: {key: 'entityWeeklySavingLimit'},
					YearlySavingLimit: {key: 'entityYearlySavingLimit'},
					TimeSymbolLevelTimesFk: {key: 'entityTimeSymbolLevelTimesFk'},
					TimeSymbolBdl1Fk: {key: 'entityTimeSymbolBDL1Fk'},
					TimeSymbolBdl2Fk: {key: 'entityTimeSymbolBDL2Fk'},
					TimeSymbolRecapBlFk: {key: 'entityTimeSymbolRecapBlFk'},
					TimeSymbolRecapUlFk: {key: 'entityTimeSymbolRecapUlFk'},
					TimeSymbolBlsl1Fk: {key: 'entityTimeSymbolBlsl1Fk'},
					TimeSymbolBlsl2Fk: {key: 'entityTimeSymbolBlsl2Fk'},
					TimeSymbolBusl1Fk: {key: 'entityTimeSymbolBusl1Fk'},
					TimeSymbolBusl2Fk: {key: 'entityTimeSymbolBusl2Fk'},
					TimeSymbolAsl1Fk: {key: 'entityTimeSymbolAsl1Fk'},
					TimeSymbolAsl2Fk: {key: 'entityTimeSymbolAsl2Fk'},
					TimeSymbolOml1Fk: {key: 'entityTimeSymbolOml1Fk'},
					TimeSymbolOml2Fk: {key: 'entityTimeSymbolOml2Fk'},
				})
			}
		};
	}
});