/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */

	/**
     * @ngdoc service
     * @name basicsEfbSheetsSurchargeLookupDataService
     * @function
     *
     * @description
     * basicsEfbSheetsSurchargeLookupDataService is the data service for all Surcharge related functionality.
     */
	angular.module('basics.efbsheets').factory('basicsEfbSheetsSurchargeLookupDataService', ['$http','platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function ($http,platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsEfbSheetsSurchargeLookupDataService', {
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
				uuid: '88d3029b683241faa58a28d3ad27ac0d'
			});

			let surchargeLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/efbsheets/crewmixaf/', endPointRead: 'listofsurcharges' }
			};

			return platformLookupDataServiceFactory.createInstance(surchargeLookupDataServiceConfig).service;
		}]);
})(angular);
