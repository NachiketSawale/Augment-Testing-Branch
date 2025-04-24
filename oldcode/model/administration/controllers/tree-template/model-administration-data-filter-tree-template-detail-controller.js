/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'model.administration';

	/**
	 * @ngdoc controller
	 * @name modelAdministrationDataFilterTreeTemplateDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details container of data filter tree template.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('modelAdministrationDataFilterTreeTemplateDetailController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, 'd5e4452554d14a598da94cb3ed1cf7d0');
		}]);
})();


