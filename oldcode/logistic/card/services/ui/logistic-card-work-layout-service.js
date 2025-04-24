/**
 * Created by shen on 6/15/2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.card';

	/**
	 * @ngdoc controller
	 * @name logisticCardWorkLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic card work entity.
	 **/
	angular.module(moduleName).service('logisticCardWorkLayoutService', LogisticCardWorkLayoutService);

	LogisticCardWorkLayoutService.$inject = ['platformUIConfigInitService', 'logisticCardContainerInformationService', 'logisticCardConstantValues', 'logisticCardTranslationService'];

	function LogisticCardWorkLayoutService(platformUIConfigInitService, logisticCardContainerInformationService, logisticCardConstantValues, logisticCardTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticCardContainerInformationService.getCardWorkLayout(),
			dtoSchemeId: logisticCardConstantValues.schemes.work,
			translator: logisticCardTranslationService
		});
	}
})(angular);