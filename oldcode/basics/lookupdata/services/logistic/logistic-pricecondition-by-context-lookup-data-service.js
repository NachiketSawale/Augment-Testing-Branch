(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name logisticPriceConditionByContextLookupDataService
	 * @function
	 *
	 * @description
	 * logisticPriceConditionByContextLookupDataService is the data service for all project cost-group1 look ups
	 */
	angular.module('basics.lookupdata').factory('logisticPriceConditionByContextLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('logisticPriceConditionByContextLookupDataService', {
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
				uuid: 'f0de29528b794139b320ae492bfcdf10'
			});


			var logisticPriceConditionByContextLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'logistic/pricecondition/', endPointRead: 'bycontext' },
				filterParam: 'contextId'
			};

			return platformLookupDataServiceFactory.createInstance(logisticPriceConditionByContextLookupDataServiceConfig).service;
		}]);
})(angular);
