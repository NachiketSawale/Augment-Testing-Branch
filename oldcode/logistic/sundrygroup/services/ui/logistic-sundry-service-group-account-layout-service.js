/**
 * Created by baf on 05.04.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.sundrygroup';

	/**
	 * @ngdoc controller
	 * @name logisticSundryServiceGroupAccountLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic sundryServiceGroup account entity.
	 **/
	angular.module(moduleName).service('logisticSundryServiceGroupAccountLayoutService', LogisticSundryServiceGroupAccountLayoutService);

	LogisticSundryServiceGroupAccountLayoutService.$inject = ['platformUIConfigInitService', 'logisticSundrygroupContainerInformationService', 'logisticSundryServiceGroupConstantValues', 'logisticSundryServiceGroupTranslationService'];

	function LogisticSundryServiceGroupAccountLayoutService(platformUIConfigInitService, logisticSundrygroupContainerInformationService, logisticSundryServiceGroupConstantValues, logisticSundryServiceGroupTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticSundrygroupContainerInformationService.getAccountLayout(),
			dtoSchemeId: logisticSundryServiceGroupConstantValues.schemes.account,
			translator: logisticSundryServiceGroupTranslationService
		});
	}
})(angular);