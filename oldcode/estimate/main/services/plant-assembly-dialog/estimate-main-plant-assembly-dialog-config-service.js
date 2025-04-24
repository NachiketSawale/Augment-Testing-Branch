/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	/* globals _ */
	let moduleName = 'estimate.main';

	/**
     * @ngdoc service
     * @name estimateMainPlantAssemblyDialogConfigService
     * @function
     * @description
     * estimateMainPlantAssemblyDialogConfigService is the data service for estimate plant assembly dialog configuration.
     */
	angular.module(moduleName).factory('estimateMainPlantAssemblyDialogConfigService', ['$injector', 'basicsLookupdataConfigGenerator', 'platformTranslateService',
		function ( $injector, basicsLookupdataConfigGenerator, platformTranslateService) {
			return{
				getStandardConfigForListView:getStandardConfigForListView
			};

			function getStandardConfigForListView() {
				let columns = [
					{
						id: 'EstPlantGroupFk',
						field: 'PlantGroupFk',
						name: 'Plant Group',
						name$tr$: 'basics.customize.plantgroupfk',
						readonly: true
					},
					{
						id: 'EstPlantFk',
						field: 'PlantFk',
						name: 'Plant Master',
						name$tr$: 'estimate.main.estPlantMaster',
						readonly: true
					},
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode',
						readonly: true,
						width: 100,
						grouping: {
							title: 'Code',
							title$tr$: 'cloud.common.entityCode',
							getter: 'Code',
							aggregators: [],
							aggregateCollapsed: true
						}
					},
					{
						id: 'DescriptionInfo',
						field: 'DescriptionInfo',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'translation',
						readonly: true,
						grouping: {
							title: 'Description',
							title$tr$:'cloud.common.entityDescription',
							getter: 'DescriptionInfo',
							aggregators: [],
							aggregateCollapsed: true
						}
					},
					{
						id: 'uom',
						field: 'BasUomFk',
						name$tr$: 'cloud.common.entityUoM',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'Uom',
							displayMember: 'Unit'
						},
						width: 100,
						grouping: {
							title: 'Uom',
							title$tr$: 'cloud.common.entityUoM',
							getter: 'BasUomFk',
							aggregators: [],
							aggregateCollapsed: true
						}
					},
					{
						id : 'costunit',
						name : 'costunit',
						field : 'CostUnit',
						name$tr$ : 'estimate.main.costUnit',
						formatter: 'money',
						grouping: {
							title: 'CostUnit',
							title$tr$: 'estimate.main.costUnit',
							getter: 'CostUnit',
							aggregators: [],
							aggregateCollapsed: true
						}
					},
					{
						id: 'MdcCostCodeFk',
						field: 'MdcCostCodeFk',
						name: 'Cost Code',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'CostCode',
							displayMember: 'Code'
						},
						name$tr$: 'estimate.main.costCode',
						grouping: {
							title: 'Cost Code',
							title$tr$: 'estimate.main.costCode',
							getter: 'MdcCostCodeFk',
							aggregators: [],
							aggregateCollapsed: true
						}
					},
					{
						id: 'MdcMaterialFk',
						field: 'MdcMaterialFk',
						name: 'Material Code',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialRecord',
							displayMember: 'Code'
						},
						name$tr$: 'basics.common.entityMaterialCode',
						grouping: {
							title: 'Material Code',
							title$tr$: 'basics.common.entityMaterialCode',
							getter: 'MdcMaterialFk',
							aggregators: [],
							aggregateCollapsed: true
						}
					},
					{
						id: 'PlantAssemblyTypeFk',
						field: 'PlantAssemblyTypeFk',
						name: 'Plant Assembly Type',
						name$tr$: 'basics.customize.plantassemblytype',
						readonly: true
					}
				];

				// let columns = estimateMainPlantAssemblyDialogService.getStandardConfigForListView().columns;
				let plantFkConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'resourceEquipmentPlantLookupDataService',
					readonly: true,
					cacheEnable: true,
					additionalColumns: false
				});
				let plantGroupFkConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'resourceEquipmentGroupLookupDataService',
					readonly: true,
					cacheEnable: true,
					additionalColumns: false
				});

				let plantGroupFk = _.find(columns, function (item) {
					return item.id === 'EstPlantGroupFk';
				});
				let plantFk = _.find(columns, function (item) {
					return item.id === 'EstPlantFk';
				});

				angular.extend(plantGroupFk,plantGroupFkConfig.grid);
				angular.extend(plantFk,plantFkConfig.grid);
				plantGroupFk.editor = null;
				plantGroupFk.editorOptions = null;
				plantFk.editor = null;
				plantFk.editorOptions = null;

				let plantAssemblyTypeFk = _.find(columns, function (item) {
					return item.id === 'PlantAssemblyTypeFk';
				});
				let plantAssemblyTypeConfig = basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.plantassemblytype', null);
				angular.extend(plantAssemblyTypeFk,plantAssemblyTypeConfig.grid);
				plantAssemblyTypeFk.editor = null;
				plantAssemblyTypeFk.editorOptions = null;

				platformTranslateService.translateGridConfig(columns);

				return {
					columns: columns,
					isTranslated: true
				};
			}
		}]);
})(angular);