/**
 * Created by baf on 05.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.sundrygroup';

	/**
	 * @ngdoc controller
	 * @name logisticSundryServiceGroupLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic sundrygroup  entity.
	 **/
	angular.module(moduleName).service('logisticSundryServiceGroupLayoutService', LogisticSundryServiceGroupLayoutService);

	LogisticSundryServiceGroupLayoutService.$inject = ['platformUIConfigInitService', 'logisticSundrygroupContainerInformationService',
		'logisticSundryServiceGroupTranslationService', 'logisticSundryServiceGroupConstantValues'];

	function LogisticSundryServiceGroupLayoutService(platformUIConfigInitService, logisticSundrygroupContainerInformationService,
		logisticSundryServiceGroupTranslationService, logisticSundryServiceGroupConstantValues) {

		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticSundrygroupContainerInformationService.getGroupLayout(),
			dtoSchemeId: logisticSundryServiceGroupConstantValues.schemes.group,
			translator: logisticSundryServiceGroupTranslationService
		});
	}
})(angular);