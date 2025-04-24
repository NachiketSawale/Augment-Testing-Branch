/**
 * Created by shen on 2024-04-02
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name logisticPricingGroupLookupDataService
	 * @function
	 *
	 * @description
	 * logisticPricingGroupLookupDataService
	 */
	angular.module('basics.lookupdata').factory('logisticPricingGroupLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('logisticPricingGroupLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				showIcon:true,
				columns: [
					{
						id: 'description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription',
						width: 120
					}
				],
				uuid: 'f0de29528b794139b320ae492bfcdfe0'
			});


			let logisticPricingGroupLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'logistic/pricecondition/item/', endPointRead: 'listpricinggroupbyid' },
				filterParam: 'priceConditionFk'
			};

			return platformLookupDataServiceFactory.createInstance(logisticPricingGroupLookupDataServiceConfig).service;
		}]);
})(angular);
