/**
 * Created by Shankar on 20.02.2025
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.card';

	/**
	 * @ngdoc controller
	 * @name logisticCardStructureLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic card entity.
	 **/
	angular.module(moduleName).service('logisticCardStructureLayoutService', LogisticCardStructureLayoutService);

	LogisticCardStructureLayoutService.$inject = ['platformUIConfigInitService', 'logisticCardContainerInformationService', 'logisticCardConstantValues', 'logisticCardTranslationService','platformSchemaService', 'platformUIStandardConfigService'];

	function LogisticCardStructureLayoutService(platformUIConfigInitService, logisticCardContainerInformationService, logisticCardConstantValues, logisticCardTranslationService,platformSchemaService, platformUIStandardConfigService) {
		let servData = {
	         service: this,
	         layout: logisticCardContainerInformationService.getCardStructureLayout(),
	         dtoSchemeId: logisticCardConstantValues.schemes.card,
	         translator: logisticCardTranslationService,
	         entityInformation: {module: angular.module(moduleName), moduleName: 'Logistic.Card', entity: 'Card'}
         };
			platformUIConfigInitService.createUIConfigurationService(servData);
			let attrDomains = platformSchemaService.getSchemaFromCache(servData.dtoSchemeId);
			return new platformUIStandardConfigService(servData.layout, attrDomains.properties, logisticCardTranslationService);

		}
})(angular);