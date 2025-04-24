


(function () {
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainAllowanceCostCodeDetailAddServices', ['_','$q', '$injector', '$http', '$translate',  'PlatformMessenger', 'platformModalService','platformDataServiceFactory',
		'ServiceDataProcessArraysExtension','basicsCostCodesImageProcessor','cloudCommonGridService','estimateMainService','basicsLookupdataLookupViewService','estimateMainOnlyCostCodeAssignmentDetailLookupDataService',
		function ( _,$q, $injector, $http, $translate,  PlatformMessenger,  platformModalService,platformDataServiceFactory,ServiceDataProcessArraysExtension,basicsCostCodesImageProcessor,cloudCommonGridService,
			estimateMainService,basicsLookupdataLookupViewService,estimateMainOnlyCostCodeAssignmentDetailLookupDataService) {


			let service = {};

			function getColumns() {
				let columns = [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 70,
						name$tr$: 'cloud.common.entityCode'
					}, {
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 100,
						name$tr$: 'cloud.common.entityDescription'
					}, {
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
					}, {
						id: 'Rate',
						field: 'Rate',
						name: 'Market Rate',
						formatter: 'money',
						width: 70,
						name$tr$: 'basics.costcodes.unitRate'
					}, {
						id: 'CurrencyFk',
						field: 'CurrencyFk',
						name: 'Currency',
						width: 80,
						name$tr$: 'cloud.common.entityCurrency',
						searchable: true,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'currency',
							displayMember: 'Currency'
						}
					}, {
						id: 'IsLabour',
						field: 'IsLabour',
						name: 'Labour',
						formatter: 'boolean',
						width: 100,
						name$tr$: 'basics.costcodes.isLabour'
					}, {
						id: 'IsRate',
						field: 'IsRate',
						name: 'Fix',
						formatter: 'boolean',
						width: 100,
						name$tr$: 'basics.costcodes.isRate'
					}, {
						id: 'FactorCosts',
						field: 'FactorCosts',
						name: 'FactorCosts',
						formatter: 'factor',
						width: 100,
						name$tr$: 'basics.costcodes.factorCosts'
					}, {
						id: 'RealFactorCosts',
						field: 'RealFactorCosts',
						name: 'RealFactorCosts',
						formatter: 'factor',
						width: 120,
						name$tr$: 'basics.costcodes.realFactorCosts'
					}, {
						id: 'FactorQuantity',
						field: 'FactorQuantity',
						name: 'FactorQuantity',
						formatter: 'factor',
						width: 100,
						name$tr$: 'basics.costcodes.factorQuantity'
					}, {
						id: 'RealFactorQuantity',
						field: 'RealFactorQuantity',
						name: 'RealFactorQuantity',
						formatter: 'factor',
						width: 100,
						name$tr$: 'basics.costcodes.realFactorQuantity'
					}, {
						id: 'CostCodeTypeFk',
						field: 'CostCodeTypeFk',
						name: 'Type',
						width: 100,
						name$tr$: 'basics.costcodes.entityType',
						searchable: true,
						formatter: 'lookup',
						formatterOptions: {
							// lookupType: 'costcodetype',
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'basics.costcodes.costcodetype',
							valueMember: 'Id',
							displayMember: 'Description'
						}
					}, {
						id: 'DayWorkRate',
						field: 'DayWorkRate',
						name: 'DW/T+M Rate',
						formatter: 'money',
						width: 100,
						name$tr$: 'basics.costcodes.dayWorkRate'
					}, {
						id: 'Remark',
						field: 'Remark',
						name: 'remarks',
						formatter: 'remark',
						width: 100,
						name$tr$: 'cloud.common.entityRemark'
					}
				];
				return columns;
			}

			service.showDialog = function(markup2CostCode,MarkupDataService) {

				let lookupConfig ={
					lookupType: 'estmasterprojectcostcode',
					valueMember: 'Id',
					displayMember: 'Code',
					initialSearchValue: '',  // setting the initial search edit box
					eagerSearch: true,// auto search when open dialog.
					columns: getColumns(),
					title: {
						name: 'Cost Codes',
						name$tr$: 'basics.costcodes.costCodes'
					},
					gridOptions: {
						multiSelect: false, // control multiple/single selection
						showFilterRow: true
					},
					treeOptions: {
						parentProp: 'CostCodeParentFk',
						childProp: 'CostCodes',
						hierarchyEnabled: true,
						inlineFilters: true,
						dataProcessor: function (dataList) {
							$injector.get('basicsCostCodesImageProcessor').processData(dataList);
							return dataList;
						},
						dataProvider: $injector.get('estimateMainOnlyCostCodeAssignmentDetailLookupDataService')
					},
					dataProcessor:{},
					dataProvider: {
						myUniqueIdentifier: 'estmasterprojectcostcode',

						getList: function () {
							return estimateMainOnlyCostCodeAssignmentDetailLookupDataService.getListOnEstMarkupCostCode();
						},

						getSearchList: function (searchString,displayMember,scope,getSearchListSettings) {
							let platformGridAPI = $injector.get('platformGridAPI');
							// let data = estimateMainOnlyCostCodeAssignmentDetailLookupDataService.getSearchListOnEstMarkupCostCode(getSearchListSettings);
							if(scope.gridId){
								platformGridAPI.rows.expandAllNodes(scope.gridId);
							}

							let items = estimateMainOnlyCostCodeAssignmentDetailLookupDataService.getSearchListOnEstMarkupCostCode(getSearchListSettings);
							setTimeout(function () {
								highlightRow(getSearchListSettings,items,scope);
							});
							return items;
						}
					},
					okBtnDisabled: function (self) {
						let selectItem = self.getSelectedItems();
						if(_.isArray(selectItem)){
							selectItem = selectItem[0];
						}
						if(!selectItem) {
							return true;
						}
						return !selectItem.IsEstimateCostCode;
					}
				};


				basicsLookupdataLookupViewService.showDialog (lookupConfig).then (function (result) {
					if (result.isOk && result.data) {
						let currentAllowance = $injector.get('estimateMainStandardAllowancesDataService').getSelected();
						let projectId = estimateMainService.getProjectId() ? estimateMainService.getProjectId() : 0;
						let estHeaderId = estimateMainService.getSelectedEstHeaderId() ? estimateMainService.getSelectedEstHeaderId() : 0;
						let  contextId = $injector.get('estimateMainCommonService').getCompanyContextFk();
						let param = {
							MdcContextId:contextId,
							MdcAllowanceFk:currentAllowance.Id,
							MdcCostCodeFk:result.data[0].Id,
							MarkupGa:currentAllowance.MarkUpGa,
							MarkupRp:currentAllowance.MarkUpRp,
							MarkupAm:currentAllowance.MarkUpAm,
							IsCustomProjectCostCode:result.data[0].IsCustomProjectCostCode,
							ProjectId:projectId,
							EstAllowanceFk:estHeaderId
						};

						if(currentAllowance.MdcAllowanceTypeFk === 3){
							let estAllowanceAreaFk =  $injector.get('estimateMainAllowanceAreaService').getSelected();
							param.EstAllowanceAreaFk = estAllowanceAreaFk ? estAllowanceAreaFk.Id : -1;
						}else {
							param.EstAllowanceAreaFk = -1;
						}
						MarkupDataService.doCallHTTPCreate(param, MarkupDataService, service.onCreateSucceeded);
					}
				}
				);
			};

			service.onCreateSucceeded = function onCreateSucceededInList(newItem) {
				if(newItem.length > 0){
					let MarkupDataService = $injector.get('estStandardAllowancesCostCodeDetailDataService');
					return MarkupDataService.onCreateSucceeded(newItem);
				}
			};

			function highlightRow(getSearchListSettings,items,scope) {
				let platformGridAPI = $injector.get('platformGridAPI');
				if(getSearchListSettings.searchString && getSearchListSettings.searchString.length){
					let grid = platformGridAPI.grids.element('id', scope.gridId);
					if(grid && grid.instance && items.$$state){
						let data = items.$$state.value ? items.$$state.value : undefined;
						if(data.length > 0){
							let highlightRow = 0;
							let findData;
							let searchString = getSearchListSettings.searchString.toUpperCase();
							for(highlightRow; highlightRow < data.length; highlightRow++){
								let codeUpperCase = data[highlightRow].Code ? data[highlightRow].Code.toUpperCase(): '';
								let descriptionUpperCase = data[highlightRow].DescriptionInfo && data[highlightRow].DescriptionInfo.Description ? data[highlightRow].DescriptionInfo.Description.toUpperCase(): '';
								if(codeUpperCase === searchString || descriptionUpperCase === searchString){
									findData = data[highlightRow];
									break;
								}
							}
							if(!findData){
								highlightRow = grid.instance.getData().getRowById(data[0].Id);
							}else {
								highlightRow = grid.instance.getData().getRowById(data[highlightRow].Id);
							}

							grid.instance.setSelectedRows([highlightRow]);
							grid.instance.scrollRowIntoView(highlightRow);
						}
					}
				}
			}

			// function incorporateDataRead(readData, data) {
			//    let  mdcCostCodes = [];
			//    cloudCommonGridService.flatten(readData, mdcCostCodes, 'CostCodeChildren');
			//    $injector.get('estStandardAllowancesCostCodeDetailDataService').setAllCostCodes(mdcCostCodes);
			//    $injector.get('estimateMainOnlyCostCodeAssignmentDetailLookupDataService').setFlattenDatas(mdcCostCodes);
			//    platformDataServiceEntitySortExtension.sortTree(readData, 'Code', 'CostCodeChildren');
			//    return serviceContainer.data.handleReadSucceeded(readData, data);
			// }
			return service;

		}]);
})();
