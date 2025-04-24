(function config() {

	'use strict';
	var moduleName = 'basics.assetmaster';

	/**
	 * @ngdoc controller
	 * @name basicsAssetMasterBelongsToDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of any kind of entity belonging to an asset
	 **/
	angular.module(moduleName).controller('basicsAssetMasterBelongsToDetailController', BasicsAssetMasterBelongsToDetailController);

	BasicsAssetMasterBelongsToDetailController.$inject = ['$scope', 'platformContainerControllerService','basicsAssetmasterContainerInformationService', 'basicsAssetMasterBelongsToContainerService'];

	function BasicsAssetMasterBelongsToDetailController($scope, platformContainerControllerService, basicsAssetmasterContainerInformationService, basicsAssetMasterBelongsToContainerService) {
		var containerUid = $scope.getContentValue('uuid');

		if(!basicsAssetmasterContainerInformationService.hasDynamic(containerUid)) {
			basicsAssetMasterBelongsToContainerService.prepareDetailConfig(containerUid, $scope, basicsAssetmasterContainerInformationService);
		}

		platformContainerControllerService.initController($scope, moduleName, containerUid);
	}
})();