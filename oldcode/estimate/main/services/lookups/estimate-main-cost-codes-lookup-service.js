/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {

	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainCostCodesLookupService
	 * @requires  estimateMainLookupService
	 * @description modal dialog window with costcodes grid to select the costcode
	 */
	/* jshint -W072 */ // This function too many parameters
	angular.module(moduleName).factory('estimateMainCostCodesLookupService', ['_', '$q', '$injector', 'platformGridAPI', 'estimateMainLookupService', 'basicsCostCodesImageProcessor', 'cloudCommonGridService', 'estimateMainCommonService', 'BasicsLookupdataLookupDirectiveDefinition','basicsLookupdataConfigGenerator',
		'estimateMainService',
		function (_, $q, $injector, platformGridAPI, estimateMainLookupService, basicsCostCodesImageProcessor, cloudCommonGridService, estimateMainCommonService, BasicsLookupdataLookupDirectiveDefinition, basicsLookupdataConfigGenerator,
			estimateMainService) {

			let isAssemblyModule = false;
			let isPrjAssembly = false;

			function checkIfIsPrjAssembly() {
				isPrjAssembly = platformGridAPI.grids.exist('51f9aff42521497898d64673050588f4') || platformGridAPI.grids.exist('20c0401f80e546e1bf12b97c69949f5b');
			}
			function checkIfIsAssemblyModule() {
				isAssemblyModule = platformGridAPI.grids.exist('234bb8c70fd9411299832dcce38ed118') || // Assembly
					platformGridAPI.grids.exist('02580d5adb6b48429302166d9e9ac8c6'); // Plant Assembly
			}

			let isProjectCrewMixToCostCodeContainer = false;

			function checkProjectCrewMixToCostCodeContainer(){
				isProjectCrewMixToCostCodeContainer = platformGridAPI.grids.exist('5fbf701267ea4e20b4723a7d46dbee24');
			}

			let defaults = {
				lookupType: 'estmdccostcodes',
				isColumnFilters: true,
				isClientSearch: true,
				disableDataCaching: false,
				autoComplete: true,
				isExactSearch: false,
				buildSearchString: function (value) {
					return value;
				},
				matchDisplayMembers: ['Code', 'DescriptionInfo.Translated'],

				// Define standard toolbar Icons and their function on the scope
				treeOptions: {
					parentProp: 'CostCodeParentFk',
					childProp: 'ProjectCostCodes',
					inlineFilters: true,
					idProperty: 'Id',
					hierarchyEnabled: true,
					isTree : true,
					dataProcessor: function (dataList) {
						let output = [];
						if (dataList.length > 0) {
							cloudCommonGridService.flatten(dataList, output, 'ProjectCostCodes');
						}

						for (let i = 0; i < output.length; ++i) {
							let lookupItem = output[i];
							basicsCostCodesImageProcessor.processItem(lookupItem);
							basicsCostCodesImageProcessor.processLookupItem(lookupItem);
							// eslint-disable-next-line no-prototype-builtins
							if (lookupItem.hasOwnProperty('nodeInfo')){
								lookupItem.nodeInfo.collapsed = true;
							}
						}
						$injector.get('platformDataServiceEntitySortExtension').sortTree(dataList, 'Code', 'ProjectCostCodes');
						return dataList;
					},
					tools: {
						showImages: true,
						showTitles: true,
						cssClass: 'tools',
						items: [
							{
								id: 't1',
								sort: 0,
								caption: 'cloud.common.taskBarNewRecord',
								type: 'item',
								iconClass: 'tlb-icons ico-rec-new',
								disabled: true
							},
							{
								id: 't2',
								sort: 10,
								caption: 'cloud.common.taskBarDeleteRecord',
								type: 'item',
								iconClass: 'tlb-icons ico-rec-delete',
								disabled: true
							}
						]
					}
				},

				events: [
					{
						name: 'onInitialized',
						handler: function (e, args) {
							checkIfIsPrjAssembly();
							isAssemblyModule = args.lookupOptions.usageContext === 'estimateAssembliesResourceService';
						}
					},
					{
						name: 'onSelectedItemsChanged',
						handler: function (e, args) {
							let items = angular.copy(args.selectedItems),
								usageContext = args.lookupOptions.usageContext;

							// handle selected item in the service, (e.g update other entity fields based on single lookup selection)
							if (usageContext){
								let serviceContext = $injector.get(usageContext);
								if (serviceContext && angular.isFunction(serviceContext.getCostCodeLookupSelectedItems)){
									serviceContext.getCostCodeLookupSelectedItems({} , items || []);
								}
							}
						}
					},
					{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							let selectedItem = angular.copy(args.selectedItem);
							estimateMainCommonService.setSelectedLookupItem(selectedItem);
						}
					}
				],
				uuid: '353cb6c50ba84ca9b82e695911fa6cdb',
				columns: [
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
						field: 'Description',
						name: 'Description',
						formatter: 'description',
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
				],
				width: 1000,
				height: 800,
				title: {
					name: 'basics.costcodes.costCodes'
				},
				gridOptions: {
					multiSelect: false
				},
				dialogOptions: {
					id: '353cb6c50ba84ca9b82e695911fa6cdb',
					resizeable: true
				},
				selectableCallback: function (selectItem) {
					return !(selectItem.isMissingParentLevel && selectItem.isMissingParentLevel === true);
				},


				userDefinedService: null
			};

			let costCodeTypeConfig = _.find(defaults.columns, function (item) {
				return item.id === 'CostCodeTypeFk';
			});

			let costTypeConfig = _.find(defaults.columns, function (item) {
				return item.id === 'EstCostTypeFk';
			});

			let currencyConfig = _.find(defaults.columns, function (item) {
				return item.id === 'CurrencyFk';
			});

			angular.extend(costCodeTypeConfig,basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.costcodes.costcodetype', 'Description').grid);

			angular.extend(costTypeConfig,basicsLookupdataConfigGenerator.provideReadOnlyConfig('estimate.lookup.costtype', 'Description').grid);

			let currencyLookupConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'basicsCurrencyLookupDataService',
				enableCache: true,
				readonly : true});
			angular.extend(currencyConfig,currencyLookupConfig.grid);

			let service = {};

			service.getLookupDefinition = function () {
				defaults.lookupType = 'estmdccostcodes';
				defaults.onDataRefresh = function ($scope) {
					estimateMainLookupService.clearCache(true);
					estimateMainLookupService.loadProjectCostCode();
					checkIfIsAssemblyModule();
					if (isAssemblyModule) {
						estimateMainLookupService.getMdcCostCodesTree().then(function (data) {
							let costCodes = _.filter(data, function (item) {
								return item.CostCodeParentFk === null;
							});
							$scope.refreshData(costCodes);
						});
					} else {
						estimateMainLookupService.getEstCostCodesTree().then(function (data) {
							let costCodes = _.filter(data, function (item) {
								return item.CostCodeParentFk === null;
							});
							$scope.refreshData(costCodes);
						});
					}
				};

				return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, {

					lookupTypesServiceName: 'estimateMainLookupTypes',

					dataProvider: {
						myUniqueIdentifier: 'EstimateMainCostCodesLookupDataHandler',

						getList: function () {
							checkIfIsAssemblyModule();
							return isAssemblyModule ? $q.when(estimateMainLookupService.getMdcCostCodesTree()) : $q.when(estimateMainLookupService.getEstCostCodesTree());
						},

						getDefault: function () {
							let item = {};
							checkIfIsAssemblyModule();
							let list = isAssemblyModule ? estimateMainLookupService.getMdcCostCodesTree() : estimateMainLookupService.getEstCostCodesTree();
							for (let i = 0; i < list.length; i++) {
								if (list[i].IsDefault === true) {
									item = list[i];
									break;
								}
							}
							return item;
						},

						getItemByKey: function (identification, options, scope) {
							let estimateMainResourceType = $injector.get('estimateMainResourceType');
							if (scope && scope.entity && scope.entity.EstResourceTypeFk === estimateMainResourceType.CostCode && scope.entity.MdcCostCodeFk > 0) {
								switch (options.usageContext) {
									case 'estimateMainResourceService':
										return estimateMainLookupService.getEstCCById(scope.entity.MdcCostCodeFk);
									default:
										return estimateMainLookupService.getMdcCCById(scope.entity.MdcCostCodeFk);
								}
							} else if (scope && scope.entity && scope.entity.EstResourceTypeFk === estimateMainResourceType.Material && scope.entity.MdcCostCodeFk > 0) {
								return $injector.get('estimateMainPrjMaterialLookupService').getPrjMaterial(scope.entity).then(function (data) {
									return data;
								});
							} else {
								return $q.when([]);
							}
						},

						getSearchList: function(value, field, scope){
							if (value) {
								let isSpecificSearch = !scope;
								// value = value.replace(/[`~§!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''); //remove special char from string
								checkIfIsAssemblyModule();
								if (isAssemblyModule){
									return estimateMainLookupService.getSearchMdcList(value, field, isSpecificSearch).then(function(data){
										return data;
									});
								}else{
									return estimateMainLookupService.getSearchList(value, field, isSpecificSearch).then(function(data){
										return data;
									});
								}
							}
							else{
								return $q.when([]);
							}
						}
					}
				});
			};

			// this lookup using in replace resouces wizard
			service.getLookupForProjectDefinition = function () {
				let thisConfig = angular.copy(defaults);
				let headerId = estimateMainService.getSelectedEstHeaderId();
				checkIfIsAssemblyModule();
				if(!isAssemblyModule) {
					let jobfk = {
						id: 'lgmjobfk',
						field: 'LgmJobFk',
						name: 'Job',
						width: 50,
						name$tr$: 'logistic.job.entityJob',
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'logisticJobLookupByProjectDataService',
							cacheEnable: true,
							additionalColumns: true,
							filter: function () {
								return estimateMainService.getSelectedProjectId();
							}
						}).grid.formatterOptions
					};
					thisConfig.columns.push(jobfk);
				}

				thisConfig.lookupType = 'mdcprjcostcodes';
				checkProjectCrewMixToCostCodeContainer();
				if(isProjectCrewMixToCostCodeContainer){
					let formaterOptions = {
						additionalColumns: true,
					};

					thisConfig.valueMember = 'Id';
					thisConfig.displayMember = 'Code';
					thisConfig.columns[0].formatterOptions = formaterOptions;					
					headerId = -1;
				}

				thisConfig.onDataRefresh = function ($scope) {
					estimateMainLookupService.clearCache(true);					
					estimateMainLookupService.getPrjCostCodesTree(true, headerId).then(function (result) {
						$scope.refreshData(result);
					});
				};

				return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', thisConfig, {

					lookupTypesServiceName: 'estimateMainLookupTypes',

					dataProvider: {
						myUniqueIdentifier: 'EstimateMainProjectCostCodesLookupDataHandler',

						getList: function () {
							return $q.when(estimateMainLookupService.getPrjCostCodesTree(true, headerId));
						},

						getDefault: function () {
							let item = {};
							let list = estimateMainLookupService.getPrjCostCodesTree();
							for (let i = 0; i < list.length; i++) {
								if (list[i].IsDefault === true) {
									item = list[i];
									break;
								}
							}
							return item;
						},

						getItemByKey: function(identification){
							let lookupData = estimateMainLookupService.getEstCostCodesSyn();							
							return (lookupData && !_.isNil(identification)) ? _.find(lookupData,{'Id':identification}) : null;
						},
						getSearchList: function(value, field, scope){
							if (value) {
								let isSpecificSearch = !scope;
								// value = value.replace(/[`~§!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''); //remove special char from string

								return estimateMainLookupService.getSearchPrjList(value, field, isSpecificSearch, 'ProjectCostCodes').then(function(data){
									return data;
								});
							}
							else{
								return $q.when([]);
							}
						}
					}
				});
			};

			service.getLookupForAssemblyDefinition = function (param) {
				let thisConfig = angular.copy(defaults);
				thisConfig.valueMember = 'Id';
				thisConfig.displayMember = 'Code';
				thisConfig.lookupType = 'mdAssemblycostcodes';
				thisConfig.treeOptions.childProp = 'CostCodes';
				_.forEach(thisConfig.columns, function(e) {
					if (e.id === 'Description') {
						e.field = 'DescriptionInfo';
						e.formatter = 'translation';
					}
				});

				thisConfig.disableDataCaching = true;
				thisConfig.onDataRefresh = function ($scope) {
					estimateMainLookupService.clearCache(true);

					estimateMainLookupService.getEstCostCodesTreeForAssemblies(param).then(function (data) {
						let costCodes = _.filter(data, function (item) {
							return item.CostCodeParentFk === null;
						});
						thisConfig.userDefinedService.attachDataToColumnLookup(costCodes, thisConfig.uuid, true);
						$scope.refreshData(costCodes);
					});
				};
				thisConfig.selectableCallback= function (selectItem) {
					if(param){
						return !estimateMainLookupService.transferCostCodeIds.includes(selectItem.Id);
					}
					else {
						return !param;
					}
				}
				return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', thisConfig, {

					lookupTypesServiceName: 'estimateMainLookupTypes',

					dataProvider: {
						myUniqueIdentifier: 'EstimateMainProjectCostCodesLookupDataHandler',

						getList: function () {
							return estimateMainLookupService.getEstCostCodesTreeForAssemblies(param).then(function(assemblyMasterCostCodes){
								thisConfig.userDefinedService.attachDataToColumnLookup(assemblyMasterCostCodes, thisConfig.uuid, true);
								return $q.when(assemblyMasterCostCodes);
							});
						},

						getDefault: function () {
							let item = {};
							let list = estimateMainLookupService.getEstCostCodesTreeForAssemblies();
							for (let i = 0; i < list.length; i++) {
								if (list[i].IsDefault === true) {
									item = list[i];
									break;
								}
							}
							return item;
						},

						getItemByKey: function(value){							
							return estimateMainLookupService.getEstCCByIdAsync(value);
						},
						getSearchList: function(value, field, scope){
							if (value) {
								let isSpecificSearch = !scope;
								// value = value.replace(/[`~§!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''); //remove special char from string

								return estimateMainLookupService.getSearchEstCostCodesList(value, field, isSpecificSearch,param).then(function(data){
									thisConfig.userDefinedService.attachDataToColumnLookup(data, thisConfig.uuid);
									return data;
								});
							}
							else{
								return $q.when([]);
							}
						}
					},
					controller: ['$scope', 'platformGridAPI', 'platformCreateUuid', function ($scope) {
						let columns = $scope.lookupOptions.columns;
						if (Object.hasOwnProperty.call($scope.lookupOptions, 'userDefinedConfigService')){
							thisConfig.userDefinedService = $injector.get($scope.lookupOptions.userDefinedConfigService);
							thisConfig.userDefinedService.attachDataToColumnLookup = function(data, gridUuid, reLoad){
								let flattenCostCodeList = [];
								cloudCommonGridService.flatten(data, flattenCostCodeList, thisConfig.treeOptions.childProp);
								checkIfIsAssemblyModule();
								checkIfIsPrjAssembly();
								let attachDataFn = isAssemblyModule || isPrjAssembly ?
									thisConfig.userDefinedService.attachDataForLookup: thisConfig.userDefinedService.attachDataFromExtend;

								if(_.isFunction(attachDataFn)){
									attachDataFn(flattenCostCodeList, null, true, isPrjAssembly, reLoad).then(function(){
										platformGridAPI.grids.refresh(gridUuid);
									});
								}
							};

							let userDefinedColumns = thisConfig.userDefinedService.getDynamicColumnsForLookUp();
							userDefinedColumns = _.filter(userDefinedColumns, function(item){ return !item.field.endsWith('Total'); });

							_.forEach(userDefinedColumns, function(col){
								col.editor = null;
								col.readonly = true;
							});
							$scope.lookupOptions.columns = columns.concat(userDefinedColumns);
						}else{
							thisConfig.userDefinedService = {
								loadDynamicColumns: function(){ return $q.when([]); },
								getDynamicColumns: function(){ return $q.when([]); },
								attachDataToColumn: function(){ return $q.when([]); },
								attachDataToColumnLookup: function(){ return $q.when([]); }
							};
						}
					}]
				});
			};

			return service;
		}
	]);
})(angular);

