(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.bundle';
	angular.module(moduleName).controller('transportplanningBundleGridController', GridController);
	GridController.$inject = ['$injector', '$scope', 'platformContainerControllerService', 'transportplanningBundleButtonService',
		'basicsCommonToolbarExtensionService'];

	function GridController($injector, $scope, platformContainerControllerService, buttonService,
		basicsCommonToolbarExtensionService) {

		var containerUuid = '95a65610f91042a5bb8995be789c2f15';
		platformContainerControllerService.initController($scope, moduleName, containerUuid);
		var containerInfo = platformContainerControllerService.getModuleInformationService(moduleName).getContainerInfoByGuid(containerUuid);
		buttonService.extendDocumentButtons($scope, $injector.get(containerInfo.dataServiceName));
	}
})(angular);