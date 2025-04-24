import { addUserDefinedDateTranslation, addUserDefinedNumberTranslation, addUserDefinedTextTranslation, IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType, ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { TimekeepingEmployeeLookupService, TimekeepingRecordingLookupService } from '@libs/timekeeping/shared';
import { IReportEntity, TIME_SYMBOL_LOOKUP_PROVIDER_TOKEN } from '@libs/timekeeping/interfaces';
import { IControllingUnitLookupEntity } from '@libs/controlling/interfaces';
import { ControllingSharedControllingUnitLookupProviderService } from '@libs/controlling/shared';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { PROJECT_LOOKUP_PROVIDER_TOKEN } from '@libs/project/interfaces';

export const TIMEKEEPING_RECORDING_REPORT_LAYOUT= async (ctx:IInitializationContext) => {
	const controllingUnitLookupProvider = ctx.injector.get(ControllingSharedControllingUnitLookupProviderService);
	const timeSymbolLookupProvider = await ctx.lazyInjector.inject(TIME_SYMBOL_LOOKUP_PROVIDER_TOKEN);
	const projectLookupProvider = await ctx.lazyInjector.inject(PROJECT_LOOKUP_PROVIDER_TOKEN);
	return <ILayoutConfiguration<IReportEntity>>{
		groups: [
			{
				gid: 'default-group',
				attributes: [
					'DueDate','RecordingFk','ReportStatusFk','EmployeeFk','TimeSymbolFk',	'ProjectFk', /*'JobFk',*/
					'Weekday', 'FromTimePartTime', 'FromTimePartDate', 'ToTimePartTime',
					'ToTimePartDate', 'Duration', 'BreakFrom', 'BreakTo', 'ControllingUnitFk',
					/*'ProjectActionFk',*/ 'CommentText', 'IsModified', 'BreakDuration',
					'Longitude', 'Latitude']
			},
			{
				gid: 'userDefTexts',
				attributes: ['UserDefinedText01', 'UserDefinedText02', 'UserDefinedText03', 'UserDefinedText04', 'UserDefinedText05', 'UserDefinedText06', 'UserDefinedText07', 'UserDefinedText08', 'UserDefinedText09', 'UserDefinedText10']
			}, {
				gid: 'userDefNumbers',
				attributes: ['UserDefinedNumber01', 'UserDefinedNumber02', 'UserDefinedNumber03', 'UserDefinedNumber04', 'UserDefinedNumber05', 'UserDefinedNumber06', 'UserDefinedNumber07', 'UserDefinedNumber08', 'UserDefinedNumber09', 'UserDefinedNumber10']
			}, {
				gid: 'userDefDates',
				attributes: ['UserDefinedDate01', 'UserDefinedDate02', 'UserDefinedDate03', 'UserDefinedDate04', 'UserDefinedDate05', 'UserDefinedDate06', 'UserDefinedDate07', 'UserDefinedDate08', 'UserDefinedDate09', 'UserDefinedDate10']
			}
		],
		overloads: {
			EmployeeFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
						dataServiceToken: TimekeepingEmployeeLookupService
					}
				)
			},
			RecordingFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
						dataServiceToken: TimekeepingRecordingLookupService
					}
				)
			},
			TimeSymbolFk: timeSymbolLookupProvider.generateTimeSymbolLookup({
				preloadTranslation: 'timekeeping.timesymbols.entity'
			}),
			//TODO ReportStatus displayMember: Description and not Code
			ReportStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideTimekeepingReportStatusReadonlyLookupOverload(),
			ProjectFk: projectLookupProvider.generateProjectLookup(),
			//TODO JobLookup
			//TODO ProjectActionFk: {},
			ControllingUnitFk: await controllingUnitLookupProvider.generateControllingUnitLookup(ctx, {
				checkIsAccountingElement: true,
				controllingUnitGetter: e => e.ControllingUnitFk,
				lookupOptions: {
					showClearButton: true,
					showDescription: true,
					descriptionMember: 'DescriptionInfo.Translated',
					serverSideFilter: {
						key: 'timekeeping.main.controllingunit.project.context.filter',
						execute: (context: ILookupContext<IControllingUnitLookupEntity, IReportEntity>) => {
							return {
								ByStructure: true,
								ExtraFilter: false,
								PrjProjectFk: context.entity?.ProjectFk,
							};
						},
					}
				}
			}),
		},
		labels: {
			...prefixAllTranslationKeys('timekeeping.recording.', {
				BreakDuration: {key: 'breakduration'},
				BreakFrom: {key:'entityBreakFrom'},
				BreakTo:{key:'entityBreakTo'},
				DueDate: {key: 'bookingDate'},
				IsModified: {key: 'isModified'},
				FromTimePartDate: {key: 'fromtimepartdate'},
				ToTimePartDate: {key: 'totimepartdate'},
				ToTimePartTime: {key: 'totimeparttime'},
				FromTimePartTime: {key: 'fromtimeparttime'},
				FromTimeBreakDate: {key: 'fromtimebreakdate'},
				IsGenerated: {key: 'isGenerated'},
				Latitude: {key: 'entityLatitude'},
				Longitude: {key: 'entityLongitude'},
				JobFk: {key: 'entityJob'},
				RecordingFk: {key: 'entityRecordingFk'}
			}),
			...prefixAllTranslationKeys('timekeeping.common.', {
				Duration: {key: 'duration'},
				IsLive: {key: 'entityIsLive'},
				Weekday: {key: 'entityWeekday'}
			}),
			...prefixAllTranslationKeys('timekeeping.timesymbols.', {
				TimeSymbolFk: {key: 'entityTimeSymbol'}
			}),
			...prefixAllTranslationKeys('timekeeping.employee.', {
				EmployeeFk: {key: 'entityEmployee'},
				ReportStatusFk: {key: 'entityReportStatus'},
				ProjectActionFk: {key: 'entityProjectAction'}
			}),
			...addUserDefinedTextTranslation({ UserDefinedText: {key: 'entityUserDefinedText',params: { 'p_0': 1 }} }, 10, 'UserDefinedText', '', 'userDefTextGroup'),
			...addUserDefinedNumberTranslation({ UserDefinedNumber: {key: 'entityUserDefinedNumber',params: { 'p_0': 1 }} }, 10, 'UserDefinedNumber', '', 'userDefNumberGroup'),
			...addUserDefinedDateTranslation({ UserDefinedDate: {key: 'entityUserDefDate',params: { 'p_0': 1 }} }, 10, 'UserDefinedDate', '', 'userDefDateGroup'),
			...prefixAllTranslationKeys('cloud.common.', {
				CommentText: {key: 'entityCommentText'},
				ProjectFk: {key: 'entityProject'},
				ControllingUnitFk: {key: 'entityControllingUnit'}
			})
		}
	};
};