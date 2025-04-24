/**
 * $Id: basics-custom-logistic-action-item-type-lookup-data-service.js$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global globals */
	/**
	 * @ngdoc service
	 * @name basicsCustomLogisticActionItemTypeLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCustomLogisticActionItemTypeLookupDataService is the data service for Action Item Type list.
	 */
	angular.module('basics.lookupdata').factory('basicsCustomLogisticActionItemTypeLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('basicsCustomLogisticActionItemTypeLookupDataService', {
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
				uuid: '3a51bf834b8649069172d23ec1ba35e2'
			});

			let basicsCustomActionItemTypeLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/logisticsactionitemtype/', endPointRead: 'list', usePostForRead: true },
			};

			return platformLookupDataServiceFactory.createInstance(basicsCustomActionItemTypeLookupDataServiceConfig).service;
		}]);
})(angular);
