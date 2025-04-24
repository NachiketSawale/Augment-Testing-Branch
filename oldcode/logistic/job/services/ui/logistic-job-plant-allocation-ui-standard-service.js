/**
 * Created by baf on 31.08.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobPlantAllocationUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic job  entity.
	 **/
	angular.module(moduleName).service('logisticJobPlantAllocationUIStandardService', LogisticJobPlantAllocationUIStandardService);

	LogisticJobPlantAllocationUIStandardService.$inject = ['platformUIConfigInitService', 'logisticJobConstantValues',
		'logisticJobContainerInformationService', 'logisticJobTranslationService'];

	function LogisticJobPlantAllocationUIStandardService(platformUIConfigInitService, logisticJobConstantValues, logisticJobContainerInformationService, logisticJobTranslationService) {

		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticJobContainerInformationService.getLogisticJobPlantAllocationLayout(),
			dtoSchemeId: logisticJobConstantValues.schemes.plantAllocation,
			translator: logisticJobTranslationService
		});
	}
})(angular);
