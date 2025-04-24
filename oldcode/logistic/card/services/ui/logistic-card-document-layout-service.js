(function (angular) {
	'use strict';
	var moduleName = 'logistic.card';

	/**
	 * @ngdoc controller
	 * @name logisticCardDocumentLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic card document entity.
	 **/
	angular.module(moduleName).service('logisticCardDocumentLayoutService', LogisticCardDocumentLayoutService);

	LogisticCardDocumentLayoutService.$inject = ['platformUIConfigInitService', 'logisticCardContainerInformationService', 'logisticCardConstantValues', 'logisticCardTranslationService'];

	function LogisticCardDocumentLayoutService(platformUIConfigInitService, logisticCardContainerInformationService, logisticCardConstantValues, logisticCardTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticCardContainerInformationService.getCardDocumentLayout(),
			dtoSchemeId: logisticCardConstantValues.schemes.carddocument,
			translator: logisticCardTranslationService
		});
	}
})(angular);