/**
 * Created by baf on 21.09.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic dispatching  entity.
	 **/
	angular.module(moduleName).service('logisticDispatchingLinkageLayoutService', LogisticDispatchingLinkageLayoutService);

	LogisticDispatchingLinkageLayoutService.$inject = ['platformUIConfigInitService', 'logisticDispatchingContainerInformationService', 'logisticDispatchingTranslationService'];

	function LogisticDispatchingLinkageLayoutService(platformUIConfigInitService, logisticDispatchingContainerInformationService, logisticDispatchingTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticDispatchingContainerInformationService.getLogisticDispatchingLinkageLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Logistic.Dispatching',
				typeName: 'DispatchHeaderLinkageDto'
			},
			translator: logisticDispatchingTranslationService
		});
	}
})(angular);