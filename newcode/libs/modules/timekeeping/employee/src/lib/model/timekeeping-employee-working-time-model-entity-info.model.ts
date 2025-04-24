/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { addUserDefinedTextTranslation, prefixAllTranslationKeys } from '@libs/platform/common';
import { IEmployeeWTMEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingEmployeeWorkingTimeModelDataService, TimekeepingEmployeeWorkingTimeModelValidationService } from '../services';
import { ILayoutConfiguration } from '@libs/ui/common';
import { TIME_SYMBOL_LOOKUP_PROVIDER_TOKEN, WORK_TIME_MODEL_LOOKUP_PROVIDER_TOKEN } from '@libs/timekeeping/interfaces';

export const TimekeepingEmployeeWorkingTimeModelEntityInfoModel: EntityInfo = EntityInfo.create<IEmployeeWTMEntity> ({
	grid: {
		title: {key: 'timekeeping.employee.employeeWorkingTimeModelListTitle'},
	},
	form: {
		title: { key: 'timekeeping.employee.employeeWorkingTimeModelDetailTitle' },
		containerUuid: '0eb6d19bf95546af8792202826993c7b',
	},
	dataService: ctx => ctx.injector.get(TimekeepingEmployeeWorkingTimeModelDataService),
	validationService: ctx => ctx.injector.get(TimekeepingEmployeeWorkingTimeModelValidationService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.Employee', typeName: 'EmployeeWTMDto'},
	permissionUuid: '67b5049e07304887abe0d7b29fcf20e3',

	layoutConfiguration: async ctx => {
		const timeSymbolLookupProvider = await ctx.lazyInjector.inject(TIME_SYMBOL_LOOKUP_PROVIDER_TOKEN);
		const workingTimeModelLookupProvider = await ctx.lazyInjector.inject(WORK_TIME_MODEL_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<IEmployeeWTMEntity>>{
			groups: [
				{
					gid: 'default-group',
					attributes: ['EmployeeWorkingTimeModelFk', 'ValidFrom', 'ValidTo', 'HasOptedPayout', 'TimesymbolFk', 'CommentText', 'EmployeeFallbackWTM', 'IsFallbackWtmActive']
				},
				{
					gid: 'userDefTexts',
					attributes: ['UserDefinedText01', 'UserDefinedText02', 'UserDefinedText03']
				}
			],
			labels: {
				...prefixAllTranslationKeys('timekeeping.employee.', {
					EmployeeWorkingTimeModelFk: {key: 'EntityEmployeeWorkingtimeModelFk'},
					ValidFrom: {key: 'EntityValidFrom'},
					ValidTo: {key: 'EntityValidTo'},
					HasOptedPayout: {key: 'EntityHasOptedPayout'},
					TimesymbolFk: {key: 'entityTimesymbolFk'},
					EmployeeFallbackWTM: {key: 'employeefallbackwtm'},
					IsFallbackWtmActive: {key: 'IsfallbackActive'}

				}),
				...prefixAllTranslationKeys('cloud.common.', {
					CommentText: {key: 'entityCommentText'},
				}),
				...addUserDefinedTextTranslation({ UserDefinedText: {key: 'entityUserDefinedText',params: { 'p_0': 1 }} }, 3, 'UserDefinedText', '', 'userDefTextGroup'),
			},
			overloads: {
				EmployeeWorkingTimeModelFk: workingTimeModelLookupProvider.generateWorkTimeModelLookup(),
				TimesymbolFk: timeSymbolLookupProvider.generateTimeSymbolLookup({
					preloadTranslation: 'timekeeping.worktimemodel.entity',
					readonly: true
				}),
				EmployeeFallbackWTM: workingTimeModelLookupProvider.generateWorkTimeModelLookup({
					IsFallback: true
				}),
				IsFallbackWtmActive: {readonly: true}
			}
		};
	}
});