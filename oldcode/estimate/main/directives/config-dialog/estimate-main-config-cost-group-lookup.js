/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateMainConfigCostGroupLookup', ['$q', '$injector', 'BasicsLookupdataLookupDirectiveDefinition','estimateMainConfigCostGroupLookupService',
		function ($q, $injector, BasicsLookupdataLookupDirectiveDefinition, estimateMainConfigCostGroupLookupService) {
			let defaults = {
				lookupType: 'configCostGroup',
				disableDataCaching: true,
				autoComplete: true,
				isExactSearch: false,
				buildSearchString: function (value) {
					return value;
				},
				matchDisplayMembers: ['Id', 'DescriptionInfo.Translated'],
				uuid: '2ccb28011d1846b5b8b69179a9aab2c9',
				columns: [
					{ id: 'id', field: 'Id', name: 'Code', name$tr$: 'cloud.common.entityCode', toolTip: 'Code', toolTip$tr$: 'cloud.common.entityCode' },
					{ id: 'desc', field: 'DescriptionInfo', name: 'Description', name$tr$: 'cloud.common.entityDescription', toolTip: 'Description', toolTip$tr$: 'cloud.common.entityDescription', formatter: 'translation' }
				],
				title: {
					name: 'estimate.main.CostGroup'
				},
				gridOptions: {
					multiSelect: false
				}
			};

			let thisConfig = angular.copy(defaults);

			thisConfig.onDataRefresh = function ($scope) {

				estimateMainConfigCostGroupLookupService.reload().then(function (result) {
					let isSelectedPrjCg = $injector.get('estimateMainStructureConfigDetailDataService').isSelectedProjectCg();
					result = _.filter(result, function (item) {
						return item.IsProjectCg === isSelectedPrjCg;
					});
					$scope.refreshData(result);
				});
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', thisConfig, {

				lookupTypesServiceName: 'estimateMainLookupTypes',

				dataProvider: {
					myUniqueIdentifier: 'estimateMainConfigCostGroupLookupDataHandler',

					getList: function () {
						return $q.when(estimateMainConfigCostGroupLookupService.getList()).then(function (data) {
							let isSelectedPrjCg = $injector.get('estimateMainStructureConfigDetailDataService').isSelectedProjectCg();
							return _.filter(data, function (item) {
								return item.IsProjectCg === isSelectedPrjCg;
							});
						});
					},

					getItemByKey: function(identification, options, scope){
						return estimateMainConfigCostGroupLookupService.getItemByKey(identification, options, scope);
					},
					getItemById: function (id,param){
						return estimateMainConfigCostGroupLookupService.getItemByKey(id,param);
					},
					getItemByIdAsync: function(value){
						return estimateMainConfigCostGroupLookupService.getItemByIdAsync(value);
					},
					getSearchList: function(value){
						if (value) {

							return estimateMainConfigCostGroupLookupService.getSearchList(value).then(function (data) {
								if(data){
									let isSelectedPrjCg = $injector.get('estimateMainStructureConfigDetailDataService').isSelectedProjectCg();
									return _.filter(data, function (item) {
										return item.IsProjectCg === isSelectedPrjCg;
									});
								}
								return data;
							});
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
