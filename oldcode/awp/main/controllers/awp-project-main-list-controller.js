/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	const moduleName = 'awp.main';

	angular.module(moduleName).controller('awpProjectMainListController',
		['$scope','awpProjectMainListDataService', 'projectCommonListControllerFactory',
			function ($scope,dataService,projectCommonListControllerFactory) {
				let myGridConfig = {
					initCalled: false,
					grouping: true,
					type: 'awp.project',
					columns: []
				};
				projectCommonListControllerFactory.initController($scope, myGridConfig, dataService, {
					addNavigateToProject : true
				});

			}
		]);
})();