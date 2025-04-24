/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.main';

	angular.module(moduleName).controller('modelMainObject2LocationDetailController',
		modelMainObject2LocationDetailController);

	modelMainObject2LocationDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function modelMainObject2LocationDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'fe0d49279eb4464a8e6744816de8ff76');
	}
})(angular);
