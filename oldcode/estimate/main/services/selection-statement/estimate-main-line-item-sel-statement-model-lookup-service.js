/**
 * Created by leo on 24.11.2015.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global globals */
	'use strict';

	/**
     * @ngdoc service
     * @name modelLookupDataService
     * @function
     *
     * @description
     * modelLookupDataService is the data service for activity look ups
     */
	angular.module('basics.lookupdata').factory('estimateMainLineItemSelStatementModelLookupService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {


			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('estimateMainLineItemSelStatementModelLookupService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 100,
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						width: 150,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'cd48e4cfc89040428707b483e30cc45b'
			});

			let modelProjectModelLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'model/project/model/', endPointRead: 'list' },
				filterParam: 'mainItemId',
				prepareFilter: function prepareFilter(Id) {
					if (Id === null || Id === undefined)
					{
						Id = 1;
					}
					return '?mainItemId=' + Id;
				}
			};

			return platformLookupDataServiceFactory.createInstance(modelProjectModelLookupDataServiceConfig).service;
		}]);
})(angular);
