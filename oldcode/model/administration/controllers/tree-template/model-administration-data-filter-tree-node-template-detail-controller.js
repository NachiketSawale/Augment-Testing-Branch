/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'model.administration';

	/**
	 * @ngdoc controller
	 * @name modelAdministrationDataFilterTreeNodeTemplateDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details container of data filter tree template.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('modelAdministrationDataFilterTreeNodeTemplateDetailController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, 'f9711d08b2e842bc9175a47dbbb0205d');
		}]);
})();


