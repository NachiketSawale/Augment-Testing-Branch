/**
 * Created by baf on 18.03.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.card';

	/**
	 * @ngdoc controller
	 * @name logisticCardLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic card entity.
	 **/
	angular.module(moduleName).service('logisticCardLayoutService', LogisticCardLayoutService);

	LogisticCardLayoutService.$inject = ['platformUIConfigInitService', 'logisticCardContainerInformationService', 'logisticCardConstantValues', 'logisticCardTranslationService'];

	function LogisticCardLayoutService(platformUIConfigInitService, logisticCardContainerInformationService, logisticCardConstantValues, logisticCardTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticCardContainerInformationService.getCardLayout(),
			dtoSchemeId: logisticCardConstantValues.schemes.card,
			translator: logisticCardTranslationService,
			entityInformation: {module: angular.module(moduleName), moduleName: 'Logistic.Card', entity: 'Card'}
		});
	}
})(angular);