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
	angular.module('cloud.translation').factory('cloudTranslationLanguageLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', 'globals',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, globals) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('cloudTranslationLanguageLookupDataService', {
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
				uuid: '6d23e282d14842cc8c77c57f1d759a60'
			});

			const locationLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'cloud/translation/language/',
					endPointRead: 'listLanguage',
					usePostForRead: true
				}
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
