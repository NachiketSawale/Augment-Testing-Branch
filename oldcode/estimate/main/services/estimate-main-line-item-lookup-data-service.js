/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */
	/**
     * @ngdoc service
     * @name projectLocationMainService
     * @function
     *
     * @description
     * projectLocationMainService is the data service for all location related functionality.
     */
	angular.module('basics.indextable').factory('estimateMainLineItemLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('estimateMainLineItemLookupDataService', {
				valMember: 'Id',
				dispMember: 'LineItemFk',
				columns: [
					{
						id: 'id',
						field: 'LineItemFk',
						name: 'Line Item',
						formatter: 'description',
						name$tr$: 'cloud.common.entityLevel'
					}
				],
				uuid: '4cde1ca3935f4037bad710ce70d2e666'
			});

			let locationLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'estimate/main/escalationresults/', endPointRead: 'lineitemlist' }
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
