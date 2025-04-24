/**
 * Created by alm on 5/26/2022.
 */

(function (angular) {

	'use strict';

	var moduleName = 'procurement.requisition';
	angular.module(moduleName).controller('procurementRequisitionVariantDetailController',
		['$scope', 'platformDetailControllerService', 'procurementRequisitionVariantService', 'procurementRequisitionVariantValidationService','procurementRequisitionVariantUIStandardService',
			'platformTranslateService',
			function ($scope, platformDetailControllerService, dataService, validationService, uiService,platformTranslateService) {
				platformDetailControllerService.initDetailController($scope, dataService, validationService, uiService, platformTranslateService);
			}]);
})(angular);
