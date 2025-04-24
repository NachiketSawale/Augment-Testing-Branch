/**
 * Created by baf on 14.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementItemLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic settlement item entity.
	 **/
	angular.module(moduleName).service('logisticSettlementItemLayoutService', LogisticSettlementItemLayoutService);

	LogisticSettlementItemLayoutService.$inject = ['platformUIConfigInitService', 'logisticSettlementContainerInformationService', 'logisticSettlementTranslationService'];

	function LogisticSettlementItemLayoutService(platformUIConfigInitService, logisticSettlementContainerInformationService, logisticSettlementTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticSettlementContainerInformationService.getLogisticSettlementItemLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Logistic.Settlement',
				typeName: 'SettlementItemDto'
			},
			translator: logisticSettlementTranslationService
		});
	}
})(angular);