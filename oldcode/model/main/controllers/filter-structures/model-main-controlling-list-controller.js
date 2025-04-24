/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.main';

	/**
	 * @ngdoc controller
	 * @name modelMainControllingListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of Controlling Unit entities.
	 **/
	angular.module(moduleName).controller('modelMainControllingListController',
		ModelMainControllingListController);

	ModelMainControllingListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ModelMainControllingListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '36d21eb2c11b452cac50a62451dfc0ac');
	}
})(angular);
