(function () {

	/*global angular*/
	'use strict';
	var moduleName = 'resource.equipment';
	var angModule = angular.module(moduleName);

	/* jshint -W072*/ //many parameters because of dependency injection
	angModule.controller('resourceEquipmentPhotoListController', ResourceEquipmentPhotoListController);

	ResourceEquipmentPhotoListController.$inject = ['$scope', '$injector', '$window', '$http', 'platformContainerControllerService',
		'resourceEquipmentLeafPhotoService', 'resourceEquipmentPhotoFileService', 'basicsCommonDragAndDropFromExplorerControllerService'];

	function ResourceEquipmentPhotoListController($scope, $injector, $window, $http, platformContainerControllerService,
		resourceEquipmentLeafPhotoService, resourceEquipmentPhotoFileService, basicsCommonDragAndDropFromExplorerControllerService) {

		const dataService = resourceEquipmentLeafPhotoService;
		//$scope.allowedFiles = ['image/jpeg'];

		platformContainerControllerService.initController($scope, moduleName, 'eebaa9c4e6c747b3b6fb477d8e285d69');

		basicsCommonDragAndDropFromExplorerControllerService.initDragAndDropService($scope, dataService);
	}
})();