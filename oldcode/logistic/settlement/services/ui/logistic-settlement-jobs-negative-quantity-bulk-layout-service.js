/**
 * Created by chin-han.lai on 08/09/2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementJobsNegativeQuantityBulkLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic settlement BulkNegativeLocationsVEntity entity.
	 **/
	angular.module(moduleName).service('logisticSettlementJobsNegativeQuantityBulkLayoutService', LogisticSettlementJobsNegativeQuantityBulkLayoutService);

	LogisticSettlementJobsNegativeQuantityBulkLayoutService.$inject = ['platformUIConfigInitService', 'logisticSettlementContainerInformationService', 'logisticSettlementConstantValues', 'logisticSettlementTranslationService'];

	function LogisticSettlementJobsNegativeQuantityBulkLayoutService(platformUIConfigInitService, logisticSettlementContainerInformationService, logisticSettlementConstantValues, logisticSettlementTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticSettlementContainerInformationService.getJobsNegativeQuantityBulkLayout(),
			dtoSchemeId: logisticSettlementConstantValues.schemes.jobsWithNegativeQuantityForBulk,
			translator: logisticSettlementTranslationService
		});
	}
})(angular);