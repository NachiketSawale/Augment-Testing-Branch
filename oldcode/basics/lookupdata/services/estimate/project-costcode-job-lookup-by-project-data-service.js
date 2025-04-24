/**
 * Created by bel on 09.28.2018.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectCostCodeJobLookupByProjectDataService
	 * @function
	 * @description
	 *
	 * data service for project cost code with job lookup filter by project.
	 */
	angular.module('basics.lookupdata').factory('projectCostCodeJobLookupByProjectDataService', [
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
					id: 'Rate',
					field: 'Rate',
					name: 'Market Rate',
					formatter: 'money',
					width: 70,
					name$tr$: 'basics.costcodes.unitRate'
				},

				{
					id: 'CurrencyFk',
					field: 'CurrencyFk',
					name: 'Currency',
					width: 50,
					name$tr$: 'cloud.common.entityCurrency',
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
					id: 'IsRate',
					field: 'IsRate',
					name: 'Fix',
					formatter: 'boolean',
					width: 30,
					name$tr$: 'estimate.main.isRate'
				},

				{
					id: 'FactorCosts',
					field: 'FactorCosts',
					name: 'FactorCosts',
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
					id: 'RealFactorCosts',
					field: 'RealFactorCosts',
					name: 'RealFactorCosts',
					formatter: 'factor',
					width: 70,
					name$tr$: 'basics.costcodes.realFactorCosts'
				},

				{
					id: 'FactorQuantity',
					field: 'FactorQuantity',
					name: 'FactorQuantity',
					formatter: 'factor',
					width: 70,
					name$tr$: 'basics.costcodes.factorQuantity',
					searchable: true
				},

				{
					id: 'RealFactorQuantity',
					field: 'RealFactorQuantity',
					name: 'RealFactorQuantity',
					formatter: 'factor',
					width: 70,
					name$tr$: 'basics.costcodes.realFactorQuantity',
					searchable: true
				},

				{
					id: 'CostCodeTypeFk',
					field: 'CostCodeTypeFk',
					name: 'Type',
					width: 70,
					name$tr$: 'basics.costcodes.entityType',
					searchable: true
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
					id: 'DayWorkRate',
					field: 'DayWorkRate',
					name: 'DW/T+M Rate',
					formatter: 'money',
					width: 70,
					name$tr$: 'basics.costcodes.dayWorkRate',
					searchable: true
				},

				{
					id: 'Remark',
					field: 'Remark',
					name: 'remarks',
					formatter: 'remark',
					width: 100,
					name$tr$: 'cloud.common.entityRemark',
					searchable: true
				}
			];

			var costCodeTypeConfig = _.find(columns, function (item) {
				return	item.id === 'CostCodeTypeFk';
			});

			var costTypeConfig = _.find(columns, function (item) {
				return item.id === 'EstCostTypeFk';
			});

			var currencyConfig = _.find(columns, function (item) {
				return	item.id === 'CurrencyFk';
			});

			angular.extend(costCodeTypeConfig,basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.costcodes.costcodetype', 'Description').grid);

			angular.extend(costTypeConfig,basicsLookupdataConfigGenerator.provideReadOnlyConfig('estimate.lookup.costtype', 'Description').grid);

			var currencyLookupConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'basicsCurrencyLookupDataService',
				enableCache: true,
				readonly : true});
			angular.extend(currencyConfig,currencyLookupConfig.grid);

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('projectCostCodeJobLookupByProjectDataService', {
				valMember: 'Id',
				dispMember: 'JobCode',
				columns: columns,
				uuid: '256232b6d7f7432197a064923999ed78'
			});

			var lookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'project/costcodes/job/rate/', endPointRead: 'getprjcostcodesbyproject'},
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
