/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	//Modules, beside my own in alphabetic order
	var currentModule = 'productionplanning.fabricationunit';
	var basicsCommonModule = 'basics.common';
	var cloudCommonModule = 'cloud.common';
	var resourceMasterModule = 'resource.master';
	var ppsCommonModule = 'productionplanning.common';
	var basicsSiteModule = 'basics.site';
	var ppsEngineeringModule = 'productionplanning.engineering';
	var ppsProductModule = 'productionplanning.product';
	var ppsItemModule = 'productionplanning.item';


	/**
	 * @ngdoc service
	 * @name productionplanningFabricationunitTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(currentModule).service('ppsFabricationunitTranslationService', ProductionplanningFabricationunitTranslationService);

	ProductionplanningFabricationunitTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ProductionplanningFabricationunitTranslationService(platformTranslationUtilitiesService) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [currentModule, basicsCommonModule, cloudCommonModule, resourceMasterModule, ppsCommonModule, basicsSiteModule, ppsEngineeringModule, ppsProductModule]
		};

		data.words = {
			ExternalCode: { location: resourceMasterModule, identifier: 'externalCode', initial: '*External Code' },
			PpsProductionSetMainFk: { location: ppsCommonModule, identifier: 'product.productionSetFk', initial: '*Production Set' },
			BasSiteFk: {location: basicsSiteModule, identifier: 'entitySite', initial: '*Site'},
			PpsProdPlaceTypeFk: { location: currentModule, identifier: 'prodPlaceType', initial: '*Production Place Type' },
			PpsProductionPlaceFk: { location: currentModule, identifier: 'prodPlace', initial: '*Production Place' },
			planningInfoGroup: {location: ppsCommonModule, identifier: 'event.planInformation', initial: '*Planning Information'},
			PlannedStart: { location: ppsCommonModule, identifier: 'event.plannedStart', initial: '*Planned StartDate' },
			PlannedFinish: { location: ppsCommonModule, identifier: 'event.plannedFinish', initial: '*Planned FinishDate' },
			EarliestStart: { location: ppsCommonModule, identifier: 'event.earliestStart', initial: '*Earliest StartDate' },
			LatestStart: { location: ppsCommonModule, identifier: 'event.latestStart', initial: '*Latest StartDate' },
			EarliestFinish: { location: ppsCommonModule, identifier: 'event.earliestFinish', initial: '*Earliest FinishDate' },
			LatestFinish: { location: ppsCommonModule, identifier: 'event.latestFinish', initial: '*Latest FinishDate' },
			basicData: {location: cloudCommonModule, identifier: 'entityProperties', initial: '*Basic Data'},
			Quantity: {location: ppsEngineeringModule, identifier: 'entityPlannedQuantity', initial: '*Planned Quantity'},
			ActualQuantity: { location: ppsCommonModule, identifier: 'actualQuantity', initial: '*Actual Quantity' },
			RemainingQuantity: {location: ppsCommonModule, identifier: 'remainingQuantity', initial: '*Remaining Quantity'},
			EventTypeFk: { location: currentModule, identifier: 'entityEventTypeFk', initial: '*Fabrication Unit Type' },
			PpsProductFk: { location: ppsCommonModule, identifier: 'event.productFk', initial: '*PPS Product' },
			PositionX: {location: ppsProductModule, identifier: 'productionPlace.positionX', initial: '*PositionX'},
			PositionY: {location: ppsProductModule, identifier: 'productionPlace.positionY', initial: '*PositionY'},
			PositionZ: {location: ppsProductModule, identifier: 'productionPlace.positionZ', initial: '*PositionZ'},
			ProjectId: { location: ppsCommonModule, identifier: 'prjProjectFk', initial: '*Project No' },
			PpsItemId: { location: currentModule, identifier: 'structure.ppsItem', initial: '*Planning Unit' },
			PpsHeaderId: { location: currentModule, identifier: 'structure.ppsHeader', initial: '*Planning Header' },
			DateshiftMode: {location: ppsCommonModule, identifier: 'event.dateshiftMode', initial: '*DateShift Mode'},
			SlabNumber: { location: currentModule, identifier: 'nesting.slabNumber', initial: '*Slab Number' },
			AngleA: { location: currentModule, identifier: 'nesting.angleA', initial: '*AngleA' },
			AngleB: { location: currentModule, identifier: 'nesting.angleB', initial: '*AngleB' },
			AngleC: { location: currentModule, identifier: 'nesting.angleC', initial: '*AngleC' },
			PpsStrandPatternFk: { location: currentModule, identifier: 'entityPpsStrandPatternFk', initial: '*Strand Pattern'},
			CommentText: { location: cloudCommonModule, identifier: 'entityComment'},
			EngDrawingFk: { location: ppsCommonModule, identifier: 'product.drawing', initial: '*Drawing' },
			PpsItemFk: {location: ppsCommonModule, identifier: 'event.itemFk', initial: '*Production Unit'},
			BasUomFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: '*UoM'}
		};

		//Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefined');

		//Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		//Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
