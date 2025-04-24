(function (angular) {
	'use strict';

	angular.module('businesspartner.main').controller('businesspartnerMainActivityListController',
		['$scope', '$injector', 'businessPartnerMainActivityUIStandardService',
			'platformGridControllerService', 'businesspartnerMainActivityValidationService', 'basicsCommonUploadDownloadControllerService', '$translate', 'platformModalService',
			'basicsCommonDocumentControllerService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, $injector, businessPartnerMainActivityUIStandardService,
				platformGridControllerService, businesspartnerMainActivityValidationService, basicsCommonUploadDownloadControllerService, $translate, platformModalService,
				basicsCommonDocumentControllerService) {

				let dataService = $scope.getContentValue('dataService');
				if (angular.isString(dataService)) {
					dataService = $injector.get(dataService);
				}

				const myGridConfig = {initCalled: false, columns: []};
				const validator = businesspartnerMainActivityValidationService(dataService);
				platformGridControllerService.initListController($scope, businessPartnerMainActivityUIStandardService, dataService, validator, myGridConfig);

				dataService.fillReadonlyModels(businessPartnerMainActivityUIStandardService.getStandardConfigForListView());

				$scope.gridFlag = '7e53f168ab934602959ff38ab0606f61';
				basicsCommonDocumentControllerService.initDocumentUploadController($scope, dataService, $scope.gridFlag);

				basicsCommonUploadDownloadControllerService.initGrid($scope, dataService);

				function updateActivities() {
					dataService.load();
				}

				dataService.parentService?.().registerDataModified(updateActivities);
				$scope.$on('$destroy', function () {
					dataService.parentService?.().unregisterDataModified(updateActivities);
				});
			}
		]);
})(angular);