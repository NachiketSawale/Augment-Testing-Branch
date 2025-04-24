/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
     * @ngdoc service
     * @name projectLocationMainService
     * @function
     *
     * @description
     * projectLocationMainService is the data service for all location related functionality.
     */
	angular.module('estimate.main').factory('estimateMainBasicsScurveLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('estimateMainBasicsScurveLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Description',
				columns: [
					{
						id: 'id',
						field: 'DescriptionInfo.Description',
						name: 'Scurve',
						formatter: 'description',
						name$tr$: 'cloud.common.entityLevel'
					}
				],
				uuid: '11e6095d8f734477aceced57a01f9560'
			});

			let locationLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'estimate/main/escalationcostchart/', endPointRead: 'scurvelist' }
			};

			return platformLookupDataServiceFactory.createInstance(locationLookupDataServiceConfig).service;
		}]);
})(angular);
