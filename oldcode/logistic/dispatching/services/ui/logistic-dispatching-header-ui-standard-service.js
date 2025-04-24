/**
 * Created by baf on 29.01.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingHeaderUIConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic dispatching  entity.
	 **/
	angular.module(moduleName).service('logisticDispatchingHeaderUIConfigurationService', LogisticDispatchingHeaderUIConfigurationService);

	LogisticDispatchingHeaderUIConfigurationService.$inject = ['platformUIConfigInitService', 'logisticDispatchingContainerInformationService', 'logisticDispatchingTranslationService'];

	function LogisticDispatchingHeaderUIConfigurationService(platformUIConfigInitService, logisticDispatchingContainerInformationService, logisticDispatchingTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticDispatchingContainerInformationService.getLogisticDispatchingHeaderLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Logistic.Dispatching',
				typeName: 'DispatchHeaderDto'
			},
			translator: logisticDispatchingTranslationService,
			entityInformation: { module: angular.module(moduleName), moduleName: 'Logistic.Dispatching', entity: 'DispatchHeader' }
		});
	}
})(angular);