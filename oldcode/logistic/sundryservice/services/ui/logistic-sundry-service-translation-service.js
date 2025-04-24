/**
 * Created by baf on 02.03.2018
 */

(function (angular) {

	'use strict';
	var logisticSundryServiceModule = 'logistic.sundryservice';
	var cloudCommonModule = 'cloud.common';

	/**
	 * @ngdoc service
	 * @name logisticSundryServiceTranslationService
	 * @description provides translation methods for logistic sundryService module
	 */
	angular.module(logisticSundryServiceModule).service('logisticSundryServiceTranslationService', LogisticSundryServiceTranslationService);

	LogisticSundryServiceTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function LogisticSundryServiceTranslationService(platformTranslationUtilitiesService) {
		var self = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [logisticSundryServiceModule, cloudCommonModule]
		};

		data.words = {
			IsManual: { location: logisticSundryServiceModule, identifier: 'isManual'},
			Specification: { location: cloudCommonModule, identifier: 'EntitySpec'},
			SundryServiceGroupFk: { location: cloudCommonModule, identifier: 'entityGroup'},
			PricePortion1: { location: logisticSundryServiceModule, identifier: 'pricePortion01'},
			PricePortion2: { location: logisticSundryServiceModule, identifier: 'pricePortion02'},
			PricePortion3: { location: logisticSundryServiceModule, identifier: 'pricePortion03'},
			PricePortion4: { location: logisticSundryServiceModule, identifier: 'pricePortion04'},
			PricePortion5: { location: logisticSundryServiceModule, identifier: 'pricePortion05'},
			PricePortion6: { location: logisticSundryServiceModule, identifier: 'pricePortion06'},
			PricePortionSum: { location: logisticSundryServiceModule, identifier: 'pricePortionSum'},
			ValidFrom: { location: cloudCommonModule, identifier: 'entityValidFrom'},
			ValidTo: { location: cloudCommonModule, identifier: 'entityValidTo'},
			CommentText: { location: cloudCommonModule, identifier: 'entityComment'},
			CurrencyFk: { location: cloudCommonModule, identifier: 'entityCurrency'}
		};

		// Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);

		// Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		// Prepare interface of service and load translations
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addTranslationServiceInterface(self, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}
})(angular);