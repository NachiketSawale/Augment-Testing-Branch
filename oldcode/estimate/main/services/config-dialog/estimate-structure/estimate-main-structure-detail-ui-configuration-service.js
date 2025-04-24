/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainStructureDetailUIConfigService
	 * @function
	 *
	 * @description
	 * This service provides Estimate Structure Detail UI Config for dialog.
	 */
	angular.module(moduleName).factory('estimateMainStructureDetailUIConfigService',
		['$injector','basicsLookupdataConfigGenerator', 'platformTranslateService',
			function ($injector, basicsLookupdataConfigGenerator, platformTranslateService) {

				let service = {};

				let gridColumns = [
					{
						id: 'estStructure',
						field: 'EstStructureFk',
						name: 'Structure',
						name$tr$: 'estimate.main.estStructureConfigDetails.structure',
						width: 170,
						toolTip: 'Structure list',
						toolTip$tr$: 'estimate.main.estStructureConfigDetails.structure',
						editor: 'lookup',
						editorOptions:{
							lookupDirective: 'estimate-main-config-structure-lookup',
							lookupOptions: {
								additionalColumns: true,
								columns: [
									{ id: 'desc', field: 'DescriptionInfo', name: 'Description', name$tr$: 'cloud.common.entityDescription', toolTip: 'Description', toolTip$tr$: 'cloud.common.entityDescription', formatter: 'translation' }
								],
								dataServiceName: 'estimateMainConfigStructureLookupService',
								disableDataCaching: true,
								displayMember: 'DescriptionInfo.Translated',
								lookupModuleQualifier: 'estimateMainConfigStructureLookupService',
								lookupType: 'estimateMainConfigStructureLookupService',
								showClearButton: true,
								valueMember: 'Id',
							},
							lookupType: 'estimateMainConfigStructureLookupService'
						},
						formatter: 'lookup',
						formatterOptions:{
							dataServiceName: 'estimateMainConfigStructureLookupService',
							displayMember: 'DescriptionInfo.Translated',
							lookupType: 'estimateMainConfigStructureLookupService'
						}
					},
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						width: 170,
						toolTip: 'Code',
						toolTip$tr$: 'cloud.common.entityCode',
						editor: 'lookup',
						editorOptions:{
							lookupDirective: 'estimate-main-config-cost-group-lookup',
							lookupOptions: {
								additionalColumns: true,
								columns: [
									{ id: 'id', field: 'Id', name: 'Code', name$tr$: 'cloud.common.entityCode', toolTip: 'Code', toolTip$tr$: 'cloud.common.entityCode' },
									{ id: 'desc', field: 'DescriptionInfo', name: 'Description', name$tr$: 'cloud.common.entityDescription', toolTip: 'Description', toolTip$tr$: 'cloud.common.entityDescription', formatter: 'translation' }
								],
								dataServiceName: 'estimateMainConfigCostGroupLookupService',
								disableDataCaching: true,
								displayMember: 'Id',
								lookupModuleQualifier: 'estimateMainConfigCostGroupLookupService',
								lookupType: 'estimateMainConfigCostGroupLookupService',
								showClearButton: true,
								valueMember: 'Id',
							},
							lookupType: 'estimateMainConfigCostGroupLookupService'
						},
						formatter: 'lookup',
						formatterOptions:{
							dataServiceName: 'estimateMainConfigCostGroupLookupService',
							displayMember: 'Id',
							lookupType: 'estimateMainConfigCostGroupLookupService'
						}
					},
					{
						id: 'code1',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						width: 170,
						toolTip: 'Code',
						toolTip$tr$: 'cloud.common.entityCode',
						editor: 'code',
						formatter: 'code',
						domain:'code'
					},
					{
						id: 'quantityRel',
						field: 'EstQuantityRelFk',
						name: 'Est Quantity Rel',
						name$tr$: 'estimate.main.estStructureConfigDetails.estQuantRel',
						editor: 'lookup',
						width: 170,
						toolTip: 'Est Quantity Rel',
						toolTip$tr$: 'estimate.main.estStructureConfigDetails.estQuantRel',
						formatter: 'lookup'
					},
					{
						id: 'sort',
						field: 'Sorting',
						name: 'Sorting',
						name$tr$: 'estimate.main.estStructureConfigDetails.sorting',
						domain: 'integer',
						editor: 'integer',
						width: 100,
						toolTip: 'Length',
						toolTip$tr$: 'estimate.main.estStructureConfigDetails.sorting',
						formatter: 'integer'
					}
				];

				let estQuantityRel = _.find(gridColumns, function (item) {
					return item.id === 'quantityRel';
				});

				let quantityRelLookupConfig =  basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsCustomizeEstQuantityRelLookupDataService',
					valMember: 'Id',
					dispMember: 'DescriptionInfo.Translated',
					columns:[
						{ id: 'icon', field: 'Icon', name: 'Icon', name$tr$: 'cloud.common.entityIcon', toolTip: 'Icon', toolTip$tr$: 'cloud.common.entityIcon',  formatter: 'imageselect',
							formatterOptions: {
								serviceName: ''// todo: est quantity rel icons
							}},
						{ id: 'desc', field: 'DescriptionInfo', name: 'Description', name$tr$: 'cloud.common.entityDescription', toolTip: 'Description', toolTip$tr$: 'cloud.common.entityDescription', formatter: 'translation' }
					],
					filterKey: 'estimate-main-structure-detail-est-quantity-relation'
				});

				angular.extend(estQuantityRel,quantityRelLookupConfig.grid);

				platformTranslateService.translateGridConfig(gridColumns);

				service.getStandardConfigForListView = function(){

					let dialogConfig = $injector.get('estimateMainDialogProcessService').getDialogConfig();
					let filterColumns = [];
					if(dialogConfig.editType==='customizeforall' || dialogConfig.editType==='customizeforstructure'){
						filterColumns = _.filter(gridColumns, function (item) {
							return item.id !== 'code';
						});
					}else{
						filterColumns = _.filter(gridColumns, function (item) {
							return item.id !== 'code1';
						});
					}

					return{
						addValidationAutomatically: true,
						columns : filterColumns
					};
				};

				service.getFields = function (){
					let fields = ['EstStructureFk', 'EstQuantityRelFk', 'Sorting'];
					return fields;
				};

				return service;

			}
		]);

})(angular);
