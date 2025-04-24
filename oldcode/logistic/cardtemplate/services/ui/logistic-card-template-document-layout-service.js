(function (angular) {
	'use strict';
	var moduleName = 'logistic.card';

	/**
	 * @ngdoc controller
	 * @name logisticCardTemplateDocumentLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic card document entity.
	 **/
	angular.module(moduleName).service('logisticCardTemplateDocumentLayoutService', LogisticCardTemplateDocumentLayoutService);

	LogisticCardTemplateDocumentLayoutService.$inject = ['platformUIConfigInitService', 'logisticCardtemplateContainerInformationService', 'logisticCardTemplateConstantValues', 'logisticCardTemplateTranslationService'];

	function LogisticCardTemplateDocumentLayoutService(platformUIConfigInitService, logisticCardtemplateContainerInformationService, logisticCardTemplateConstantValues, logisticCardTemplateTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticCardtemplateContainerInformationService.getCardTemplateDocumentLayout(),
			dtoSchemeId: logisticCardTemplateConstantValues.schemes.cardTemplateDocument,
			translator: logisticCardTemplateTranslationService
		});
	}
})(angular);