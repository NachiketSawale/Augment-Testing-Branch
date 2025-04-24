/**
 * Created by baf on 2018/03/13.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name logisticSundryServiceLookupDataService
	 * @function
	 *
	 * @description
	 * logisticSundryServiceLookupDataService is the data service for all Address Format
	 */
	angular.module('basics.lookupdata').factory('logisticSundryServiceLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('logisticSundryServiceGroupLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				showIcon:true,
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 300,
						name$tr$: 'cloud.common.entityCode'
					}
				],
				uuid: 'cd8335de34ee47d2bbf1de02a87d0a3d'
			});

			var logisticSundryServiceGroupLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'logistic/sundryservice/', endPointRead: 'listbycontext' },
			};

			return platformLookupDataServiceFactory.createInstance(logisticSundryServiceGroupLookupDataServiceConfig).service;
		}]);
})(angular);
