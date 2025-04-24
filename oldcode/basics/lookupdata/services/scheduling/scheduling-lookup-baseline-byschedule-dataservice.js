/**
 * Created by sprotte on 20.04.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingLookupBaselineDataServiceBySchedule
	 * @function
	 *
	 * @description
	 * schedulingLookupBaselineDataServiceBySchedule is a data service for schedule baseline lookups
	 * filtered by schedule
	 */
	angular.module('basics.lookupdata').factory('schedulingLookupBaselineDataServiceBySchedule', ['$http', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function ($http, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var options, factoryservice, schedulingCalendarLookupDataServiceConfig;
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('schedulingLookupBaselineDataServiceBySchedule', {
				valMember: 'Id',
				dispMember: 'Description',
				columns: [
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '421dd8124ad2489499451e33c54048aa'
			});

			schedulingCalendarLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'scheduling/main/baseline/', endPointRead: 'list'},
				filterParam: 'PsdScheduleFk'
			};

			factoryservice = platformLookupDataServiceFactory.createInstance(schedulingCalendarLookupDataServiceConfig);

			// now we modify the factory-built lookup data service if filter has been set
			options = factoryservice.options.httpRead;
			factoryservice.data.readData = function readData() {
				return $http.post(options.route + 'listbyschedule', {Filter: this.filter});
			};

			return factoryservice.service;
		}]);
})(angular);
