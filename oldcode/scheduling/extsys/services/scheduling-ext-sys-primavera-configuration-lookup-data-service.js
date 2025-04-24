/**
 * Created by csalopek on 20.12.2017.
 */

(function () {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingExtSysPrimaveraConfigurationLookupDataService
	 * @function
	 *
	 * @description
	 * schedulingExtSysPrimaveraConfigurationLookupDataService is the data service for primavera configurations lookup in scheduling extsys
	 */
	angular.module('scheduling.extsys').factory('schedulingExtSysPrimaveraConfigurationLookupDataService', ['platformLookupDataServiceFactory',
		function (platformLookupDataServiceFactory) {
			var schedulingExtSysPrimaveraConfigurationLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'scheduling/extsys/primavera/import/',
					endPointRead: 'configurations'
				}
			};

			return platformLookupDataServiceFactory.createInstance(schedulingExtSysPrimaveraConfigurationLookupDataServiceConfig).service;
		}]);
})();
