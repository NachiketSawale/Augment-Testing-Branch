/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */
	/**
	 * @ngdoc service
	 * @name basicsCustomRoundingMethodLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCustomRoundingMethodLookupDataService is the data service for Rounding Method list.
	 */
	angular.module('basics.lookupdata').factory('basicsCustomRoundingMethodLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCustomRoundingMethodLookupDataService', {
				valMember: 'Id',
				dispMember: 'Type',
				columns: [
					{
						id: 'Description',
						field: 'Type',
						name: 'Description',
						formatter: 'description',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '96816e207b004873bfd527dac870023d'
			});

			let basicsCustomClerkRoleLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/roundingmethod/', endPointRead: 'list', usePostForRead: true },
			};

			return platformLookupDataServiceFactory.createInstance(basicsCustomClerkRoleLookupDataServiceConfig).service;
		}]);
})(angular);
