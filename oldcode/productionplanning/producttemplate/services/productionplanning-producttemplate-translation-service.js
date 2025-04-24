/**
 * Created by zwz on 5/6/2019.
 */

(function (angular) {
	'use strict';

	var currentModule = 'productionplanning.producttemplate';
	var cloudCommonModule = 'cloud.common';
	var ppsCommonModule = 'productionplanning.common';
	var stockModule = 'procurement.stock';
	var engineeringModule = 'productionplanning.engineering';
	var ppsMaterialModule = 'productionplanning.ppsmaterial';
	var ppsStrandpatternModule = 'productionplanning.strandpattern';
	var ppsFormulaConfigurationModule = 'productionplanning.formulaconfiguration';
	var ppsProductModule = 'productionplanning.product';

	/**
	 * @ngdoc service
	 * @name productionplanningProducttemplateTranslationService
	 * @description provides translation for product templates module
	 */
	angular.module(currentModule).factory('productionplanningProducttemplateTranslationService', TranslationService);

	TranslationService.$inject = ['platformTranslationUtilitiesService'];

	function TranslationService(platformTranslationUtilitiesService) {
		var service = {};

		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [currentModule, cloudCommonModule, ppsCommonModule, stockModule, engineeringModule, ppsMaterialModule,
				ppsStrandpatternModule, ppsFormulaConfigurationModule, ppsProductModule]
		};

		data.words = {
			baseGroup: {location: cloudCommonModule, identifier: 'entityProperties', initial: '*Basic Data'},
			Code: {location: cloudCommonModule, identifier: 'entityCode', initial: '*Code'},
			DescriptionInfo: {location: cloudCommonModule, identifier: 'entityDescription', initial: '*Description'},
			Quantity: {location: cloudCommonModule, identifier: 'entityQuantity', initial: '*Quantity'},
			UomFk: {location: cloudCommonModule, identifier: 'entityUoM', initial: '*UoM'},
			Sorting: {location: cloudCommonModule, identifier: 'entitySorting', initial: '*Sorting'},
			InstallationSequence : {location: cloudCommonModule, identifier: 'installationSequence', initial: '*Installation Sequence'},

			EngTaskFk: { location: engineeringModule, identifier: 'entityEngTaskFk', initial: '*Task' },
			EngDrawingFk: { location: currentModule, identifier: 'entityEngDrawingFk', initial: '*Drawing' },
			MaterialFk: {location: currentModule, identifier: 'entityMaterialFk', initial: '*Material'},
			VariableName: {location: currentModule, identifier: 'entityVariableName', initial: '*Variable Name'},

			dimensions: {location: ppsCommonModule, identifier: 'product.dimensions', initial: '*Dimentions'},
			Length: {location: ppsCommonModule, identifier: 'product.length', initial: '*Length'},
			Width: {location: ppsCommonModule, identifier: 'product.width', initial: '*Width'},
			Height: {location: ppsCommonModule, identifier: 'product.height', initial: '*Height'},
			Weight: {location: ppsCommonModule, identifier: 'product.weight', initial: '*Weight'},
			Weight2: {location: ppsCommonModule, identifier: 'product.weight2', initial: '*Weight2'},
			Weight3: {location: ppsCommonModule, identifier: 'product.weight3', initial: '*Weight3'},
			Area: {location: ppsCommonModule, identifier: 'product.area', initial: '*Area'},
			Area2: {location: ppsCommonModule, identifier: 'product.area2', initial: '*Area2'},
			Area3: {location: ppsCommonModule, identifier: 'product.area3', initial: '*Area3'},
			Volume: {location: ppsCommonModule, identifier: 'product.volume', initial: '*Volume'},
			Volume2: {location: ppsCommonModule, identifier: 'product.volume2', initial: '*Volume2'},
			Volume3: {location: ppsCommonModule, identifier: 'product.volume3', initial: '*Volume3'},
			UomLengthFk: { location: ppsCommonModule, identifier: 'product.lengthUoM', initial: '*Length UoM' },
			UomWidthFk: { location: ppsCommonModule, identifier: 'product.widthUoM', initial: '*Width UoM' },
			UomHeightFk: { location: ppsCommonModule, identifier: 'product.heightUoM', initial: '*Height UoM' },
			UomWeightFk: { location: ppsCommonModule, identifier: 'product.weightUoM', initial: '*Weight UoM' },
			UomAreaFk: { location: ppsCommonModule, identifier: 'product.areaUoM', initial: '*Area UoM' },
			UomVolumeFk: { location: ppsCommonModule, identifier: 'product.volumeUoM', initial: '*Volume UoM' },
			BillingQuantity: { location: ppsCommonModule, identifier: 'product.billQuantity', initial: '*Bill Quantity' },
			UomBillFk: { location: ppsCommonModule, identifier: 'product.billUoM', initial: '*Bill Uom' },
			EngStackFk: { location: currentModule, identifier: 'entityStack', initial: '*Stack' },
			StackCode: { location: currentModule, identifier: 'stackCode', initial: '*Stack Code' },
			Level: {location: currentModule, identifier: 'level', initial: '*Level'},
			SortCode: {location: currentModule, identifier: 'sortCode', initial: '*Sort Code'},
			Number4Stack: {location: currentModule, identifier: 'number4Stack', initial: '*Number in Stack'},
			Number4Plan: {location: currentModule, identifier: 'number4Plan', initial: '*Number in Plan'},
			DbId:{location: ppsCommonModule, identifier: 'summary', initial: '*Summary'},
			propertiesGroup : {location: ppsMaterialModule, identifier: 'productDescription.propertiesGroup', initial: '*Properties'},
			IsolationVolume : {location: ppsMaterialModule, identifier: 'productDescription.isolationVolume', initial: '*Isolation Volume'},
			ConcreteVolume : {location: ppsMaterialModule, identifier: 'productDescription.concreteVolume', initial: '*Concrete Volume'},
			ConcreteQuality : {location: ppsMaterialModule, identifier: 'productDescription.concreteQuality', initial: '*Concrete Quality'},
			Guid: {location: currentModule, identifier: 'GUID', initial: '*GUID'},
			UserdefinedByMaterial1: {location: currentModule, identifier: 'userdefinedbymaterial1', initial: '*Text By Material 1'},
			UserdefinedByMaterial2: {location: currentModule, identifier: 'userdefinedbymaterial2', initial: '*Text By Material 2'},
			UserdefinedByMaterial3: {location: currentModule, identifier: 'userdefinedbymaterial3', initial: '*Text By Material 3'},
			UserdefinedByMaterial4: {location: currentModule, identifier: 'userdefinedbymaterial4', initial: '*Text By Material 4'},
			UserdefinedByMaterial5: {location: currentModule, identifier: 'userdefinedbymaterial5', initial: '*Text By Material 5'},
			PpsStrandPatternFk: { location: ppsStrandpatternModule, identifier: 'entityStrandPattern', initial: '*Strand Pattern'},

			MdcProductDescriptionFk : {location: ppsMaterialModule, identifier: 'productDescription.entityMdcProductDescription', initial: '*Mdc Product Description'},
			PpsFormulaVersionFk: {location: ppsFormulaConfigurationModule, identifier: 'ppsParameter.ppsFormulaVersionFk', initial: '*Formula Version'},
			InstallSequence : {location: currentModule, identifier: 'productsInstallationSequence', initial: '*Products Installation Sequence No.'},
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
