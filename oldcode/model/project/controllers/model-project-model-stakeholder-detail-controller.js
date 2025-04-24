/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'model.project';

	/**
	 * @ngdoc controller
	 * @name modelProjectModelStakeholderDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details container of stakeholders.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('modelProjectModelStakeholderDetailController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, 'f254928aff3d427193c35f1596304523');
		}]);
})();
