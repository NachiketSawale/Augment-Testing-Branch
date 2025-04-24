/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */

	/**
     * @ngdoc service
     * @name basicsEfbSheetsWageGroupLookupDataService
     * @function
     *
     * @description
     * basicsEfbSheetsWageGroupLookupDataService is the data service for all WageGroup related functionality.
     */
	angular.module('basics.efbsheets').factory('basicsEfbSheetsWageGroupLookupDataService', ['$http','platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function ($http,platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsEfbSheetsWageGroupLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'Group',
						field: 'Group',
						name: 'Group',
						formatter: 'code',
						name$tr$: 'basics.customize.group'
					},
					{
						id: 'MarkUpRate',
						field: 'MarkupRate',
						name: 'MarkupRate',
						formatter: 'money',
						name$tr$: 'basics.efbsheets.markupRate'
					}
				],
				uuid: 'bca22c43a73a4138a9f61f46b42bbe12'
			});

			let wageGroupLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/efbsheets/averagewages/', endPointRead: 'listofwagegroups' }
			};

			return platformLookupDataServiceFactory.createInstance(wageGroupLookupDataServiceConfig).service;
		}]);
})(angular);
