/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'basics.costcodes';

	angular.module(moduleName).run(['basicsLookupdataLookupFilterService', function(basicsLookupdataLookupFilterService){

		let lookupFilter = [
			{
				key: 'cost-code-isEstimateCc-and-company-filter',
				serverKey: 'cost-code-isEstimateCc-and-company-filter',
				serverSide: true,
				fn: function (contextData, state) {
					return { IsEstimateCc: true, FilterByCompany: true };
				}
			},
			{
				key: 'estimate-assemblies-lazy-load-cost-codes-filter',
				serverKey: 'estimate-assemblies-lazy-load-cost-codes-filter',
				serverSide: true,
				fn: function (contextData, state) {
					return { IsEstimateCc: true, FilterByCompany: true };
				}
			}
		];

		basicsLookupdataLookupFilterService.registerFilter(lookupFilter);
	}]);

	angular.module(moduleName).directive('basicsCostCodesLookup',
		['_','basicsCostCodesImageProcessor','BasicsLookupdataLookupDirectiveDefinition', function (_,imageProcessor,BasicsLookupdataLookupDirectiveDefinition) {
			let defaults = angular.copy(configOption);

			defaults.treeOptions.dataProcessor = function (dataList) {
				imageProcessor.processData(dataList);
				return dataList;
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
							}
		]);

	let configOption = {
		lookupType: 'costcode',
		valueMember: 'Id',
		displayMember: 'Code',
		uuid: '71a0b76babc841a7baa8bf43460ce7c1',
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
		width: 1200,
		height: 800,
		title: {
			name: 'CostCodes',
			name$tr$: 'basics.costcodes.costCodes'
		},
		treeOptions: {
			parentProp: 'CostCodeParentFk',
			childProp: 'CostCodes',
			inlineFilters: true,
			hierarchyEnabled: true,
			lazyLoad: true,
			depth: 1
					},
		version: 3
	};


	angular.module(moduleName).directive('basicsPrcCommonCostCodesLookup',
		['_','basicsCostCodesImageProcessor','BasicsLookupdataLookupDirectiveDefinition','$injector','basicsCommonUtilities', 'cloudCommonGridService', function (_,imageProcessor,BasicsLookupdataLookupDirectiveDefinition,$injector,basicsCommonUtilities, cloudCommonGridService) {
			let defaults = angular.copy(configOption);
			defaults.lookupType = 'NewEstimateCostCode';
			defaults.version =3;
			defaults.dataProcessor = {};

			// it is weird that response is empty if I set lazyLoad to false
			defaults.treeOptions.lazyLoad = true;
			defaults.treeOptions.depth = 1;

			// defaults.dataProcessor.execute = function (dataList) {
			// 	if(!!dataList && dataList.length > 0){
			// 		let selectedCostode = $injector.get('prcCommonUpdateEstimatePrcStructureDataSerivce').getSelected();
			// 		if(selectedCostode){
			// 			let result = [];
			// 			let flatCostCodes = cloudCommonGridService.flatten(dataList, result, 'CostCodes');
			//
			// 			let element = $injector.get('platformGridAPI').grids.element('id', 'FA740FF0A2094DA085175A2E379F60A7');
			// 			let grid = element.instance;
			// 			let selectedColumn = grid.getColumns()[grid.getActiveCell().cell];
			// 			let masterCostCodeFk = selectedCostode['Master' + selectedColumn.field];
			//
			// 			if(masterCostCodeFk){
			// 				dataList = _.filter(flatCostCodes, {Id: masterCostCodeFk});
			//
			// 				let costCodeFk = selectedCostode[ selectedColumn.field];
			// 				let list2 = costCodeFk ? _.filter(flatCostCodes, {Id: costCodeFk}):[];
			// 				dataList = dataList.concat(list2);
			// 			}
			// 		}
			// 	}
			//
			// 	return dataList;
			// };

			defaults.treeOptions.dataProcessor = function (dataList) {
				imageProcessor.processData(dataList);
				return dataList;
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}
		]);

	angular.module(moduleName).directive('salesBillingItemCostCodesLookup',
		['basicsCostCodesImageProcessor','BasicsLookupdataLookupDirectiveDefinition', function (imageProcessor,BasicsLookupdataLookupDirectiveDefinition) {
			let defaults = angular.copy(configOption);

			function keepRawDayWorkRate(dataList) {
				angular.forEach(dataList, function (item) {
					if(!item.RawDayWorkRate){
						item.RawDayWorkRate = item.DayWorkRate;
					}

					if (item.CostCodes && item.CostCodes.length > 0) {
						keepRawDayWorkRate(item.CostCodes);
					}
				});

				return dataList;
			}

			defaults.columns.push({
				id: 'CostCodePriceListFk',
				field: 'CostCodePriceListFk',
				name: 'CostCodePriceListFk',
				width: 100,
				name$tr$: 'basics.costcodes.costCodePriceListFk',
				editor: 'lookup',
				editorOptions: {
					directive: 'basics-cost-codes-price-list-selection',
					lookupOptions: {
						showClearButton: true
					}
				},
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'MdcCostCodePriceList',
					displayMember: 'DescriptionInfo.Translated'
				}
			});

			defaults.treeOptions.dataProcessor = function (dataList) {
				imageProcessor.processData(dataList);
				keepRawDayWorkRate(dataList);
				return dataList;
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, {
				controller : ['$scope', function () {

				}]
			});
		}
		]);

	angular.module(moduleName).directive('estimateCostCodesLookup',
		['_', 'basicsCostCodesImageProcessor', 'BasicsLookupdataLookupDirectiveDefinition', function (_, imageProcessor, BasicsLookupdataLookupDirectiveDefinition) {
			let defaults = angular.copy(configOption);
			defaults.lookupType = 'EstimateCostCode';
			defaults.version = null;
			defaults.treeOptions.dataProcessor = function (dataList) {
				imageProcessor.processData(dataList);
				return dataList;
			};
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}
		]);

	angular.module(moduleName).directive('assembliesCostCodesLookup',
		[
		'_',
		'$injector',
		'platformGridAPI',
		'basicsCostCodesImageProcessor',
		'cloudCommonGridService',
		'BasicsLookupdataLookupDirectiveDefinition',
		'basicsLookupdataConfigGenerator',
		'estimateMainCreateProjectCostCodeDialogService',
		'estimateMainCostCodesLookupDataService',
		function (
			_,
			$injector,
			platformGridAPI,
			basicsCostCodesImageProcessor,
			cloudCommonGridService,
			BasicsLookupdataLookupDirectiveDefinition,
			basicsLookupdataConfigGenerator,
			estimateMainCreateProjectCostCodeDialogService,
			estimateMainCostCodesLookupDataService,
		) {
			let lookupOptions = {};

			let defaults = {
				lookupType: 'costcode',
				isColumnFilters: true,
				autoComplete: true,
				isExactSearch: false,
				buildSearchString: function (value) {
					return value;
				},
				matchDisplayMembers: ['Code', 'DescriptionInfo.Translated'],

				// Define standard toolbar Icons and their function on the scope
				treeOptions: {
					parentProp: 'CostCodeParentFk',
					childProp: 'CostCodes',
					inlineFilters: true,
					idProperty: 'Id',
					hierarchyEnabled: true,
					isTree: true,
					lazyLoad: true,
					depth: 1,
					dataProcessor: function (dataList) {
						let output = [];
						if (dataList.length > 0) {
							cloudCommonGridService.flatten(dataList, output, 'CostCodes');
						}
						for (let i = 0; i < output.length; ++i) {
							let lookupItem = output[i];
							basicsCostCodesImageProcessor.processItem(lookupItem);
							basicsCostCodesImageProcessor.processLookupItem(lookupItem);
						}
						return dataList;
					},
				},

				events: [
					{
						name: 'onSelectedItemsChanged',
						handler: function (e, args) {
							estimateMainCostCodesLookupDataService.selectedItemsChanged(angular.copy(args.selectedItems));
						},
					},
					{
						name: 'onSelectedItemChanged',
						handler: function (e, args) {
							estimateMainCostCodesLookupDataService.selectedItemChanged(angular.copy(args.selectedItem));
						},
					},
					{
						name: 'onPopupOpened',
						handler: function () {
							defaults.onPopupOpened = 1;
						},
					},
					{
						name: 'onPopupClosed',
						handler: function () {
							delete defaults.onPopupOpened;
						},
					},
				],
				uuid: '1925165eea3f49dbb8d985195d5e3195',
				dialogOptions: {
					id: 'b80a10f31428471bb0767456ba5d417e',
					resizeable: true,
				},
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 70,
						name$tr$: 'cloud.common.entityCode',
						searchable: true,
					},

					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 100,
						name$tr$: 'cloud.common.entityDescription',
						searchable: true,
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
							displayMember: 'Unit',
						},
					},

					{
						id: 'Rate',
						field: 'Rate',
						name: 'Market Rate',
						formatter: 'money',
						width: 70,
						name$tr$: 'basics.costcodes.unitRate',
					},
					{
						id: 'IsProjectChildAllowed',
						field: 'IsProjectChildAllowed',
						name: 'Child Allowed',
						formatter: 'boolean',
						width: 30,
						name$tr$: 'basics.costcodes.isChildAllowed',
					},
					{
						id: 'CurrencyFk',
						field: 'CurrencyFk',
						name: 'Currency',
						width: 50,
						name$tr$: 'cloud.common.entityCurrency',
						searchable: true,
					},
					{
						id: 'IsLabour',
						field: 'IsLabour',
						name: 'Labour',
						formatter: 'boolean',
						width: 50,
						name$tr$: 'estimate.main.isLabour',
						readOnly: true,
						searchable: true,
					},

					{
						id: 'IsRate',
						field: 'IsRate',
						name: 'Fix',
						formatter: 'boolean',
						width: 30,
						name$tr$: 'estimate.main.isRate',
					},

					{
						id: 'FactorCosts',
						field: 'FactorCosts',
						name: 'FactorCosts',
						formatter: 'factor',
						width: 70,
						name$tr$: 'basics.costcodes.factorCosts',
						searchable: true,
					},
					{
						id: 'FactorHour',
						field: 'FactorHour',
						name: 'FactorHour',
						formatter: 'factor',
						width: 70,
						name$tr$: 'basics.costcodes.factorHour',
						searchable: true,
					},
					{
						id: 'RealFactorCosts',
						field: 'RealFactorCosts',
						name: 'RealFactorCosts',
						formatter: 'factor',
						width: 70,
						name$tr$: 'basics.costcodes.realFactorCosts',
					},

					{
						id: 'FactorQuantity',
						field: 'FactorQuantity',
						name: 'FactorQuantity',
						formatter: 'factor',
						width: 70,
						name$tr$: 'basics.costcodes.factorQuantity',
						searchable: true,
					},

					{
						id: 'RealFactorQuantity',
						field: 'RealFactorQuantity',
						name: 'RealFactorQuantity',
						formatter: 'factor',
						width: 70,
						name$tr$: 'basics.costcodes.realFactorQuantity',
						searchable: true,
					},

					{
						id: 'CostCodeTypeFk',
						field: 'CostCodeTypeFk',
						name: 'Type',
						width: 70,
						name$tr$: 'basics.costcodes.entityType',
						searchable: true,
					},

					{
						id: 'EstCostTypeFk',
						field: 'EstCostTypeFk',
						name: 'Type',
						width: 70,
						name$tr$: 'basics.costcodes.costType',
						searchable: true,
					},

					{
						id: 'DayWorkRate',
						field: 'DayWorkRate',
						name: 'DW/T+M Rate',
						formatter: 'money',
						width: 70,
						name$tr$: 'basics.costcodes.dayWorkRate',
						searchable: true,
					},

					{
						id: 'Remark',
						field: 'Remark',
						name: 'remarks',
						formatter: 'remark',
						width: 100,
						name$tr$: 'cloud.common.entityRemark',
						searchable: true,
					},
					{
						id: 'Co2Source',
						field: 'Co2Source',
						name: 'Co2Source',
						formatter: 'quantity',
						width: 70,
						name$tr$: 'cloud.common.sustainabilty.entityCo2Source',
						searchable: true,
					},
					{
						id: 'Co2Project',
						field: 'Co2Project',
						name: 'Co2Project',
						formatter: 'quantity',
						width: 70,
						name$tr$: 'cloud.common.sustainabilty.entityCo2Project',
						searchable: true,
					},
					{
						id: 'UserDefined1',
						field: 'UserDefined1',
						name: 'Text 1',
						width: 100,
						toolTip: 'Text 1',
						formatter: 'description',
						name$tr$: 'cloud.common.text1',
						name$tr$param$: { p_0: '1' },
					},
					{
						id: 'UserDefined2',
						field: 'UserDefined2',
						name: 'Text 2',
						width: 100,
						toolTip: 'Text 2',
						formatter: 'description',
						name$tr$: 'cloud.common.entityUserDefText',
						name$tr$param$: { p_0: '2' },
					},
					{
						id: 'Userdefined3',
						field: 'UserDefined3',
						name: 'Text 3',
						width: 100,
						toolTip: 'Text 3',
						formatter: 'description',
						name$tr$: 'cloud.common.entityUserDefText',
						name$tr$param$: { p_0: '3' },
					},
					{
						id: 'Userdefined4',
						field: 'UserDefined4',
						name: 'Text 4',
						width: 100,
						toolTip: 'Text 4',
						formatter: 'description',
						name$tr$: 'cloud.common.entityUserDefText',
						name$tr$param$: { p_0: '4' },
					},
					{
						id: 'Userdefined5',
						field: 'UserDefined5',
						name: 'Text 5',
						width: 100,
						toolTip: 'Text 5',
						formatter: 'description',
						name$tr$: 'cloud.common.entityUserDefText',
						name$tr$param$: { p_0: '5' },
					},
				],
				width: 1000,
				height: 800,
				title: {
					name: 'Cost Codes',
					name$tr$: 'basics.costcodes.costCodes',
				},
				gridOptions: {
					multiSelect: false,
				},
				grid: {},

				userDefinedService: null,
				onDataRefresh: function ($scope) {
					$scope.search(null);
				},
				toolbarItems: [
					{
						id: 't1',
						sort: 0,
						caption: 'cloud.common.toolbarNewSubdivision',
						type: 'item',
						iconClass: 'control-icons ico-plus',
						fn: function () {
							// open popup dialog here
							initializePopup();
						},
						disabled: function () {
							return estimateMainCostCodesLookupDataService.canCreateChildItem();
						},
						hideItem: function () {
							return estimateMainCostCodesLookupDataService.canHideCreateItem();
						},
					},
				],
				selectableCallback: function (selectItem) {
					let assembly = $injector.get('estimateAssembliesService').getSelected();
					if(assembly && assembly.TransferMdcCostCodeFk){
						return selectItem.IsEstimateCostCode && !(selectItem.Id === assembly.TransferMdcCostCodeFk);
					}
					return selectItem.IsEstimateCostCode;
				},
				resolveStringValueCallback: function resolveStringValueCallback(options) {
					return function (value){
						let filterParams = {
							codeProp: 'Reference',
							descriptionProp: 'Reference',
							isSpecificSearch: null,
							searchValue: value,
						};
						let boqItemsCopy = estimateMainBoqItemService.getSearchList(null,value, null);

						let existItems = estimateMainCommonLookupService.getSearchData(filterParams, boqItemsCopy, 'BoqItems', 'BoqItemFk', true);

						const lowercaseValue = value.toLowerCase();

						const filteredItem = _.find(existItems, (item) => item.Code === value) || _.find(existItems, (item) => item.Code.toLowerCase() === lowercaseValue);

						if (filteredItem) {
							return {
								apply: true,
								valid: true,
								value: filteredItem.Id,
							};
						} else {
							return {
								apply: true,
								valid: false,
								value: value,
								error: 'Not found!'
							};
						}
					}
				},

				version: 3
			};

			function initializePopup() {
				let grid = platformGridAPI.grids.element('id', defaults.uuid).instance;
				let selectedRow = grid.getSelectedRows();
				let item = grid.getDataItem(selectedRow);
				estimateMainCreateProjectCostCodeDialogService.create(item, lookupOptions);
			}

			let costCodeTypeConfig = _.find(defaults.columns, function (item) {
				return item.id === 'CostCodeTypeFk';
			});

			let costTypeConfig = _.find(defaults.columns, function (item) {
				return item.id === 'EstCostTypeFk';
			});

			let currencyConfig = _.find(defaults.columns, function (item) {
				return item.id === 'CurrencyFk';
			});

			angular.extend(costCodeTypeConfig, basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.costcodes.costcodetype', 'Description').grid);
			angular.extend(costTypeConfig, basicsLookupdataConfigGenerator.provideReadOnlyConfig('estimate.lookup.costtype', 'Description').grid);

			let currencyLookupConfig = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'basicsCurrencyLookupDataService',
				enableCache: true,
				readonly: true,
			});
			angular.extend(currencyConfig, currencyLookupConfig.grid);

			var customConfiguration = {
				lookupTypesServiceName: 'estimateMainLookupTypes',
				controller: [
					'$scope',
					function ($scope) {
						// do external logic to specific lookup directive controller here.
						estimateMainCostCodesLookupDataService.init($scope, function (userDefinedService) {
							defaults.userDefinedService = userDefinedService;
						});
					},
				],
			}
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, customConfiguration);
		},
	]
	);

})(angular);