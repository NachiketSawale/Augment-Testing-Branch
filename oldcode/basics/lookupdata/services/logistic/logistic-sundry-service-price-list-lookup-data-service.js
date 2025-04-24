/**
 * Created by baf on 2018-03-13.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name logisticSundryServicePriceListLookupDataService
	 * @function
	 *
	 * @description
	 * logisticSundryServicePriceListLookupDataService is the data service for all project cost-group1 look ups
	 */
	angular.module('basics.lookupdata').factory('logisticSundryServicePriceListLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			var readData =  { PKey1: null };

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('logisticSundryServicePriceListLookupDataService', {
				valMember: 'Id',
				dispMember: 'CommentText',
				showIcon:true,
				columns: [
					{
						id: 'comment',
						field: 'CommentText',
						name: 'Comment',
						formatter: 'comment',
						width: 300,
						name$tr$: 'cloud.common.entityComment'
					}
				],
				uuid: '0447901426cb40c390c9931f775c2e64'
			});


			var logisticSundryServicePriceListLookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'logistic/sundryservice/pricelist/',
					endPointRead: 'listbyparent'
				},
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(logisticSundryServicePriceListLookupDataServiceConfig).service;
		}]);
})(angular);
