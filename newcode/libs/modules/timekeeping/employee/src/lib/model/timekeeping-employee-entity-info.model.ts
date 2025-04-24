/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { TimekeepingEmployeeDataService, TimekeepingEmployeeValidationService } from '../services';
import { addUserDefinedDateTranslation, addUserDefinedNumberTranslation, addUserDefinedTextTranslation, prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { TimekeepingEmployeePaymentGroupLookupService, TimeKeepingGroupLookupService, TimekeepingShiftLookupService } from '@libs/timekeeping/shared';
import {
	BasicsCompanyLookupService, BasicsSharedAddressDialogComponent,
	BasicsSharedCustomizeLookupOverloadProvider,
	BasicsSharedLookupOverloadProvider,
	BasicsSharedPlainTextContainerComponent,
	BasicsSharedTimekeepingEmployeeGroupLookupService, createFormDialogLookupProvider, IPlainTextAccessor,
	PLAIN_TEXT_ACCESSOR
} from '@libs/basics/shared';
import { CALENDAR_LOOKUP_PROVIDER_TOKEN } from '@libs/scheduling/interfaces';
import { IEmployeeEntity } from '@libs/timekeeping/interfaces';
import { CREW_LEADER_LOOKUP_PROVIDER_TOKEN, WORK_TIME_MODEL_LOOKUP_PROVIDER_TOKEN } from '@libs/timekeeping/interfaces';


export const TimekeepingEmployeeEntityInfoModel: EntityInfo = EntityInfo.create<IEmployeeEntity> ({
	grid: {
		title: {key: 'timekeeping.employee.employeeListTitle'},
	},
	form: {
		title: { key: 'timekeeping.employee.employeeDetailTitle' },
		containerUuid: '6fa7a4435630483b8ffe16d6dbd3d17c',
	},
	dataService: ctx => ctx.injector.get(TimekeepingEmployeeDataService),
	validationService: ctx => ctx.injector.get(TimekeepingEmployeeValidationService),
	dtoSchemeId: {moduleSubModule: 'Timekeeping.Employee', typeName: 'EmployeeDto'},
	permissionUuid: '3b47dae9be994a8c8aab95ca3aba7725',

	layoutConfiguration: async ctx => {
		const calendarLookup = await ctx.lazyInjector.inject(CALENDAR_LOOKUP_PROVIDER_TOKEN);
		const crewLeaderLookupProvider = await ctx.lazyInjector.inject(CREW_LEADER_LOOKUP_PROVIDER_TOKEN);
		const workingTimeModelLookupProvider = await ctx.lazyInjector.inject(WORK_TIME_MODEL_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<IEmployeeEntity>>{
			groups: [{
				gid: 'default', attributes: ['Code', 'CompanyOperatingFk', 'DescriptionInfo',
					'FirstName', 'FamilyName', 'Initials', 'AddressFk', 'CountryFk',
					'TelephoneNumberTelFk', 'TelephoneNumberMobFk', 'Email', 'BirthDate', /*'UserFk',*/ 'WorkingTimeModelFk',
					'WorkingTimeAccountBalance', 'IsPayroll', 'VacationBalance', 'YearlyVacation', 'TrafficLightFk', 'GenerateRecording']
			},
				{
					gid: 'configuration',
					attributes: ['StartDate', 'TerminalDate', 'IsCrewLeader', 'IsWhiteCollar', 'IsHiredLabor', 'IsTimekeeper', 'Remark',
						'ShiftFk', 'EmployeeGroupFk', 'TimekeepingGroupFk', 'ProfessionalCategoryFk', 'PaymentGroupFk', 'ClerkFk', 'CalendarFk',
						'GroupFk', 'CostGroupFk', 'EmployeeAreaFk', 'EmployeeSubAreaFk', 'EmployeeStatusFk', 'CrewLeaderFk']

				},
				{
					gid: 'userDefTexts',
					attributes: ['UserDefinedText01', 'UserDefinedText02', 'UserDefinedText03', 'UserDefinedText04', 'UserDefinedText05']
				}, {
					gid: 'userDefNumbers',
					attributes: ['UserDefinedNumber01', 'UserDefinedNumber02', 'UserDefinedNumber03', 'UserDefinedNumber04', 'UserDefinedNumber05']
				}, {
					gid: 'userDefDates',
					attributes: ['UserDefinedDate01', 'UserDefinedDate02', 'UserDefinedDate03', 'UserDefinedDate04', 'UserDefinedDate05']
				}
				],
			overloads: {

				CrewLeaderFk: crewLeaderLookupProvider.generateCrewLeaderLookup({
					preloadTranslation: 'timekeeping.employee.entityCurrent'
				}),
				PaymentGroupFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: TimekeepingEmployeePaymentGroupLookupService,
					})
				},
				CountryFk: BasicsSharedLookupOverloadProvider.provideCountryLookupOverload(true),
				//TODO additional field for Country description
				AddressFk: {
					type: FieldType.CustomComponent,
					componentType: BasicsSharedAddressDialogComponent,
					providers: createFormDialogLookupProvider({
						objectKey: 'AddressEntity',
						displayMember: 'Address',
						showClearButton: true,
						showPopupButton: false
					})
				},
				//TODO additional field for Clerk description
				ClerkFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
				CompanyOperatingFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsCompanyLookupService
					})
				},
				TelephoneNumberTelFk: BasicsSharedLookupOverloadProvider.providerTelephoneDialogComponentOverload(true),
				TelephoneNumberMobFk: BasicsSharedLookupOverloadProvider.providerTelephoneDialogComponentOverload(true),
				//TODO UserFk

				WorkingTimeModelFk: workingTimeModelLookupProvider.generateWorkTimeModelLookup(),
				TrafficLightFk: BasicsSharedCustomizeLookupOverloadProvider.provideTimeSymbolTrafficlightLookupOverload(true),
				ShiftFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: TimekeepingShiftLookupService
					}),
					//TODO additional field
				},
				EmployeeGroupFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedTimekeepingEmployeeGroupLookupService
					})
				},
				TimekeepingGroupFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: TimeKeepingGroupLookupService
					}),
					additionalFields:[
						{
							displayMember: 'DescriptionInfo',
							label: {
								key: 'timekeeping.employee.entityTimekeepingGroupDescription',
							},
							column: true,
							singleRow: true

						}
					]
				},
				ProfessionalCategoryFk: BasicsSharedCustomizeLookupOverloadProvider.provideTimeKeepingProfessionalCategoryReadonlyLookupOverload(),
				//TODO additional field Calendar Description
				CalendarFk: calendarLookup.generateCalendarLookup(),
				GroupFk: BasicsSharedCustomizeLookupOverloadProvider.provideTimeKeepingGroupLookupOverload(true),
				CostGroupFk: BasicsSharedCustomizeLookupOverloadProvider.provideTimekeepingCostGroupReadonlyLookupOverload(),
				EmployeeAreaFk: BasicsSharedCustomizeLookupOverloadProvider.provideTimekeepingEmployeeAreaLookupOverload(true),
				EmployeeSubAreaFk: BasicsSharedCustomizeLookupOverloadProvider.provideTimekeepingEmployeeSubAreaLookupOverload(true),
				EmployeeStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideTimekeepingEmployeeStatusReadonlyLookupOverload()
			},
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					CountryFk: {key: 'entityCountry'},
					AddressFk: {key: 'entityAddress'},
					StartDate: {key: 'entityStartDate'},
					GroupFk: {key: 'entityGroup'}
				}),
				...prefixAllTranslationKeys('timekeeping.employee.', {
					CrewLeaderFk: {key: 'entityCurrentCrewLeader'},
					PaymentGroupFk: {key: 'entityPaymentGroupFk'},
					CompanyOperatingFk: {key: 'entityOperatingCompany'},
					Initials: {key: 'entityInitials'},
					WorkingTimeModelFk: {key: 'entityWorkingTimeModel'},
					WorkingTimeAccountBalance: {key: 'entityWorkingTimeAccountBalance'},
					IsPayroll: {key: 'EntityIsPayroll'},
					VacationBalance: {key: 'entityVacationBalance'},
					YearlyVacation: {key: 'entityYearlyVacation'},
					TrafficLightFk: {key: 'entityTrafficLight'},
					GenerateRecording: {key: 'entityGenerateRecording'},
					TerminalDate: {key: 'entityTerminalDate'},
					IsCrewLeader: {key: 'entityIsCrewLeader'},
					IsWhiteCollar: {key: 'entityIsWhiteCollar'},
					IsHiredLabor: {key: 'entityIsHiredLabor'},
					IsTimekeeper: {key: 'entityIsTimekeeper'},
					ShiftFk: {key: 'entityShift'},
					EmployeeGroupFk: {key: 'entityEmployeeGroup'},
					TimekeepingGroupFk: {key: 'entityTimekeepingGroup'},
					ProfessionalCategoryFk: {key: 'entityProfessionalCategoryFk'},
					CostGroupFk: {key: 'entityCostGroup'},
					EmployeeAreaFk: {key: 'employeeArea'},
					EmployeeSubAreaFk: {key: 'employeeSubArea'},
					EmployeeStatusFk: {key: 'employeeStatusFk'}
				}),
				...prefixAllTranslationKeys('basics.clerk.', {
					ClerkFk: {key: 'entityClerk'},
					FirstName: {key: 'entityFirstName'},
					FamilyName: {key: 'entityFamilyName'},
					TelephoneNumberTelFk: {key: 'entityTelephoneNumberFk'},
					TelephoneNumberMobFk: {key: 'entityTelephoneMobilFk'},
					Email: {key: 'entityEmail'},
					BirthDate: {key: 'entityBirthdate'},
					//UserFk: {key: 'entityUserFk'},
				}),
				...prefixAllTranslationKeys('basics.company.', {
					CalendarFk: {key: 'entityCalendar'}
				}),
				...addUserDefinedTextTranslation({ UserDefinedText: {key: 'entityUserDefinedText',params: { 'p_0': 1 }} }, 5, 'UserDefinedText', '', 'userDefTextGroup'),
				...addUserDefinedNumberTranslation({ UserDefinedNumber: {key: 'entityUserDefinedNumber',params: { 'p_0': 1 }} }, 5, 'UserDefinedNumber', '', 'userDefNumberGroup'),
				...addUserDefinedDateTranslation({ UserDefinedDate: {key: 'entityUserDefDate',params: { 'p_0': 1 }} }, 5, 'UserDefinedDate', '', 'userDefDateGroup'),
			}
		};
		},
	additionalEntityContainers: [
		// remark container
		{
			uuid: '726429485e844236bbc249a3982326fe',
			title: 'cloud.common.remark',
			containerType: BasicsSharedPlainTextContainerComponent,
			providers: [
				{
					provide: PLAIN_TEXT_ACCESSOR,
					useValue: <IPlainTextAccessor<IEmployeeEntity>>{
						getText(entity: IEmployeeEntity): string | undefined {
							return entity.Remark ?? '';
						},
						setText(entity: IEmployeeEntity, value?: string) {
							if (value) {
								entity.Remark = value;
							}
						},
					},
				},
			],
		},
	],
});