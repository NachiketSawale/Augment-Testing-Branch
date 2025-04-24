/**
 * Created by leo on 12.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobSundryServicePriceLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic job plant price  entity.
	 **/
	angular.module(moduleName).service('logisticJobSundryServicePriceUIStandardService', LogisticJobSundryServicePriceUIStandardService);

	LogisticJobSundryServicePriceUIStandardService.$inject = ['platformUIConfigInitService', 'logisticJobContainerInformationService', 'logisticJobTranslationService'];

	function LogisticJobSundryServicePriceUIStandardService(platformUIConfigInitService, logisticJobContainerInformationService, logisticJobTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticJobContainerInformationService.getLogisticJobSundryServicePriceLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Logistic.Job',
				typeName: 'LogisticSundryServicePriceDto'
			},
			translator: logisticJobTranslationService
		});
	}
})(angular);