/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc directive
	 * @name estimateMainCostCodesLookup
	 * @requires  estimateMainJobCostcodesLookupService
	 * @description modal dialog window with costcodes grid to select the costcode
	 */
	/* jshint -W072 */ // This function too many parameters
	angular.module(moduleName).directive('estimateMainCostCodesLookup', [
		'_',
		'$timeout',
		'$http',
		'$translate',
		'$q',
		'$injector',
		'platformGridAPI',
		'estimateMainJobCostcodesLookupService',
		'estimateMainLookupService',
		'basicsCostCodesImageProcessor',
		'cloudCommonGridService',
		'estimateMainCommonService',
		'BasicsLookupdataLookupDirectiveDefinition',
		'basicsLookupdataConfigGenerator',
		'estimateMainCreateProjectCostCodeDialogService',
		'estimateMainCostCodesLookupDataService',
		function (
			_,
			$timeout,
			$http,
			$translate,
			$q,
			$injector,
			platformGridAPI,
			estimateMainJobCostcodesLookupService,
			estimateMainLookupService,
			basicsCostCodesImageProcessor,
			cloudCommonGridService,
			estimateMainCommonService,
			BasicsLookupdataLookupDirectiveDefinition,
			basicsLookupdataConfigGenerator,
			estimateMainCreateProjectCostCodeDialogService,
			estimateMainCostCodesLookupDataService,
		) {
			let lookupOptions = {};

			let isAssemblyModule = false;

			let defaults = {
				lookupType: 'estmdccostcodes',
				isColumnFilters: true,
				autoComplete: true,
				isExactSearch: false,
				eagerLoad: true,
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
					dataProcessor: function (dataList) {
						let output = [];
						if (dataList.length > 0) {
							cloudCommonGridService.flatten(dataList, output, 'CostCodes');
						}
						basicsCostCodesImageProcessor.insertImagesInList(output);
						for (let i = 0; i < output.length; ++i) {
							let lookupItem = output[i];
							if (Object.prototype.hasOwnProperty.call(lookupItem, 'nodeInfo')) {
								lookupItem.nodeInfo.collapsed = true;
							}
						}
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
								disabled: true,
							},
							{
								id: 't2',
								sort: 10,
								caption: 'cloud.common.taskBarDeleteRecord',
								type: 'item',
								iconClass: 'tlb-icons ico-rec-delete',
								disabled: true,
							},
						],
					},
				},

				events: [
					{
						name: 'onInitialized',
						handler: function (/* e, args */) {
							isAssemblyModule = lookupOptions.usageContext === 'estimateAssembliesResourceService';
						},
					},
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
				uuid: '353cb6c50ba84ca9b82e695911fa6cdb',
				dialogOptions: {
					id: '4600740246054decb51923418ffcab40',
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
				onDataRefresh: function ($scope) {
					estimateMainCostCodesLookupDataService.refreshData(function (costCodes) {
						$scope.refreshData(costCodes);
					});
				},

				userDefinedService: null,

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
			if(currencyLookupConfig.grid){
				currencyLookupConfig.grid.editor = null;
			}
			angular.extend(currencyConfig, currencyLookupConfig.grid);

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults, {
				lookupTypesServiceName: 'estimateMainLookupTypes',

				dataProvider: {
					myUniqueIdentifier: 'EstimateMainCostCodesLookupDataHandler',
					getList: function (opt, scope) {
						lookupOptions = opt;
						return estimateMainCostCodesLookupDataService.getList(opt, scope.entity);
					},
					getDefault: function (opt, scope) {
						return estimateMainCostCodesLookupDataService.getDefault(opt, scope.entity);
					},
					getItemByKey: function (value, options, scope) {
						return estimateMainCostCodesLookupDataService.getItemByKey(value, options, scope.entity);
					},
					getSearchList: function (value, field, scope) {
						estimateMainCostCodesLookupDataService.setDoCreatePrjCostCode(false);
						return estimateMainCostCodesLookupDataService.getSearchList(value ? value : '', field, scope ? scope.entity : null, !scope);
					},
					resolveStringValue : function (value, formatterOptions, service, entity, column){
						return estimateMainCostCodesLookupDataService.getSearchList(value, 'Code', entity, true).then(function(items){
							if (items && items.length > 0){
								estimateMainCostCodesLookupDataService.selectedItemChanged(angular.copy(items[0]));
								return {
									apply: true,
									valid: true,
									value: items[0].Code
								};
							}
							return {
								apply: true,
								valid: false,
								value: value,
								error: 'not found!'
							};
						});
					}
				},

				controller: [
					'$scope',
					function ($scope) {
						// do external logic to specific lookup directive controller here.
						estimateMainCostCodesLookupDataService.init($scope, function (userDefinedService) {
							defaults.userDefinedService = userDefinedService;
						});

						let dataService = $injector.get('estimateMainCostCodesLookupDataService');

						function onSelectedRowsChanged() {
							let item = platformGridAPI.rows.selection({
								gridId: $scope.lookupOptions.uuid
							});

							if(item){
								estimateMainCostCodesLookupDataService.setDoCreatePrjCostCode(item && item.IsProjectChildAllowed);
							} else {
								estimateMainCostCodesLookupDataService.setDoCreatePrjCostCode(false);
							}

							if ($scope.$$childHead && $scope.$$childHead.$$childHead && $scope.$$childHead.$$childHead.tools) {
								$scope.$$childHead.$$childHead.tools.update();
							}
						};

						function updateItemList() {
							platformGridAPI.events.register($scope.lookupOptions.uuid, 'onSelectedRowsChanged', onSelectedRowsChanged);
						}

						dataService.onSelectionChangedFired.register(updateItemList);

						$scope.$on('$destroy', function () {
							dataService.onSelectionChangedFired.unregister(updateItemList);
							platformGridAPI.events.unregister($scope.lookupOptions.uuid, 'onSelectedRowsChanged', onSelectedRowsChanged);
						});

					},
				],


			});
		},
	]);
})(angular);
