(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectRfiContributionLookupDataService
	 * @function
	 *
	 * @description
	 * projectRfiContributionLookupDataService is the data service for all project icontribution look ups
	 */
	angular.module('basics.lookupdata').factory('projectRfiContributionLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var readData =  { PKey1: -1};

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('projectRfiContributionLookupDataService', {
				valMember: 'Id',
				dispMember: 'DateRaised',
				columns: [
					{
						id: 'DateRaised',
						field: 'DateRaised',
						name: 'Date',
						formatter: 'date',
						width: 300,
						name$tr$: 'cloud.common.entityDate'
					}]
			});

			var projectRFIContributionLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'project/rfi/requestcontribution/', endPointRead: 'list'},
				filterParam: readData,
				prepareFilter: function prepareFilter(Id) {
					readData.PKey1 = Id;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(projectRFIContributionLookupDataServiceConfig).service;
		}]);
})(angular);

