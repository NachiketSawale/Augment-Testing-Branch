(function () {

	'use strict';
	var moduleName = 'basics.assetmaster';

	/**
	 * @ngdoc controller
	 * @name basicsAssetMasterBelongsToListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of any kind of entity causing a change in a project
	 **/
	angular.module(moduleName).controller('basicsAssetMasterBelongsToListController', BasicsAssetMasterBelongsToListController);

	BasicsAssetMasterBelongsToListController.$inject = ['$scope', 'platformContainerControllerService','basicsAssetmasterContainerInformationService', 'basicsAssetMasterBelongsToContainerService'];

	function BasicsAssetMasterBelongsToListController($scope, platformContainerControllerService, basicsAssetmasterContainerInformationService, basicsAssetMasterBelongsToContainerService) {
		var containerUid = $scope.getContentValue('uuid');

		if(!basicsAssetmasterContainerInformationService.hasDynamic(containerUid)) {
			basicsAssetMasterBelongsToContainerService.prepareGridConfig(containerUid, $scope, basicsAssetmasterContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})();