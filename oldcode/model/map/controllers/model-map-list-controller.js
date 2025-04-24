/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var moduleName = 'model.map';

	/**
	 * @ngdoc controller
	 * @name modelMapListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of the models
	 **/
	angular.module(moduleName).controller('modelMapListController',
		['$scope', 'platformContainerControllerService', 'modelMapDataService',
			function ($scope, platformContainerControllerService, modelMapDataService) {
				platformContainerControllerService.initController($scope, moduleName, 'b3283ad1a7424388b03ca5a47fa09d15');
				modelMapDataService.retrieveRefreshedModelMaps();
			}
		]);
})(angular);
