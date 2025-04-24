/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	var moduleName = 'privacy.config';

	angular.module(moduleName).controller('privacyConfigHandledTypeListController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) { // jshint ignore:line
			platformContainerControllerService.initController($scope, moduleName, '2fc25afb5e2b4b06afac50f375b2469a');
		}]);
})();
