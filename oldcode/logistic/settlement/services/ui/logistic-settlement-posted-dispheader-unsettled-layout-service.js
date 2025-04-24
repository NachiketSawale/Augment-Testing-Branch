/**
 * Created by shen on 9/7/2023
 */

(function (angular) {
	'use strict';
	let moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticPostedDispHeaderUnsettledLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic posted and unsettled dispatch header entity.
	 **/
	angular.module(moduleName).service('logisticPostedDispHeaderUnsettledLayoutService', LogisticPostedDispHeaderUnsettledLayoutService);

	LogisticPostedDispHeaderUnsettledLayoutService.$inject = ['platformUIConfigInitService', 'logisticSettlementContainerInformationService', 'logisticSettlementConstantValues', 'logisticSettlementTranslationService'];

	function LogisticPostedDispHeaderUnsettledLayoutService(platformUIConfigInitService, logisticSettlementContainerInformationService, logisticSettlementConstantValues, logisticSettlementTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticSettlementContainerInformationService.getPostedDispHeaderUnsettledLayout(),
			dtoSchemeId: logisticSettlementConstantValues.schemes.postedDispHeaderNotSettled,
			translator: logisticSettlementTranslationService
		});
	}
})(angular);

