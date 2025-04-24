/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	//Modules, beside my own in alphabetic order
	var ppsFormulaConfigurationModule = 'productionplanning.formulaconfiguration';
	var basicsCommonModule = 'basics.common';
	var cloudCommonModule = 'cloud.common';
	const ppsCommonModule = 'productionplanning.common'; // for planned quantity slot, we need to add this module. by zwz on 2022/9/29 for ticket 135004
	const boqMainModule = 'boq.main'; // for translation of Reference and Brief, we need to add this module. by zwz on 2025/3/4 for ticket dev-35685

	/**
	 * @ngdoc service
	 * @name productionPlanningFormulaConfigurationTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(ppsFormulaConfigurationModule).service('productionPlanningFormulaConfigurationTranslationService', ProductionPlanningFormulaConfigurationTranslationService);

	ProductionPlanningFormulaConfigurationTranslationService.$inject = ['platformTranslationUtilitiesService', 'ppsCommonCustomColumnsServiceFactory'];

	function ProductionPlanningFormulaConfigurationTranslationService(platformTranslationUtilitiesService, customColumnsServiceFactory) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [ppsFormulaConfigurationModule, basicsCommonModule, cloudCommonModule, ppsCommonModule, boqMainModule]
		};

		data.words = {
			CommentText: { location: ppsFormulaConfigurationModule, identifier: 'CommentText', initial: '*Comment Text' },
			FormulaVersion: { location: ppsFormulaConfigurationModule, identifier: 'FormulaVersion', initial: '*Formula Version' },
			Status: {location: cloudCommonModule, identifier: 'entityStatus', initial: '*Status'},
			IsLive: {location: cloudCommonModule, identifier: 'entityIsLive', initial: '*IsLive'},
			PpsParameterFk: { location: ppsFormulaConfigurationModule, identifier: 'PpsParameterFk', initial: '*Parameter' },
			PpsFormulaInstanceFk: { location: ppsFormulaConfigurationModule, identifier: 'PpsFormulaInstanceFk', initial: '*Formula Instance' },
			PpsProductDescriptionFk: { location: ppsFormulaConfigurationModule, identifier: 'PpsProductDescriptionFk', initial: '*Product Description' },
			Value: { location: ppsFormulaConfigurationModule, identifier: 'ppsParameter.Value', initial: '*Value' },

			VariableName: {location: ppsFormulaConfigurationModule, identifier: 'ppsParameter.variableName', initial: '*Variable Name'},
			PpsFormulaVersionFk: {location: ppsFormulaConfigurationModule, identifier: 'ppsParameter.ppsFormulaVersionFk', initial: '*Formula Version'},
			BasDisplayDomainFk: {location: ppsFormulaConfigurationModule, identifier: 'ppsParameter.basDisplayDomainFk', initial: '*Display Domain'},
			BoqHeaderFk: { location: ppsFormulaConfigurationModule, identifier: 'plannedQuantity.boqHeader', initial: '*BoQ Header' },
			EstHeaderFk: { location: ppsFormulaConfigurationModule, identifier: 'plannedQuantity.estHeader', initial: '*Estimate Header' },
			BasUomFk: { location: cloudCommonModule, identifier: 'entityUoM', initial: '*UoM' },
			ResourceTypeFk: { location: ppsFormulaConfigurationModule, identifier: 'plannedQuantity.sourceType', initial: '*Source Type' },
			BoQEstItemResFk: { location: ppsFormulaConfigurationModule, identifier: 'plannedQuantity.source', initial: '*Source' },
			PpsPlannedQuantityTypeFk: { location: ppsFormulaConfigurationModule, identifier: 'plannedQuantity.PpsPlannedQuantityTypeFk', initial: '*Quantity Type' },
			PropertyMaterialCostcodeFk: { location: ppsFormulaConfigurationModule, identifier: 'plannedQuantity.target', initial: '*Material/CostCode/Property' },
			MdcProductDescriptionFk: {location: ppsFormulaConfigurationModule, identifier: 'plannedQuantity.mdcProductDescriptionFk', initial: '*Material Product Template'},
			PrjLocationFk: { location: ppsCommonModule, identifier: 'prjLocationFk', initial: 'Location' },
			DueDate: { location: basicsCommonModule, identifier: 'entityDueDate', initial: '*DueDate' },
			SourceCode1: {location: ppsFormulaConfigurationModule, identifier: 'plannedQuantity.sourceCode1', initial: '*Source Code1'},
			SourceCode2: {location: ppsFormulaConfigurationModule, identifier: 'plannedQuantity.sourceCode2', initial: '*Source Code2'},
			SourceCode3: {location: ppsFormulaConfigurationModule, identifier: 'plannedQuantity.sourceCode3', initial: '*Source Code3'},
			InternalPrice: {location: ppsFormulaConfigurationModule, identifier: 'plannedQuantity.internalPrice', initial: '*Internal Price'},
			ExternalPrice: {location: ppsFormulaConfigurationModule, identifier: 'plannedQuantity.externalPrice', initial: '*External Price'},
			Reference: {location: boqMainModule, identifier: 'Reference', initial: '*Reference No.'},
			Brief: {location: boqMainModule, identifier: 'BriefInfo', initial: '*Outline Specification'},
			BillingQuantity: { location: ppsCommonModule, identifier: 'product.billQuantity', initial: '*Bill Quantity' },
			BasUomBillFk: { location: ppsCommonModule, identifier: 'product.billUoM', initial: '*Bill Uom' },
			IsChargeable: { location: ppsFormulaConfigurationModule, identifier: 'plannedQuantity.isChargeable', initial: '*IsChargeable' }
		};

		//Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'Userdefined');

		//Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		//Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);

		service.setTranslationForCustomColumns = function () {
			// update data.words with customColumns words
			var customColumnsService = customColumnsServiceFactory.getServiceForPlnQty(ppsFormulaConfigurationModule);
			customColumnsService.setTranslation(data.words);
			// for translations of customColumns, we need to "override" corresponding settings of current service
			// 1. reset data.toTranslate
			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);
			// 2. reset interface of service with data
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			// 3. reload translations with data
			platformTranslationUtilitiesService.loadModuleTranslation(data);
		};
	}

})(angular);
