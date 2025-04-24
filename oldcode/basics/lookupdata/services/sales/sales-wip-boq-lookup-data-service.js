(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name salesWipBoqLookupDataService
	 * @function
	 *
	 * @description
	 * salesWipBoqLookupDataService is the data service for wip boq
	 */
	angular.module('basics.lookupdata').factory('salesWipBoqLookupDataService', ['platformLookupDataServiceFactory','basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator ) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('salesWipBoqLookupDataService', {

				valMember: 'Id',
				dispMember: 'Reference',
				columns: [
					{
						id: 'Reference',
						field: 'Reference',
						name: 'Reference',
						formatter: 'code',
						name$tr$: 'boq.main.Reference'
					},
					{
						id: 'Outline Specification',
						field: 'BriefInfo',
						name: 'BriefInfo',
						formatter: 'translation',
						name$tr$: 'boq.main.Brief'
					}
				],
				uuid: '606b2b654e3a482b8f0b37fbf0b34cd1'
			});

			var lookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'boq/main/', endPointRead: 'getpureboqitembyid'},
				filterParam: 'headerId'
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		}]);
})(angular);
