/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'model.administration';

	/**
	 * @ngdoc controller
	 * @name modelAdministrationDataFilterTreeNodeTemplateListController
	 * @function
	 *
	 * @description
	 * Controller for the details container of data filter tree node template.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('modelAdministrationDataFilterTreeNodeTemplateListController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, '9d4324768ea240a59b0f68e56eaa4f08');
		}]);
})();