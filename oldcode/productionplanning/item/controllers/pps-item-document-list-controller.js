(function (angular) {

	'use strict';

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).controller('ppsItemDocumentListController', DocumentListController);

	DocumentListController.$inject = ['$scope', 'platformContainerControllerService',
		'basicsCommonUploadDownloadControllerService', 'ppsItemDocumentDataService'];

	function DocumentListController($scope, platformContainerControllerService,
									uploadDownloadControllerService, dataService) {

		platformContainerControllerService.initController($scope, moduleName, $scope.getContentValue('uuid'));
		uploadDownloadControllerService.initGrid($scope, dataService);

	}

})(angular);