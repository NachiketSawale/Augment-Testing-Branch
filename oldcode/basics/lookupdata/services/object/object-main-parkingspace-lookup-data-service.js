(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name objectMainLookupDataService
	 * @function
	 *
	 * @description
	 * objectMainLookupDataService is the data service for all location look ups
	 */
	angular.module('basics.lookupdata').factory('objectMainLookupDataService', ['platformLookupDataServiceFactory','basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator ) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('objectMainLookupDataService', {

				valMember: 'Id',
				dispMember: 'Description',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}
				]

			});


			var locationLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'object/main/unit/', endPointRead: 'getunitsbyprojectid'},
				filterParam: 'unitId',
			};


			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
