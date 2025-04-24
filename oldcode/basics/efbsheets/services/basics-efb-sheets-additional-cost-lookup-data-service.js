/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/* global globals */

	/**
     * @ngdoc service
     * @name basicsEfbSheetsAdditionalCostLookupDataService
     * @function
     *
     * @description
     * basicsEfbSheetsAdditionalCostLookupDataService is the data service for all Surcharge related functionality.
     */
	angular.module('basics.efbsheets').factory('basicsEfbSheetsAdditionalCostLookupDataService', ['$http','platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function ($http,platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsEfbSheetsAdditionalCostLookupDataService', {
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
				uuid: 'a864c999997142a28c7130e214203c58'
			});

			let additionalCostLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/efbsheets/crewmixafsn/', endPointRead: 'listofadditionalcosts' }
			};

			return platformLookupDataServiceFactory.createInstance(additionalCostLookupDataServiceConfig).service;
		}]);
})(angular);
