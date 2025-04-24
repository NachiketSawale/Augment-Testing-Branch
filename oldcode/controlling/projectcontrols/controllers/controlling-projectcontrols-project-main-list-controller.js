
(function () {

	'use strict';
	var moduleName = 'controlling.projectcontrols';

	angular.module(moduleName).controller('controllingProjectcontrolsProjectMainListController',
		['$scope','controllingProjectcontrolsProjectMainListDataService', 'controllingCommonProjectMainListControllerFactory',
			function ($scope,dataService,controllingCommonProjectMainListControllerFactory) {

				controllingCommonProjectMainListControllerFactory.initController($scope, dataService, moduleName);

			}
		]);
})();