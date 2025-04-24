/**
 * Created by Shankar on 07.09.2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingNoteTotalWeightLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic dispatch weight Info entity..
	 **/
	angular.module(moduleName).service('logisticDispatchingNoteTotalWeightLayoutService', LogisticDispatchingNoteTotalWeightLayoutService);

	LogisticDispatchingNoteTotalWeightLayoutService.$inject = ['platformUIConfigInitService', 'logisticDispatchingContainerInformationService', 'logisticDispatchingConstantValues', 'logisticDispatchingTranslationService'];

	function LogisticDispatchingNoteTotalWeightLayoutService(platformUIConfigInitService, logisticDispatchingContainerInformationService, logisticDispatchingConstantValues, logisticDispatchingTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticDispatchingContainerInformationService.getNoteTotalWeightLayout(),
			dtoSchemeId: logisticDispatchingConstantValues.schemes.dispatchNoteTotalWeight,
			translator: logisticDispatchingTranslationService
		});
	}
})(angular);