
(function (angular) {
	/* global globals _ */
	'use strict';
	let moduleName = 'controlling.projectcontrols';
	let controllingProjectControlsModule = angular.module(moduleName);

	controllingProjectControlsModule.factory('controllingProjectControlsPrcContractListDataService',
		['controllingCommonPrcContractListDataServiceFactory','controllingProjectcontrolsDashboardService','cloudCommonGridService',
			function (controllingCommonPrcContractListDataServiceFactory,parentService,cloudCommonGridService) {
				let serviceOptions = {
					moduleName: moduleName
				};

				return controllingCommonPrcContractListDataServiceFactory.createPrcContractService(serviceOptions,parentService,'controllingProjectControlsPrcContractListDataService');
			}
		]);
})(angular);
