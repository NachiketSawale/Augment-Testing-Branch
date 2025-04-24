(function (angular) {
	'use strict';
	var moduleName = 'basics.procurementstructure';
	angular.module(moduleName).controller('basicsProcurementStructureDocumentController',
		['$scope', 'platformGridControllerService', 'procurementStructureDocumentUIStandardService',
			'procurementStructureDocumentService', 'basicsProcurementStructureEventValidationService','$translate','basicsCommonUploadDownloadControllerService', 'basicsCommonDocumentControllerService',
			function ($scope, gridControllerService, gridColumns, dataService, validation,$translate,basicsCommonUploadDownloadControllerService, basicsCommonDocumentControllerService) {
				var gridConfig = {
					columns: []
				};
				gridControllerService.initListController($scope, gridColumns, dataService, validation, gridConfig);
				$scope.gridFlag = '2bac93628c56416991e49f4c61a721ad';
				basicsCommonDocumentControllerService.initDocumentUploadController($scope, dataService, $scope.gridFlag);
				basicsCommonUploadDownloadControllerService.initGrid($scope, dataService);
			}]);
})(angular);