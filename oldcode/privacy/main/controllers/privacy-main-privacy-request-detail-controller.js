/*
 * $Id: privacy-main-privacy-request-detail-controller.js 627998 2021-03-16 15:37:51Z leo $
 * Copyright (c) RIB Software SE
 */

((angular) => {
	'use strict';

	let moduleName = 'privacy.main';

	angular.module(moduleName).controller('privacyMainPrivacyRequestDetailController', ['$scope',
		'platformContainerControllerService', 'privacyMainConstantValues',
		function ($scope, platformContainerControllerService, privacyMainConstantValues) {
			platformContainerControllerService.initController($scope, moduleName, privacyMainConstantValues.uuid.container.requestDetail);
		}]);
})(angular);
