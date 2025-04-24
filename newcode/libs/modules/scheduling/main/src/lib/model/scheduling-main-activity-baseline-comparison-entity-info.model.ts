/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { CALENDAR_LOOKUP_PROVIDER_TOKEN, IActivityBaselineCmpVEntity, IActivityEntity, SCHEDULE_LOOKUP_PROVIDER_TOKEN } from '@libs/scheduling/interfaces';
import { ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { SchedulingActivityLookupProviderService } from '../services/scheduling-activity-lookup-provider.service';
import { SchedulingMainActivityBaselineComparison } from '../services/scheduling-main-activity-baseline-comparison-data.service';
import { PROJECT_LOOKUP_PROVIDER_TOKEN } from '@libs/project/interfaces';
import { CONTROLLING_UNIT_LOOKUP_PROVIDER_TOKEN, IControllingUnitLookupEntity } from '@libs/controlling/interfaces';

export const SCHEDULING_MAIN_ACTIVITY_BASELINE_COMP_ENTITY_INFO: EntityInfo = EntityInfo.create<IActivityBaselineCmpVEntity> ({
	grid: {
		title: {key: 'scheduling.main' + '.detailActivityBaseLineCmpListTitle'},
		containerUuid: 'cf894b615b395g75bcb9d584b06e1373',
	},
	form: {
		title: { key: 'scheduling.main' + '.detailActivityBaseLineCmpTitle' },
		containerUuid: 'cf894b615b395g75bcb9c473a95d0262',
	},
	dataService: ctx => ctx.injector.get(SchedulingMainActivityBaselineComparison),
	dtoSchemeId: {moduleSubModule: 'Scheduling.Main', typeName: 'ActivityBaselineCmpVDto'},
	permissionUuid: '5fc7ccd1f42f4aa7b8b2edeb2bde9d96',

	layoutConfiguration:async ctx=> {
		const controllingUnitLookupProvider = await ctx.lazyInjector.inject(CONTROLLING_UNIT_LOOKUP_PROVIDER_TOKEN);
		const activityLookupProvider = ctx.injector.get(SchedulingActivityLookupProviderService);
		const scheduleLookupProvider = await ctx.lazyInjector.inject(SCHEDULE_LOOKUP_PROVIDER_TOKEN);
		const projectLookupProvider = await ctx.lazyInjector.inject(PROJECT_LOOKUP_PROVIDER_TOKEN);
		const calendarLookupProvider = await ctx.lazyInjector.inject(CALENDAR_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<IActivityBaselineCmpVEntity>>{
			groups: [
				{
					gid: 'default-group',
					attributes: ['ActivtyId',
						'UpToDateCode',
						'UpToDateDescription',
						'UpToDateParentActivityFk',
						'UpToDateScheduleFk',
						'UpToDateSpecification',
						'UpToDateActivityStateFk',
						'UpToDateSchedulingMethodFk',
						'UpToDateLocationFk',
						'UpToDateLocationSpecification',
						'UpToDatePlannedStart',
						'UpToDatePlannedFinish',
						'UpToDatePlannedDuration',
						'UpToDateConstraintTypeFk',
						'UpToDateConstraintDate',
						'UpToDateActualStart',
						'UpToDateActualFinish',
						'UpToDateActualDuration',
						'UpToDateCurrentStart',
						'UpToDateCurrentFinish',
						'UpToDateCurrentDuration',
						'UpToDateResourceFactor',
						'UpToDatePerformanceFactor',
						'UpToDatePerformanceRuleFk',
						'UpToDatePerf1UoMFk',
						'UpToDatePerf2UoMfk',
						'Id',
						'ProjectFk',
						'ActivityTypeFk',
						'BaselineFk',
						'Code',
						'Description',
						'ParentActivityFk',
						'ScheduleFk',
						'CompanyFk',
						'BaseActivityFk',
						'ActivityTemplateFk',
						'ControllingUnitFk',
						'CalendarFk',
						'AllowModify',
						'Specification',
						'ActivityStateFk',
						'SchedulingMethodFk',
						'SubScheduleFk',
						'LocationFk',
						'LocationSpec',
						'ActPresentationFk',
						'ChartPresentationFk',
						'PlannedStart',
						'PlannedFinish',
						'PlannedDuration',
						'ConstraintTypeFk',
						'ConstraintDate',
						'ActualStart',
						'ActualFinish',
						'ActualDuration',
						'CurrentStart',
						'CurrentFinish',
						'CurrentDuration',
						'ExecutionStarted',
						'ExecutionFinished',
						'EarliestStart',
						'LatestStart',
						'EarliestFinish',
						'LatestFinish',
						'TotalFloatTime',
						'FreeFloatTime',
						'ResourceFactor',
						'PerformanceFactor',
						'PerformanceRuleFk',
						'Perf1UoMFk',
						'Perf2UoMFk',
						'TaskTypeFk',
						'Work',
						'QuantityUoMFk',
						'Quantity',
						'ProgressReportMethodFk',
						'Bas3dvisualizationtypeFk',
						'SCurveFk',
						'EventTypeFk',
						'IsCritical',
						'IsLive',
						'IsDirty',
						'Note',
						'SearchPattern']				},
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
				ActivtyId: activityLookupProvider.generateActivityLookup(),
				ScheduleFk:scheduleLookupProvider.generateScheduleLookup(),
				ProjectFk:projectLookupProvider.generateProjectLookup(),
				CalendarFk:calendarLookupProvider.generateCalendarLookup(),
				ControllingUnitFk: controllingUnitLookupProvider.generateControllingUnitLookup(ctx, {
					checkIsAccountingElement: true,
					projectGetter: e => e.ProjectFk,
					controllingUnitGetter: e => e.ControllingUnitFk,
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
			},
			labels: {
				...prefixAllTranslationKeys('scheduling.main.', {
					ActivtyId: {key:'entityActivity'},
					UpToDateCode: {key:'upToDateCode'},
					UpToDateDescription: {key:'UpToDateDescription'},
					UpToDateParentActivityFk: {key:'UpToDateParentActivityFk'},
					UpToDateScheduleFk: {key:'UpToDateScheduleFk'},
					UpToDateSpecification: {key:'UpToDateSpecification'},
					UpToDateActivityStateFk: {key:'UpToDateActivityStateFk'},
					UpToDateSchedulingMethodFk: {key:'UpToDateSchedulingMethodFk'}
				}),

			}
		};
	}
});