(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCountryLookupDataService
	 * @function
	 *
	 * @description
	 * platformGridConfigUserLabelLookupService is the data service providing data for user label lookup
	 */
	angular.module('platform').factory('platformGridConfigUserLabelLookupService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', 'globals',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, globals) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('platformGridConfigUserLabelLookupService', {
				uuid: '7f644bce8e034baeaa4bf306c466e20b',
				valueMember: 'Id',
				displayMember: 'Code',
				columns:[
					{id: 'Code', field: 'Code', name: 'Code', width: 150},
					{id: 'KeyWords', field: 'KeyWords', name: 'Key Words', width: 150},
				]
			});

			const locationLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/customize/userlabel/',
					endPointRead: 'list',
					usePostForRead: true
				}
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
