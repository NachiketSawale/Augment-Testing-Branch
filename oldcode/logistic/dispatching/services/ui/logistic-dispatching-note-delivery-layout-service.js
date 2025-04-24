/**
 * Created by henkel on 29.10.2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingNoteDeliveryLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic dispatching note settled entity..
	 **/
	angular.module(moduleName).service('logisticDispatchingNoteDeliveryLayoutService', LogisticDispatchingNoteDeliveryLayoutService);

	LogisticDispatchingNoteDeliveryLayoutService.$inject = ['platformUIConfigInitService', 'logisticDispatchingContainerInformationService', 'logisticDispatchingConstantValues', 'logisticDispatchingTranslationService'];

	function LogisticDispatchingNoteDeliveryLayoutService(platformUIConfigInitService, logisticDispatchingContainerInformationService, logisticDispatchingConstantValues, logisticDispatchingTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticDispatchingContainerInformationService.getLogisticDispatchingNoteDeliveryLayout(),
			dtoSchemeId: logisticDispatchingConstantValues.schemes.noteDelivery,
			translator: logisticDispatchingTranslationService
		});
	}
})(angular);