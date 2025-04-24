/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var moduleName = 'model.project';

	/**
	 * @ngdoc controller
	 * @name modelProjectPropertyKeyBlackListListController
	 * @function
	 *
	 * @description
	 * Controller for the list container of property black list for model comparison.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('modelProjectPropertyKeyBlackListListController', ['$scope',
		'platformContainerControllerService', 'modelAdministrationPropertyKeyBlacklistHelperService',
		'modelProjectPropertyKeyBlackListDataService',
		function ($scope, platformContainerControllerService, modelAdministrationPropertyKeyBlacklistHelperService,
		          modelProjectPropertyKeyBlackListDataService) {
			platformContainerControllerService.initController($scope, moduleName, '90ed732516e74347a59f2a187f3246ad');

			modelAdministrationPropertyKeyBlacklistHelperService.addBlacklistByTagButton($scope, true, function () {
				return modelProjectPropertyKeyBlackListDataService.load();
			});
		}]);
})(angular);
