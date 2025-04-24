(function (angular) {
	/* global globals */
	'use strict';
	/**
     * @ngdoc service
     * @name projectLocationMainService
     * @function
     *
     * @description
     * projectLocationMainService is the data service for all location related functionality.
     */
	angular.module('basics.indextable').factory('basicsIndexLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsIndexLookupDataService', {
				valMember: 'Id',
				dispMember: 'Description',
				uuid: '377ce2c6433e42b9be1b531cdf798477'
			});
			let locationLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/indexheader/', endPointRead: 'levellist' }
			};
			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);