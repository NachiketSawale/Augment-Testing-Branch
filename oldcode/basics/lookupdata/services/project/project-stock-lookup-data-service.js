/**
 * Created by baf on 2017/08/29.
 */
(function (angular) {
	'use strict';

	/**
     * @ngdoc service
     * @name projectStockLookupDataService
     * @function
     *
     * @description
     * projectLookupDataService is the data service for all location look ups
     */
	angular.module('basics.lookupdata').factory('projectStockLookupDataService', ['basicsLookupdataConfigGenerator', 'platformLookupDataServiceFactory',

		function (basicsLookupdataConfigGenerator, platformLookupDataServiceFactory) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('projectStockLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 100,
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						width: 150,
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'companyCode',
						field: 'CompanyFk',
						name: 'CompanyCode',
						width: 120,
						name$tr$: 'cloud.common.entityCompanyCode',
						sortable: true,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'company',
							displayMember: 'Code'
						}
					},
					{
						id: 'companyName',
						field: 'CompanyFk',
						name: 'CompanyName',
						width: 120,
						name$tr$: 'cloud.common.entityCompanyName',
						sortable: true,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'company',
							displayMember: 'CompanyName'
						}
					},
					{
						id: 'projectNo',
						field: 'ProjectFk',
						name: 'projectNo',
						width: 120,
						name$tr$: 'cloud.common.entityProjectNo',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'project',
							displayMember: 'ProjectNo'
						}
					},
					{
						id: 'projectName',
						field: 'ProjectFk',
						name: 'projectName',
						width: 150,
						name$tr$: 'cloud.common.entityProjectName',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'project',
							displayMember: 'ProjectName'
						}
					},
					{
						id:'prjStockTypeDesc',
						field: 'StockTypeDescriptionInfo.Translated',
						name: 'prjStockTypeDesc',
						width: 120,
						name$tr$: 'project.stock.stockType',
						formatter: 'description'
					}
				],
				uuid:'b9a0fe4aa0774a7aa62f1f64062593c7'
			});
			var readData = {PKey1: null, PKey2: null, PKey3: null};
			var stockLookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'project/stock/', endPointRead: 'instances'},
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData.PKey1 = item.PKey1;
					readData.PKey2 = item.PKey2;
					readData.PKey3 = item.PKey3;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(stockLookupDataServiceConfig).service;
		}]);
})(angular);



