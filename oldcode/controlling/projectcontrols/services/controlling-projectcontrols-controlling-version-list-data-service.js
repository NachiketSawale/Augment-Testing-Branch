
(function (angular) {

	'use strict';
	let moduleName = 'controlling.projectcontrols';
	let controllingProjectControlsModule = angular.module(moduleName);

	controllingProjectControlsModule.factory('controllingProjectcontrolsControllingVersionListDataService',
		['controllingVersionsListDataServiceFactory', 'controllingProjectcontrolsProjectMainListDataService',
			function (controllingVersionsListDataServiceFactory, controllingProjectcontrolsProjectMainListDataService) {

				return controllingVersionsListDataServiceFactory.createControllingVersionsListDataService(moduleName, controllingProjectcontrolsProjectMainListDataService);

			}
		]);
})(angular);
