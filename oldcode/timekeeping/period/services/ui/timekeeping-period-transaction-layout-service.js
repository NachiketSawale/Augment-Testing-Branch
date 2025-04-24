/**
 * Created by leo on 25.02.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'timekeeping.period';

	/**
	 * @ngdoc controller
	 * @name timekeepingPeroiodTransactionLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  timekeeping transaction  entity.
	 **/
	angular.module(moduleName).service('timekeepingPeroiodTransactionLayoutService', TimekeepingTransactionLayoutService);

	TimekeepingTransactionLayoutService.$inject = ['platformUIConfigInitService', 'timekeepingPeriodContainerInformationService', 'timekeepingPeriodTranslationService', 'timekeepingPeriodConstantValues'];

	function TimekeepingTransactionLayoutService(platformUIConfigInitService, timekeepingPeriodContainerInformationService, timekeepingPeriodTranslationService, timekeepingPeriodConstantValues) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: timekeepingPeriodContainerInformationService.getTransactionLayout(),
			dtoSchemeId: timekeepingPeriodConstantValues.schemes.transaction,
			translator: timekeepingPeriodTranslationService
		});
	}
})(angular);
