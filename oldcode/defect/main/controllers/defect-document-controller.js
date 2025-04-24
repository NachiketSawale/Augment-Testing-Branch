/**
 * Created by alm on 5/10/2017.
 */
/* global , $ */
(function (angular) {
	'use strict';
	var moduleName='defect.main';
	angular.module(moduleName).controller('defectDocumentListController',
		['$scope','procurementContextService', 'platformGridControllerService','defectDocumentDataService','defectDocumentValidationService',
			'defectDocumentUIStandardService','basicsCommonUploadDownloadControllerService','$translate','platformModalService','$rootScope',
			'basicsCommonDocumentControllerService',
			function ($scope, moduleContext, gridControllerService, dataService, validationService, gridColumns,basicsCommonUploadDownloadControllerService,$translate,platformModalService,
				$rootScope, basicsCommonDocumentControllerService) {
				var gridConfig = {
					columns: []
				};
				var parentDataService = dataService.parentService();
				parentDataService.registerSelectionChanged(onParentSelectionChange);

				function onParentSelectionChange(){
					$('#docsaveerror').hide();
				}

				$rootScope.$on('updateDone', function () {
					$('#docsaveerror').hide();
				});

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				$scope.gridFlag='19004da082644d6e9f3ce323eabc9196';
				basicsCommonDocumentControllerService.initDocumentUploadController($scope, dataService, $scope.gridFlag);

				basicsCommonUploadDownloadControllerService.initGrid($scope, dataService);
			}
		]
	);
})(angular);