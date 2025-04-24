/**
 * Created by alm on 5/27/2022.
 */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.requisition';

	angular.module(moduleName).controller('procurementRequisitionItemVariantDetailController',
		['$scope', 'platformDetailControllerService', 'procurementRequisitionItemVariantService', 'procurementRequisitionItemVariantUIStandardService','platformTranslateService',
			function ($scope, platformDetailControllerService, dataService, uiService,platformTranslateService) {

				platformDetailControllerService.initDetailController($scope, dataService, {}, uiService, platformTranslateService);

			}
		]);
})(angular);