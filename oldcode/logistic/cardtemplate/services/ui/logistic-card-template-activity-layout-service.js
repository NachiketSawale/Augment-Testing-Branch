/**
 * Created by baf on 19.03.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.cardtemplate';

	/**
	 * @ngdoc controller
	 * @name logisticCardTemplateActivityLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic cardTemplate activity entity.
	 **/
	angular.module(moduleName).service('logisticCardTemplateActivityLayoutService', LogisticCardTemplateActivityLayoutService);

	LogisticCardTemplateActivityLayoutService.$inject = ['platformUIConfigInitService', 'logisticCardtemplateContainerInformationService', 'logisticCardTemplateConstantValues', 'logisticCardTemplateTranslationService'];

	function LogisticCardTemplateActivityLayoutService(platformUIConfigInitService, logisticCardtemplateContainerInformationService, logisticCardTemplateConstantValues, logisticCardTemplateTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticCardtemplateContainerInformationService.getCardTemplateActivityLayout(),
			dtoSchemeId: logisticCardTemplateConstantValues.schemes.cardTemplateActivity,
			translator: logisticCardTemplateTranslationService
		});
	}
})(angular);