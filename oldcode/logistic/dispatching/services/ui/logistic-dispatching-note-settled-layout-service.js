/**
 * Created by Shankar on 05.04.2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingNoteSettledLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic dispatching note settled entity..
	 **/
	angular.module(moduleName).service('logisticDispatchingNoteSettledLayoutService', LogisticDispatchingNoteSettledLayoutService);

	LogisticDispatchingNoteSettledLayoutService.$inject = ['platformUIConfigInitService', 'logisticDispatchingContainerInformationService', 'logisticDispatchingConstantValues', 'logisticDispatchingTranslationService'];

	function LogisticDispatchingNoteSettledLayoutService(platformUIConfigInitService, logisticDispatchingContainerInformationService, logisticDispatchingConstantValues, logisticDispatchingTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticDispatchingContainerInformationService.getLogisticDispatchingNoteSettledLayout(),
			dtoSchemeId: logisticDispatchingConstantValues.schemes.dispatchNoteSettled,
			translator: logisticDispatchingTranslationService
		});
	}
})(angular);