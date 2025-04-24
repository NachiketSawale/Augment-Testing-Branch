
(function (angular) {
	'use strict';

	angular.module('controlling.revrecognition').controller('controllingRevenueRecognitionDocumentGridController',
		['$','$scope','$translate','$rootScope', 'platformGridControllerService', 'controllingRevenueRecognitionDocumentUIStandardService', 'controllingRevenueRecognitionDocumentDataService','basicsCommonUploadDownloadControllerService','platformModalService','basicsCommonDocumentControllerService',
			function ($,$scope, $translate,$rootScope,gridControllerService, gridColumns, dataService,basicsCommonUploadDownloadControllerService,platformModalService,basicsCommonDocumentControllerService) {
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
				gridControllerService.initListController($scope, gridColumns, dataService, {}, gridConfig);
				$scope.gridFlag='19004da082644d6e9f3ce323eabc9196';
				basicsCommonDocumentControllerService.initDocumentUploadController($scope, dataService, $scope.gridFlag);
				basicsCommonUploadDownloadControllerService.initGrid($scope, dataService);
			}
		]);
})(angular);
