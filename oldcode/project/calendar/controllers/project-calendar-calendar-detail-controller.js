/*
 * $Id: project-calendar-calendar-detail-controller.js 537450 2019-03-14 14:55:18Z leo $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'project.calendar';

	angular.module(moduleName).controller('projectCalendarCalendarDetailController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, 'bc9bfd0c36bf4c4aa7f9f40d109e35c1');
		}]);
})(angular);
