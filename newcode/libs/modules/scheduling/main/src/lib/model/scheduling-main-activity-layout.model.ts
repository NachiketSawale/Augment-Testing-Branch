import { ControllingSharedControllingUnitLookupProviderService } from '@libs/controlling/shared';
import { ACTIVITY_LOOKUP_PROVIDER_TOKEN, ACTIVITY_TEMPLATE_LOOKUP_PROVIDER_TOKEN, CALENDAR_LOOKUP_PROVIDER_TOKEN, IActivityEntity, SCHEDULE_LOOKUP_PROVIDER_TOKEN } from '@libs/scheduling/interfaces';
import { PROJECT_LOOKUP_PROVIDER_TOKEN } from '@libs/project/interfaces';
import { createLookup, FieldType, ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import {
	BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider,
} from '@libs/basics/shared';
import { ProjectLocationLookupService } from '@libs/project/shared';
import { IControllingUnitLookupEntity } from '@libs/controlling/interfaces';
import { addUserDefinedDateTranslation, addUserDefinedNumberTranslation, addUserDefinedTextTranslation, IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';

export const SCHEDULING_MAIN_ACTIVITY_LAYOUT = async (ctx:IInitializationContext) => {
	const controllingUnitLookupProvider = ctx.injector.get(ControllingSharedControllingUnitLookupProviderService);
	const activityTemplateLookupProvider = await ctx.lazyInjector.inject(ACTIVITY_TEMPLATE_LOOKUP_PROVIDER_TOKEN);
	const activityLookupProvider = await ctx.lazyInjector.inject(ACTIVITY_LOOKUP_PROVIDER_TOKEN);
	const scheduleLookupProvider = await ctx.lazyInjector.inject(SCHEDULE_LOOKUP_PROVIDER_TOKEN);
	const projectLookupProvider = await ctx.lazyInjector.inject(PROJECT_LOOKUP_PROVIDER_TOKEN);
	const calendarLookupProvider = await ctx.lazyInjector.inject(CALENDAR_LOOKUP_PROVIDER_TOKEN);
	return <ILayoutConfiguration<IActivityEntity>>{
		groups: [
			{
				gid: 'default-group',
				attributes: ['Code', 'Description','ActivityTemplateFk', 'ControllingUnitFk', 'ParentActivityFk', 'ActivityStateFk',
					'ProjectFk', 'ScheduleFk', 'CalendarFk', 'AddressFk', 'SchedulingMethodFk', 'TaskTypeFk', 'Quantity', 'QuantityUoMFk',
					'IsQuantityEvaluated', 'Specification', 'Note', 'BaselineFk', 'SCurveFk', /*'ProjectReleaseFk',*/
					'ScheduleSubFk', 'ActivitySubFk', 'ScheduleMasterFk', 'ActivityMasterFk', 'EstimateHoursTotal']
			},
			{
				gid: 'procurementGroup',
				attributes: ['PrcStructureFk', 'PackageCode', 'PackageDesc']
			},
			{
				gid: 'locationGroup',
				attributes: ['LocationFk', 'ActivityPresentationFk', 'LocationSpecification', 'ChartPresentationFk', 'Bas3dVisualizationTypeFk', 'LobLabelPlacementFk', 'CosMatchtext']
			},
			{
				gid: 'dateFloatGroup',
				attributes: ['PlannedStart', 'PlannedFinish', 'PlannedDuration', 'RemainingDuration', 'PlannedCalendarDays', 'IsCritical', 'EarliestStart', 'EarliestFinish', 'LatestStart', 'LatestFinish', 'TotalFloatTime', 'FreeFloatTime', 'IsOnLongestPath']
			},
			{
				gid: 'constraintGroup',
				attributes: ['ConstraintTypeFk', 'ConstraintDate']
			},
			{
				gid: 'execGroup',
				attributes: ['ActualStart', 'ExecutionStarted', 'ActualFinish', 'ActualDuration', 'ActualCalendarDays', 'ExecutionFinished', 'CurrentStart', 'CurrentFinish', 'CurrentDuration', 'CurrentCalendarDays', 'IsDurationEstimationDriven']
			},
			{
				gid: 'performanceGroup',
				attributes: ['ResourceFactor', 'PerformanceFactor', 'Perf1UoMFk', 'Perf2UoMFk']
			},
			{
				gid: 'performanceMeasurementGroup',
				attributes: ['PercentageCompletion', 'PeriodQuantityPerformance', 'DueDateQuantityPerformance', 'RemainingActivityQuantity', 'PeriodWorkPerformance', 'DueDateWorkPerformance', 'RemainingActivityWork']
			},
			{
				gid: 'progressGroup',
				attributes: ['ProgressReportMethodFk', 'Work']
			},
			{
				gid: 'relation',
				attributes: ['Predecessor', 'Successor']
			},
			{
				gid: 'userDefTextGroup',
				attributes: ['UserDefinedText01', 'UserDefinedText02', 'UserDefinedText03', 'UserDefinedText04', 'UserDefinedText05', 'UserDefinedText06', 'UserDefinedText07', 'UserDefinedText08', 'UserDefinedText09', 'UserDefinedText10']
			}, {
				gid: 'userDefNumberGroup',
				attributes: ['UserDefinedNumber01', 'UserDefinedNumber02', 'UserDefinedNumber03', 'UserDefinedNumber04', 'UserDefinedNumber05', 'UserDefinedNumber06', 'UserDefinedNumber07', 'UserDefinedNumber08', 'UserDefinedNumber09', 'UserDefinedNumber10']
			}, {
				gid: 'userDefDateGroup',
				attributes: ['UserDefinedDate01', 'UserDefinedDate02', 'UserDefinedDate03', 'UserDefinedDate04', 'UserDefinedDate05', 'UserDefinedDate06', 'UserDefinedDate07', 'UserDefinedDate08', 'UserDefinedDate09', 'UserDefinedDate10']
			}
		],
		overloads: {
			CurrentStart:{readonly: true},
			CurrentFinish:{readonly: true},
			CurrentDuration:{readonly: true},
			CurrentCalendarDays:{readonly: true},
			ActualDuration:{readonly: true},
			ActualCalendarDays:{readonly: true},
			CosMatchtext:{readonly: true},
			Predecessor:{readonly: true},
			PackageCode:{readonly: true},
			Successor:{readonly: true},
			RemainingDuration:{readonly: true},
			PlannedCalendarDays:{readonly: true},
			EstimateHoursTotal:{readonly: true},
			IsCritical: {readonly: true},
			EarliestStart: {readonly: true},
			EarliestFinish: {readonly: true},
			LatestStart: {readonly: true},
			LatestFinish: {readonly: true},
			TotalFloatTime: {readonly: true},
			FreeFloatTime: {readonly: true},
			IsOnLongestPath: {readonly: true},
			BaselineFk: BasicsSharedLookupOverloadProvider.provideBaselineSpecReadonlyLookupOverload(),
			PrcStructureFk: BasicsSharedLookupOverloadProvider.providerBasicsProcurementStructureLookupOverload(true),
			Perf1UoMFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			Perf2UoMFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			ActivityPresentationFk: BasicsSharedLookupOverloadProvider.provideActivityPresentationLookupOverload(true),
			ChartPresentationFk: BasicsSharedCustomizeLookupOverloadProvider.provideChartPresentationLookupOverload(true),
			Bas3dVisualizationTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideThreeDVisualizationTypeLookupOverload(true),
			LobLabelPlacementFk: BasicsSharedLookupOverloadProvider.provideLabelPlacementLookupOverload(true),
			ConstraintTypeFk: BasicsSharedLookupOverloadProvider.provideConstraintTypeLookupOverload(true),
			SCurveFk: BasicsSharedCustomizeLookupOverloadProvider.provideSCurveLookupOverload(true),
			LocationFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
						dataServiceToken: ProjectLocationLookupService
					}
				)
			},
			ActivityTemplateFk: activityTemplateLookupProvider.generateActivityTemplateLookup(),
			ControllingUnitFk: await controllingUnitLookupProvider.generateControllingUnitLookup(ctx, {
				checkIsAccountingElement: true,
				projectGetter: (e: IActivityEntity) => e.ProjectFk,
				controllingUnitGetter: (e: IActivityEntity) => e.ControllingUnitFk,
				lookupOptions: {
					showClearButton: true,
					showDescription: true,
					descriptionMember: 'DescriptionInfo.Translated',
					serverSideFilter: {
						key: 'scheduling.main.controllingunit.project.context.filter',
						execute: (context: ILookupContext<IControllingUnitLookupEntity, IActivityEntity>) => {
							return {
								ByStructure: true,
								ExtraFilter: false,
								PrjProjectFk: context.entity?.ProjectFk,
								CompanyFk:  context.entity?.CompanyFk
							};
						},
					}
				}
			}),
			ParentActivityFk:activityLookupProvider.generateActivityLookup(),
			ScheduleFk: scheduleLookupProvider.generateScheduleLookup(),
			ProjectFk: projectLookupProvider.generateProjectLookup(),
			CalendarFk: calendarLookupProvider.generateCalendarLookup(),
			TaskTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideTaskTypeLookupOverload(false),
			SchedulingMethodFk: BasicsSharedCustomizeLookupOverloadProvider.provideScheduleMethodLookupOverload(false),
			ProgressReportMethodFk:BasicsSharedCustomizeLookupOverloadProvider.provideProgressReportMethodLookupOverload(false),
			ActivityStateFk:BasicsSharedCustomizeLookupOverloadProvider.provideActivityStateLookupOverload(false),
			AddressFk: BasicsSharedLookupOverloadProvider.providerAddressDialogComponentOverload(true),
			QuantityUoMFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
			//TODO ProjectReleaseFk: lookuOverload
			ScheduleSubFk: scheduleLookupProvider.generateScheduleLookup({ readonly: true }),
			ActivitySubFk: activityLookupProvider.generateActivityLookup({ readonly: true }),
			ScheduleMasterFk: scheduleLookupProvider.generateScheduleLookup({ readonly: true }),
			ActivityMasterFk: activityLookupProvider.generateActivityLookup({ readonly: true }),
		},
		labels: {
			...
				prefixAllTranslationKeys('scheduling.main.', {
					ControllingUnitFk: {key: 'controllingunit'},
					ScheduleFk: {key: 'schedule'},
					ParentActivityFk: {key: 'entityParent'},
					SchedulingMethodFk: {key: 'schedulingMethod'},
					IsQuantityEvaluated: {key: 'isQuantityEvaluated'},
					Specification: {key: 'entitySpecification'},
					Note: {key: 'note'},
					BaselineFk: {key: 'baseline'},
					SCurveFk: {key: 'activitySCurve'},
					EstimateHoursTotal: {key: 'estimateHoursTotal'},
					PrcStructureFk: {key: 'prcStructureFk'},
					PackageCode: {key: 'packageCode'},
					LocationFk: {key: 'location'},
					ActivityPresentationFk: {key: 'activityPresented'},
					LocationSpecification: {key: 'locationSpecification'},
					ChartPresentationFk: {key: 'activityChartPresented'},
					Bas3dVisualizationTypeFk: {key: '3dVisualizationType'},
					CosMatchtext: {key: 'CosMatchText'},
					PlannedStart: {key: 'plannedStart'},
					PlannedFinish: {key: 'plannedFinish'},
					PlannedDuration: {key: 'plannedDuration'},
					PlannedCalendarDays: {key: 'plannedCalendarDays'},
					IsCritical: {key: 'iscritical'},
					EarliestStart: {key: 'earliestStart'},
					EarliestFinish: {key: 'earliestFinish'},
					LatestStart: {key: 'latestFinish'},
					TotalFloatTime: {key: 'totalFloatTime'},
					FreeFloatTime: {key: 'freeFloatTime'},
					IsOnLongestPath: {key: 'entityIsOnLongestPath'},
					ActualStart: {key: 'actualStart'},
					ActualFinish: {key: 'actualStart'},
					ActualDuration: {key: 'actualDuration'},
					ActualCalendarDays: {key: 'actualCalendarDays'},
					CurrentStart: {key: 'currentStart'},
					CurrentFinish: {key: 'constraint'},
					ConstraintTypeFk: {key: 'currentFinish'},
					IsDurationEstimationDriven: {key: 'IsDurationEstimationDriven'},
					ResourceFactor: {key: 'resourceFactor'},
					PerformanceFactor: {key: 'performanceFactor'},
					Perf1UoMFk: {key: 'perfUoM', params: {'p_0': 1}},
					Perf2UoMFk: {key: 'perfUoM', params: {'p_0': 2}},
					PercentageCompletion: {key: 'entityMeasuredPerformance'},
					PeriodQuantityPerformance: {key: 'entityPeriodQuantityPerformance'},
					DueDateQuantityPerformance: {key: 'entityDueDateQuantityPerformance'},
					RemainingActivityQuantity: {key: 'entityRemainingActivityQuantity'},
					PeriodWorkPerformance: {key: 'entityPeriodWorkPerformance'},
					RemainingActivityWork: {key: 'entityRemainingActivityWork'},
					Work: {key: 'work'},
					Predecessor: {key: 'predecessor'},
					Successor: {key: 'successor'},
					RemainingDuration: {key: 'remainingduration'},
					ExecutionStarted: {key: 'executionStarted'},
					ExecutionFinished: {key: 'executionFinished'},
					LatestFinish: {key: 'latestFinish'},
					//ProjectReleaseFk: {key: 'entityRelease'},
					ScheduleSubFk: {key: 'scheduleSubFk'},
					ActivitySubFk: {key: 'activitySubFk'},
					ScheduleMasterFk: {key: 'scheduleMasterFk'},
					ActivityMasterFk: {key: 'activityMasterFk'},
					PackageDesc: {key: 'packageDesc'},
					LobLabelPlacementFk: {key: 'entityLabelPlacement'},
					CurrentDuration: {key: 'currentDuration'},
					CurrentCalendarDays: {key: 'currentCalendarDays'},
					DueDateWorkPerformance: {key: 'entityDueDateWorkPerformance'},
					ProgressReportMethodFk: {key: 'progressReportMethod'}
				}),
			...
				prefixAllTranslationKeys('cloud.common.', {
					ActivityStateFk: {key: 'entityState'},
					Code: {key: 'entityCode'},
					Description: {key: 'entityDescription'},
					userDefTexts: {key: 'UserdefTexts'},
					userDefNumbers: {key: 'UserdefNumbers'},
					userDefDates: {key: 'UserdefDates'},
					ProjectFk: {key: 'entityProject'},
					TaskTypeFk: {key: 'entityType'},
					ActivityTemplateFk: {key: 'entityTemplate'},
					CalendarFk: {key: 'entityCalCalendarFk'},
					Quantity: {key: 'entityQuantity'},
					QuantityUoMFk: {key: 'entityUoM'},
					ConstraintDate: {key: 'entityDate'},
					AddressFk: {key: 'address'}
				}),
			...addUserDefinedTextTranslation({ UserDefinedText: {key: 'entityUserDefinedText',params: { 'p_0': 1 }} }, 10, 'UserDefinedText', '', 'userDefTextGroup'),
			...addUserDefinedNumberTranslation({ UserDefinedNumber: {key: 'entityUserDefinedNumber',params: { 'p_0': 1 }} }, 10, 'UserDefinedNumber', '', 'userDefNumberGroup'),
			...addUserDefinedDateTranslation({ UserDefinedDate: {key: 'entityUserDefDate',params: { 'p_0': 1 }} }, 10, 'UserDefinedDate', '', 'userDefDateGroup'),
		}
	};
};
