/**
 * Created by bel on 09.28.2018.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectMaterialJobLookupByProjectDataService
	 * @function
	 * @description
	 *
	 * data service for project cost code with job lookup filter by project.
	 */
	angular.module('basics.lookupdata').factory('projectMaterialJobLookupByProjectDataService', [
		'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator', '$injector',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator, $injector) {

			var readData = {projectId: null};

			var columns = [
				{
					id: 'lgmjobfk',
					field: 'LgmJobFk',
					name: 'Job',
					width: 100,
					name$tr$: 'estimate.project.lgmJobFk',
					formatter: 'lookup',
					formatterOptions: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'logisticJobLookupByProjectDataService',
						cacheEnable: true,
						additionalColumns: false,
						filter: function () {
							return $injector.get('estimateMainService').getSelectedProjectId();
						}
					}).grid.formatterOptions
				},
				{
					id: 'EstimatePrice',
					field: 'EstimatePrice',
					name: 'EstimatePrice',
					formatter: 'money',
					width: 70,
					name$tr$: 'basics.costcodes.unitRate'
				},
				{
					id: 'UomFk',
					field: 'UomFk',
					name: 'Uom',
					width: 50,
					name$tr$: 'basics.costcodes.uoM',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'uom',
						displayMember: 'Unit'
					}
				},
				{
					id: 'EstCostTypeFk',
					field: 'EstCostTypeFk',
					name: 'Type',
					width: 70,
					name$tr$: 'basics.costcodes.costType',
					searchable: true
				},
				{
					id: 'BasCurrencyFk',
					field: 'BasCurrencyFk',
					name: 'Currency',
					width: 50,
					name$tr$: 'cloud.common.entityCurrency',
					searchable: true
				},
				{
					id: 'RetailPrice',
					field: 'RetailPrice',
					name: 'RetailPrice',
					formatter: 'money',
					width: 70,
					name$tr$: 'basics.material.record.retailPrice'
				},
				{
					id: 'ListPrice',
					field: 'ListPrice',
					name: 'ListPrice',
					formatter: 'money',
					width: 70,
					name$tr$: 'basics.material.record.listPrice'
				},
				{
					id: 'Code',
					field: 'Code',
					name: 'Code',
					formatter: 'code',
					width: 70,
					name$tr$: 'cloud.common.entityCode',
					searchable: true
				},
				{
					id: 'Description',
					field: 'DescriptionInfo',
					name: 'Description',
					formatter: 'translation',
					width: 100,
					name$tr$: 'cloud.common.entityDesc',
					searchable: true
				},

				{
					id: 'Discount',
					field: 'Discount',
					name: 'Discount',
					formatter: 'money',
					width: 70,
					name$tr$: 'basics.material.record.discount'
				},
				{
					id: 'PriceUnit',
					field: 'PriceUnit',
					name: 'PriceUnit',
					formatter: 'money',
					width: 70,
					name$tr$: 'basics.material.record.PriceUnit'
				},
				{
					id: 'FactorPriceUnit',
					field: 'FactorPriceUnit',
					name: 'FactorPriceUnit',
					formatter: 'factor',
					width: 70,
					name$tr$: 'basics.costcodes.factorCosts',
					searchable: true
				},

				{
					id: 'FactorHour',
					field: 'FactorHour',
					name: 'FactorHour',
					formatter: 'factor',
					width: 70,
					name$tr$: 'basics.costcodes.factorHour',
					searchable: true
				},
				{
					id: 'IsLabour',
					field: 'IsLabour',
					name: 'Labour',
					formatter: 'boolean',
					width: 50,
					name$tr$: 'estimate.main.isLabour',
					readOnly: true,
					searchable: true
				},
				{
					id: 'Comments',
					field: 'CommentText',
					name: 'Comment',
					formatter: 'comment',
					width: 100,
					name$tr$: 'cloud.common.entityComment'
				}
			];

			var costTypeConfig = _.find(columns, function (item) {
				return item.id === 'EstCostTypeFk';
			});

			var currencyConfig = _.find(columns, function (item) {
				return	item.id === 'BasCurrencyFk';
			});

			angular.extend(costTypeConfig,basicsLookupdataConfigGenerator.provideReadOnlyConfig('estimate.lookup.costtype', 'Description').grid);

			var currencyLookupConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'basicsCurrencyLookupDataService',
				enableCache: true,
				readonly : true});
			angular.extend(currencyConfig,currencyLookupConfig.grid);

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('projectMaterialJobLookupByProjectDataService', {
				valMember: 'Id',
				dispMember: 'JobCode',
				columns: columns,
				uuid: '073b84b480d9408f8e7c47db52082687'
			});

			var lookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'project/material/', endPointRead: 'getlist'},
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					if (!item) {
						item = $injector.get('estimateMainService').getSelectedProjectId();
					}
					readData.projectId = item;
					return readData;
				}
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		}
	]);
})(angular);
