/**
 * Created by baf on 18.03.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.card';

	/**
	 * @ngdoc controller
	 * @name logisticCardRecordLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic card record entity.
	 **/
	angular.module(moduleName).service('logisticCardRecordLayoutService', LogisticCardRecordLayoutService);

	LogisticCardRecordLayoutService.$inject = ['platformUIConfigInitService', 'logisticCardContainerInformationService', 'logisticCardConstantValues', 'logisticCardTranslationService'];

	function LogisticCardRecordLayoutService(platformUIConfigInitService, logisticCardContainerInformationService, logisticCardConstantValues, logisticCardTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticCardContainerInformationService.getRecordLayout(),
			dtoSchemeId: logisticCardConstantValues.schemes.record,
			translator: logisticCardTranslationService
		});
	}
})(angular);