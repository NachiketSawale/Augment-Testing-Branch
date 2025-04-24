/**
 * Created by janas on 27.08.2015.
 */
(function () {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainPrcPackageLookupDataService
	 * @function
	 *
	 * @description
	 * estimateMainPrcPackageLookupDataService is the data service for Line item context prc package related functionality.
	 */
	angular.module(moduleName).factory('estimateMainPrcPackageLookupDataService',
		['$injector','platformLookupDataServiceFactory',
			function ($injector,platformLookupDataServiceFactory) {

				let prcPackageLookupDataServiceConfig = {
					httpRead: {route: globals.webApiBaseUrl + 'procurement/package/package/', endPointRead: 'lookup'},
					filterParam: 'projectId',
					prepareFilter: function prepareFilter(filterValue) {
						let prjId = $injector.get('estimateMainService').getSelectedProjectId();
						prjId = prjId ? prjId : 0;
						if (prjId === 0 && filterValue) {
							prjId = filterValue;
						}
						return '?projectId=' + prjId;
					}
				};

				let instance =  platformLookupDataServiceFactory.createInstance(prcPackageLookupDataServiceConfig);

				let resetCache = instance.service.resetCache;
				instance.service.resetCache = function(options){
					return resetCache(options);
				};

				$injector.get('estimateMainPrcPackageStatusLookupService').loadLookupData();
				return instance.service;
			}]);
})();
