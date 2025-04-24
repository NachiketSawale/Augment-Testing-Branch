/*
 * $Id: model-change-type-lookup-data-service.js 467801 2017-11-13 12:55:59Z kh $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name modelChangeTypeLookupDataService
	 * @function
	 *
	 * @description
	 * A data service for lookups that display model change types.
	 */
	angular.module('basics.lookupdata').factory('modelChangeTypeLookupDataService', ['platformLookupDataServiceFactory',
		'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('modelChangeTypeLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						formatter: 'comment',
						width: 150,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '04ced1cbea30495d9530a8e6a597c78b'
			});

			var modelChangeTypeLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'model/change/type/', endPointRead: 'all' }
			};

			return platformLookupDataServiceFactory.createInstance(modelChangeTypeLookupDataServiceConfig).service;
		}]);
})(angular);
