/**
 * Created by baf on 13.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.sundryservice';

	/**
	 * @ngdoc controller
	 * @name logisticSundryServicePriceListLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic sundryService priceList entity.
	 **/
	angular.module(moduleName).service('logisticSundryServicePriceListLayoutService', LogisticSundryServicePriceListLayoutService);

	LogisticSundryServicePriceListLayoutService.$inject = ['platformUIConfigInitService', 'logisticSundryserviceContainerInformationService', 'logisticSundryServiceTranslationService'];

	function LogisticSundryServicePriceListLayoutService(platformUIConfigInitService, logisticSundryserviceContainerInformationService, logisticSundryServiceTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticSundryserviceContainerInformationService.getLogisticSundryServicePriceListLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Logistic.SundryService',
				typeName: 'SundryServicePriceListDto'
			},
			translator: logisticSundryServiceTranslationService
		});
	}
})(angular);