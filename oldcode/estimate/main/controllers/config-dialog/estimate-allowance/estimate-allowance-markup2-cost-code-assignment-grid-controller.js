
(function () {
	'use strict';
	/* global globals , _ */
	let moduleName = 'estimate.main';

	angular.module(moduleName).controller('estimateAllowanceMarkup2CostCodeAssignmentGridController', ['$scope','$http', '$timeout', '$injector', 'platformGridAPI', 'platformCreateUuid',
		'estimateAllowanceMarkUp2CostCodeAssignmentGridService',  'platformGridControllerService', '$translate','estimateAllowanceMarkUp2CostCodeAssignmentGridUIService','cloudCommonGridService','basicsLookupdataLookupViewService',
		function ($scope,$http, $timeout, $injector, platformGridAPI, platformCreateUuid,  dataServices,  platformGridControllerService, $translate,
			estimateAllowanceMarkUp2CostCodeAssignmentGridUIService,cloudCommonGridService,basicsLookupdataLookupViewService) {


			// let editType = $injector.get('estimateMainCostCodeAssignmentDetailLookupDataService').getEditType();

			let myGridConfig = {
				initCalled: false,
				columns: [],
				ContainerType : 'Grid',
				parentProp: 'CostCodeParentFk',
				childProp: 'CostCodes',
				childSort: true,
				enableDraggableGroupBy: false,
				skipPermissionCheck : true,
				skipToolbarCreation :true
			};

			$scope.gridId = platformCreateUuid();
			dataServices.setGridId($scope.gridId);

			$scope.onContentResized = function () {
				resize();
			};

			$scope.gridData = {
				state: $scope.gridId
			};

			function updateMajorCostCode(entity) {
				dataServices.updateMajorCostCode(entity);
			}

			function resize() {
				$timeout(function () {
					platformGridAPI.grids.resize($scope.gridId);
				});
			}

			platformGridAPI.events.register($scope.gridId, 'onCellChange', cellChangeCallBack);
			function cellChangeCallBack(e,args) {
				let isAreaCostCode = $scope.$parent.entity.AllowanceTypeFk === 3;
				let entity = args.item;
				let markUp2CostCodeToSave = dataServices.getItemsToSave();
				if(!markUp2CostCodeToSave){
					let saveData = [];
					saveData.push(entity);
					dataServices.setItemToSave(saveData,isAreaCostCode);
					return;
				}
				let entityToSave = _.find(markUp2CostCodeToSave,{'Id':entity.Id});
				if(!entityToSave){
					markUp2CostCodeToSave.push(entity);
				}else {
					angular.extend(entityToSave,entity);
				}
			}

			function init() {
				platformGridControllerService.initListController($scope, estimateAllowanceMarkUp2CostCodeAssignmentGridUIService, dataServices, null, myGridConfig);

				if($scope.$parent.entity.AllowanceTypeFk < 3){
					$timeout(function () {
						dataServices.load();
					});
				}
			}

			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
			});

			$scope.setTools = function (tools) {
				tools.update = function () {
					tools.version += 1;
				};
			};
			init();

			function isCanCreate() {
				let isDisabled = false;
				let isAreaCostCode = $scope.$parent.entity.AllowanceTypeFk === 3;
				if(isAreaCostCode){
					let areaSelect = $injector.get('estimateMdcAllowanceAreaService').getSelected();
					isDisabled = areaSelect ? !(areaSelect.Id > 0 && areaSelect.AreaType < 3) : true;
				}
				return isDisabled;
			}
			// Define standard toolbar Icons and their function on the scope
			$scope.tools = {
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: [
					{
						id: 't7',
						sort: 60,
						caption: 'cloud.common.toolbarCollapse',
						type: 'item',
						iconClass: 'tlb-icons ico-tree-collapse',
						fn: function collapseSelected() {
							platformGridAPI.rows.collapseNode($scope.gridId);
						}
					},
					{
						id: 't8',
						sort: 70,
						caption: 'cloud.common.toolbarExpand',
						type: 'item',
						iconClass: 'tlb-icons ico-tree-expand',
						fn: function expandSelected() {
							platformGridAPI.rows.expandNode($scope.gridId);
						}
					},
					{
						id: 't9',
						sort: 80,
						caption: 'cloud.common.toolbarCollapseAll',
						type: 'item',
						iconClass: 'tlb-icons ico-tree-collapse-all',
						fn: function collapseAll() {
							platformGridAPI.rows.collapseAllSubNodes($scope.gridId);
						}
					},
					{
						id: 't10',
						sort: 90,
						caption: 'cloud.common.toolbarExpandAll',
						type: 'item',
						iconClass: 'tlb-icons ico-tree-expand-all',
						fn: function expandAll() {
							platformGridAPI.rows.expandAllSubNodes($scope.gridId);
						}
					},
					{
						id: 'update',
						sort: 1,
						caption: $translate.instant('estimate.main.markupUpdateMajorCostCode'),
						type: 'item',
						iconClass: 'tlb-icons ico-rec-new-deepcopy',
						disabled: isCanCreate,
						fn: function onClick(arg1,arg2,arg3) {
							let isAreaCostCode = $scope.$parent.entity.AllowanceTypeFk === 3;
							let entity = arg3.scope.$parent.entity;
							if(isAreaCostCode){
								entity.isAreaCostCode = isAreaCostCode;
							}
							updateMajorCostCode(entity);
						}
					},
					{
						id: 'add',
						sort: 2,
						caption: 'cloud.common.taskBarNewRecord',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-new',
						disabled: isCanCreate,
						fn: function onClick() {
							let isAreaCostCode = $scope.$parent.entity.AllowanceTypeFk === 3;
							let dataView = new basicsLookupdataLookupViewService.LookupDataView();
							let lookupConfig ={
								lookupType: 'costcode',
								valueMember: 'Id',
								displayMember: 'Code',
								initialSearchValue: '',  // setting the initial search edit box
								eagerSearch: true,// auto search when open dialog.
								columns: [
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
								],
								title: {
									name: 'Cost Codes',
									name$tr$: 'basics.costcodes.costCodes'
								},
								gridOptions: {
									multiSelect: false // control multiple/single selection
								},
								onDataRefresh: function ($scope) {
									let estimateMainCostCodeAssignmentDetailLookupDataService = $injector.get('estimateMainCostCodeAssignmentDetailLookupDataService');
									estimateMainCostCodeAssignmentDetailLookupDataService.refreshMdcAllowanceCostCodesTree().then(function(data){
										platformGridAPI.items.data($scope.gridId, data);
									});
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
									dataProvider: $injector.get('estimateMainCostCodeAssignmentDetailLookupDataService')
								},
								dataView:dataView,
								dataProcessor:{},
								dataProvider: {

									getList: function () {
										let estimateMainCostCodeAssignmentDetailLookupDataService = $injector.get('estimateMainCostCodeAssignmentDetailLookupDataService');
										return estimateMainCostCodeAssignmentDetailLookupDataService.getList(true);
									},

									getSearchList: function (searchString,displayMember,scope,getSearchListSettings) {
										let platformGridAPI = $injector.get('platformGridAPI');
										if(scope.gridId){
											platformGridAPI.rows.expandAllNodes(scope.gridId);
										}

										let items = $injector.get('estimateMainCostCodeAssignmentDetailLookupDataService').getSearchListOnMdcAllowance(getSearchListSettings);
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

							$http.get(globals.webApiBaseUrl + 'basics/costcodes/getcostcodetype').then(function (costCodeTypes) {
								let estimateCCCostCodeTypes = _.filter(costCodeTypes.data, {'IsEstimateCc': true});
								dataServices.setEstimateCCCostCodeTypes(estimateCCCostCodeTypes);

								basicsLookupdataLookupViewService.showDialog(lookupConfig).then(function (result) {
									if (result && result.isOk && result.data && result.data.length > 0) {
										let currentAllowance = $injector.get('estimateAllowanceDialogDataService').getCurrentAllowance();

										let estimateMdcAllowanceAreaService = $injector.get('estimateMdcAllowanceAreaService');
										let param = {
											MdcContextId:currentAllowance.MasterContextFk,
											MdcAllowanceFk:currentAllowance.Id,
											MdcCostCodeFk:result.data[0].Id,
											MarkupGa:currentAllowance.MarkupGa,
											MarkupRp:currentAllowance.MarkupRp,
											MarkupAm:currentAllowance.MarkupAm,
											MdcAllowanceAreaFk: isAreaCostCode ? estimateMdcAllowanceAreaService.getSelected().Id : -1
										};
										let isCreateParentNode = $injector.get('estimateAllowanceMarkUp2CostCodeAssignmentGridService').getIsCreateParentNode(result.data[0]);
										param.IsCreateParentNode = isCreateParentNode;
										let url =globals.webApiBaseUrl + 'estimate/main/mdcAllmarkup2costcode/create';
										$http.post(url, param).then(function (response) {
											if(response && response.data){
												$injector.get('estimateAllowanceMarkUp2CostCodeAssignmentGridService').addItem(response.data,true,isAreaCostCode);
											}
										});
									}
								});
							});

						}
					},
					{
						id: 'delete',
						sort: 2,
						caption: 'cloud.common.taskBarDeleteRecord',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-delete',
						disabled: function () {
							if( !(dataServices.getList() && dataServices.getList().length)) {
								return true;
							}
							let selItem = dataServices.getSelectedEntities ();
							return !selItem.length;
						},
						fn: function onDelete() {
							let items =  dataServices.getSelectedEntities();
							let toDeletes = [];

							_.forEach(items,function (d) {
								if(!d.CostCodeParentFk){
									let input =[];
									cloudCommonGridService.flatten([d], input, 'CostCodes');
									toDeletes = toDeletes.concat(input);
								}else{
									toDeletes.push(d);
								}
							});
							toDeletes = _.uniqBy(toDeletes,'Id');
							_.forEach(toDeletes,function (d) {
								d.CostCodes =[];
							});
							dataServices.deleteEntities(toDeletes);
						}
					}
				],
				update: function () {
				}
			};
			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
				platformGridAPI.events.unregister($scope.gridId, 'onCellChange', cellChangeCallBack);
			});
		}
	]);
})();
