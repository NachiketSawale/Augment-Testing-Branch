/**
 * Created by leo on 08.05.2018.
 */
(function () {
	'use strict';
	const moduleName = 'timekeeping.employee';

	angular.module(moduleName).controller('timekeepingEmployeePictureController', ['$scope', 'timekeepingEmployeePictureDataService', 'timekeepingEmployeePictureFileService', 'platformFileUtilControllerFactory',
		function ($scope, timekeepingEmployeePictureDataService, timekeepingEmployeePictureFileService, platformFileUtilControllerFactory) {
			platformFileUtilControllerFactory.initFileController($scope, timekeepingEmployeePictureDataService, timekeepingEmployeePictureFileService);
			$scope.allowedFiles = ['image/jpeg'];
		}
	]);
})();