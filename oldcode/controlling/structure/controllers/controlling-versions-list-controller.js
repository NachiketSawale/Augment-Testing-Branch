
(function () {

	'use strict';
	var moduleName = 'controlling.structure';

	angular.module(moduleName).controller('controllingVersionsListController',
		['$scope','controllingVersionsListDataService','controllingVersionsListControllerFactory',
			function ($scope,dataService,controllingVersionsListControllerFactory) {

				controllingVersionsListControllerFactory.initControllingVersionListController($scope, dataService);

			}
		]);
})();