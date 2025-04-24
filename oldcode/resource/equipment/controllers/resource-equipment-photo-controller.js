(function () {
	/*global angular*/
	'use strict';
	var moduleName = 'resource.equipment';

	angular.module(moduleName).controller('resourceEquipmentPhotoController', ['$scope', 'resourceEquipmentLeafPhotoService', 'resourceEquipmentPhotoFileService', 'platformFileUtilControllerFactory',
		function ($scope, resourceEquipmentLeafPhotoService, resourceEquipmentPhotoFileService, platformFileUtilControllerFactory) {
			platformFileUtilControllerFactory.initFileController($scope, resourceEquipmentLeafPhotoService, resourceEquipmentPhotoFileService);
			$scope.allowedFiles = ['image/jpeg'];
		}
	]);
})();