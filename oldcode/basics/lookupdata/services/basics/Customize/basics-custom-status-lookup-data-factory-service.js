/**
 * Created by Frank on 04.02.2016
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCustomStatusLookupDataFactoryService
	 * @function
	 *
	 * @description
	 * basicsCustomQuotationStatusLookupDataService is the data service factory for all status look ups
	 */
	angular.module('basics.lookupdata').service('basicsCustomStatusLookupDataFactoryService', BasicsCustomStatusLookupDataFactoryService);

	BasicsCustomStatusLookupDataFactoryService.$inject = ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator'];

	function BasicsCustomStatusLookupDataFactoryService(platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
		this.createService = function createService(servName, routePostfix) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec(servName, {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				showIcon: true,
				columns: [
					{
						id: 'Icon',
						field: 'Icon',
						name: 'Icon',
						formatter: 'image',
						formatterOptions: {
							imageSelector: 'platformStatusIconService'
						},
						width: 50,
						name$tr$: 'cloud.common.entityIcon'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '1e7f9c2acc59444a875ad0f6f8a40c40'
			});

			var readData =  { PKey1: null };
			var basicsCustomQuotationStatusLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/' + routePostfix + '/', endPointRead: 'list', usePostForRead: true },
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(basicsCustomQuotationStatusLookupDataServiceConfig).service;
		};
	}
})(angular);
