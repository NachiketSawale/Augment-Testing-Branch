(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCountryLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCountryLookupDataService is the data service providing data for Country look ups
	 */
	angular.module('cloud.translation').factory('cloudTranslationSourceLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', 'globals',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, globals) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('cloudTranslationSourceLookupDataService', {
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
				uuid: 'ffdd4df03c5c4deebc7e90bba3ddc58e'
			});

			const locationLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'cloud/translation/source/',
					endPointRead: 'listSource',
					usePostForRead: true
				}
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
