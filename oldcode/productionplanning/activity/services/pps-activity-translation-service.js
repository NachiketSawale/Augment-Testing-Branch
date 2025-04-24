/**
 * Created by anl on 2/2/2017.
 */

(function (angular) {
	'use strict';

	var ppsActivityModule = 'productionplanning.activity';

	var ppsMountingModule = 'productionplanning.mounting';
	var cloudCommonModule = 'cloud.common';
	var ppsCommonModule = 'productionplanning.common';
	var ppsProductModule = 'productionplanning.product';
	var ppsReportModule = 'productionplanning.report';
	var customizeModule = 'basics.customize';
	var projectCostCodesModule = 'project.costcodes';
	var estimateCommonModule = 'estimate.common';
	var schedulingMainModule = 'scheduling.main';
	var schedulingScheduleModule = 'scheduling.schedule';
	var ppsItemModule = 'productionplanning.item';
	var resMasterModule = 'resource.master';// for additional column (e.g. resource-description) of resource reservation container
	var resReservationModule = 'resource.reservation';
	// for translation of filter form of unassignal-bundles in Activity module
	var trsBundleModule = 'transportplanning.bundle';
	var trsRequisitionModule = 'transportplanning.requisition';
	var trsTransportModule = 'transportplanning.transport';
	var basSiteModule = 'basics.site';
	var modelViewerModule = 'model.viewer';
	var modelSimulationModule = 'model.simulation';

	angular.module(ppsActivityModule).factory('productionplanningActivityTranslationService', PpsActivityTranslationService);

	PpsActivityTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function PpsActivityTranslationService(platformTranslationUtilitiesService) {
		var service = {};

		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [ppsActivityModule, ppsMountingModule, ppsCommonModule, cloudCommonModule, ppsReportModule,
				customizeModule, projectCostCodesModule, estimateCommonModule, schedulingMainModule,
				schedulingScheduleModule, ppsItemModule,resMasterModule,resReservationModule,trsBundleModule,basSiteModule,
				ppsProductModule, trsRequisitionModule, trsTransportModule, modelViewerModule, modelSimulationModule]
		};

		data.words = {
			baseGroup: {location: ppsActivityModule, identifier: 'baseGroup', initial: 'Basic Data'},

			Code: {location: cloudCommonModule, identifier: 'entityCode', initial: '* Code'},
			Descriptioninfo: {location: cloudCommonModule, identifier: 'entityDescription', initial: '* Description'},
			ActStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: 'Status'},
			MntRequisitionFk: {
				location: ppsMountingModule,
				identifier: 'entityRequisition',
				initial: '* Mounting Requisition'
			},
			Remarks: {location: cloudCommonModule, identifier: 'entityRemark', initial: '* Remarks'},
			IsLive: {location: cloudCommonModule, identifier: 'entityIsLive', initial: '* Active'},
			EstWorkingHours: {
				location: ppsActivityModule,
				identifier: 'activity.Estworkinghours',
				initial: '* Planned Working Hours'
			},
			ActWorkingHours: {
				location: ppsActivityModule,
				identifier: 'activity.Actworkinghours',
				initial: '* Actual Working Hours'
			},

			leadingStructuresGroup: {
				location: ppsCommonModule,
				identifier: 'leadingStructuresGroup',
				initial: '*Leading StructuresGroup'
			},
			Assignment: {location: ppsCommonModule, identifier: 'assignment', initial: '*Assignment'},
			planInformation: {
				location: ppsCommonModule,
				identifier: 'event.planInformation',
				initial: '* Planning Information'
			},

			EventTypeFk: {location: ppsActivityModule, identifier: 'activity.eventTypeFk', initial: '* Activity Type'},
			PlannedStart: {location: ppsCommonModule, identifier: 'event.plannedStart', initial: '* Planned StartDate'},
			PlannedFinish: {
				location: ppsCommonModule,
				identifier: 'event.plannedFinish',
				initial: '* Planned FinishDate'
			},
			EarliestStart: {
				location: ppsCommonModule,
				identifier: 'event.earliestStart',
				initial: '* Earliest StartDate'
			},
			LatestStart: {location: ppsCommonModule, identifier: 'event.latestStart', initial: '* Latest StartDate'},
			EarliestFinish: {
				location: ppsCommonModule,
				identifier: 'event.earliestFinish',
				initial: '* Earliest FinishDate'
			},
			LatestFinish: {location: ppsCommonModule, identifier: 'event.latestFinish', initial: '* Latest FinishDate'},
			LicCostGroup1Fk: {location: customizeModule, identifier: 'licCostGroup1Fk', initial: '*CostGroup 1'},
			LicCostGroup2Fk: {location: customizeModule, identifier: 'licCostGroup2Fk', initial: '*CostGroup 2'},
			LicCostGroup3Fk: {location: customizeModule, identifier: 'licCostGroup3Fk', initial: '*CostGroup 3'},
			LicCostGroup4Fk: {location: customizeModule, identifier: 'licCostGroup4Fk', initial: '*CostGroup 4'},
			LicCostGroup5Fk: {location: customizeModule, identifier: 'licCostGroup5Fk', initial: '*CostGroup 5'},
			PrjCostGroup1Fk: {location: customizeModule, identifier: 'prjCostGroup1Fk', initial: '*PrjCostGroup1'},
			PrjCostGroup2Fk: {location: customizeModule, identifier: 'prjCostGroup2Fk', initial: '*PrjCostGroup2'},
			PrjCostGroup3Fk: {location: customizeModule, identifier: 'prjCostGroup3Fk', initial: '*PrjCostGroup3'},
			PrjCostGroup4Fk: {location: customizeModule, identifier: 'prjCostGroup4Fk', initial: '*PrjCostGroup4'},
			PrjCostGroup5Fk: {location: customizeModule, identifier: 'prjCostGroup5Fk', initial: '*PrjCostGroup5'},
			LgmJobFk: {location: projectCostCodesModule, identifier: 'lgmJobFk', initial: '*Logistic Job'},
			PrjLocationFk: {location: ppsCommonModule, identifier: 'prjLocationFk', initial: '*Location'},
			MdcControllingunitFk: {
				location: ppsCommonModule,
				identifier: 'mdcControllingUnitFk',
				initial: '*Controlling Unit'
			},
			PsdActivityFk: {location: ppsCommonModule, identifier: 'event.psdActivityFk', initial: '*PSD Activity'},
			ActualStart: {location: ppsCommonModule, identifier: 'event.actualStart', initial: '* Actual StartDate'},
			ActualFinish: {location: ppsCommonModule, identifier: 'event.actualFinish', initial: '* Actual FinishDate'},
			DateshiftMode: {location: ppsCommonModule, identifier: 'event.dateshiftMode', initial: '*DateShift Mode'}
		};

		//Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'Userdefined');


		//Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		//Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);

		return service;
	}
})(angular);

