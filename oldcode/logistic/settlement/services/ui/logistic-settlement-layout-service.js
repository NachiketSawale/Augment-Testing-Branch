/**
 * Created by baf on 14.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic settlement  entity.
	 **/
	angular.module(moduleName).service('logisticSettlementLayoutService', LogisticSettlementLayoutService);

	LogisticSettlementLayoutService.$inject = ['platformUIConfigInitService', 'logisticSettlementContainerInformationService', 'logisticSettlementTranslationService'];

	function LogisticSettlementLayoutService(platformUIConfigInitService, logisticSettlementContainerInformationService, logisticSettlementTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticSettlementContainerInformationService.getLogisticSettlementLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Logistic.Settlement',
				typeName: 'SettlementDto'
			},
			translator: logisticSettlementTranslationService,
			entityInformation: { module: angular.module(moduleName), moduleName: 'Logistic.Settlement', entity: 'Settlement' }
		});
	}
})(angular);