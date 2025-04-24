/**
 * Created by baf on 30.01.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingRecordUIConfigurationService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic dispatching ui entity.
	 **/
	angular.module(moduleName).service('logisticDispatchingRecordUIConfigurationService', LogisticDispatchingRecordUIConfigurationService);

	LogisticDispatchingRecordUIConfigurationService.$inject = ['platformUIConfigInitService', 'logisticDispatchingContainerInformationService', 'logisticDispatchingTranslationService'];

	function LogisticDispatchingRecordUIConfigurationService(platformUIConfigInitService, logisticDispatchingContainerInformationService, logisticDispatchingTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticDispatchingContainerInformationService.getLogisticDispatchingRecordLayout(),
			dtoSchemeId: {
				moduleSubModule: 'Logistic.Dispatching',
				typeName: 'DispatchRecordDto'
			},
			translator: logisticDispatchingTranslationService
		});
	}
})(angular);