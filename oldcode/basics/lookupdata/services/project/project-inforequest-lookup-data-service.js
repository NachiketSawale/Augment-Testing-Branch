(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectInfoRequestLookupDataService
	 * @function
	 *
	 * @description
	 * projectInfoRequestLookupDataService is the data service for all project info request look ups
	 */
	angular.module('basics.lookupdata').factory('projectInfoRequestLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var readData =  { PKey1: -1};

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('projectInfoRequestLookupDataService', {
				valMember: 'Id',
				dispMember: 'Description',
				columns: [
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'descriptiom',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}]
			});

			var projectRFIRequestLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'project/rfi/informationrequest/', endPointRead: 'listByProject'},
				filterParam: readData,
				prepareFilter: function prepareFilter(Id) {
					readData.PKey1 = Id;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(projectRFIRequestLookupDataServiceConfig).service;
		}]);
})(angular);

