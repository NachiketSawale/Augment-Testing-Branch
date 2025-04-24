
(function (angular) {
	/* global globals _ */
	'use strict';
	let moduleName = 'controlling.projectcontrols';
	let controllingProjectControlsModule = angular.module(moduleName);

	controllingProjectControlsModule.factory('controllingProjectControlsActualListDataService',
		['controllingCommonActualDataServiceFactory','controllingProjectcontrolsDashboardService',
			function (controllingCommonActualDataServiceFactory,parentService) {

				let serviceOptions = {
					module: moduleName,
					serviceName: 'controllingProjectControlsActualListDataService'
				};


				return controllingCommonActualDataServiceFactory.createActualListDataService(serviceOptions,parentService,'controllingProjectControlsActualListDataService');
			}
		]);
})(angular);
