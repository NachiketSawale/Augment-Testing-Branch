/**
 * Created by wul on 5/6/2019.
 */


/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';

	let estimateMainResourceAssemblyLookup = ['$q', '$injector', 'BasicsLookupdataLookupDirectiveDefinition','basicsLookupdataConfigGenerator','estimateMainResourceAssemblyLookupService',
		function ($q, $injector, BasicsLookupdataLookupDirectiveDefinition, basicsLookupdataConfigGenerator,estimateMainResourceAssemblyLookupService) {
			let defaults = {
				lookupType: 'resourceAssembly',
				disableDataCaching: true,
				autoComplete: true,
				isExactSearch: false,
				matchDisplayMembers: ['Code', 'DescriptionInfo.Translated'],
				uuid: '659AEE1FFE2B479F8B6F46B77FFA7E28',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 100,
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
						id: 'jobCode',
						field: 'JobCode',
						name: 'Job',
						width: 120,
						name$tr$: 'logistic.job.entityJob',
						formatter: 'code'
					}
				],
				width: 600,
				// height: 800,
				title: {
					name: 'estimate.assemblies.assembly'
				},
				gridOptions: {
					multiSelect: false
				}
			};

			let thisConfig = angular.copy(defaults);

			if ($injector.get('estimateMainWizardContext').getConfig() === $injector.get('estimateMainResourceFrom').EstimateAssemblyResource) {
				thisConfig.columns = _.filter(thisConfig.columns, function (item) {
					return item.id !== 'jobCode';
				});
			}

			thisConfig.onDataRefresh = function ($scope) {

				estimateMainResourceAssemblyLookupService.reloadAssemblies().then(function (result) {
					$scope.refreshData(result);
				});
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', thisConfig, {

				lookupTypesServiceName: 'estimateMainLookupTypes',

				dataProvider: {
					myUniqueIdentifier: 'EstimateMainResourceAssemblyLookupDataHandler',

					getList: function () {
						return $q.when(estimateMainResourceAssemblyLookupService.getEstimateAssemblies());
					},

					getItemByKey: function(identification){
						return estimateMainResourceAssemblyLookupService.getAssemblyById(identification);
					},
					getSearchList: function(value){
						if (value) {

							return $q.when(estimateMainResourceAssemblyLookupService.getEstimateAssemblies());
						}
						else{
							return $q.when([]);
						}
					}
				}
			});
		}
	];

	angular.module(moduleName).directive('estimateMainResourceAssemblyLookup', estimateMainResourceAssemblyLookup);

	angular.module(moduleName).directive('estimateAssemblyResourceAssemblyLookup', estimateMainResourceAssemblyLookup);

	angular.module(moduleName).directive('estimateMainJobAssemblyLookup', ['$q', '$injector', 'BasicsLookupdataLookupDirectiveDefinition','basicsLookupdataConfigGenerator','estimateMainResourceAssemblyLookupService',
		function ($q, $injector, BasicsLookupdataLookupDirectiveDefinition, basicsLookupdataConfigGenerator,estimateMainResourceAssemblyLookupService) {
			let defaults = {
				lookupType: 'resourceAssembly',
				disableDataCaching: true,
				autoComplete: true,
				uuid: '5F3E128AD571459EB347C4F18450EA2D',
				columns: [
					{
						id: 'jobCode',
						field: 'JobCode',
						name: 'Job',
						width: 120,
						name$tr$: 'logistic.job.entityJob',
						formatter: 'code'
					},
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 100,
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
					}
				],
				width: 600,
				// height: 800,
				title: {
					name: 'estimate.assemblies.assembly'
				},
				gridOptions: {
					multiSelect: false
				}
			};

			let thisConfig = angular.copy(defaults);

			thisConfig.onDataRefresh = function ($scope) {

				estimateMainResourceAssemblyLookupService.getFilterList().then(function (result) {
					$scope.refreshData(result);
				});
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', thisConfig, {

				lookupTypesServiceName: 'estimateMainLookupTypes',

				dataProvider: {
					myUniqueIdentifier: 'EstimateMainResourceAssemblyLookupDataHandler',

					getList: function () {
						return $q.when(estimateMainResourceAssemblyLookupService.getFilterList());
					},

					getItemByKey: function(identification){
						return estimateMainResourceAssemblyLookupService.getAssemblyById(identification);
					},
					getSearchList: function(value){
						if (value) {

							return $q.when(estimateMainResourceAssemblyLookupService.getFilterList());
						}
						else{
							return $q.when([]);
						}
					}
				}
			});
		}
	]);
})(angular);
