/*
 * $Id: timekeeping-layout-user-interface-layout-detail-controller.js 548315 2019-06-19 12:26:42Z baf $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'timekeeping.layout';

	angular.module(moduleName).controller('timekeepingLayoutUserInterfaceLayoutDetailController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, '0f43a4ef30aa4686ab0bf5d5ad256f4b');
		}]);
})(angular);
