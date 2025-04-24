/**
 * Created by lvy on 10/09/2020.
 */
(function(){
	'use strict';

	var moduleName = 'procurement.common';
	angular.module(moduleName).factory('procurementCommonMasterRestrictionPrjBoqLookupDataService', [
		'$q',
		'globals',
		'platformLookupDataServiceFactory',
		function (
			$q,
			globals,
			platformLookupDataServiceFactory
		) {
			let service = {};
			let boqHeaderLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'boq/project/', endPointRead: 'list' },
				filterParam: 'projectId',
				prepareFilter: function (projectId) {
					return '?projectId=' + projectId;
				}
			};

			let container = platformLookupDataServiceFactory.createInstance(boqHeaderLookupDataServiceConfig);

			service = container.service;

			return service;
		}
	]);
})();