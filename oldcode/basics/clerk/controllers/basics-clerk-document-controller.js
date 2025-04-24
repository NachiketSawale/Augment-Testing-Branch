/**
 * Created by pel on 3/21/2019.
 */

(function (angular) {
	'use strict';
	var moduleName = 'basics.clerk';
	angular.module(moduleName).controller('clerkDocumentListController',
		['$scope', 'platformGridControllerService', 'clerkDocumentDataService', 'clerkDocumentValidationService',
			'clerkDocumentUIStandardService', 'basicsCommonUploadDownloadControllerService', 'basicsCommonDocumentControllerService', '$translate', 'platformModalService', '$rootScope',
			function ($scope, gridControllerService, dataService, validationService, gridColumns, basicsCommonUploadDownloadControllerService, basicsCommonDocumentControllerService,
				$translate, platformModalService, $rootScope) {
				var gridConfig = {
					columns: []
				};

				var parentDataService = dataService.parentService();
				parentDataService.registerSelectionChanged(onParentSelectionChange);

				function onParentSelectionChange() {
					$('#docsaveerror').hide();
				}

				$rootScope.$on('updateDone', function () {
					$('#docsaveerror').hide();
				});

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				$scope.gridFlag = 'fbbf119ec03b442b87dcc3de1029c440';
				basicsCommonDocumentControllerService.initDocumentUploadController($scope, dataService, $scope.gridFlag);
				basicsCommonUploadDownloadControllerService.initGrid($scope, dataService);

			}
		]
	);
})(angular);
