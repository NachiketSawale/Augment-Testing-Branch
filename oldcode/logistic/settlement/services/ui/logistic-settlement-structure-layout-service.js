/**
 * Created by chlai on 08.01.2025
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticSettlementStructureLayoutService
	 * @function
	 *
	 * @description
	 * This service provides layout for structure container of  logistic settlement structure entity.
	 **/
	angular.module(moduleName).service('logisticSettlementStructureLayoutService', LogisticSettlementStructureLayoutService);

	LogisticSettlementStructureLayoutService.$inject = ['platformUIConfigInitService', 'logisticSettlementContainerInformationService',
		'logisticSettlementTranslationService', 'platformSchemaService', 'platformUIStandardConfigService'];

	function LogisticSettlementStructureLayoutService(platformUIConfigInitService, logisticSettlementContainerInformationService,
		logisticSettlementTranslationService, platformSchemaService, platformUIStandardConfigService) {

		let servData = {
			service: this,
			layout: logisticSettlementContainerInformationService.getSettlementStructVLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Logistic.Settlement',
				typeName: 'SettlementStructVDto'
			},
			translator: logisticSettlementTranslationService,
			entityInformation: { module: angular.module(moduleName), moduleName: 'Logistic.Settlement', entity: 'SettlementStructV' }
		};

		platformUIConfigInitService.createUIConfigurationService(servData);

		let attrDomians = platformSchemaService.getSchemaFromCache(servData.dtoSchemeId);

		return new platformUIStandardConfigService(servData.layout, attrDomians.properties, logisticSettlementTranslationService);
	}

})(angular);