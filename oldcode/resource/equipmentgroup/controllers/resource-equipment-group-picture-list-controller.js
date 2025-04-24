(function (angular) {
	'use strict';
	const moduleName = 'resource.equipmentgroup';
	const angModule = angular.module(moduleName);

	/* jshint -W072*/ //many parameters because of dependency injection
	angModule.controller('resourceEquipmentGroupPictureListController', ResourceEquipmentGroupPictureListController);

	ResourceEquipmentGroupPictureListController.$inject = ['$scope', 'platformContainerControllerService', 'basicsCommonDragAndDropFromExplorerControllerService',
		'resourceEquipmentGroupPictureDataService'];

	function ResourceEquipmentGroupPictureListController($scope, platformContainerControllerService, basicsCommonDragAndDropFromExplorerControllerService,
		resourceEquipmentGroupPictureDataService) {

		const dataService = resourceEquipmentGroupPictureDataService;

		platformContainerControllerService.initController($scope, moduleName, '35f2de73e6a147b2ac6740c09031271d');

		basicsCommonDragAndDropFromExplorerControllerService.initDragAndDropService($scope, dataService);
	}
})(angular);