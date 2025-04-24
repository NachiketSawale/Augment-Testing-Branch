/**
 * Created by shen on 11/22/2021
 */

(function (angular) {
	'use strict';
	let moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticPoolJobPlantAllocationUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic job  entity.
	 **/
	angular.module(moduleName).service('logisticPoolJobPlantAllocationUIStandardService', LogisticPoolJobPlantAllocationUIStandardService);

	LogisticPoolJobPlantAllocationUIStandardService.$inject = ['platformUIConfigInitService', 'logisticJobConstantValues',
		'logisticJobContainerInformationService', 'logisticJobTranslationService'];

	function LogisticPoolJobPlantAllocationUIStandardService(platformUIConfigInitService, logisticJobConstantValues, logisticJobContainerInformationService, logisticJobTranslationService) {

		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticJobContainerInformationService.getLogisticPoolJobPlantAllocationLayout(),
			dtoSchemeId: logisticJobConstantValues.schemes.plantAllocation,
			translator: logisticJobTranslationService
		});
	}
})(angular);
