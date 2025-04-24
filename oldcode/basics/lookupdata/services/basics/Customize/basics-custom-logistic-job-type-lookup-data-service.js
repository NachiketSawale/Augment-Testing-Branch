/**
 * $Id: basics-custom-logistic-job-type-lookup-data-service.js 46190 2023-08-01 07:38:12Z baf $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */
	/**
	 * @ngdoc service
	 * @name basicsCustomLogisticJobTypeLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCustomLogisticJobTypeLookupDataService is the data service for Rounding Method list.
	 */
	angular.module('basics.lookupdata').factory('basicsCustomLogisticJobTypeLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCustomLogisticJobTypeLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '45c50354a6b742eb81c5b4ebaea0a39f'
			});

			let basicsCustomClerkRoleLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/jobtype/', endPointRead: 'list', usePostForRead: true },
			};

			return platformLookupDataServiceFactory.createInstance(basicsCustomClerkRoleLookupDataServiceConfig).service;
		}]);
})(angular);
