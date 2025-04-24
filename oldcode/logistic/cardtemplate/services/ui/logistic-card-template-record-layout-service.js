/**
 * Created by baf on 19.03.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.cardtemplate';

	/**
	 * @ngdoc controller
	 * @name logisticCardTemplateRecordLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic cardTemplate record entity.
	 **/
	angular.module(moduleName).service('logisticCardTemplateRecordLayoutService', LogisticCardTemplateRecordLayoutService);

	LogisticCardTemplateRecordLayoutService.$inject = ['platformUIConfigInitService', 'logisticCardtemplateContainerInformationService', 'logisticCardTemplateConstantValues', 'logisticCardTemplateTranslationService'];

	function LogisticCardTemplateRecordLayoutService(platformUIConfigInitService, logisticCardtemplateContainerInformationService, logisticCardTemplateConstantValues, logisticCardTemplateTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticCardtemplateContainerInformationService.getCardTemplateRecordLayout(),
			dtoSchemeId: logisticCardTemplateConstantValues.schemes.cardTemplateRecord,
			translator: logisticCardTemplateTranslationService
		});
	}
})(angular);