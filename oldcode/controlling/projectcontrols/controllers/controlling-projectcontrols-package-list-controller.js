(function (angular) {
	/* global  _ */
	'use strict';
	let moduleName='controlling.projectcontrols';

	angular.module(moduleName).controller('controllingProjectControlsPackageListController',
		['$scope', 'platformGridControllerService', 'controllingProjectControlsPackageListDataService', 'controllingProjectcontrolsPackageUIStandardService',
			function ($scope, platformGridControllerService, dataService, configurationService) {

				let myGridConfig = {
					initCalled: false, columns: []
				};

				platformGridControllerService.initListController($scope, configurationService,dataService, null, myGridConfig);
			}
		]);
})(angular);