/*
 * $Id: privacy-main-privacy-request-list-controller.js 627998 2021-03-16 15:37:51Z leo $
 * Copyright (c) RIB Software SE
 */

((angular) => {
	'use strict';

	let moduleName = 'privacy.main';

	angular.module(moduleName).controller('privacyMainPrivacyRequestListController', ['$scope',
		'platformContainerControllerService', 'privacyMainConstantValues',
		function ($scope, platformContainerControllerService, privacyMainConstantValues) { // jshint ignore:line
			platformContainerControllerService.initController($scope, moduleName, privacyMainConstantValues.uuid.container.requestList);
		}]);
})(angular);
