(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name productionSetTranslationService
	 * @function
	 *
	 * @description
	 * productionSetTranslationService is the data service for all Production Set related functionality.
	 * */
	var cloudCommonModule = 'cloud.common';
	var basicsSiteModule = 'basics.site';
	var customizeModule = 'basics.customize';
	var moduleName = 'productionplanning.productionset';
	var ppsCommonModule = 'productionplanning.common';
	var ppsFabricationUnit = 'productionplanning.fabricationunit';

	var productionSetModul = angular.module(moduleName);

	productionSetModul.factory('productionplanningProductionsetTranslationService', ProductionSetTranslationService);
	ProductionSetTranslationService.$inject = ['platformTranslationUtilitiesService', 'ppsCommonCustomColumnsServiceFactory'];

	function ProductionSetTranslationService(platformTranslationUtilitiesService, customColumnsServiceFactory) {
		var service = {};

		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [moduleName, cloudCommonModule, basicsSiteModule, ppsCommonModule, ppsFabricationUnit]
		};

		data.words = {
			//custom module
			productionGroup: {location: moduleName, identifier: 'productionGroup', initial: 'Production'},
			EventTypeFk: { location: moduleName, identifier: 'entityEventTypeFk', initial: '*Productionset Type' },
			// site module
			SiteFk: {location: basicsSiteModule, identifier: 'entitySite', initial: 'Site'},
			// cloud common module
			Quantity: {location: cloudCommonModule, identifier: 'entityQuantity', initial: '*Quantity'},
			BasUomFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: '*UoM'},
			PpsProdSetStatusFk: {location: cloudCommonModule, identifier: 'entityStatus', initial: '*Status'},
			CommentText: {location: cloudCommonModule, identifier: 'entityComment', initial: '*Comments'},
			// customize module
			IsLive: {location: customizeModule, identifier: 'islive', initial: '*Is Live'},
			// ppsCommon module
			Assignment:{ location: ppsCommonModule, identifier: 'assignment', initial: '*Assignment' },
			planningInfoGroup: {location: ppsCommonModule, identifier: 'event.planInformation', initial: '*Planning Information'},
			PlannedStart: { location: ppsCommonModule, identifier: 'event.plannedStart', initial: '*Planned StartDate' },
			PlannedFinish: { location: ppsCommonModule, identifier: 'event.plannedFinish', initial: '*Planned FinishDate' },
			EarliestStart: { location: ppsCommonModule, identifier: 'event.earliestStart', initial: '*Earliest StartDate' },
			LatestStart: { location: ppsCommonModule, identifier: 'event.latestStart', initial: '*Latest StartDate' },
			EarliestFinish: { location: ppsCommonModule, identifier: 'event.earliestFinish', initial: '*Earliest FinishDate' },
			LatestFinish: { location: ppsCommonModule, identifier: 'event.latestFinish', initial: '*Latest FinishDate' },
			PrjLocationFk: { location: ppsCommonModule, identifier: 'prjLocationFk', initial: '*Location' },
			MdcControllingunitFk:{ location: ppsCommonModule, identifier: 'mdcControllingUnitFk', initial: '*Controlling Unit' },
			ActualQuantity: { location: ppsCommonModule, identifier: 'actualQuantity', initial: '*Actual Quantity' },
			RemainingQuantity: {location: ppsCommonModule, identifier: 'remainingQuantity', initial: '*Remaining Quantity'},
			basicData: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
			PpsProductionSetFk: { location: ppsCommonModule, identifier: 'product.productionSetFk', initial: '*Production Set' },
			PpsFabricationUnitFk: { location: ppsFabricationUnit, identifier: 'fabricationUnit', initial: '*Fabrication Unit' },
			DateshiftMode: { location: ppsCommonModule, identifier: 'event.dateshiftMode', initial: '*DateShift Mode' },

			ProductionSiteFk: { location: moduleName, identifier: 'productionSiteFk', initial: '*Production Site' },
			ProductionSetParentFk: { location: moduleName, identifier: 'productionSetParentFk', initial: '*Parent Production Set' },
			IsUserEditedValue: { location: moduleName, identifier: 'isUserEditedValue', initial: '*User Edited Value' },
		};

		var customColumnsService = customColumnsServiceFactory.getService(moduleName);
		customColumnsService.setTranslation(data.words);

		//Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefined');

		//Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		//Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);

		service.data = data;
		return service;
	}
})(angular);