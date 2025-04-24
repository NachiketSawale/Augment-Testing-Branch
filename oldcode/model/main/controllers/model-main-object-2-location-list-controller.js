/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.main';

	angular.module(moduleName).controller('modelMainObject2LocationListController',
		modelMainObject2LocationListController);

	modelMainObject2LocationListController.$inject = ['$scope', 'platformContainerControllerService'];

	function modelMainObject2LocationListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '119fdb6a6c384668b9cc6c9882c14161');
	}
})(angular);
