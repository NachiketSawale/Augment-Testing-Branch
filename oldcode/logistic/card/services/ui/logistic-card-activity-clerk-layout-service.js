/**
 * Created by Shankar on 11.08.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.card';

	/**
	 * @ngdoc controller
	 * @name logisticCardActivityClerkLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of logistic card clerk entity.
	 **/
	angular.module(moduleName).service('logisticCardActivityClerkLayoutService', LogisticCardActivityClerkLayoutService);

	LogisticCardActivityClerkLayoutService.$inject = ['platformUIConfigInitService', 'logisticCardContainerInformationService', 'logisticCardConstantValues', 'logisticCardTranslationService'];

	function LogisticCardActivityClerkLayoutService(platformUIConfigInitService, logisticCardContainerInformationService, logisticCardConstantValues, logisticCardTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticCardContainerInformationService.getCardActivityClerkLayout(),
			dtoSchemeId: logisticCardConstantValues.schemes.cardactivityclerk,
			translator: logisticCardTranslationService
		});
	}
})(angular);