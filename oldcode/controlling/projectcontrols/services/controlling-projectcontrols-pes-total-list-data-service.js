
(function (angular) {
	/* global globals _ */
	'use strict';
	let moduleName = 'controlling.projectcontrols';
	let controllingProjectControlsModule = angular.module(moduleName);
	
	controllingProjectControlsModule.factory('controllingProjectControlsPesTotalListDataService',
		['controllingCommonPesTotalDataServiceFactory', 'controllingProjectcontrolsDashboardService', 'cloudCommonGridService',
			function (controllingCommonPesTotalDataServiceFactory, parentService, cloudCommonGridService) {
				let serviceOptions = {
					module: moduleName
				};
				return controllingCommonPesTotalDataServiceFactory.createPesDataService(serviceOptions, parentService, 'controllingProjectControlsPesTotalListDataService');
			}
		]);
})(angular);
