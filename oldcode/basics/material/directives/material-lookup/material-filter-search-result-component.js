/*
 * Copyright(c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.material';
	angular.module(moduleName).component('basicsMaterialFilterSearchResult', {
		templateUrl: 'basics.material/templates/material-lookup/material-filter-search-result-component.html',
		bindings: {
			searchViewOptions: '<'
		},
		controller: [
			'$scope',
			'$element',
			'$timeout',
			'$translate',
			'$sanitize',
			'platformGridAPI',
			'platformTranslateService',
			'basicsMaterialFilterSearchGridColumn',
			'basicsMaterialSearchSortOptions',
			'materialLookupDialogSearchOptionService',
			'basicsLookupdataPopupService',
			'cloudDesktopHotKeyService',
			'platformPermissionService',
			'basicsMaterialSearchGridId',
			function (
				$scope,
				$element,
				$timeout,
				$translate,
				$sanitize,
				platformGridAPI,
				platformTranslateService,
				basicsMaterialFilterSearchGridColumn,
				searchSortOptions,
				searchOptionService,
				basicsLookupdataPopupService,
				cloudDesktopHotKeyService,
				platformPermissionService,
				basicsMaterialSearchGridId
			) {
				let splitter = null;
				let searchBarResizeObserver = null;
				let isPreviewPanelCanAutoOpen = true;
				let hasReadPermissionOfSimilar = false;
				let hasCreatePermissionOfSimilar = false;
				const materialLookupDialogGridId = basicsMaterialSearchGridId;
				const sortByOptionsPopupHelper = basicsLookupdataPopupService.getToggleHelper();
				const searchViewOptions = this.searchViewOptions;
				const currentFilterOption = searchViewOptions.getCurrentFilterOption();

				$scope.dialog = $scope.$parent.$parent.$parent.$parent.$parent.dialog;
				$scope.searchViewOptions = this.searchViewOptions;
				$scope.searchService = this.searchViewOptions.searchService;
				$scope.searchOptions = this.searchViewOptions.searchService.searchOptions;
				$scope.detailPanelId = 'ui-layout-right';
				$scope.SortOptionDescription = '';
				$scope.canClone = canClone;
				$scope.showSortByOptionsPopup = showSortByOptionsPopup;
				$scope.defaultDisplayFields = getDefaultDisplayFields();
				$scope.gridData = {
					state: materialLookupDialogGridId
				};
				$scope.selectedItemDetail = {
					selectedItem: null
				};
				$scope.toolbarCopyItem = {
					caption: 'basics.material.lookup.createCopy',
					contextAreas: ['grid-row'],
					fn: clone,
					iconClass: 'tlb-icons ico-copy',
					id: 'copy',
					shortCut: cloudDesktopHotKeyService.getTooltip('createCopy'),
					type: 'item'
				};
				$scope.rightClickTools = {items: []};
				$scope.searchNoResult = false;

				this.$onInit = function onInit() {
					initSortOption();
					initMaterialGrid();
					$scope.searchService.onListLoaded.register(onMaterialListLoaded);

					hasReadPermissionOfSimilar = !!platformPermissionService.hasRead(searchViewOptions.similarPermissionUuid);
					hasCreatePermissionOfSimilar = !!platformPermissionService.hasExecute(searchViewOptions.similarPermissionUuid);
					if (hasClonePermission()) {
						$scope.rightClickTools.items.push($scope.toolbarCopyItem);
						cloudDesktopHotKeyService.register('createCopy', clone);
					}
				}

				this.$postLink = function onPostLink() {
					observeSearchBarHeight();
				}

				function initMaterialGrid() {
					const gridConfig = {
						columns: getColumns(),
						id: materialLookupDialogGridId,
						data: $scope.searchService.data.items ?? [],
						lazyInit: true,
						options: {
							indicator: true,
							idProperty: 'Id',
							enableConfigSave: true,
							editorLock: new Slick.EditorLock()
						}
					};

					if (platformGridAPI.grids.exist(materialLookupDialogGridId)) {
						platformGridAPI.grids.unregister(materialLookupDialogGridId);
					}

					platformTranslateService.translateGridConfig(gridConfig.columns);
					platformGridAPI.grids.config(gridConfig);
					platformGridAPI.events.register(materialLookupDialogGridId, 'onSelectedRowsChanged', onSelectionItemChange);
					platformGridAPI.events.register(materialLookupDialogGridId, 'onDblClick', onDoubleClickItem);
					platformGridAPI.events.register(materialLookupDialogGridId, 'onHeaderCheckboxChanged', onHeaderCheckboxChanged);
				}

				function onSelectionItemChange() {
					const selectedItem = platformGridAPI.rows.selection({gridId: materialLookupDialogGridId});
					const stateOfSelection = selectedItem?.selected;
					$scope.selectedItemDetail.selectedItem = selectedItem ?? null;
					toggleDetailPanel(!!selectedItem);

					// Check the checkbox automatically when user selects a material item.
					// Not check the checkbox when user manually modifies the checkbox status.
					$timeout(function () {
						if (selectedItem && selectedItem.selected === stateOfSelection && !selectedItem.selected) {
							// For update header checkbox state
							$('.slick-cell.column-id_selected.selected')?.find('input')?.click();
						}
					});

					$scope.$root.safeApply();
				}

				function onDoubleClickItem() {
					const item = platformGridAPI.rows.selection({gridId: materialLookupDialogGridId});
					item.selected = true;
					searchViewOptions.onSelectedChanged_redesign(item);
					searchViewOptions.onRowDoubleClick(item);
				}

				function onHeaderCheckboxChanged(e) {
					searchViewOptions.selectedAllOfPage($scope.searchService.data.items, e.target.checked);
				}

				function toggleDetailPanel(isOpenDetailPanel) {
					splitter = getSplitter();
					if ((isOpenDetailPanel && splitter.options.panes[1].collapsed && isPreviewPanelCanAutoOpen) ||
						!isOpenDetailPanel && !splitter.options.panes[1].collapsed) {
						if (!isOpenDetailPanel) {
							splitter.unbind('resize', onSplitterResize);
						}
						splitter.toggle(`#${$scope.detailPanelId}`);
						if (isOpenDetailPanel && isPreviewPanelCanAutoOpen) {
							splitter.bind('resize', onSplitterResize);
						}
					}
				}

				function onSplitterResize(e) {
					if (e.sender.options.panes[1].collapsed) {
						isPreviewPanelCanAutoOpen = false;
						getSplitter().unbind('resize', onSplitterResize);
					}
				}

				function onMaterialListLoaded() {
					$scope.searchNoResult = !$scope.searchService.data.items?.length;
					platformGridAPI.items.data(materialLookupDialogGridId, $scope.searchService.data.items);
					platformGridAPI.grids.resize(materialLookupDialogGridId);

					// If the search result does not change, manually change the checkbox status
					$timeout(function () {
						const hasSelectedItem = !!$scope.searchService.data.items.find(i => i.selected);
						const headerChkBoxElement = $('.slick-header-column')?.find('.checkbox-radio-box')?.find('input')?.get(0);
						const isCheckHeaderChkBox = !!(headerChkBoxElement?.indeterminate || headerChkBoxElement?.checked);
						if (!hasSelectedItem && isCheckHeaderChkBox) {
							headerChkBoxElement.indeterminate = false;
							headerChkBoxElement.checked = false;
						}
					});
				}

				function onDialogMaximizeOrMinimize() {
					getSplitter()?.resize(true);
					platformGridAPI.grids.resize(materialLookupDialogGridId);
				}

				function getSplitter() {
					return splitter ?? $element.eq(0).find('.k-splitter').data('kendoSplitter');
				}

				function observeSearchBarHeight() {
					const searchBarElement = document.getElementsByClassName('material-filter-search-bar')[0];
					if (searchBarElement) {
						startObserveSearchBarHeight(searchBarElement);
					} else {
						$timeout(function () {
							observeSearchBarHeight();
						}, 500);
					}
				}

				function startObserveSearchBarHeight(searchBarElement) {
					const searchResultElement = document.getElementsByClassName('material-filter-search-result')[0];
					let oldHeight = 0;
					updateHeightAndResize();
					searchBarResizeObserver = new ResizeObserver(updateHeightAndResize);
					searchBarResizeObserver.observe(searchBarElement);

					function updateHeightAndResize() {
						if (searchBarElement.offsetHeight !== oldHeight) {
							oldHeight = searchBarElement.offsetHeight;
							searchResultElement.style.height = `calc(100% - ${searchBarElement.offsetHeight}px)`;
							getSplitter()?.resize(true);
							platformGridAPI.grids.resize(materialLookupDialogGridId);
						}
					}
				}

				function getDefaultDisplayFields() {
					return ['Code', 'CatalogCode', 'CatalogDescriptionInfo', 'GroupCode', 'GroupDescriptionInfo', 'PrcStructureFk', 'DescriptionInfo', 'DescriptionInfo2', 'SpecificationInfo', 'Cost', 'EstimatePrice', 'BasCurrencyFk', 'UomInfo', 'PriceUnit', 'PriceUnitUomInfo', 'BpdBusinesspartnerFk', 'LeadTime', 'MinQuantity', 'ListPrice'];
				}

				function getSearchHighlightFields() {
					return ['Code', 'DescriptionInfo', 'DescriptionInfo2', 'SpecificationInfo'];
				}

				function updateColumnHiddenStatus(columns) {
					const defaultDisplayFields = getDefaultDisplayFields();
					columns.forEach(function (c) {
						if (_.includes(['selected', 'indicator'], c.field)) {
							return;
						}

						if (c.field === 'MaterialPriceListFk') {
							c.hidden = false;
							return;
						}
						c.hidden = !_.includes(defaultDisplayFields, c.field);
					});
					return columns;
				}

				function addHighLightFormatter(columns) {
					const highlightFields = getSearchHighlightFields();
					highlightFields.forEach(function (field) {
						const column = columns.find(function (c) {
							return c.field === field;
						});
						if (!column) {
							return;
						}

						column.formatter = function (row, cell, value) {
							const userInput = currentFilterOption.userInput;
							const originalValue = $sanitize(_.isObject(value) ? (value.Translated ?? '') : value);
							let formatedValue = originalValue;

							if (userInput) {
								const regExp = new RegExp(userInput, 'i');
								const matchResult = regExp.exec(originalValue);
								if (matchResult && matchResult.length > 0) {
									const matchStr = matchResult[0];
									formatedValue = originalValue.replace(matchStr, '<span class="highlight">' + matchStr + '</span>');
								}
							}

							return formatedValue;
						}
					})
				}

				function addValidator(columns) {
					const selectedColumn = _.find(columns, {id: 'selected'});
					const costColumn = _.find(columns, {id: 'cost'});
					const estimatePriceColumn = _.find(columns, {id: 'estimatePrice'});

					selectedColumn.validator = selectedValidator;
					costColumn.validator = costNEstimatePriceValidator;
					estimatePriceColumn.validator = costNEstimatePriceValidator;

					function selectedValidator(entity, value, model) {
						entity[model] = value;
						searchViewOptions.onSelectedChanged_redesign(entity);
						if (!$scope.searchViewOptions.multipleSelection && value) {
							platformGridAPI.grids.refresh(materialLookupDialogGridId, true);
						}
					}

					function costNEstimatePriceValidator(entity) {
						$scope.searchService.onItemUpdated.fire(entity);
					}

					return columns;
				}

				function getColumns() {
					const columns = addValidator(basicsMaterialFilterSearchGridColumn);
					const selectedColumn = _.find(columns, {id: 'selected'});
					selectedColumn.headerChkbox = $scope.searchViewOptions.multipleSelection;

					updateColumnHiddenStatus(columns);
					addHighLightFormatter(columns);

					return columns;
				}

				function initSortOption() {
					const materialDefOfSortOption = searchOptionService.getMaterialSearchOption('sortOption');
					const sortByOptions = getSortByOptions();
					if (_.isNumber(materialDefOfSortOption)) {
						$scope.searchOptions.SortOption = materialDefOfSortOption;
					}
					$scope.SortOptionDescription = sortByOptions.find(function (option) {
						return option.value === $scope.searchOptions.SortOption;
					}).description;
				}

				function getSortByOptions() {
					return [
						{value: searchSortOptions.SupplierAscending, description: $translate.instant('basics.material.lookup.SupplierAscending')},
						{value: searchSortOptions.SupplierDescending, description: $translate.instant('basics.material.lookup.SupplierDescending')},
						{value: searchSortOptions.CodeAscending, description: $translate.instant('basics.material.lookup.CodeAscending')},
						{value: searchSortOptions.CodeDescending, description: $translate.instant('basics.material.lookup.CodeDescending')},
						{value: searchSortOptions.PriceAscending, description: $translate.instant('basics.material.lookup.PriceAscending')},
						{value: searchSortOptions.PriceDescending, description: $translate.instant('basics.material.lookup.PriceDescending')}
					];
				}

				function onSortOptionChange(value) {
					$scope.searchOptions.SortOption = value;
					$scope.SortOptionDescription = getSortByOptions().find(function (option) {
						return option.value === value;
					}).description;
					const materialDefOfSortOption = searchOptionService.getMaterialSearchOption('sortOption');
					if (materialDefOfSortOption !== $scope.searchOptions.SortOption) {
						searchOptionService.postMaterialSearchOption({sortOption: $scope.searchOptions.SortOption});
					}
					searchViewOptions.executeSortBy();
				}

				function showSortByOptionsPopup(e) {
					sortByOptionsPopupHelper.toggle({
						focusedElement: angular.element(e.currentTarget),
						scope: $scope.$new(true),
						template: '<div class="generic-popup"><ul class="popup-list"><li data-ng-repeat="option in sortOptions" data-ng-bind="option.description" data-ng-click="select(option.value)"></li></ul></div>',
						controller: ['$scope', 'options', function ($scope, options) {
							$scope.sortOptions = options.sortOptions;
							$scope.select = function (value) {
								options.select(value);
								$scope.$close();
							}
						}],
						plainMode: true,
						hasDefaultWidth: false,
						resolve: {
							options: function () {
								return {
									sortOptions: getSortByOptions(),
									select: onSortOptionChange
								};
							}
						}
					});
				}

				function clone() {
					if (canClone()) {
						$scope.searchViewOptions.onClone($scope.selectedItemDetail.selectedItem).then(function (newMaterial) {
							if (newMaterial) {
								platformGridAPI.rows.scrollIntoViewByItem(materialLookupDialogGridId, newMaterial, false);
								platformGridAPI.rows.selection({gridId: materialLookupDialogGridId, rows: [newMaterial]});
							}
						});
					}
				}

				function hasClonePermission() {
					return hasReadPermissionOfSimilar &&
						hasCreatePermissionOfSimilar &&
						!$scope.searchViewOptions.customDisableSimilar
				}

				function canClone() {
					return hasClonePermission() &&
						$scope.selectedItemDetail.selectedItem;
				}

				const unregisterWatch = $scope.$watch('dialog.isMaximized', function () {
					onDialogMaximizeOrMinimize();
				})

				this.$onDestroy = function onDestroy() {
					unregisterWatch();
					getSplitter()?.unbind('resize', onSplitterResize);

					$scope.searchService.onListLoaded.unregister(onMaterialListLoaded);
					cloudDesktopHotKeyService.unregister('createCopy', clone);

					if (platformGridAPI.grids.exist(materialLookupDialogGridId)) {
						platformGridAPI.grids.unregister(materialLookupDialogGridId);
					}

					if (searchBarResizeObserver) {
						searchBarResizeObserver.disconnect();
					}
				};
			}
		],
		controllerAs: 'basicsMaterialFilterSearchResult'
	});

	angular.module(moduleName).factory('basicsMaterialFilterSearchGridColumn', [
		'$injector',
		'basicsMaterialLookUpItems',
		'platformGridDomainService',
		'basicsMaterialRecordUIConfigurationService',
		function (
			$injector,
			lookUpItems,
			platformGridDomainService,
			basicsMaterialRecordUIConfigurationService
		) {
			const fields = ['Code', 'CatalogCode', 'CatalogDescriptionInfo', 'GroupCode', 'GroupDescriptionInfo', 'PrcStructureFk', 'DescriptionInfo', 'DescriptionInfo2', 'SpecificationInfo', 'Cost', 'EstimatePrice', 'BasCurrencyFk', 'UomInfo', 'PriceUnit', 'PriceUnitUomInfo', 'BpdBusinesspartnerFk', 'LeadTime', 'MinQuantity', 'ListPrice', 'Matchcode', 'MdcMaterialabcFk', 'RetailPrice', 'Discount', 'Charges', 'PrcPriceconditionFk', 'PriceExtra', 'Supplier', 'DayworkRate', 'FactorPriceUnit', 'FactorHour', 'SellUnit', 'WeightType', 'WeightNumber', 'Weight', 'ExternalCode', 'EstCostTypeFk', 'LeadTimeExtra', 'MaterialTempTypeFk', 'BasUomWeightFk', 'Co2Source', 'Co2Project', 'BasCo2SourceFk', 'MdcTaxCodeFk', 'MdcMaterialFk', 'MdcMaterialDiscountGroupFk', 'MaterialStockFk', 'MaterialStatusFk', 'DangerClassFk', 'PackageTypeFk', 'UomVolumeFk', 'AgreementFk', 'UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5', 'UserDefinedDate1', 'UserDefinedDate2', 'UserDefinedDate3', 'UserDefinedDate4', 'UserDefinedDate5', 'UserDefinedText1', 'UserDefinedText2', 'UserDefinedText3', 'UserDefinedText4', 'UserDefinedText5', 'UserDefinedNumber1', 'UserDefinedNumber2', 'UserDefinedNumber3', 'UserDefinedNumber4', 'UserDefinedNumber5'];
			const specialColumns = [
				{
					id: 'catalogCode',
					field: 'CatalogCode',
					readonly: true,
					width: 100,
					name$tr$: 'basics.material.record.materialCatalog'
				},
				{
					id: 'catalogDescriptionInfo',
					field: 'CatalogDescriptionInfo',
					readonly: true,
					width: 150,
					formatter: 'translation',
					name$tr$: 'basics.material.record.materialCatalogDescription'
				},
				{
					id: 'groupCode',
					field: 'GroupCode',
					readonly: true,
					width: 100,
					name$tr$: 'basics.material.record.materialGroup'
				},
				{
					id: 'groupDescriptionInfo',
					field: 'GroupDescriptionInfo',
					readonly: true,
					width: 150,
					formatter: 'translation',
					name$tr$: 'basics.material.record.materialGroupDescription'
				},
				{
					id: 'descriptionInfo',
					field: 'DescriptionInfo',
					readonly: true,
					width: 150,
					formatter: 'translation',
					name$tr$: 'cloud.common.entityDescription'
				},
				{
					id: 'descriptionInfo2',
					field: 'DescriptionInfo2',
					readonly: true,
					width: 150,
					formatter: 'translation',
					name$tr$: 'basics.material.record.furtherDescription'
				},
				{
					id: 'currency',
					field: 'Currency',
					readonly: true,
					width: 100,
					name$tr$: 'cloud.common.entityCurrency'
				},
				{
					id: 'uomInfo',
					field: 'UomInfo',
					readonly: true,
					width: 150,
					formatter: 'translation',
					name$tr$: 'cloud.common.entityUoM'
				},
				{
					id: 'priceUnitUomInfo',
					field: 'PriceUnitUomInfo',
					readonly: true,
					width: 150,
					formatter: 'translation',
					name$tr$: 'cloud.common.entityPriceUnitUoM'
				},
				{
					id: 'prcStructureFk',
					field: 'PrcStructureFk',
					readonly: true,
					width: 80,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Prcstructure',
						displayMember: 'Code'
					},
					name$tr$: 'cloud.common.entityStructureCode'
				},
				{
					id: 'structureDescription',
					field: 'PrcStructureFk',
					readonly: true,
					width: 100,
					grouping: {
						aggregateCollapsed: true,
						aggregators: [],
						getter: 'PrcStructureFk'
					},
					additionalColumn: {
						id: 'structureDescription',
						field: 'DescriptionInfo',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription',
						width: 100
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'Prcstructure'
					},
					name$tr$: 'cloud.common.entityStructureDescription'
				},
				{
					id: 'cost',
					field: 'MaterialPriceListFk',
					readonly: true,
					width: 80,
					formatter: costNEstimatePriceFormatter('Cost'),
					editor: 'lookup',
					editorOptions: {
						lookupDirective: 'basics-material-price-list-cost-lookup'
					},
					name$tr$: 'basics.material.record.costPrice'
				},
				{
					id: 'estimatePrice',
					field: 'MaterialPriceListFk',
					readonly: true,
					width: 80,
					formatter: costNEstimatePriceFormatter('EstimatePrice'),
					editor: 'lookup',
					editorOptions: {
						lookupDirective: 'basics-material-price-list-estimate-price-lookup'
					},
					name$tr$: 'basics.material.record.estimatePrice'
				},
				{
					id: 'bpdBusinesspartnerFk',
					field: 'BpdBusinesspartnerFk',
					name: 'Business Partner',
					readonly: true,
					width: 100,
					name$tr$: 'basics.common.BusinessPartner',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'BusinessPartner',
						displayMember: 'BusinessPartnerName1'
					}
				},
				{
					id: 'matchcode',
					field: 'Matchcode',
					readonly: true,
					width: 100,
					name$tr$: 'basics.material.record.matchCode'
				},
				{
					id: 'weightType',
					field: 'WeightType',
					readonly: true,
					width: 100,
					formatter: 'select',
					formatterOptions: {
						displayMember: 'Description',
						valueMember: 'Id',
						items: lookUpItems.weightType
					},
					name$tr$: 'basics.material.record.weightType'
				},
				{
					id: 'mdcMaterialDiscountGroupFk',
					field: 'MdcMaterialDiscountGroupFk',
					readonly: true,
					width: 80,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'materialdiscountgroup',
						displayMember: 'Code',
						formatter: 'code'
					},
					name$tr$: 'basics.material.record.discountGroup'
				},
				{
					id: 'neutralMaterialFk',
					field: 'MdcMaterialFk',
					readonly: true,
					width: 80,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'materialRecord',
						displayMember: 'Code',
						formatter: 'code'
					},
					name$tr$: 'basics.material.record.neutralMaterial'
				},
				{
					id: 'neutralMaterialFkDescription',
					field: 'MdcMaterialFk',
					readonly: true,
					width: 100,
					formatter: 'lookup',
					formatterOptions: {lookupType: 'materialRecord'},
					additionalColumn: {
						id: 'neutralMaterialFkDescription',
						field: 'DescriptionInfo',
						formatter: 'translation'
					},
					name$tr$: 'basics.material.record.neutralMaterialDescription'
				},
				{
					id: 'materialStockFk',
					field: 'MaterialStockFk',
					readonly: true,
					width: 80,
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'materialRecord',
						displayMember: 'Code',
						formatter: 'code'
					},
					name$tr$: 'basics.material.record.stockMaterial'
				},
				{
					id: 'materialStockFkDescription',
					field: 'MaterialStockFk',
					readonly: true,
					width: 100,
					formatter: 'lookup',
					formatterOptions: {lookupType: 'materialRecord'},
					additionalColumn: {
						id: 'materialStockFkDescription',
						field: 'DescriptionInfo',
						formatter: 'translation'
					},
					name$tr$: 'basics.material.record.stockMaterialDescription'
				},
				{
					id: 'materialStockFkCatalogCode',
					field: 'MaterialStockFk',
					readonly: true,
					width: 100,
					formatter: 'lookup',
					formatterOptions: {lookupType: 'materialRecord'},
					additionalColumn: {
						id: 'materialStockFkCatalogCode',
						field: 'MaterialCatalogCode',
						formatter: 'code'
					},
					name$tr$: 'basics.material.record.stockMaterialCatalog'
				},
				{
					id: 'materialStockFkCatalogDescription',
					field: 'MaterialStockFk',
					readonly: true,
					width: 100,
					formatter: 'lookup',
					formatterOptions: {lookupType: 'materialRecord'},
					additionalColumn: {
						id: 'materialStockFkCatalogDescription',
						field: 'MaterialCatalogFk',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'MaterialCatalog',
							displayMember: 'DescriptionInfo.Translated'
						},
					},
					name$tr$: 'basics.material.record.stockMaterialCatalogDescription'
				},
				{
					id: 'userDefined1',
					field: 'UserDefined1',
					name$tr$: 'cloud.common.entityUserDefined',
					name$tr$param$: {'p_0': '1'},
					width: 100
				},
				{
					id: 'userDefined2',
					field: 'UserDefined2',
					name$tr$: 'cloud.common.entityUserDefined',
					name$tr$param$: {'p_0': '2'},
					width: 100
				},
				{
					id: 'userDefined3',
					field: 'UserDefined3',
					name$tr$: 'cloud.common.entityUserDefined',
					name$tr$param$: {'p_0': '3'},
					width: 100
				},
				{
					id: 'userDefined4',
					field: 'UserDefined4',
					name$tr$: 'cloud.common.entityUserDefined',
					name$tr$param$: {'p_0': '4'},
					width: 100
				},
				{
					id: 'userDefined5',
					field: 'UserDefined5',
					name$tr$: 'cloud.common.entityUserDefined',
					name$tr$param$: {'p_0': '5'},
					width: 100
				}
			];
			const materialRecordGridColumns = basicsMaterialRecordUIConfigurationService.getStandardConfigForListView().columns;

			return completeColumns();

			function costNEstimatePriceFormatter(model) {
				return function (row, cell, value, columnDef, entity) {
					return platformGridDomainService.formatter('money')(row, cell, entity[model], columnDef);
				}
			}

			function completeColumns() {
				const columns = [];

				fields.forEach(function (f) {
					const relatedColumns = _.filter(specialColumns, function (c) {
						return (c.field === f || c.id.toLowerCase() === f.toLowerCase());
					})

					if (relatedColumns?.length) {
						relatedColumns.forEach(c => {
							c.sortable = true;
							columns.push(c);
						});
						return;
					}

					const columnInMaterialRecordGrid = _.find(materialRecordGridColumns, {field: f});
					if (columnInMaterialRecordGrid) {
						const column = _.cloneDeep(columnInMaterialRecordGrid);
						column.readonly = true;
						column.editor = null;
						column.editorOptions = null;
						columns.push(column);
					}
				});

				addSelectColumn(columns);
				return columns;
			}

			function addSelectColumn(columns) {
				columns.unshift({
					id: 'selected',
					field: 'selected',
					formatter: 'boolean',
					editor: 'boolean',
					readonly: true,
					width: 75,
					pinned: true,
					headerChkbox: true,
					focusable: true,
					sortable: true,
					searchable: true,
					resizeable: true,
					name$tr$: 'basics.material.lookup.gridCheckBox'
				});
			}
		}]);
})(angular);