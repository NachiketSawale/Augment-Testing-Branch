/**
 * Created by Roberson Luo on 15.03.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name constructionSystemMainInstanceLookupDataService
	 * @function
	 * @description
	 *
	 * data service for constructionsystem main instance lookup.
	 */
	angular.module('basics.lookupdata').factory('constructionSystemMainInstanceLookupDataService', [
		'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('constructionSystemMainInstanceLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode',
						width: 100
					},
					{
						id: 'description',
						field: 'DescriptionInfo.Translated',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription',
						width: 150
					}
				],
				uuid: '77e7540ed3104bea86bb9cda626f6ead'
			});

			var lookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'constructionsystem/main/instance/', endPointRead: 'lookup'},
				filterParam: 'mainItemId'
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		}
	]);
})(angular);
