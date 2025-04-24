/**
 * Created by Shankar on 19.07.2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingRecordLoadingInfoLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic dispatch loading Info entity..
	 **/
	angular.module(moduleName).service('logisticDispatchingRecordLoadingInfoLayoutService', LogisticDispatchingRecordLoadingInfoLayoutService);

	LogisticDispatchingRecordLoadingInfoLayoutService.$inject = ['platformUIConfigInitService', 'logisticDispatchingContainerInformationService', 'logisticDispatchingConstantValues', 'logisticDispatchingTranslationService'];

	function LogisticDispatchingRecordLoadingInfoLayoutService(platformUIConfigInitService, logisticDispatchingContainerInformationService, logisticDispatchingConstantValues, logisticDispatchingTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticDispatchingContainerInformationService.getDispatchRecordLoadingInfoLayout(),
			dtoSchemeId: logisticDispatchingConstantValues.schemes.dispatchRecordLoadingInfo,
			translator: logisticDispatchingTranslationService
		});
	}
})(angular);