/**
 * $Id: estimate-main-replace-resource-plant-lookup.js  2025-02-24 15:47:59Z long.wu $
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	/* global Slick */
	'use strict';
	let moduleName = 'estimate.main';

	function getLookupConfig(replaceTo){
		return ['$q', '$injector', 'BasicsLookupdataLookupDirectiveDefinition','basicsLookupdataConfigGenerator','estimateMainReplaceResourcePlantLookupService',
			function ($q, $injector, BasicsLookupdataLookupDirectiveDefinition, basicsLookupdataConfigGenerator,estimateMainReplaceResourcePlantLookupService) {
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
							width: 160,
							name$tr$: 'cloud.common.entityDesc',
							searchable: true
						},
						{
							id: 'EstPlantGroupFk',
							field: 'PlantGroupFk',
							name: 'Plant Group',
							width: 120,
							name$tr$: 'estimate.main.estPlantGroup',
							formatter: 'lookup',
							formatterOptions:{
								dataServiceName: 'resourceEquipmentGroupLookupDataService',
								displayMember: 'Code',
								imageSelector: '',
								isClientSearch: true,
								lookupType: 'resourceEquipmentGroupLookupDataService',
								translate: false,
								valueMember: 'Id',
							}
						}
					],
					width: 650,
					title: {
						name: 'estimate.main.plantList'
					},
					gridOptions: {
						tree: true, indicator: false,
						editorLock: new Slick.EditorLock(),
						parentProp: 'EquipmentGroupFk',
						childProp: 'SubGroups',
						multiSelect: false
					},
					buildSearchString: function (value) {
						return value;
					},
				};

				let thisConfig = angular.copy(defaults);

				thisConfig.onDataRefresh = function ($scope) {

					estimateMainReplaceResourcePlantLookupService.reloadData(replaceTo).then(function (result) {
						$scope.refreshData(result);
					});
				};

				return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', thisConfig, {

					lookupTypesServiceName: 'estimateMainLookupTypes',

					dataProvider: {
						myUniqueIdentifier: 'EstimateMainResourceAssemblyLookupDataHandler',

						getList: function () {
							return $q.when(estimateMainReplaceResourcePlantLookupService.getList(replaceTo));
						},

						getItemByKey: function(identification){
							return estimateMainReplaceResourcePlantLookupService.getItemByKey(identification);
						},
						getSearchList: function(value){
							if (value) {

								return $q.when(estimateMainReplaceResourcePlantLookupService.getSearchList(value, replaceTo));
							}
							else{
								return $q.when([]);
							}
						}
					}
				});
			}
		];
	}

	let estimateMainReplaceResourcePlantLookup = getLookupConfig();

	angular.module(moduleName).directive('estimateMainReplaceResourcePlantLookup', estimateMainReplaceResourcePlantLookup);

})(angular);