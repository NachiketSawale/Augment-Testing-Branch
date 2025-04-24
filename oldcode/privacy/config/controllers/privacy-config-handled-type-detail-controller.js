/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'privacy.config';

	angular.module(moduleName).controller('privacyConfigHandledTypeDetailController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, 'mainEntityDetailGuid');
		}]);
})(angular);
