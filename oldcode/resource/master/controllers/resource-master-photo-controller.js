(function (angular) {
	'use strict';
	var moduleName = 'resource.master';

	angular.module(moduleName).controller('resourceMasterMainPhotoController',ResourceMasterMainPhotoController);

	ResourceMasterMainPhotoController.$inject = ['$scope', 'basicsCommonPhotoControllerBase', 'resourceMasterMainPhotoDataService'];

	function ResourceMasterMainPhotoController($scope, basicsCommonPhotoControllerBase, resourceMasterMainPhotoDataService) {

		basicsCommonPhotoControllerBase($scope, resourceMasterMainPhotoDataService);

	}

})(angular);