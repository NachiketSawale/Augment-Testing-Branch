/**
 * Created by balkanci on 12.11.2015.
 */
(function (angular) {
	'use strict';
	var moduleName = 'basics.clerk';

	angular.module(moduleName).controller('basicsClerkPhotoController', ['$scope',  'basicsClerkPhotoService', 'basicsClerkMainService','platformFileUtilControllerFactory',
		function ($scope, basicsClerkPhotoService, basicsClerkMainService, platformFileUtilControllerFactory) {
			platformFileUtilControllerFactory.initFileController($scope, basicsClerkMainService, basicsClerkPhotoService);
		}
	]);
})(angular);