(function () {
	/*global angular*/
	'use strict';
	var moduleName = 'object.main';

	angular.module(moduleName).controller('objectMainPhotoController', ['$scope', 'objectMainUnitPhotoService', 'objectMainPhotoFileService', 'platformFileUtilControllerFactory',
		function ($scope, objectMainUnitPhotoService, objectMainPhotoFileService, platformFileUtilControllerFactory) {
			platformFileUtilControllerFactory.initFileController($scope, objectMainUnitPhotoService, objectMainPhotoFileService);
		}
	]);
})();