
(function (angular) {
	'use strict';

	// Modules, beside my own in alphabetic order
	var procurementOrderProposalsModule = 'procurement.orderproposals';

	/**
	 * @ngdoc service
	 * @name procurementOrderProposalsTranslationService
	 * @description Provides translations for the module.
	 */

	/* jshint -W106 */ // variable name is forced by translation json file
	angular.module(procurementOrderProposalsModule).factory('procurementOrderProposalsTranslationService', ['platformUIBaseTranslationService', '$q',
		'procurementStockLayout', 'procurementStockStockTotalLayout', 'procurementStockTransactionLayout', 'procurementOrderProposalsLayout',
		function procurementOrderProposalsTranslationService(PlatformUIBaseTranslationService, $q, procurementStockLayout, procurementStockStockTotalLayout, procurementStockTransactionLayout, procurementOrderProposalsLayout) {
			function MyTranslationService(layout) {
				PlatformUIBaseTranslationService.call(this, layout);
			}

			MyTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
			MyTranslationService.prototype.constructor = MyTranslationService;

			var service = new MyTranslationService(
				[
					procurementStockLayout,
					procurementStockStockTotalLayout,
					procurementStockTransactionLayout,
					procurementOrderProposalsLayout
				]
			);

			// for container information service use
			service.loadTranslations = function loadTranslations() {
				return $q.when(false);
			};

			return service;
		}]);
/*
* angular.module(procurementOrderProposalsModule).service('procurementOrderProposalsTranslationService', ProcurementOrderProposalsTranslationService);

	ProcurementOrderProposalsTranslationService.$inject = ['platformTranslationUtilitiesService'];

	function ProcurementOrderProposalsTranslationService(platformTranslationUtilitiesService) {
		var service = this;
		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [procurementOrderProposalsModule, basicsCommonModule, cloudCommonModule]
		};

		data.words = {
			// Word: { location: procurementOrderProposalsModule, identifier: 'key', initial: 'English' }
		};

		//Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);

		//Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		//Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);
	}
* */
})(angular);
