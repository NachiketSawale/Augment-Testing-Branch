(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name logisticPriceConditionLookupDataService
	 * @function
	 *
	 * @description
	 * logisticPriceConditionLookupDataService is the data service for all project cost-group1 look ups
	 */
	angular.module('basics.lookupdata').factory('logisticPriceConditionLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('logisticPriceConditionLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				showIcon:true,
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'descriptionInfo',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'db39ece0ac39418e97cbffe7ca925116'
			});


			var logisticPriceConditionLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'logistic/pricecondition/',
					endPointRead: 'listbycontext'
				}
			};

			return platformLookupDataServiceFactory.createInstance(logisticPriceConditionLookupDataServiceConfig).service;
		}]);
})(angular);
