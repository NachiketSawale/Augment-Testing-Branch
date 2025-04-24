/**
 * Created by shen on 4/11/2023
 */

(function () {
	'use strict';
	let moduleName = 'procurement.common';

	/**
	 * @ngdoc controller
	 * @name prcCommonItem2plantGridController
	 * Controller for the list view of  prc common item2plant entities
	 */
	angular.module(moduleName).controller('prcCommonItem2plantGridController',
		['$scope', '$translate', 'procurementContextService', 'prcCommonItem2plantDataService',
			'procurementCommonItem2PlantUIStandardService', 'procurementCommonWarrantyValidationService',
			'platformGridControllerService', 'procurementCommonPrcItemDataService',
			function ($scope, $translate, procurementContextService, prcCommonItem2plantDataService, procurementCommonItem2PlantUIStandardService, validationService, platformGridControllerService, procurementCommonPrcItemDataService) {

				let mainService = procurementContextService.getMainService();
				let parentDataService = procurementCommonPrcItemDataService.getService(mainService);

				let dataService = prcCommonItem2plantDataService.getService(parentDataService);


				let myGridConfig = {
					initCalled: false,
					columns: []
				};

				platformGridControllerService.initListController($scope, procurementCommonItem2PlantUIStandardService, dataService, {}, myGridConfig);


			}
		]);
})();