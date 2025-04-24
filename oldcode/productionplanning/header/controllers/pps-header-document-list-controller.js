(function (angular) {

	'use strict';

	var moduleName = 'productionplanning.header';
	angular.module(moduleName).controller('ppsHeaderDocumentListController', DocumentListController);

	DocumentListController.$inject = ['$scope', 'platformGridControllerService', 'ppsHeaderDocumentUIStandardService',
		'basicsCommonUploadDownloadControllerService', 'ppsHeaderDocumentDataService'];

	function DocumentListController($scope, platformGridControllerService, uiStandardServ,
									uploadDownloadControllerService, dataService) {
		var gridConfig = {initCalled: false, columns: []};
		platformGridControllerService.initListController($scope, uiStandardServ, dataService, {}, gridConfig);
		uploadDownloadControllerService.initGrid($scope, dataService);
	}
})(angular);