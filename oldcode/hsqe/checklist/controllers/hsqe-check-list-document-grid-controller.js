
(function (angular) {
	/* global $ */
	'use strict';

	angular.module('hsqe.checklist').controller('hsqeCheckListDocumentGridController',
		['$scope', 'globals', '$injector', '$translate', 'platformGridControllerService', 'hsqeCheckListDocumentUIStandardService', 'hsqeCheckListDocumentDataService','hsqeCheckListDocumentValidationService','$rootScope','platformModalService',
			'basicsCommonUploadDownloadControllerService', 'basicsCommonDocumentControllerService',
			function ($scope, globals, $injector, $translate, gridControllerService, gridColumns, dataService, validationService, $rootScope, platformModalService,
				basicsCommonUploadDownloadControllerService, basicsCommonDocumentControllerService) {
				var gridConfig = {
					columns: []
				};

				let parentDataService = dataService.parentService();
				parentDataService.registerSelectionChanged(onParentSelectionChange);

				function onParentSelectionChange() {
					$('#docsaveerror').hide();
				}

				$rootScope.$on('updateDone', function () {
					$('#docsaveerror').hide();
				});

				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				$scope.gridFlag = '3a052d40f0ab4b4a8fd342ee91419de8';
				basicsCommonDocumentControllerService.initDocumentUploadController($scope, dataService, $scope.gridFlag);

				basicsCommonUploadDownloadControllerService.initGrid($scope, dataService);
			}
		]);
})(angular);
