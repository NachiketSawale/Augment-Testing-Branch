/**
 * Created by baf on 27.06.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettledProjectChangeItemLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic settlement batch entity.
	 **/
	angular.module(moduleName).service('logisticSettledProjectChangeItemLayoutService', LogisticSettledProjectChangeItemLayoutService);

	LogisticSettledProjectChangeItemLayoutService.$inject = ['platformUIConfigInitService', 'logisticSettlementContainerInformationService', 'logisticSettlementConstantValues', 'logisticSettlementTranslationService'];

	function LogisticSettledProjectChangeItemLayoutService(platformUIConfigInitService, logisticSettlementContainerInformationService, logisticSettlementConstantValues, logisticSettlementTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticSettlementContainerInformationService.getSettledProjectChangeItemLayout(),
			dtoSchemeId: logisticSettlementConstantValues.schemes.settledProjectChangeItem,
			translator: logisticSettlementTranslationService
		});
	}
})(angular);