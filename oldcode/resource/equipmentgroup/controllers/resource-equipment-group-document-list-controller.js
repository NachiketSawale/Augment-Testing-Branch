/**
 * Created by cakiral.
 */
(function () {

	'use strict';
	const moduleName = 'resource.equipmentgroup';
	const angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name resourceEquipmentGroupDocumentListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of plant document entities.
	 **/
	angModule.controller('resourceEquipmentGroupDocumentListController', ResourceEquipmentGroupDocumentListController);

	ResourceEquipmentGroupDocumentListController.$inject = ['$rootScope','$scope','$translate','$injector','$http','_',
		'platformModalService','platformContainerControllerService','basicsCommonDocumentUploadFilesControllerService',
		'basicsCommonUploadDownloadControllerService','resourceEquipmentGroupDocumentDataService',];

	function ResourceEquipmentGroupDocumentListController($rootScope, $scope, $translate, $injector, $http, _,
														  platformModalService, platformContainerControllerService,basicsCommonDocumentUploadFilesControllerService,
														  basicsCommonUploadDownloadControllerService, resourceEquipmentGroupDocumentDataService) {

		const dataService = resourceEquipmentGroupDocumentDataService;

		platformContainerControllerService.initController($scope, moduleName, '08addb1b387b4b848cbc4898ebdca385');

		basicsCommonDocumentUploadFilesControllerService.initUploadFilesController($scope,dataService,'08addb1b387b4b848cbc4898ebdca385');

		basicsCommonUploadDownloadControllerService.initGrid($scope, dataService);
	}
})();