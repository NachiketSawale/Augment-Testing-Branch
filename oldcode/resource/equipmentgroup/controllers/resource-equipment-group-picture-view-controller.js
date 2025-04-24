(function (angular) {
	'use strict';
	const moduleName = 'resource.equipmentgroup';

	angular.module(moduleName).controller('resourceEquipmentGroupPictureViewController',
		['$scope', 'platformFileUtilControllerFactory', 'resourceEquipmentGroupPictureDataService', 'resourceEquipmentGroupPictureFileService',
		function ($scope, platformFileUtilControllerFactory, resourceEquipmentGroupPictureDataService, resourceEquipmentGroupPictureFileService) {
			platformFileUtilControllerFactory.initFileController($scope, resourceEquipmentGroupPictureDataService, resourceEquipmentGroupPictureFileService);

			$scope.allowedFiles = ['image/jpeg'];
		}
	]);
})(angular);