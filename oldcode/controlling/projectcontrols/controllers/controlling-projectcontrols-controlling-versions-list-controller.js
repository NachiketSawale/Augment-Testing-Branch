
(function () {

	'use strict';
	var moduleName = 'controlling.projectcontrols';

	angular.module(moduleName).controller('controllingProjectcontrolsControllingVersionsListController',
		['$scope','controllingProjectcontrolsControllingVersionListDataService', 'controllingVersionsListControllerFactory',
			function ($scope,dataService,controllingVersionsListControllerFactory) {

				controllingVersionsListControllerFactory.initControllingVersionListController($scope, dataService);

			}
		]);
})();