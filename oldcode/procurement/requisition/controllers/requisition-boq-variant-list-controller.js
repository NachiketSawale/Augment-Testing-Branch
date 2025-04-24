/**
 * Created by alm on 5/27/2022.
 */

(function (angular) {
	'use strict';

	let moduleName = 'procurement.requisition';

	angular.module(moduleName).controller('procurementRequisitionBoqVariantListController',
		['$scope', 'platformGridControllerService', 'procurementRequisitionBoqVariantService', 'procurementRequisitionBoqVariantUIStandardService',
			function ($scope, platformGridControllerService, dataService, uiService) {

				let myGridConfig = {
					initCalled: false,
					columns: []
				};

				platformGridControllerService.initListController($scope, uiService, dataService, {}, myGridConfig);


			}
		]);
})(angular);