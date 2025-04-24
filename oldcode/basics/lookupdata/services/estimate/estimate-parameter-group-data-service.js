/**
 * Created by zos on 3/28/2016.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name estParamGroupLookupDataService
	 * @function
	 *
	 * @description
	 * estParamGroupLookupDataService is the data service for all estParamGroup look ups
	 */
	angular.module('basics.lookupdata').factory('estParamGroupLookupDataService',
		['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
			function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

				basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('estParamGroupLookupDataService', {
					valMember: 'Id',
					dispMember: 'DescriptionInfo.Translated',
					columns: [
						{
							id: 'desc',
							field: 'DescriptionInfo',
							name: 'Description',
							formatter: 'translation',
							width: 150,
							name$tr$: 'cloud.common.entityDescription'
						}
					],
					uuid: 'e8bf5be96d334725b43cd68151e8024d'
				});

				var lookupDataServiceConfig = {
					httpRead: {route: globals.webApiBaseUrl + 'basics/lookupdata/master/', endPointRead: 'getlist?lookup=EstParamGroup'}
				};

				return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
			}]);
})(angular);