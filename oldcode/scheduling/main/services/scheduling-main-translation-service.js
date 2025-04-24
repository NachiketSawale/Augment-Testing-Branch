/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	// List of modules used directly.
	var schedulingMainModule = 'scheduling.main';
	var cloudCommonModule = 'cloud.common';
	var cloudDesktopModule = 'cloud.desktop';
	var schedulingScheduleModule = 'scheduling.schedule';
	var estimateMainModule = 'estimate.main';
	var mntActivity = 'productionplanning.activity';
	var mountingModule = 'productionplanning.mounting';


	/**
	 * @ngdoc service
	 * @name schedulingMainTranslationService
	 * @description provides validation methods for schedules
	 */
	angular.module(schedulingMainModule).factory('schedulingMainTranslationService', ['platformTranslationUtilitiesService', 'resourceRequisitionTranslationService',
		'modelViewerTranslationModules',

		function (platformTranslationUtilitiesService, resourceRequisitionTranslationService,
			modelViewerTranslationModules) {

			var service = {};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [schedulingMainModule, cloudCommonModule, cloudDesktopModule, schedulingScheduleModule, estimateMainModule,
					mntActivity, mountingModule, 'basics.procurementstructure'].concat(modelViewerTranslationModules)
			};

			/* jshint -W106 */ // variable name is forced by translation json file
			data.words = {
				activityDetails: { location: schedulingMainModule, identifier: 'activitydetails', initial: 'Details Activity' },
				listRelationship: { location: schedulingMainModule, identifier: 'listRelationship', initial: 'Relationships' },
				detailRelationshipTitle: { location: schedulingMainModule, identifier: 'detailRelationshipTitle', initial: 'Details Relationship' },
				activityProgressReport: { location: schedulingMainModule, identifier: 'progressReport', initial: 'Progress Report History' },
				procurementGroup: { location: schedulingMainModule, identifier: 'procurementGroup', initial: 'Procurement' },
				locationGroup: { location: schedulingMainModule, identifier: 'locationGroup', initial: 'Location' },
				dateFloatGroup: { location: schedulingMainModule, identifier: 'datesFloatsGroup', initial: 'Dates & Floats' },
				constraintGroup: { location: schedulingMainModule, identifier: 'constraintGroup', initial: 'Constraint' },
				execGroup: { location: schedulingMainModule, identifier: 'ExecutionGroup', initial: 'Execution' },
				performanceGroup: { location: schedulingMainModule, identifier: 'ProductivityGroup', initial: 'Productivity' },
				performanceMeasurementGroup: { location: schedulingMainModule, identifier: 'PerformanceMeasurementGroup', initial: 'Performance' },
				progressGroup: { location: schedulingMainModule, identifier: 'ProgressGroup', initial: 'Progress' },
				progressReport: {location: schedulingMainModule, identifier: 'progressReport', initial: 'Progress Report History' },
				ProjectFk: { location: cloudCommonModule, identifier: 'entityProject', initial: 'Project' },
				ActivityTypeFk: { location: cloudCommonModule, identifier: 'entityType', initial: 'Type' },
				Note: { location: schedulingMainModule, identifier: 'note', initial: 'Note' },
				BaselineFk: { location: schedulingMainModule, identifier: 'baseline', initial: 'Baseline' },
				ParentActivityFk: { location: schedulingMainModule, identifier: 'entityParent', initial: 'Parent' },
				ScheduleFk: { location: schedulingMainModule, identifier: 'schedule', initial: 'Plan' },
				CalendarFk: {location: cloudCommonModule, identifier: 'entityCalCalendarFk', initial: 'Calendar (FI)'},
				CompanyFk: { location: cloudCommonModule, identifier: 'entityCompany', initial: 'Plan' },
				ActivityTemplateFk: { location: cloudCommonModule, identifier: 'entityTemplate', initial: 'Template' },
				ControllingUnitFk: { location: schedulingMainModule, identifier: 'controllingunit', initial: 'Controlling Unit'},
				Specification: { location: schedulingMainModule, identifier: 'entitySpecification', initial: 'Specification' },
				ActivityStateFk: { location: cloudCommonModule, identifier: 'entityState', initial: 'Status' },
				SchedulingMethodFk: { location: schedulingMainModule, identifier: 'schedulingMethod', initial: 'Scheduling Method' },
				LocationFk: { location: schedulingMainModule, identifier: 'location', initial: 'Location' },
				LocationSpecification: { location: schedulingMainModule, identifier: 'locationSpecification', initial: 'locationSpecification' },
				ActivityPresentationFk: { location: schedulingMainModule, identifier: 'activityPresented', initial: 'Activity Presented' },
				ChartPresentationFk:{location: schedulingMainModule, identifier: 'activityChartPresented', initial: 'Activity Chart Presentation'},
				Bas3dVisualizationTypeFk:{location: schedulingMainModule, identifier: '3dVisualizationType', initial: '3D Visualization Type'},
				PlannedStart: { location: schedulingMainModule, identifier: 'plannedStart', initial: 'Planned Start' },
				PlannedFinish: { location: schedulingMainModule, identifier: 'plannedFinish', initial: 'Planned Finish' },
				PlannedDuration: { location: schedulingMainModule, identifier: 'plannedDuration', initial: 'Planned Duration' },
				PlannedCalendarDays: { location: schedulingMainModule, identifier: 'plannedCalendarDays', initial: 'Planned Duration in Calendar Days' },
				ConstraintTypeFk: { location: schedulingMainModule, identifier: 'constraint', initial: 'Constraint' },
				ConstraintDate: { location: cloudCommonModule, identifier: 'entityDate', initial: 'Date' },
				ActualStart: { location: schedulingMainModule, identifier: 'actualStart', initial: 'Actual Start' },
				ActualFinish: { location: schedulingMainModule, identifier: 'actualFinish', initial: 'Actual Finish' },
				ActualDuration: { location: schedulingMainModule, identifier: 'actualDuration', initial: 'Actual Duration' },
				ActualCalendarDays: { location: schedulingMainModule, identifier: 'actualCalendarDays', initial: 'Actual Duration in Calendar Days' },
				CurrentStart: { location: schedulingMainModule, identifier: 'currentStart', initial: 'Current Start' },
				CurrentFinish: { location: schedulingMainModule, identifier: 'currentFinish', initial: 'Current Finish' },
				CurrentDuration: { location: schedulingMainModule, identifier: 'currentDuration', initial: 'Current Duration' },
				CurrentCalendarDays: { location: schedulingMainModule, identifier: 'currentCalendarDays', initial: 'Current Duration in Calendar Days' },
				ExecutionStarted: { location: schedulingMainModule, identifier: 'executionStarted', initial: 'Execution Started' },
				ExecutionFinished: { location: schedulingMainModule, identifier: 'executionFinished', initial: 'Execution Finished' },
				IsDurationEstimationDriven: { location: schedulingMainModule, identifier: 'durationEstimationDriven', initial: 'Duration Estimation Driven' },
				EarliestStart: { location: schedulingMainModule, identifier: 'earliestStart', initial: 'Earliest Start' },
				LatestStart: { location: schedulingMainModule, identifier: 'latestStart', initial: 'Latest Start' },
				EarliestFinish: { location: schedulingMainModule, identifier: 'earliestFinish', initial: 'Earliest Finish' },
				LatestFinish: { location: schedulingMainModule, identifier: 'latestFinish', initial: 'Latest Finish' },
				TotalFloatTime: { location: schedulingMainModule, identifier: 'totalFloatTime', initial: 'Total Float' },
				FreeFloatTime: { location: schedulingMainModule, identifier: 'freeFloatTime', initial: 'Free Float' },
				ResourceFactor: { location: schedulingMainModule, identifier: 'resourceFactor', initial: 'Resource' },
				PerformanceFactor: { location: schedulingMainModule, identifier: 'performanceFactor', initial: 'Performance' },
				PerformanceRuleFk: { location: schedulingMainModule, identifier: 'performanceRule', initial: 'Perf. Rule' },
				Perf1UoMFk: { location: schedulingMainModule, identifier: 'perfUoM', param: { number: '1' }, initial: 'UoM 1' },
				Perf2UoMFk: { location: schedulingMainModule, identifier: 'perfUoM', param: { number: '2' }, initial: 'UoM 2' },
				TaskTypeFk: { location: cloudCommonModule, identifier: 'entityType', initial: 'Type' },
				PlannedQuantity: { location: schedulingMainModule, identifier: 'PlannedQuantity', initial: 'Planned Quantity' },
				PlannedWork: { location: schedulingMainModule, identifier: 'PlannedWork', initial: 'Planned Work' },
				Work: { location: schedulingMainModule, identifier: 'work', initial: 'Work' },
				Quantity:{ location: cloudCommonModule, identifier: 'entityQuantity', initial: 'Quantity' },
				QuantityUoMFk: { location: cloudCommonModule, identifier: 'entityUoM', initial: 'UoM' },
				PercentageCompletion: { location: schedulingMainModule, identifier: 'entityMeasuredPerformance', initial: 'Measured Performance %' },
				PeriodQuantityPerformance: { location: schedulingMainModule, identifier: 'entityPeriodQuantityPerformance', initial: 'Performance in Period Quantity' },
				DueDateQuantityPerformance: { location: schedulingMainModule, identifier: 'entityDueDateQuantityPerformance', initial: 'Performance per Due Date Quantity' },
				RemainingActivityQuantity: { location: schedulingMainModule, identifier: 'entityRemainingActivityQuantity', initial: 'Remaining Quantity' },
				PeriodWorkPerformance: { location: schedulingMainModule, identifier: 'entityPeriodWorkPerformance', initial: 'Performance in Period Work' },
				DueDateWorkPerformance: { location: schedulingMainModule, identifier: 'entityDueDateWorkPerformance', initial: 'Performance per Due Date Work' },
				RemainingActivityWork: { location: schedulingMainModule, identifier: 'entityRemainingActivityWork', initial: 'Remaining Work' },
				LastProgressDate: { location: schedulingMainModule, identifier: 'entityLastProgressDate', initial: 'Last Progress Date' },
				ProgressReportMethodFk: { location: schedulingMainModule, identifier: 'progressReportMethod', initial: 'Report Method' },
				RemainingLineItemQuantity: { location: schedulingMainModule, identifier: 'entityRemainingActivityQuantity', initial: 'Remaining Quantity' },
				RemainingLineItemWork: { location: schedulingMainModule, identifier: 'entityRemainingActivityWork', initial: 'Remaining Work' },
				ActivityFk: { location: schedulingMainModule, identifier: 'entityActivity', initial: 'Activity' },
				PerformanceDate: { location: schedulingMainModule, identifier: 'entityPerformanceDate', initial: 'Performance Date' },
				LineItems: { location: schedulingMainModule, identifier: 'entityLineItems', initial: 'Line Items' },
				EstLineItemFk: { location: schedulingMainModule, identifier: 'entityLineItem', initial: 'Line Item' },
				EstHeaderFk: { location: schedulingMainModule, identifier: 'entityEstimationHeader', initial: 'Estimate Code' },
				BasUomFk: { location: cloudCommonModule, identifier: 'entityUoM', initial: 'UoM' },
				QuantityTotal: { location: schedulingMainModule, identifier: 'entityQuantityTotal', initial: 'LI Quantity Total' },
				WorkTotal: { location: schedulingMainModule, identifier: 'entityWorkTotal', initial: 'LI Work Total' },
				RemainingQuantity: { location: schedulingMainModule, identifier: 'entityRemainingQuantity', initial: 'Remaining Quantity' },
				PCo: { location: schedulingMainModule, identifier: 'entityPCo', initial: 'Percentage Completion' },
				RemainingPCo: { location: schedulingMainModule, identifier: 'entityRemainingPCo', initial: 'Remaining Percentage Completion' },
				RemainingWork: { location: schedulingMainModule, identifier: 'entityRemainingWork', initial: 'Remaining Work' },
				detailTitleSchedule: { location: schedulingScheduleModule, identifier: 'detailTitle', initial: 'Details Schedule'},
				RelationKindFk: { location: schedulingMainModule, identifier: 'entityRelationKind', initial: 'Kind' },
				PredecessorActivityFk: { location: schedulingMainModule, identifier: 'entityRelationPredecessor', initial: 'Predecessor' },
				PredecessorDesc: { location: schedulingMainModule, identifier: 'predecessorDesc', initial: 'Predecessor-Description' },
				PredecessorSchedule: { location: schedulingMainModule, identifier: 'predecessorSchedule', initial: 'Predecessor-Schedule' },
				ChildActivityFk: { location: schedulingMainModule, identifier: 'entityRelationChild', initial: 'Successor' },
				SuccessorDesc: { location: schedulingMainModule, identifier: 'successorDesc', initial: 'Successor-Description' },
				SuccessorSchedule: { location: schedulingMainModule, identifier: 'successorSchedule', initial: 'Successor-Schedule' },
				FixLagPercent: { location: schedulingMainModule, identifier: 'entityRelationFixLagPercent', initial: 'Fix Lag Percent' },
				FixLagTime: { location: schedulingMainModule, identifier: 'entityRelationFixLagTime', initial: 'Fix Lag Time' },
				VarLagPercent: { location: schedulingMainModule, identifier: 'entityRelationVarLagPercent', initial: 'Var Lag Percent' },
				VarLagTime: { location: schedulingMainModule, identifier: 'entityRelationVarLagTime', initial: 'Var Lag Time' },
				UseCalendar: { location: schedulingMainModule, identifier: 'entityRelationUseCalendar', initial: 'Use Calendar' },
				eventListTitle: { location: schedulingMainModule, identifier: 'eventListTitle', initial: 'Events' },
				eventDetailTitle: { location: schedulingMainModule, identifier: 'eventDetailTitle', initial: 'Details Event' },
				EventTypeFk: { location: cloudCommonModule, identifier: 'entityType', initial: 'Type' },
				Date: { location: cloudCommonModule, identifier: 'entityDate', initial: 'Date' },
				IsFixedDate: { location: schedulingMainModule, identifier: 'IsFixedDate', initial: 'Is Fixed Date' },
				PlacedBefore: { location: schedulingMainModule, identifier: 'PlacedBefore', initial: 'Placed Before' },
				DistanceTo: { location: schedulingMainModule, identifier: 'DistanceTo', initial: 'Distance To' },
				IsDisplayed: { location: schedulingMainModule, identifier: 'IsDisplayed', initial: 'Is Displayed' },
				createBaseline: { location: schedulingMainModule, identifier: 'createBaseline', initial: 'Create Baseline' },
				deleteBaseline: { location: schedulingMainModule, identifier: 'deleteBaseline', initial: 'Delete Baseline' },
				splitActivityByLocations: { location: schedulingMainModule, identifier: 'splitActivityByLocations', initial: 'Split Activity by Locations' },
				changeActivityState: { location: schedulingMainModule, identifier: 'changeActivityState', initial: 'Change Activity Status'},
				newActivityState: { location: schedulingMainModule, identifier: 'newActivityState', initial: 'New Status' },
				entityEvent: { location: schedulingMainModule, identifier: 'entityEvent', initial: 'Event' },
				entityRelationship: { location: schedulingMainModule, identifier: 'entityRelationship', initial: 'Relationship' },
				entityLineItemProgress: { location: schedulingMainModule, identifier: 'entityLineItemProgress', initial: 'Line-Item Progress' },
				ActivityCode:  { location: cloudCommonModule, identifier: 'entityCode', initial: 'Code' },
				ActivityDescription:  { location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description' },
				SCurveFk:{location: schedulingMainModule, identifier: 'activitySCurve', initial: 'S Curve'},
				LineItemCode: { location: schedulingMainModule, identifier: 'entityLineItem', initial: 'Line Item' },
				LineItemDescription: { location: schedulingMainModule, identifier: 'entityLineItemDesc', initial: 'Item Desc.' },
				EstimationCode: { location: schedulingMainModule, identifier: 'entityEstimationHeader', initial: 'Estimate Code' },
				EstimationDescription: { location: schedulingMainModule, identifier: 'entityEstimationDesc', initial: 'Estimate Desc.' },
				CostTotal: { location: schedulingMainModule, identifier: 'entityEstimationCostTotal', initial: 'Estimate Costs' },
				formConfigMoveUpBnt: { location: cloudDesktopModule, identifier: 'formConfigMoveUpBnt', initial: 'Move Up' },
				formConfigMoveDownBnt: { location: cloudDesktopModule, identifier: 'formConfigMoveDownBnt', initial: 'Move Down' },
				activityLocationMatrix: { location: schedulingMainModule, identifier: 'activityLocationMatrix', initial: 'Activity Location Matrix' },
				HoursTotal:{ location: estimateMainModule, identifier: 'hoursTotal', initial: 'HoursTotal' },
				Code:{ location: cloudCommonModule, identifier: 'entityCode', initial: 'Code' },
				templates:{ location: cloudCommonModule, identifier: 'templates', initial: 'Templates' },
				ProjectName: {location: cloudCommonModule, identifier: 'entityName', initial: 'Name'},
				PrcStructureFk:{ location: schedulingMainModule, identifier: 'prcStructureFk', initial: 'Procurement Structure' },
				UpToDateActivityStateFk: {location: schedulingMainModule, identifier: 'upToDateActivityStateFk', initial: 'UpToDateActivityStateFk'},
				UpToDateActivityTypeFk: {location: schedulingMainModule, identifier: 'upToDateActivityTypeFk', initial: 'UpToDateActivityTypeFk'},
				UpToDateActualDuration: {location: schedulingMainModule, identifier: 'upToDateActualDuration', initial: 'UpToDateActualDuration'},
				UpToDateActualFinish: {location: schedulingMainModule, identifier: 'upToDateActualFinish', initial: 'UpToDateActualFinish'},
				UpToDateActualStart: {location: schedulingMainModule, identifier: 'upToDateActualStart', initial: 'UpToDateActualStart'},
				UpToDateCode: {location: schedulingMainModule, identifier: 'upToDateCode', initial: 'UpToDateCode'},
				UpToDateConstraintDate: {location: schedulingMainModule, identifier: 'upToDateConstraintDate', initial: 'UpToDateConstraintDate'},
				UpToDateConstraintTypeFk: {location: schedulingMainModule, identifier: 'upToDateConstraintTypeFk', initial: 'UpToDateConstraintTypeFk'},
				UpToDateCurrentDuration: {location: schedulingMainModule, identifier: 'upToDateCurrentDuration', initial: 'UpToDateCurrentDuration'},
				UpToDateCurrentFinish: {location: schedulingMainModule, identifier: 'upToDateCurrentFinish', initial: 'UpToDateCurrentFinish'},
				UpToDateCurrentStart: {location: schedulingMainModule, identifier: 'upToDateCurrentStart', initial: 'UpToDateCurrentStart'},
				UpToDateDescription: {location: schedulingMainModule, identifier: 'upToDateDescription', initial: 'UpToDateDescription'},
				UpToDateLocationFk: {location: schedulingMainModule, identifier: 'upToDateLocationFk', initial: 'UpToDateLocationFk'},
				UpToDateLocationSpecification: {location: schedulingMainModule, identifier: 'upToDateLocationSpecification', initial: 'UpToDateLocationSpecification'},
				UpToDateParentActivityFk: {location: schedulingMainModule, identifier: 'upToDateParentActivityFk', initial: 'UpToDateParentActivityFk'},
				UpToDatePerf1UoMFk: {location: schedulingMainModule, identifier: 'upToDatePerf1UoMFk', initial: 'UpToDatePerf1UoMFk'},
				UpToDatePerf2UoMfk: {location: schedulingMainModule, identifier: 'upToDatePerf2UoMfk', initial: 'UpToDatePerf2UoMfk'},
				UpToDatePerformanceFactor: {location: schedulingMainModule, identifier: 'upToDatePerformanceFactor', initial: 'UpToDatePerformanceFactor'},
				UpToDatePerformanceRuleFk: {location: schedulingMainModule, identifier: 'upToDatePerformanceRuleFk', initial: 'UpToDatePerformanceRuleFk'},
				UpToDatePlannedDuration: {location: schedulingMainModule, identifier: 'upToDatePlannedDuration', initial: 'UpToDatePlannedDuration'},
				UpToDatePlannedFinish: {location: schedulingMainModule, identifier: 'upToDatePlannedFinish', initial: 'UpToDatePlannedFinish'},
				UpToDatePlannedStart: {location: schedulingMainModule, identifier: 'upToDatePlannedStart', initial: 'UpToDatePlannedStart'},
				UpToDateResourceFactor: {location: schedulingMainModule, identifier: 'upToDateResourceFactor', initial: 'UpToDateResourceFactor'},
				UpToDateScheduleFk: {location: schedulingMainModule, identifier: 'upToDateScheduleFk', initial: 'UpToDateScheduleFk'},
				UpToDateSchedulingMethodFk: {location: schedulingMainModule, identifier: 'upToDateSchedulingMethodFk', initial: 'UpToDateSchedulingMethodFk'},
				UpToDateSpecification: {location: schedulingMainModule, identifier: 'upToDateSpecification', initial: 'UpToDateSpecification'},
				activeActivity: { location: schedulingMainModule, identifier: 'activeActivity', initial: 'Active Activity' },
				IsCritical: { location: schedulingMainModule, identifier: 'iscritical', initial: 'Critical' },
				PackageId: { location: schedulingMainModule, identifier: 'packageCode', initial: 'Package' },
				PackageCode: { location: schedulingMainModule, identifier: 'packageCode', initial: 'Package Code' },
				PackageDesc: { location: schedulingMainModule, identifier: 'packageDesc', initial: 'Package Desc.' },
				ganttGridTitle: { location: schedulingMainModule, identifier: 'ganttGridTitle', initial: 'Gantt Grid.' },
				ganttTreeGridTitle: { location: schedulingMainModule, identifier: 'ganttTreeGridTitle', initial: 'Gantt Treegrid' },
				CosMatchtext: { location: schedulingMainModule, identifier: 'cosMatchText', initial: 'COS Match Text' },
				basicData : { location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data' },
				ActivityMemberFk : { location: schedulingMainModule, identifier: 'assignedActivity', initial: 'Assigned Activity' },
				CommentText : { location: cloudCommonModule, identifier: 'entityComment', initial: 'Comments' },
				Predecessor : { location: schedulingMainModule, identifier: 'predecessor', initial: 'Predecessor' },
				Successor : { location: schedulingMainModule, identifier: 'successor', initial: 'Successor' },
				relation: { location: schedulingMainModule, identifier: 'relation', initial: 'Relation' },
				ResourceCode: { location: schedulingMainModule, identifier: 'entityResourceCode', initial: 'Resource Code' },
				ResourceDescription: { location: schedulingMainModule, identifier: 'entityResourceDescription', initial: 'Resource Description' },
				ProjectReleaseFk: { location: schedulingMainModule, identifier: 'entityRelease', initial: 'Release' },
				LobLabelPlacementFk: { location: schedulingMainModule, identifier: 'entityLabelPlacement', initial: 'Label Placement' },
				IsOnLongestPath: { location: schedulingMainModule, identifier: 'entityIsOnLongestPath', initial: 'On Longest Path' },
				ActivityObservedFk: { location: schedulingMainModule, identifier: 'activityObserved', initial: 'Observed'},
				IsQuantityEvaluated: { location: schedulingMainModule, identifier: 'isQuantityEvaluated', initial: 'Quantity Evaluated'},
				ScheduleSubFk: { location: schedulingMainModule, identifier: 'scheduleSubFk', initial: 'Sub Schedule'},
				ActivitySubFk: { location: schedulingMainModule, identifier: 'activitySubFk', initial: 'Sub Activity'},
				ScheduleMasterFk: { location: schedulingMainModule, identifier: 'scheduleMasterFk', initial: 'Master Schedule'},
				ActivityMasterFk: { location: schedulingMainModule, identifier: 'activityMasterFk', initial: 'Master Activity'},
				EventFk: { location: schedulingMainModule, identifier: 'eventFk', initial: 'Connected EventpredecessorProjectNo'},
				PredecessorProjectNo: { location: schedulingMainModule, identifier: 'PredecessorProjectNo', initial: 'Predecessor Project No'},
				PredecessorProjectName: { location: schedulingMainModule, identifier: 'PredecessorProjectName', initial: 'Predecessor Project Name'},
				SuccessorProjectNo: { location: schedulingMainModule, identifier: 'SuccessorProjectNo', initial: 'Successor Project No'},
				SuccessorProjectName: { location: schedulingMainModule, identifier: 'SuccessorProjectName', initial: 'Successor Project Name'},
				ScheduleCode: { location: schedulingMainModule, identifier: 'scheduleCode', initial: 'Schedule Code'},
				ScheduleDescription: { location: schedulingMainModule, identifier: 'scheduleDescription', initial: 'Schedule Description'},
				ProjectNo: { location: schedulingMainModule, identifier: 'projectNo', initial: 'Project No'},
				AddressFk: { location: schedulingMainModule, identifier: 'address', initial: 'Address' },
				LineItem2ObjectFk: { location: schedulingMainModule, identifier: 'lineItem2ObjectFk', initial: 'lineItem to ObjectFk' },
				MdlModelFk: { location: schedulingMainModule, identifier: 'modelFk', initial: 'Model ' },
				ModelFk: { location: schedulingMainModule, identifier: 'modelFk', initial: 'Model ' },
				ObjectFk: { location: schedulingMainModule, identifier: 'objectFk', initial: 'Object ' },
				PlannedSequence: { location: schedulingMainModule, identifier: 'plannedSequence', initial: 'Planned Sequence' },
				ActualSequence: { location: schedulingMainModule, identifier: 'actualSequence', initial: 'Actual Sequence' },
				RemainingDuration:{location: schedulingMainModule, identifier: 'remainingDuration' , initial: 'Remaining Duration'},
				EstLineItemCode:{location: schedulingMainModule, identifier: 'lineItemCode' , initial: 'Line Item'},
				EstLineItemDescription:{location: schedulingMainModule, identifier: 'estLineItemDescription' , initial: 'Line Item Description'},
				EstHeaderCode:{location: schedulingMainModule, identifier: 'estHeaderCode' , initial: 'Estimate Code'},
				EstHeaderDesc:{location: schedulingMainModule, identifier: 'estHeaderDesc' , initial: 'Estimate Code Description'},
				Activity2ModelObjectFk:{location: schedulingMainModule, identifier: 'activity2ModelObjectFk' , initial: 'Model Object'},
				ModelObjectCode:{location: schedulingMainModule, identifier: 'modelObjectCode' , initial: 'Model Object Code'},
				ModelObjectDescription:{location: schedulingMainModule, identifier: 'modelObjectDescription' , initial: 'Model Object Description'},
				ExternalCode :{ location: schedulingMainModule, identifier: 'entityExternalCode' ,initial: 'External Code'},
				EstimateHoursTotal: { location: schedulingMainModule, identifier: 'estimateHoursTotal', initial: 'EstimateHoursTotal'},
				TotalCostCompleted: { location: schedulingMainModule, identifier: 'entityTotalCostCompleted', initial: 'TotalCostCompleted'},
				TotalCost: { location: schedulingMainModule, identifier: 'entityTotalCost', initial: 'TotalCost'},
				Icon:{ location: schedulingMainModule, identifier: 'icon', initial: 'Icon' },
				ModelCode: { location: schedulingMainModule, identifier: 'modelFk', initial: 'Model ' },
				ModelObjectDesc: { location: schedulingMainModule, identifier: 'objectFk', initial: 'Object ' }
			};

			// Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);
			platformTranslationUtilitiesService.addClerkContainerTranslations(data.words);
			resourceRequisitionTranslationService.addRequisitionTranslation(data.words);
			platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 10, 'UserDefinedText', '0');
			platformTranslationUtilitiesService.addUserDefinedNumberTranslation(data.words, 10, 'UserDefinedNumber', '0');
			platformTranslationUtilitiesService.addUserDefinedDateTranslation(data.words, 10, 'UserDefinedDate', '0');
			platformTranslationUtilitiesService.addModelAndSimulationTranslation(data.words, true);// true -> include models

			// Convert word list into a format used by platform translation service
			platformTranslationUtilitiesService.addMissingModules(data.allUsedModules, data.words);
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			// Prepare interface of service and load translations
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.loadModuleTranslation(data);


			service.loadTranslations = function loadTranslations() {
				return platformTranslationUtilitiesService.registerModules(data);
			};

			return service;
		}
	]);
})(angular);
