/**
 * Created by leo on 09.04.2019.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name logisticCardTemplateLookupDataService
	 * @function
	 * @description
	 *
	 * data service for logistic card template lookup.
	 */
	angular.module('basics.lookupdata').factory('logisticCardTemplateLookupDataService', [
		'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('logisticCardTemplateLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: '100',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 150,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'd0e3272497cd4d73b559809241394964'
			});

			var lookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'logistic/cardtemplate/cardtemplate/', endPointRead: 'searchlist'}
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		}
	]);
})(angular);
