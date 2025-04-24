/**
 * Created by balkanci on 17.07.2015.
 */
(function (angular) {
	'use strict';

	angular.module('basics.lookupdata').factory('basicsCompanySequenceTypeDataService', ['platformLookupDataServiceFactory','basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCompanySequenceTypeDataService', {
				valMember: 'Id',
				dispMember: 'Description'
			});

			var basicsLookupMaterialCatalogDataServiceConfig = {
				dataAlreadyLoaded:true
			};

			return platformLookupDataServiceFactory.createInstance(basicsLookupMaterialCatalogDataServiceConfig).service;
		}]);
})(angular);
