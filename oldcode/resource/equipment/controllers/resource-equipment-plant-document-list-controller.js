/**
 * Created by cakiral.
 */
(function () {

	'use strict';
	var moduleName = 'resource.equipment';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentPlantDocumentListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of plant document entities.
	 **/
	angModule.controller('resourceEquipmentPlantDocumentListController', ResourceEquipmentPlantDocumentListController);

	ResourceEquipmentPlantDocumentListController.$inject = ['$rootScope','$scope','$translate','$injector','$http','_','platformModalService','platformContainerControllerService', 'basicsCommonDocumentUploadFilesControllerService', 'basicsCommonUploadDownloadControllerService','resourceEquipmentPlantDocumentDataService',];

	function ResourceEquipmentPlantDocumentListController($rootScope, $scope, $translate, $injector, $http, _, platformModalService, platformContainerControllerService,basicsCommonDocumentUploadFilesControllerService,basicsCommonUploadDownloadControllerService, resourceEquipmentPlantDocumentDataService) {

		const dataService = resourceEquipmentPlantDocumentDataService;

		platformContainerControllerService.initController($scope, moduleName, 'f0e92216d80d4f9892c0d591cfd93a06');

		basicsCommonDocumentUploadFilesControllerService.initUploadFilesController($scope,dataService,'f0e92216d80d4f9892c0d591cfd93a06');

		basicsCommonUploadDownloadControllerService.initGrid($scope, dataService);
	}
})();