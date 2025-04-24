/**
 * Created by Sahil Saluja on 30.12.2019.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	/**
     * @ngdoc service
     * @name projectLocationMainService
     * @function
     *
     * @description
     * projectLocationMainService is the data service for all location related functionality.
     */
	angular.module('procurement.common').factory('prcCommonTextTypeLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('prcCommonTextTypeLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				columns: [
					{
						id: 'id',
						field: 'DescriptionInfo.Translated',
						name: 'PrcTexttype',
						formatter: 'description',
						name$tr$: 'cloud.common.entityTextType'
					}
				],
				uuid: '377ce2c6433e42bb9e1b531cdf798477'
			});

			var locationLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/procurementconfiguration/', endPointRead: 'getTextType' }
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
