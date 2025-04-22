/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function () {

	'use strict';
	var moduleName = 'sales.wip';

	/**
	 * @ngdoc controller
	 * @name salesWipContractListController
	 * @function
	 *
	 * @description
	 * Controller for the related contract list view of a selected wip (header) entity.
	 **/
	angular.module(moduleName).controller('salesWipContractListController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {
				platformContainerControllerService.initController($scope, moduleName, '7231283a45584ee0bd48b7343c42dae0');
			}
		]);
})();
