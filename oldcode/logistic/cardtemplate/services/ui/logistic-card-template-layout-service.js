/**
 * Created by baf on 19.03.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.cardtemplate';

	/**
	 * @ngdoc controller
	 * @name logisticCardTemplateLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic cardTemplate cardTemplate entity.
	 **/
	angular.module(moduleName).service('logisticCardTemplateLayoutService', LogisticCardTemplateLayoutService);

	LogisticCardTemplateLayoutService.$inject = ['platformUIConfigInitService', 'logisticCardtemplateContainerInformationService', 'logisticCardTemplateConstantValues', 'logisticCardTemplateTranslationService'];

	function LogisticCardTemplateLayoutService(platformUIConfigInitService, logisticCardtemplateContainerInformationService, logisticCardTemplateConstantValues, logisticCardTemplateTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticCardtemplateContainerInformationService.getCardTemplateLayout(),
			dtoSchemeId: logisticCardTemplateConstantValues.schemes.cardTemplate,
			translator: logisticCardTemplateTranslationService
		});
	}
})(angular);