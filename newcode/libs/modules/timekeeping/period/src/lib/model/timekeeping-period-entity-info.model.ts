/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { TimekeepingPeriodDataService } from '../services/timekeeping-period-data.service';
import { IPeriodEntity } from './entities/period-entity.interface';
import { addUserDefinedDateTranslation, addUserDefinedNumberTranslation, addUserDefinedTextTranslation, prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType } from '@libs/ui/common';
import { BasicsCompanyLookupService, BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { TimeKeepingGroupLookupService } from '@libs/timekeeping/shared';
import { TimekeepingPeriodValidationService } from '../services/timekeeping-period-validation.service';


export const TIMEKEEPING_PERIOD_ENTITY_INFO: EntityInfo = EntityInfo.create<IPeriodEntity>({
	grid: {
		title: {key: 'timekeeping.period.periodListTitle'},
	},
	form: {
		title: {key: 'timekeeping.period.periodDetailTitle'},
		containerUuid: '670b62e97f124e208db778cb7135220a',
	},
	dataService: ctx => ctx.injector.get(TimekeepingPeriodDataService),
	validationService: ctx => ctx.injector.get(TimekeepingPeriodValidationService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.Period', typeName: 'PeriodDto'},
	permissionUuid: '7d9965a4006c4a9fac97f8514baf6b4d',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default', attributes: ['PeriodStatusFk','TimekeepingGroupFk', 'CompanyFk', 'Code', 'DescriptionInfo', 'StartDate', 'EndDate',
					'PayrollYear', 'PayrollPeriod', 'PayrollDate', 'PostingDate', 'Due1Date', 'Due2Date','VoucherNumber','VoucherDate']
			},
			{
				gid: 'userDefTexts',
				attributes: ['UserDefinedText01', 'UserDefinedText02', 'UserDefinedText03', 'UserDefinedText04', 'UserDefinedText05', 'UserDefinedText06', 'UserDefinedText07', 'UserDefinedText08', 'UserDefinedText09', 'UserDefinedText10']
			},
			{
				gid: 'userDefNumbers',
				attributes: ['UserDefinedNumber01', 'UserDefinedNumber02', 'UserDefinedNumber03', 'UserDefinedNumber04', 'UserDefinedNumber05', 'UserDefinedNumber06', 'UserDefinedNumber07', 'UserDefinedNumber08', 'UserDefinedNumber09', 'UserDefinedNumber10']
			},
			{
				gid: 'userDefDates',
				attributes: ['UserDefinedDate01', 'UserDefinedDate02', 'UserDefinedDate03', 'UserDefinedDate04', 'UserDefinedDate05', 'UserDefinedDate06', 'UserDefinedDate07', 'UserDefinedDate08', 'UserDefinedDate09', 'UserDefinedDate10']
			}
		],
		overloads: {
			PeriodStatusFk:BasicsSharedCustomizeLookupOverloadProvider.provideTimekeepingPeriodStatusReadonlyLookupOverload(),
			CompanyFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsCompanyLookupService,
					showDescription: true,
					descriptionMember: 'CompanyName'
				})
			},
			TimekeepingGroupFk:
				{
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: TimeKeepingGroupLookupService
					})
				},
		},
		labels: {
			...prefixAllTranslationKeys('timekeeping.common.', {
				StartDate: {key: 'startDate'},
				EndDate: {key: 'endDate'},
				PayrollYear: {key: 'payrollYear'},
				PayrollPeriod: {key: 'payrollPeriod'},
				PayrollDate: {key: 'payrollDate'},
				PostingDate: {key: 'postingDate'},
				Due1Date: {key: 'due1Date'},
				Due2Date: {key: 'due2Date'},
				TimekeepingGroupFk: {key: 'timekeepingGroup'},

			}),
			...prefixAllTranslationKeys('cloud.common.', {
				Code: {key: 'entityCode'},
				DescriptionInfo: {key: 'entityDescription'},
				VoucherNumber: {key: 'entityVoucherNumber'},
				VoucherDate: {key: 'entityVoucherDate'},
				CompanyFk: {
					text: 'Company',
					key: 'entityCompany'
				},
				PeriodStatusFk:{key:'entityStatus'}
			}),
			...addUserDefinedTextTranslation({ UserDefinedText: {key: 'entityUserDefinedText',params: { 'p_0': 1 }} }, 10, 'UserDefinedText', '', 'userDefTextGroup'),
			...addUserDefinedNumberTranslation({ UserDefinedNumber: {key: 'entityUserDefinedNumber',params: { 'p_0': 1 }} }, 10, 'UserDefinedNumber', '', 'userDefNumberGroup'),
			...addUserDefinedDateTranslation({ UserDefinedDate: {key: 'entityUserDefDate',params: { 'p_0': 1 }} }, 10, 'UserDefinedDate', '', 'userDefDateGroup'),

			...prefixAllTranslationKeys('timekeeping.period.', {
				IsDefault: {key: 'entityIsDefault'},
				IsFallback: {key: 'entityisfallback'},
				VactionExpiryDate: {key: 'entityVactionExpiryDate'},
				VactionYearStart: {key: 'entityVactionYearStart'},
			})
		}
	},
});