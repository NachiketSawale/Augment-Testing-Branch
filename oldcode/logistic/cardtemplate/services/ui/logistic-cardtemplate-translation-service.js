(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	var logisticCardtemplateModule = 'logistic.cardtemplate';
	var basicsCommonModule = 'basics.common';
	var cloudCommonModule = 'cloud.common';
	var basicsCustomizeModule = 'basics.customize';
	var logisticCommonModule = 'logistic.common';

	/**
	 * @ngdoc service
	 * @name logisticCardtemplateTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(logisticCardtemplateModule).service('logisticCardTemplateTranslationService', LogisticCardTemplateTranslationService);

	LogisticCardTemplateTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function LogisticCardTemplateTranslationService(platformTranslationUtilitiesService) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [logisticCardtemplateModule, basicsCommonModule, cloudCommonModule, basicsCustomizeModule, logisticCommonModule]
		};

		data.words = {
			UomFk:{ location: cloudCommonModule, identifier: 'entityUoM'},
			JobCardRecordTypeFk: { location: basicsCustomizeModule, identifier: 'jobcardrecordtype'},
			CardRecordFk: { location: logisticCardtemplateModule, identifier: 'cardRecord'},
			WorkOperationTypeFk: { location: logisticCardtemplateModule, identifier: 'workOperationTypeFk'},
			CardRecordDescription: {location: logisticCardtemplateModule, identifier: 'cardRecordDescription'},
			ResourceFk:{ location: logisticCardtemplateModule, identifier: 'entitiyResource'},
			JobCardDocumentTypeFk:{ location: logisticCardtemplateModule, identifier: 'jobCardDocumentTypeFk'},
			DocumentTypeFk: { location: cloudCommonModule, identifier: 'entityType'},
			Date: {location: cloudCommonModule, identifier: 'entityDate'},
			Barcode: {location: logisticCardtemplateModule, identifier: 'barcode'},
			FileArchiveDocFk: {location: logisticCardtemplateModule, identifier: 'fileArchiveDocFk'},
			OriginFileName: {location: logisticCardtemplateModule, identifier: 'originFileName'},
			RubricCategoryFk: {location: logisticCardtemplateModule, identifier: 'rubricCategory'},
			Url: { location: logisticCardtemplateModule, identifier: 'url', initial: 'Url' }
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
