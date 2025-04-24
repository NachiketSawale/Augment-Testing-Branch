/**
 * Created by baf on 02.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.sundryservice';

	/**
	 * @ngdoc controller
	 * @name logisticSundryServiceLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic sundryService  entity.
	 **/
	angular.module(moduleName).service('logisticSundryServiceLayoutService', LogisticSundryServiceLayoutService);

	LogisticSundryServiceLayoutService.$inject = ['platformUIConfigInitService', 'logisticSundryserviceContainerInformationService', 'logisticSundryServiceTranslationService'];

	function LogisticSundryServiceLayoutService(platformUIConfigInitService, logisticSundryServiceContainerInformationService, logisticSundryServiceTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticSundryServiceContainerInformationService.getLogisticSundryServiceLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Logistic.SundryService',
				typeName: 'SundryServiceDto'
			},
			translator: logisticSundryServiceTranslationService
		});
	}
})(angular);