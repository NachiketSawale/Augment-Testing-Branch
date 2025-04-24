(function (angular) {
	'use strict';
	const moduleName = 'productionplanning.item';
	/* global angular */

	/**
	 * @ngdoc directive
	 * @name productionplanning.item.directive:ppsItemProcurementPackageLookup
	 * @element div
	 * @restrict A
	 * @description
	 * Package lookup. It's copied from procurement.common/directives/package-lookup.js, for supporting showing prcPackage data across companies for PPS/Transport modules specifically
	 */
	angular.module(moduleName).directive('ppsItemProcurementPackageLookup', ['$q', 'basicsLookupdataLookupDescriptorService', 'BasicsLookupdataLookupDirectiveDefinition', 'basicsLookupdataLookupDataService',
		function ($q, basicsLookupdataLookupDescriptorService, BasicsLookupdataLookupDirectiveDefinition, lookupDataService) {
			basicsLookupdataLookupDescriptorService.loadData(['prcconfiguration', 'packageStatus']);
			let defaultDataProvider = lookupDataService.registerDataProviderByType('PrcPackage');
			let lookupOptions = {
				version: 3,
				lookupType: 'PrcPackage',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'fec42d1418f048fea8b6c83b73e6015e',
				columns: [
					{
						id: 'code',
						field: 'Code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'description',
						field: 'Description',
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'packageStatusDescription',
						field: 'PackageStatusFk',
						name$tr$: 'cloud.common.entityState',
						'formatter': 'lookup',
						'formatterOptions': {
							'lookupType': 'PackageStatus',
							'displayMember': 'DescriptionInfo.Translated',
							'imageSelector': 'platformStatusIconService'
						},
						searchable: false
					},
					{
						id: 'packageConfigurationDescription',
						field: 'PrcPackageConfigurationFk',
						name$tr$: 'procurement.common.prcConfigurationDescription',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'prcconfiguration',
							displayMember: 'DescriptionInfo.Translated'
						},
						searchable: false
					}
				],
				width: 500,
				height: 200,
				title: {name: 'procurement.common.packageLookupDialogTitle'}
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', lookupOptions, {
				dataProvider: {
					getList: function (options) {
						return defaultDataProvider.getList(options);
					},
					getSearchList: function (searchRequest, options, curScope) {
						return defaultDataProvider.getSearchList(searchRequest, options, curScope);
					},
					getItemByKey: function (key) {
						let result = basicsLookupdataLookupDescriptorService.getLookupItem('PrcPackage', key);
						if (result) {
							return $q.when(result);
						}
						return defaultDataProvider.getItemByKey(key);
					}
				}
			});
		}
	]);

})(angular);