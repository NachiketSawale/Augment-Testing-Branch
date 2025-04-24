/**
 * Created by alm on 5/27/2022.
 */

(function (angular) {
	'use strict';

	let moduleName = 'procurement.requisition';

	angular.module(moduleName).controller('procurementRequisitionBoqVariantDetailController',
		['$scope', 'platformDetailControllerService', 'procurementRequisitionBoqVariantService', 'procurementRequisitionBoqVariantUIStandardService','platformTranslateService',
			function ($scope, platformDetailControllerService, dataService, uiService,platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, {}, uiService, platformTranslateService);

			}
		]);
})(angular);