/**
 * Created by shen on 4/11/2023
 */

(function (angular) {
	'use strict';
	let moduleName = 'procurement.common';

	/**
	 * @ngdoc controller
	 * @name prcCommonItem2plantDetailController
	 * Controller for the detail view of prc common item2plant entities
	 */
	angular.module(moduleName).controller('prcCommonItem2plantDetailController', prcCommonItem2plantDetailController);
	prcCommonItem2plantDetailController.$inject = ['$scope', 'procurementContextService', 'platformDetailControllerService', 'procurementCommonItem2PlantUIStandardService',
		'prcCommonItem2plantDataService', 'procurementCommonWarrantyValidationService', 'platformTranslateService', 'procurementCommonPrcItemDataService'];

	function prcCommonItem2plantDetailController($scope, procurementContextService, platformDetailControllerService, procurementCommonItem2PlantUIStandardService, prcCommonItem2plantDataService, validationService, platformTranslateService, procurementCommonPrcItemDataService) {

		let mainService = procurementContextService.getMainService();
		let parentDataService = procurementCommonPrcItemDataService.getService(mainService);

		let dataService = prcCommonItem2plantDataService.getService(parentDataService);

		platformDetailControllerService.initDetailController($scope, dataService, {},
			procurementCommonItem2PlantUIStandardService, platformTranslateService);

	}
})(angular);