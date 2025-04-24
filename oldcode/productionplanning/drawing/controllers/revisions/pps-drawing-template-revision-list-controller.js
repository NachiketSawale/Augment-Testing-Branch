(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.drawing';

	angular.module(moduleName).controller('ppsDrawingTmplRevisionListController', RevisionListController);

	RevisionListController.$inject = ['$scope', 'platformContainerControllerService', 'platformGridControllerService', 'ppsDrawingTmplRevisionDataServiceFactory', 'productionplanningDrawingContainerInformationService'];

	function RevisionListController($scope, platformContainerControllerService, platformGridControllerService, tmplRevisionDataServiceFactory, thisModuleContainerInfoService) {

		var guid = $scope.getContainerUUID();
		var serviceOptions = $scope.getContentValue('serviceOptions');
		if($scope.getContentValue('moduleName') || !serviceOptions){
			var _moduleName = $scope.getContentValue('moduleName') || moduleName;
			platformContainerControllerService.initController($scope, _moduleName, guid);
		}else {
			var info = thisModuleContainerInfoService.getContainerInfoByGuid(guid);
			var dataService = tmplRevisionDataServiceFactory.getService(serviceOptions);
			platformGridControllerService.initListController($scope, info.standardConfigurationService, dataService, info.validationService, info.listConfig);
		}

		// var guid = $scope.getContentValue('uuid');
		// platformContainerControllerService.initController($scope, moduleName, guid);
	}
})(angular);