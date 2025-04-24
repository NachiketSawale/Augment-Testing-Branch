/**
 * Created by baf on 07.02.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'object.main';

	/**
	 * @ngdoc controller
	 * @name objectMainUnitInstallmentLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  object main unitInstallment entity.
	 **/
	angular.module(moduleName).service('objectMainUnitInstallmentLayoutService', ObjectMainUnitInstallmentLayoutService);

	ObjectMainUnitInstallmentLayoutService.$inject = ['platformUIConfigInitService', 'objectMainContainerInformationService', 'objectMainConstantValues', 'objectMainTranslationService'];

	function ObjectMainUnitInstallmentLayoutService(platformUIConfigInitService, objectMainContainerInformationService, objectMainConstantValues, objectMainTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: objectMainContainerInformationService.getObjectMainUnitInstallmentLayout(),
			dtoSchemeId: objectMainConstantValues.schemes.unitInstallment,
			translator: objectMainTranslationService
		});
	}
})(angular);