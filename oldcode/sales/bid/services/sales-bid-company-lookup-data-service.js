/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {


	'use strict';

	// TODO: move to lookups place
	/**
	 * @ngdoc service
	 * @name salesBidCompanyLookupDataService
	 * @function
	 *
	 * @description
	 * salesBidCompanyLookupDataService is the data service for company lookup in sales bid
	 */
	angular.module('sales.bid').factory('salesBidCompanyLookupDataService', ['globals', 'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', 'ServiceDataProcessArraysExtension', 'basicsCompanyImageProcessor',

		function (globals, platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, ServiceDataProcessArraysExtension, basicsCompanyImageProcessor) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('salesBidCompanyLookupDataService', {
				valMember: 'Id',
				dispMember: 'CompanyName',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'CompanyName',
						field: 'CompanyName',
						name: 'CompanyName',
						formatter: 'description',
						name$tr$: 'cloud.common.entityCompanyName'
					},
					{
						id: 'islive',
						field: 'IsLive',
						name: 'Active',
						name$tr$: 'cloud.common.entityIsLive',
						formatter: 'boolean'
					}
				],
				uuid: '4a8868f6e0844c0e90d0a1ac37e682e0'
			});

			var salesBidCompanyLookupDataServiceConfig = {
				selectableCallback: function selectableCallback(dataItem) {
					let result = false;
					if (dataItem.IsLive) {
						result = true;
					}
					return result;
				},
				httpRead: {route: globals.webApiBaseUrl + 'basics/company/', endPointRead: 'tree'},
				filterParam: 'startId', // 'companyId'
				prepareFilter: function (companyId) {
					return '?startId=' + companyId + '&includeStart=true&depth=10';
				},
				dataProcessor: [new ServiceDataProcessArraysExtension(['Companies']), basicsCompanyImageProcessor],
				tree: {parentProp: 'CompanyFk', childProp: 'Companies'}
			};

			return platformLookupDataServiceFactory.createInstance(salesBidCompanyLookupDataServiceConfig).service;
		}]);
})();
