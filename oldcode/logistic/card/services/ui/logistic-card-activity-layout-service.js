/**
 * Created by baf on 18.03.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.card';

	/**
	 * @ngdoc controller
	 * @name logisticCardActivityLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic card activity entity.
	 **/
	angular.module(moduleName).service('logisticCardActivityLayoutService', LogisticCardActivityLayoutService);

	LogisticCardActivityLayoutService.$inject = ['platformUIConfigInitService', 'logisticCardContainerInformationService', 'logisticCardConstantValues', 'logisticCardTranslationService'];

	function LogisticCardActivityLayoutService(platformUIConfigInitService, logisticCardContainerInformationService, logisticCardConstantValues, logisticCardTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticCardContainerInformationService.getActivityLayout(),
			dtoSchemeId: logisticCardConstantValues.schemes.activity,
			translator: logisticCardTranslationService
		});
	}
})(angular);