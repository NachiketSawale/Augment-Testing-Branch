/**
 * Created by baf on 21.09.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingHeaderRequisitionLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic dispatching headerRequisition entity.
	 **/
	angular.module(moduleName).service('logisticDispatchingHeaderRequisitionLayoutService', LogisticDispatchingHeaderRequisitionLayoutService);

	LogisticDispatchingHeaderRequisitionLayoutService.$inject = ['platformUIConfigInitService', 'logisticDispatchingContainerInformationService', 'logisticDispatchingConstantValues', 'logisticDispatchingTranslationService'];

	function LogisticDispatchingHeaderRequisitionLayoutService(platformUIConfigInitService, logisticDispatchingContainerInformationService, logisticDispatchingConstantValues, logisticDispatchingTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticDispatchingContainerInformationService.getHeaderRequisitionLayout(),
			dtoSchemeId: logisticDispatchingConstantValues.schemes.header2Requisition,
			translator: logisticDispatchingTranslationService
		});
	}
})(angular);