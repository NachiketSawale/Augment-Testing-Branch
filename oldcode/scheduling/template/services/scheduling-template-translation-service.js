/**
 * Created by leo on 18.11.2014.
 */

(function (angular) {
	'use strict';

	var schedulingTemplateModule = 'scheduling.template';
	var cloudCommonModule = 'cloud.common';
	var schedulingMainModule = 'scheduling.main';
	var cloudCostgroupsModule = 'basics.costgroups';
	var estimateAssembliesModule = 'estimate.assemblies';
	var prcStructureModule = 'basics.procurementstructure';

	/**
	 * @ngdoc service
	 * @name schedulingTemplateTranslationService
	 * @description provides translation for scheduling template module
	 */
	angular.module(schedulingTemplateModule).factory('schedulingTemplateTranslationService', ['platformTranslateService', 'platformTranslationUtilitiesService',

		function (platformTranslateService, platformTranslationUtilitiesService) {
			var service = {};
			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [schedulingTemplateModule, cloudCommonModule, schedulingMainModule, cloudCostgroupsModule, estimateAssembliesModule, prcStructureModule]
			};

			data.words = {
				ActivityTemplateGroup: {location: schedulingTemplateModule, identifier:'activityTemplateGroup', initial:'ActivityTemplateGroup'},
				ActivityTemplateGroupFk: {location: schedulingTemplateModule, identifier:'activityTemplateGroupFk', initial:'Parent'},
				ActivityTemplate: {location: schedulingTemplateModule, identifier:'activityTemplate', initial:'ActivityTemplate'},
				ActivityTemplateFk: {location: schedulingTemplateModule, identifier:'activityTemplate', initial:'ActivityTemplate'},
				EventTypeFk: {location: schedulingTemplateModule, identifier:'eventType', initial:'Event type'},
				AllowModify: {location: schedulingTemplateModule, identifier:'allowModify', initial:'AllowModify'},
				PlacedBefore: {location: schedulingMainModule, identifier:'PlacedBefore', initial:'Placed Before'},
				DistanceTo: {location: schedulingMainModule, identifier:'DistanceTo', initial:'Distance To'},
				IsDisplayed: {location: schedulingMainModule, identifier:'IsDisplayed', initial:'Is Displayed'},
				ControllingGroupFk: {location: schedulingTemplateModule, identifier:'controllingGroupFk', initial:'Controlling Group'},
				ControllingGroupDetailFk: {location: schedulingTemplateModule, identifier:'controllingGroupDetailFk', initial:'Controlling Group Detail'},
				Inherited: {location: schedulingTemplateModule, identifier:'inherited', initial:'Inherited'},
				InheritedControllingGroupDetailFk: {location: schedulingTemplateModule, identifier:'inheritedcontrollingGroupDetailFk', initial:'Inherited Controlling Group Detail'},
				Resource: {location: schedulingMainModule, identifier: 'resourceFactor', initial: 'Resource / Crew'},
				PerformanceSheetFk: {location: schedulingTemplateModule, identifier: 'performanceSheet', initial: 'Performance Sheet'},
				DocumentTypeFk: {location: schedulingTemplateModule, identifier: 'documentType', initial: 'Document Type'},
				Date: {location: schedulingTemplateModule, identifier: 'Date', initial: 'Date'},
				FilearchivedocFk: {location: schedulingTemplateModule, identifier: 'filearchivedocFk', initial: 'File Archive Document'},
				OriginFileName : {location: schedulingTemplateModule, identifier: 'originFileName', initial: 'Origin File Name'},
				IsDefault: { location: cloudCommonModule, identifier: 'entityIsDefault', initial: 'Default' },
				constraintGroup: { location: schedulingMainModule, identifier: 'constraint', initial: 'Constraint' },
				performanceGroup: { location: schedulingMainModule, identifier: 'performance', initial: 'Performance' },
				performanceMeasurementGroup: { location: schedulingMainModule, identifier: 'PerformanceMeasurement', initial: 'Performance Measurement' },
				Specification: { location: cloudCommonModule, identifier: 'EntitySpec', initial: 'Specification' },
				SchedulingMethodFk: { location: schedulingMainModule, identifier: 'schedulingMethod', initial: 'Scheduling Method' },
				ActivityPresentationFk: { location: schedulingMainModule, identifier: 'activityPresented', initial: 'Activity Presented' },
				ChartPresentationFk:{location: schedulingMainModule, identifier: 'activityChartPresented', initial: 'Activity Chart Presentation'},
				SCurveFk:{location: schedulingMainModule, identifier: 'activitySCurve', initial: 'S Curve'},
				Bas3dVisualizationTypeFk:{location: schedulingMainModule, identifier: '3dVisualizationType', initial: '3D Visualization Type'},
				PrcStructureFk: {location: schedulingMainModule, identifier: 'prcStructureFk', initial: 'Procurement Structure'},
				ConstraintTypeFk: { location: schedulingMainModule, identifier: 'constraint', initial: 'Constraint' },
				ResourceFactor: { location: schedulingMainModule, identifier: 'resourceFactor', initial: 'Resource' },
				PerformanceFactor: { location: schedulingMainModule, identifier: 'performanceFactor', initial: 'Factor' },
				Perf1UoMFk: { location: schedulingMainModule, identifier: 'perfUoM', param: { number: '1' }, initial: 'UoM 1' },
				Perf2UoMFk: { location: schedulingMainModule, identifier: 'perfUoM', param: { number: '2' }, initial: 'UoM 2' },
				TaskTypeFk: { location: cloudCommonModule, identifier: 'entityType', initial: 'Type' },
				QuantityUoMFk: { location: cloudCommonModule, identifier: 'entityUoM', initial: 'UoM' },
				UomFk1: { location: schedulingMainModule, identifier: 'perfUoM', param: { number: '1' }, initial: 'UoM 1' },
				UomFk2: { location: schedulingMainModule, identifier: 'perfUoM', param: { number: '2' }, initial: 'UoM 2' },
				CommentText: {location: cloudCommonModule, identifier: 'entityComment', initial: 'Comments'},
				ControllingUnitTemplate: {location: schedulingTemplateModule, identifier: 'controllingUnitTemplate', initial: 'Controlling Unit Template'},
				ProgressReportMethodFk: { location: schedulingMainModule, identifier: 'progressReportMethod', initial: 'Report Method' },
				structurefk: {location: schedulingMainModule, identifier: 'prcStructureFk', initial: 'Procurement Structure'},
				StructureFk: {location: schedulingMainModule, identifier: 'prcStructureFk', initial: 'Procurement Structure'},
				CategoryWicFk: {location: estimateAssembliesModule, identifier: 'entityBoqWicCatFk', initial: 'WIC Group'},
				CatalogWicFk: {location: estimateAssembliesModule, identifier: 'entityBoqWicCatBoqFk', initial: 'WIC Catalogue'},
				HeaderWicFk: {location: estimateAssembliesModule, identifier: 'entityBoqWicCatBoqFk', initial: 'WIC Catalogue'},
				ItemWicFk: { location: estimateAssembliesModule, identifier: 'boqItemFk', initial: 'WIC BoQ-Item Ref.No'},
				LabelPlacementFk: { location: schedulingTemplateModule, identifier: 'entityLabelPlacement', initial: 'LOB Label Placement' },
				EventTemplateFk: { location: schedulingMainModule, identifier: 'eventFk', initial: 'Connected Event' }
			};

			// Get some predefined packages of words used in project
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);
			platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 10, 'UserDefinedText', '0');
			platformTranslationUtilitiesService.addUserDefinedNumberTranslation(data.words, 10, 'UserDefinedNumber', '0');
			platformTranslationUtilitiesService.addUserDefinedDateTranslation(data.words, 10, 'UserDefinedDate', '0');

			// Convert word list into a format used by platform translation service
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			// Prepare interface of service and load translations
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.registerModules(data);

			return service;
		}
	]);
})(angular);
