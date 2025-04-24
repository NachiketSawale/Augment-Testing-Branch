(function (angular) {
	'use strict';

	var currentModule = 'productionplanning.engineering';
	var customizeModule = 'basics.customize';
	var basicsCommonModule = 'basics.common';
	var basicsUserformModule = 'basics.userform';
	var cloudCommonModule = 'cloud.common';
	var modelMainModule = 'model.main';
	var ppsCommonModule = 'productionplanning.common';
	var projectCostCodesModule = 'project.costcodes';
	var siteModule = 'basics.site';
	var drawingModule = 'productionplanning.drawing';

	var estimateCommonModule = 'estimate.common';// for translation of (project)cost group1~5 list container
	var resMasterModule = 'resource.master';// for translation of column ResourceFk of resource reservation list container
	var resReservationModule = 'resource.reservation';// for translation of resource reservation list container
	var trsRequisitionModule = 'transportplanning.requisition';//just for translation of resource requisition dialog
	var projectMain = 'project.main'; //for translation of ProjectBusinessParnterContact container
	var documentProject = 'documents.project'; // for translation of projectDocument container
	/**
	 * @ngdoc service
	 * @name productionplanningEngineeringTranslationService
	 * @description provides translation for productionplanning engineering module
	 */
	angular.module(currentModule).factory('productionplanningEngineeringTranslationService', productionplanningEngineeringTranslationService);

	productionplanningEngineeringTranslationService.$inject = ['platformTranslationUtilitiesService', 'ppsCommonCustomColumnsServiceFactory'];

	function productionplanningEngineeringTranslationService(platformTranslationUtilitiesService, customColumnsServiceFactory) {
		var service = {};

		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [currentModule, basicsCommonModule, cloudCommonModule, customizeModule, modelMainModule, ppsCommonModule, projectCostCodesModule, siteModule, drawingModule,
				// additional used modules for additional containers from other modules
				estimateCommonModule, trsRequisitionModule, resMasterModule, resReservationModule, projectMain, documentProject, basicsUserformModule
			]
		};

		data.words = {
			// cloud common module
			basicData: { location: cloudCommonModule, identifier: 'entityProperties', initial: '*Basic Data' },
			baseGroup: {location: cloudCommonModule, identifier: 'entityProperties', initial: '*Basic Data'},
			Code: {location: cloudCommonModule, identifier: 'entityCode', initial: '*Code'},
			Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: '*Description'},
			Remark: {location: cloudCommonModule, identifier: 'entityRemarks', initial: '*Remarks'},
			ProjectFk: {location: cloudCommonModule, identifier: 'entityProjectNo', initial: '*Project No.'},
			EngStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: '*Status'},
			EngTaskStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: '*Status'},
			ProjectId: {location: cloudCommonModule, identifier: 'entityProject', initial: '*Project'},
			BusinessPartnerFk:{ location: cloudCommonModule, identifier: 'entityBusinessPartner', initial: 'Business Partner'},
			Quantity: {location: cloudCommonModule, identifier: 'entityQuantity', initial: '*Quantity'},
			BasUomFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: '*UoM'},
			// current module
			projectInfoGroup: {location: currentModule, identifier: 'projectInfoGroup', initial: '*Project Information'},
			EngTypeFk: {location: currentModule, identifier: 'entityEngTypeFk', initial: '*Engineering Type'},
			ClerkFk: {location: currentModule, identifier: 'entityClerkFk', initial: '*Engineering Planner'},
			ClerkRoleFk: {location: basicsCommonModule, identifier: 'entityClerkRole', initial: '*Clerk Role'},
			EngDrawingFk: { location: currentModule, identifier: 'entityEngDrawingFk', initial: '*Drawing' },
			EngTaskFk: {location: currentModule, identifier: 'entityEngTaskFk', initial: '*Task'},
			PerformanceDate: {location: currentModule, identifier: 'entityPerformanceDate', initial: '*Performance Date'},
			PlannedQuantity: {location: currentModule, identifier: 'entityPlannedQuantity', initial: '*Planned Quantity'},
			ActualQuantity: { location: currentModule, identifier: 'entityActualQuantity', initial: '*Actual Quantity' },
			RemainingQuantity: {location: currentModule, identifier: 'entityRemainingQuantity', initial: '*Remaining Quantity'},
			EngHeaderFk: {location: currentModule, identifier: 'entityEngHeader', initial: '*Engineering Header'},
			EventTypeFk: { location: currentModule, identifier: 'entityEventTypeFk', initial: '*Task Type' },
			// customize module
			IsLive: {location: customizeModule, identifier: 'islive', initial: '*Is Live'},
			LicCostGroup1Fk: { location: customizeModule, identifier: 'licCostGroup1Fk', initial: '*CostGroup1' },
			LicCostGroup2Fk: { location: customizeModule, identifier: 'licCostGroup2Fk', initial: '*CostGroup2' },
			LicCostGroup3Fk: { location: customizeModule, identifier: 'licCostGroup3Fk', initial: '*CostGroup3' },
			LicCostGroup4Fk: { location: customizeModule, identifier: 'licCostGroup4Fk', initial: '*CostGroup4' },
			LicCostGroup5Fk: { location: customizeModule, identifier: 'licCostGroup5Fk', initial: '*CostGroup5' },
			PrjCostGroup1Fk: { location: customizeModule, identifier: 'prjCostGroup1Fk', initial: '*Project CostGroup1' },
			PrjCostGroup2Fk: { location: customizeModule, identifier: 'prjCostGroup2Fk', initial: '*Project CostGroup2' },
			PrjCostGroup3Fk: { location: customizeModule, identifier: 'prjCostGroup3Fk', initial: '*Project CostGroup3' },
			PrjCostGroup4Fk: { location: customizeModule, identifier: 'prjCostGroup4Fk', initial: '*Project CostGroup4' },
			PrjCostGroup5Fk: { location: customizeModule, identifier: 'prjCostGroup5Fk', initial: '*Project CostGroup5' },
			// drawing module
			EngDrawingTypeFk: {location: drawingModule, identifier: 'engDrawingTypeFk', initial: '*Drawing Type'},
			// module module
			ModelFk: {location: modelMainModule, identifier: 'entityModel', initial: '*Model'},
			//projectCostCodes module
			LgmJobFk: {location: projectCostCodesModule, identifier: 'lgmJobFk', initial: '*Logistic Job'},
			// pps common module
			planningInfoGroup: {
				location: ppsCommonModule,
				identifier: 'event.planInformation',
				initial: '*Planning Information'
			},
			PPSItemFk: {location: ppsCommonModule, identifier: 'event.itemFk', initial: '*Production Unit'},
			leadingStructuresGroup: {
				location: ppsCommonModule,
				identifier: 'leadingStructuresGroup',
				initial: '*Leading StructuresGroup'
			},
			Assignment:{ location: ppsCommonModule, identifier: 'assignment', initial: '*Assignment' },
			PlannedStart: { location: ppsCommonModule, identifier: 'event.plannedStart', initial: 'Planned StartDate' },
			PlannedFinish: { location: ppsCommonModule, identifier: 'event.plannedFinish', initial: 'Planned FinishDate' },
			EarliestStart: { location: ppsCommonModule, identifier: 'event.earliestStart', initial: 'Earliest StartDate' },
			LatestStart: { location: ppsCommonModule, identifier: 'event.latestStart', initial: 'Latest StartDate' },
			EarliestFinish: { location: ppsCommonModule, identifier: 'event.earliestFinish', initial: 'Earliest FinishDate' },
			LatestFinish: { location: ppsCommonModule, identifier: 'event.latestFinish', initial: 'Latest FinishDate' },
			PrjLocationFk: { location: ppsCommonModule, identifier: 'prjLocationFk', initial: 'Location' },
			MdcControllingunitFk:{ location: ppsCommonModule, identifier: 'mdcControllingUnitFk', initial: '*Controlling Unit' },
			ActualStart: {location: ppsCommonModule, identifier: 'event.actualStart', initial: '* Actual StartDate'},
			ActualFinish: {location: ppsCommonModule, identifier: 'event.actualFinish', initial: '* Actual FinishDate'},
			// site module
			//SiteFk: {location: siteModule, identifier: 'entitySite', initial: 'Site'},
			SiteInfo: {location: siteModule, identifier: 'entitySite', initial: 'Site'},
			contactsGroup:{ location: ppsCommonModule, identifier: 'contactsGroup', initial: '*Contacts' },
			BusinessPartnerOrderFk:{ location: ppsCommonModule, identifier: 'businessPartnerOrderFk', initial: '*Business Partner Contract' },
			MaterialGroupFk:{ location: ppsCommonModule, identifier: 'materialGroupFk', initial: '*Material Group' },
			MdcMaterialFk: { location: ppsCommonModule, identifier: 'mdcMaterialFk', initial: '*Material' },
			PpsItemMaterialCodes: {location: currentModule, identifier: 'ppsItemMaterialCodes', initial: '*Planning Unit Materials'},
			LoginClerkRoles: { location: currentModule, identifier: 'loginClerkRoles', initial: '*Login Clerk Roles' },
			From: { location: ppsCommonModule, identifier: 'from', initial: '*From' },
			DateshiftMode: {location: ppsCommonModule, identifier: 'event.dateshiftMode', initial: '*DateShift Mode'},
			userFlagGroup: {location: ppsCommonModule, identifier: 'event.userFlagGroup', initial: '*Userdefined Flags'},
			UserFlag1: {location: ppsCommonModule, identifier: 'event.userflag1', initial: '*Userflag1'},
			UserFlag2: {location: ppsCommonModule, identifier: 'event.userflag2', initial: '*Userflag2'},
			LgmJobRecvFk: {location: currentModule, identifier: 'receivingJob', initial: '*Receiving Job'},
			BasClerkFk: {location: currentModule, identifier: 'entityClerkFk', initial: '*Engineering Planner'},
			ActualStartDate: {location: ppsCommonModule, identifier: 'event.actualStart', initial: '*Actual Start Date'},
			ActualEndDate: {location: ppsCommonModule, identifier: 'event.actualFinish', initial: '*Actual Finish Date'},
			IsManualQuantity: {location: currentModule, identifier: 'isManualQuantity', initial: '*Is Manual Quantity'},
			ValidFrom: {location: cloudCommonModule, identifier: 'entityValidFrom', initial: '*Valid From'},
			ValidTo: {location: cloudCommonModule, identifier: 'entityValidTo', initial: '*Valid To'},
			CommentText: {location: cloudCommonModule, identifier: 'entityComment', initial: '*Comment'},
			IsUpstreamDefined: {location: currentModule, identifier: 'isUpstreamDefined', initial: '*Upstream State'}
		};

		//Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'Userdefined');
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefined');

		//Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		//Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);

		service.setTranslationForCustomColumns = function () {
			// update data.words with customColumns words
			var customColumnsService = customColumnsServiceFactory.getService(currentModule);
			customColumnsService.setTranslation(data.words);
			// for translations of customColumns, we need to "override" corresponding settings of current service
			// 1. reset data.toTranslate
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);
			// 2. reset interface of service with data
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			// 3. reload translations with data
			platformTranslationUtilitiesService.loadModuleTranslation(data);
		};

		service.data = data;
		return service;
	}
})(angular);
