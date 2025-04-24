/**
 * Created by alm on 5/27/2022.
 */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.requisition';

	angular.module(moduleName).controller('procurementRequisitionItemVariantListController',
		['$scope', 'platformGridControllerService', 'procurementRequisitionItemVariantService', 'procurementRequisitionItemVariantUIStandardService',
			function ($scope, platformGridControllerService, dataService, uiService) {

				var myGridConfig = {
					initCalled: false,
					columns: []
				};

				platformGridControllerService.initListController($scope, uiService, dataService, {}, myGridConfig);



			}
		]);
})(angular);