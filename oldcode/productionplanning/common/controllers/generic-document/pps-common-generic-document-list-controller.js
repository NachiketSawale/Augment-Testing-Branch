
(function (angular) {
	'use strict';

	var module = 'productionplanning.common';

	angular.module(module).controller('ppsCommonGenericDocumentListController', ListController);

	ListController.$inject = [
		'$scope',
		'basicsCommonUploadDownloadControllerService',
		'platformGridControllerService',
		'ppsCommonGenericDocumentUIStandardService',
		'ppsCommonGenericDocumentDataServiceFactory'];

	function ListController($scope,
		uploadDownloadControllerService,
		platformGridControllerService,
		uiStandardService,
		dataServiceFactory) {

		var gridConfig = { initCalled: false, columns: [] };

		// get environment variable from the module-container.json file
		var serviceOptions = $scope.getContentValue('serviceOptions');
		var dataService = dataServiceFactory.getOrCreateService(serviceOptions);

		platformGridControllerService.initListController($scope, uiStandardService, dataService, null, gridConfig);

		uploadDownloadControllerService.initGrid($scope, dataService);
	}
})(angular);