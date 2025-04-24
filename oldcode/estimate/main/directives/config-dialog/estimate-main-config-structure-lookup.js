/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateMainConfigStructureLookup', ['$q', '$injector', 'BasicsLookupdataLookupDirectiveDefinition','estimateMainConfigStructureLookupService',
		function ($q, $injector, BasicsLookupdataLookupDirectiveDefinition, estimateMainStructureLookupService) {
			let defaults = {
				lookupType: 'configEstStructure',
				disableDataCaching: true,
				autoComplete: true,
				isExactSearch: false,
				uuid: 'b8ac44ac94af4c0b912c124089857759',
				columns: [
					{ id: 'desc', field: 'DescriptionInfo', name: 'Description', name$tr$: 'cloud.common.entityDescription', toolTip: 'Description', toolTip$tr$: 'cloud.common.entityDescription', formatter: 'translation' }
				],
				title: {
					name: 'estimate.main.estStructureConfigDetails.structure'
				},
				gridOptions: {
					multiSelect: false
				}
			};

			let thisConfig = angular.copy(defaults);

			thisConfig.onDataRefresh = function ($scope) {

				estimateMainStructureLookupService.reload().then(function (result) {
					$scope.refreshData(result);
				});
			};

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', thisConfig, {

				lookupTypesServiceName: 'estimateMainLookupTypes',

				dataProvider: {
					myUniqueIdentifier: 'estimateMainConfigStructureLookupDataHandler',

					getList: function () {
						return $q.when(estimateMainStructureLookupService.getList());
					},

					getItemByKey: function(identification, options, scope){
						return estimateMainStructureLookupService.getItemByKey(identification, options, scope);
					},
					getItemById: function (id,param){
						return estimateMainStructureLookupService.getItemByKey(id,param);
					},
					getItemByIdAsync: function(value){
						return estimateMainStructureLookupService.getItemByIdAsync(value);
					},
					getSearchList: function(value){
						if (value) {

							return $q.when(estimateMainStructureLookupService.getSearchList());
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
