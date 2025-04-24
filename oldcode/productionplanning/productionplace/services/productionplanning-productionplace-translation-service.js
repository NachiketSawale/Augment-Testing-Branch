/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'productionplanning.productionplace';

	const basicsCommonModule = 'basics.common';
	const cloudCommonModule = 'cloud.common';
	const ppsCommonModule = 'productionplanning.common';
	const siteModule = 'basics.site';
	const resourceMasterModule = 'resource.master';

	angular.module(moduleName).service('productionplanningProductionPlaceTranslationService', translationService);

	translationService.$inject = ['platformTranslationUtilitiesService'];

	function translationService(platformTranslationUtilitiesService) {
		const service = this;
		const data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [moduleName, basicsCommonModule, cloudCommonModule, ppsCommonModule, siteModule, resourceMasterModule]
		};

		data.words = {
			Code: {location: cloudCommonModule, identifier: 'entityCode', initial: '*Code'},
			PpsProdPlaceTypeFk: {location: cloudCommonModule, identifier: 'entityType', initial: '*Type'},
			BasSiteFk: {location: siteModule, identifier: 'SiteFk', initial: '*Site'},
			PositionX: {location: moduleName, identifier: 'positionX', initial: '*PositionX'},
			PositionY: {location: moduleName, identifier: 'positionY', initial: '*PositionY'},
			PositionZ: {location: moduleName, identifier: 'positionZ', initial: '*PositionZ'},
			dimensions: { location: ppsCommonModule, identifier: 'product.dimensions', initial: 'Dimensions' },
			Length: { location: ppsCommonModule, identifier: 'product.length', initial: '*Length' },
			Width: { location: ppsCommonModule, identifier: 'product.width', initial: '*Width' },
			Height: { location: ppsCommonModule, identifier: 'product.height', initial: '*Height' },
			BasUomLengthFk: { location: ppsCommonModule, identifier: 'product.lengthUoM', initial: '*Length UoM' },
			BasUomWidthFk: { location: ppsCommonModule, identifier: 'product.widthUoM', initial: '*Width UoM' },
			BasUomHeightFk: { location: ppsCommonModule, identifier: 'product.heightUoM', initial: '*Height UoM' },
			ResResourceFk: {location: resourceMasterModule, identifier: 'entityResource', initial: '*Resource'},
			IsLive: { location: cloudCommonModule, identifier: 'entityIsLive', initial: '*IsLive' },
			Sorting: { location: cloudCommonModule, identifier: 'entitySorting', initial: '*Sorting' },
			StartDate: {location: moduleName, identifier: 'maintenance.startDate', initial: '*Start Date'},
			EndDate: {location: moduleName, identifier: 'maintenance.endDate', initial: '*End Date'},
			CommentText: { location: cloudCommonModule, identifier: 'entityComment'},
			baseGroup: {location: cloudCommonModule, identifier: 'entityBaseGroup', initial: 'Base Group'},
		};

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);

		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}

})(angular);
