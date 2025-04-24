(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	angular.module(moduleName).controller('procurementPriceComparisonSettingsController', [
		'_',
		'$scope',
		'$translate',
		'$timeout',
		'platformGridAPI',
		'platformTranslateService',
		'procurementPriceComparisonSettingUiService',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonCreateIdealQuoteDialogService',
		'procurementPriceComparisonSettingConfiguration',
		'procurementPriceComparisonCommonHelperService',
		function (
			_,
			$scope,
			$translate,
			$timeout,
			platformGridAPI,
			platformTranslateService,
			settingUiService,
			commonService,
			createIdealQuoteDialogService,
			settingConfiguration,
			commonHelperService
		) {

			var configure = settingConfiguration.getCurrentConfig();
			var columnService = configure.quoteCompareColumn.dataService;
			var rowService = configure.compareField.dataService;
			var quoteRowService = configure.quoteCompareField.dataService;
			var billingSchemaService = configure.billingSchemaField.dataService;
			var formConfig = settingUiService.getStandardConfigForDetailView();
			platformTranslateService.translateFormConfig(formConfig);

			$scope.modalOptions = {
				headerText: $translate.instant('procurement.pricecomparison.compareConfigDialog'),
			};

			function onColumnListLoaded() {
				$scope.actionStates.bidder.loaded = true;
			}

			$scope.containerOptions = {
				formOptions: {
					configure: formConfig
				}
			};

			$scope.actionStates = {
				bidder: {
					loaded: false
				}
			};

			$scope.disabledOKButton = function disabledOKButton() {
				return $scope.actionStates.bidder.loaded === false;
			};

			$scope.modalOptions.onOK = function () {
				// when the popup grid is being closed, keep the grid in API
				// add the commit edit for not losing focus but still save on clicking OK button
				platformGridAPI.grids.commitEdit(columnService.gridId);
				platformGridAPI.grids.commitEdit(rowService.gridId);
				platformGridAPI.grids.commitEdit(quoteRowService.gridId);
				platformGridAPI.grids.commitEdit(billingSchemaService.gridId);

				var columnList = columnService.getList();
				var hasNewColumn = _.some(columnList, function (column) {
					return !column.IsIdealBidder && column.RfqHeaderId > 0 && column.Version === 0;
				});
				if (configure.isBoq) {
					commonService.onCompareCollectSetting.fire();
				}
				if (hasNewColumn) {
					var baseInfo = commonService.getBaseRfqInfo();
					var rfqHeaderId = baseInfo.baseRfqId;
					createIdealQuoteDialogService.createIdealQuote(rfqHeaderId, 0, 1)
						.finally(function () {
							$scope.$close({
								isOK: true,
								data: commonService.getUserSettings(rowService, columnService, quoteRowService, billingSchemaService)
							});
						});
				} else {
					$scope.$close({
						isOK: true,
						data: commonService.getUserSettings(rowService, columnService, quoteRowService, billingSchemaService)
					});
				}
			};

			$scope.modalOptions.cancel = function () {
				$scope.$close({isOK: false});
			};

			columnService.registerListLoaded(onColumnListLoaded);
			commonService.registerLoadFinish.register(onSectionLoaded);
			let summaryCount = 0;
			let gids = settingConfiguration.getGids();
			let loadSections = [gids.billingSchemaField, gids.quoteCompareColumn, gids.quoteCompareField, gids.compareField, gids.gridLayout].concat(configure.isBoq ? [gids.summaryCompareField] : []);
			let sectionLoadState = _.reduce(loadSections, function (result, n) {
				result[n] = false;
				return result;
			}, {});

			function onAllSectionLoaded() {
				let closeGroups = _.filter(_.values(gids), function (gid) {
					return gid !== gids.quoteCompareColumn && gid !== gids.compareField;
				});
				_.each(formConfig.groups, function (group) {
					if (_.includes(closeGroups, group.gid)) {
						group.isOpen = false;
					}
				});
			}

			function checkSectionLoadState() {
				let isAllLoaded = _.every(_.values(sectionLoadState), Boolean);
				if (isAllLoaded) {
					onAllSectionLoaded();
				}
			}

			function onSectionLoaded(info) {
				let currGib = _.find(formConfig.groups, {gid: info.value});
				if (currGib) {
					if (currGib.gid === gids.summaryCompareField) {
						summaryCount++;
						if (summaryCount === 3) {
							commonHelperService.itemTypeReadonlyOnload();
							sectionLoadState[info.value] = true;
						}
					} else {
						sectionLoadState[info.value] = true;
					}

					switch (info.value) {
						case gids.billingSchemaField:
							platformGridAPI.grids.resize(configure.billingSchemaField.gridId);
							break;
						case gids.quoteCompareColumn:
							platformGridAPI.grids.resize(configure.quoteCompareColumn.gridId);
							break;
						case gids.quoteCompareField:
							platformGridAPI.grids.resize(configure.quoteCompareField.gridId);
							break;
						case gids.compareField:
							platformGridAPI.grids.resize(configure.compareField.gridId);
							break;
						default:
							break;
					}

					checkSectionLoadState();
				}
			}

			$scope.$on('$destroy', function destroy() {
				columnService.unregisterListLoaded(onColumnListLoaded);
				commonService.registerLoadFinish.unregister(onSectionLoaded);
			});
		}
	]);

	angular.module(moduleName).controller('procurementPriceComparisonColumnController', [
		'_',
		'$scope',
		'$timeout',
		'$translate',
		'globals',
		'platformGridAPI',
		'basicsCommonDialogGridControllerService',
		'procurementPriceComparisonCommonService',
		'platformModalService',
		'procurementPriceComparisonCreateIdealQuoteDialogService',
		'basicsLookupdataLookupDescriptorService',
		'cloudCommonGridService',
		'procurementPriceComparisonCommonHelperService',
		'procurementPriceComparisonHeaderCheckHelperService',
		'procurementPriceComparisonPrintConstants',
		'procurementPriceComparisonCheckBidderService',
		'procurementPriceComparisonSettingConfiguration',
		function (
			_,
			$scope,
			$timeout,
			$translate,
			globals,
			platformGridAPI,
			basicsCommonDialogGridControllerService,
			commonService,
			platformModalService,
			createIdealQuoteDialogService,
			basicsLookupdataLookupDescriptorService,
			cloudCommonGridService,
			commonHelperService,
			headerCheckHelperService,
			printConstants,
			checkBidderService,
			settingConfiguration
		) {

			var currentConfig = settingConfiguration.getCurrentConfig();
			var configure = currentConfig.quoteCompareColumn;
			var customSetting = angular.extend({}, configure.customSetting);
			var canCreateIdealQuoteSet = typeof (customSetting.canCreateIdealQuote) === 'boolean' ? customSetting.canCreateIdealQuote : true;
			var dataService = configure.dataService;
			var columnDef = {
				getStandardConfigForListView: function () {
					var columns = [
						{
							id: currentConfig.isPrint ? 'Print' : 'Visible',
							field: 'Visible',
							name: currentConfig.isPrint ? 'Print' : 'Visible',
							name$tr$: currentConfig.isPrint ? 'procurement.pricecomparison.printing.print' : 'procurement.pricecomparison.compareConfigColumnsVisible',
							formatter: 'boolean',
							editor: 'boolean',
							headerChkbox: true
						},
						{
							id: 'ColumnDescription',
							field: 'DescriptionInfo',
							name: 'Column Description',
							name$tr$: 'procurement.pricecomparison.compareConfigColumnDescriptionEditable',
							formatter: 'translation',
							editor: 'translation'
						},
						{
							id: 'IsCountInTarget',
							field: 'IsCountInTarget',
							name: 'Count in T',
							name$tr$: 'procurement.pricecomparison.isCountInTarget',
							formatter: 'boolean',
							editor: 'boolean',
							headerChkbox: true,
							width: 100
						},
						{
							id: 'BackgroundColor',
							field: 'BackgroundColor',
							name: 'Background Color',
							name$tr$: 'procurement.pricecomparison.compareConfigColumnBackgroudColor',
							formatter: 'color',
							editor: 'color',
							editorOptions: {
								showClearButton: true
							}
						},
						{
							id: 'businessPartnerFk',
							field: 'QtnHeaderFk',
							name: 'Business Partner',
							name$tr$: 'cloud.common.entityBusinessPartner',
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: false,
									displayMember: 'BusinessPartnerName1',
									service: dataService
								},
								directive: 'procurement-price-comparison-item-bp-quote-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Quote',
								displayMember: 'BusinessPartnerName1'
							},
							searchable: true
						},
						{
							id: 'qtnVersion',
							field: 'QtnHeaderFk',
							name: 'Version',
							name$tr$: 'cloud.common.entityVersion',
							editor: 'lookup',
							editorOptions: {
								lookupOptions: {
									showClearButton: false,
									displayMember: 'QuoteVersion',
									service: dataService
								},
								directive: 'procurement-price-comparison-item-bp-quote-lookup'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Quote',
								displayMember: 'QuoteVersion'
							},
							searchable: true
						},
						{
							id: 'statusFk',
							field: 'QtnHeaderFk',
							name: 'Status',
							name$tr$: 'cloud.common.entityState',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Quote',
								displayMember: 'StatusDescriptionInfo.Description',
								imageSelector: 'platformStatusIconService'
							}
						},
						{
							id: 'qtnCode',
							field: 'QtnHeaderFk',
							name: 'Reference Code',
							name$tr$: 'cloud.common.entityReferenceCode',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Quote',
								displayMember: 'Code'
							},
							searchable: true
						},
						{
							id: 'qtnDescription',
							field: 'QtnHeaderFk',
							name: 'Description',
							name$tr$: 'cloud.common.entityDescription',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Quote',
								displayMember: 'Description'
							},
							searchable: true
						},
						{
							id: 'rfqHeaderCode',
							field: 'RfqHeaderId',
							name: 'Rfq Header Code',
							name$tr$: 'procurement.quote.headerRfqHeaderCode',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'RfqHeader',
								displayMember: 'Code'
							},
							searchable: true
						},
						{
							id: 'rfqHeaderDescription',
							field: 'RfqHeaderId',
							name: 'Rfq Header Description',
							name$tr$: 'procurement.quote.headerRfqHeaderDescription',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'RfqHeader',
								displayMember: 'Description'
							},
							searchable: true
						},
						{
							id: 'currencyDescription',
							field: 'QtnHeaderFk',
							name: 'Currency',
							name$tr$: 'cloud.common.entityCurrency',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Quote',
								displayMember: 'Currency'
							},
							searchable: true
						},
						{
							id: 'exchangeRate',
							field: 'QtnHeaderFk',
							name: 'Rate',
							name$tr$: 'cloud.common.entityRate',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Quote',
								displayMember: 'ExchangeRate'
							},
							searchable: true
						},
						{
							id: 'subsidiaryFk',
							field: 'QtnHeaderFk',
							name: 'Subsidiary',
							name$tr$: 'cloud.common.entitySubsidiary',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Quote',
								displayMember: 'SubsidiaryDescription'
							},
							searchable: true
						},
						{
							id: 'supplierCode',
							field: 'QtnHeaderFk',
							name: 'Supplier Code',
							name$tr$: 'cloud.common.entitySupplierCode',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Quote',
								displayMember: 'SupplierCode'
							},
							searchable: true
						},
						{
							id: 'supplierDescription',
							field: 'QtnHeaderFk',
							name: 'Supplier Description',
							name$tr$: 'cloud.common.entitySupplierDescription',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Quote',
								displayMember: 'SupplierDescription'
							},
							searchable: true
						},
						{
							id: 'remark',
							field: 'QtnHeaderFk',
							name: 'Remarks',
							name$tr$: 'cloud.common.entityRemark',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Quote',
								displayMember: 'Remark'
							},
							searchable: true
						},
						{
							id: 'userDefined1',
							field: 'QtnHeaderFk',
							name: 'User Defined 1',
							name$tr$: 'cloud.common.entityUserDefined',
							name$tr$param$: {'p_0': '1'},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Quote',
								displayMember: 'UserDefined1'
							},
							searchable: true
						},
						{
							id: 'userDefined2',
							field: 'QtnHeaderFk',
							name: 'User Defined 2',
							name$tr$: 'cloud.common.entityUserDefined',
							name$tr$param$: {'p_0': '2'},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Quote',
								displayMember: 'UserDefined2'
							},
							searchable: true
						},
						{
							id: 'userDefined3',
							field: 'QtnHeaderFk',
							name: 'User Defined 3',
							name$tr$: 'cloud.common.entityUserDefined',
							name$tr$param$: {'p_0': '3'},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Quote',
								displayMember: 'UserDefined3'
							},
							searchable: true
						},
						{
							id: 'userDefined4',
							field: 'QtnHeaderFk',
							name: 'User Defined 4',
							name$tr$: 'cloud.common.entityUserDefined',
							name$tr$param$: {'p_0': '4'},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Quote',
								displayMember: 'UserDefined4'
							},
							searchable: true
						},
						{
							id: 'userDefined5',
							field: 'QtnHeaderFk',
							name: 'User Defined 5',
							name$tr$: 'cloud.common.entityUserDefined',
							name$tr$param$: {'p_0': '5'},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Quote',
								displayMember: 'UserDefined5'
							},
							searchable: true
						},
						{
							id: 'isHighlightChanges',
							field: 'IsHighlightChanges',
							name: 'Is HigLight Changes',
							name$tr$: 'procurement.pricecomparison.highlightChangesQTN',
							formatter: 'boolean',
							editor: 'boolean',
							width: 100,
							headerChkbox: true
						},
						{
							id: 'isDeviationRef',
							field: 'IsDeviationRef',
							name: 'Is Deviation Reference',
							name$tr$: 'procurement.pricecomparison.isDeviationRef',
							formatter: 'boolean',
							editor: 'boolean',
							width: 100
						},
						{
							id: 'applyReqChangesToQuote',
							field: 'ApplyReqChangesToQuote',
							name: 'Apply Req. Changes to Quote',
							name$tr$: 'procurement.pricecomparison.applyReqChangesToQuote',
							formatter: 'boolean',
							editor: 'boolean',
							headerChkbox: true,
							width: 100
						}
					];
					if (currentConfig.isPrint) {
						var printColumns = [
							{
								id: 'width',
								field: 'Width',
								name: 'Width',
								name$tr$: 'cloud.desktop.gridWidthHeader',
								editor: 'percent',
								formatter: 'percent'
							},
							{
								id: 'groupSequence',
								field: 'GroupSequence',
								name: 'Group Sequence',
								name$tr$: 'procurement.pricecomparison.printing.groupSequence',
								formatter: 'integer'
							}
						];
						columns = columns.concat(printColumns);
					}

					return {
						addValidationAutomatically: true,
						columns: columns
					};
				}
			};
			var compareService = currentConfig.parentService;

			var gridConfig = {
				initCalled: false,
				columns: [],
				grouping: false,
				uuid: configure.gridId,
				parentProp: customSetting.parentProp || '',
				childProp: 'Children',
				cellChangeCallBack: onCellChangeCallBack
			};
			$scope.disabledOrder = compareService.getGrandTotalRankSortingCheckedState(currentConfig.isPrint ? 'print' : 'ui');
			var toolbarItems = [
				{
					id: 't90',
					sort: 30,
					caption: 'cloud.common.taskBarNewRecord',
					iconClass: commonService.icons.toolBars.add,
					type: 'item',
					fn: function () {
						dataService.columnParentType = true; // 'create base rfq'
						dataService.createItem(true);
					}
				},
				{
					id: 'createChild',
					sort: 21,
					caption: 'cloud.common.toolbarInsertSub',
					type: 'item',
					iconClass: 'tlb-icons ico-sub-fld-new',
					fn: function () {
						dataService.columnParentType = false; // 'create changed rfq'
						dataService.createItem(false);
					}
				},
				{
					id: 't91',
					sort: 31,
					caption: 'cloud.common.taskBarDeleteRecord',
					iconClass: commonService.icons.toolBars.delete,
					type: 'item',
					fn: function () {
						dataService.deleteItem(dataService.getSelected());
					}
				},
				{
					id: 't105',
					sort: 40,
					caption: $translate.instant('procurement.pricecomparison.moveUp'),
					iconClass: commonService.icons.toolBars.moveUp,
					type: 'item',
					disabled: function () {
						return $scope.disabledOrder;
					},
					fn: function () {
						var hasChanged = dataService.moveUp();
						if (!!currentConfig.isPrint && dataService.hasSelection() && hasChanged) {
							dataService.updateBidderMessage(dataService.MaxBidderNum, dataService.BidderWidth, dataService.getList(), null);
							dataService.clickChange();
						}
					}
				},
				{
					id: 't106',
					sort: 50,
					caption: $translate.instant('procurement.pricecomparison.moveDown'),
					iconClass: commonService.icons.toolBars.moveDown,
					type: 'item',
					disabled: function () {
						return $scope.disabledOrder;
					},
					fn: function () {
						var hasChanged = dataService.moveDown();
						if (!!currentConfig.isPrint && dataService.hasSelection() && hasChanged) {
							dataService.updateBidderMessage(dataService.MaxBidderNum, dataService.BidderWidth, dataService.getList(), null);
							dataService.clickChange();
						}
					}
				}
			];
			if (canCreateIdealQuoteSet) {
				toolbarItems.unshift({
					id: 'createIdealQuote',
					sort: 10,
					caption: 'procurement.pricecomparison.createIdealQuoteDialog.title2',
					iconClass: commonService.icons.toolBars.addIdealQuote,
					type: 'item',
					fn: createIdealQuote
				});
			}

			$scope.setTools = function (tools) {
				$scope.tools = commonService.getTools(tools, toolbarItems);
				$scope.tools.update = function () {
					$scope.tools.version += 1;
				};
			};

			$scope.removeToolByClass = function removeToolByClass(cssClassArray) {
				$scope.tools.items = _.filter($scope.tools.items, function (toolItem) {
					var notFound = true;
					_.each(cssClassArray, function (CssClass) {
						if (CssClass === toolItem.iconClass) {
							notFound = false;
						}
					});
					return notFound;
				});
				$scope.tools.update();
			};

			basicsCommonDialogGridControllerService.initListController($scope, columnDef, dataService, configure.dataValidationService(dataService), gridConfig);
			headerCheckHelperService.configForBidder($scope, {
				visibleSkipFn: customSetting.visibleSkipFn || function (item) {
					return checkBidderService.item.isReference(item.Id);  // boq also suitable
				},
				completeFn: function (items, field) {
					var flatList = cloudCommonGridService.flatten(items, [], 'Children');
					var targetItems = _.filter(flatList, function (item) {
						return !commonHelperService.isDataPropReadonly(item, field);
					});
					processCheckboxCellChanged(targetItems, field, true);

					// for print
					if (currentConfig.isPrint && field !== 'IsCountInTarget') {
						commonHelperService.addBidderMessage(dataService.MaxBidderNum, dataService.BidderWidth, dataService.getList());
						dataService.visibleBidderNumChange();
					}
				}
			});

			compareService.onGrandTotalRankSortingChanged.register(onGrandTotalRankSortingChanged);
			$timeout(function () {
				// when controller initialized, refresh to show grid (height) correctly, then load data.
				dataService.load().then(function () {
					commonService.registerLoadFinish.fire({
						value: settingConfiguration.getGids().quoteCompareColumn
					});
				});
				dataService.deletedColumns = []; // clear
			});

			function onCellChangeCallBack(arg) {
				var columns = arg.grid.getColumns(), field = columns[arg.cell].field, item = arg.item;

				processCheckboxCellChanged([item], field, true, item);

				// for print
				if (currentConfig.isPrint) {
					if (field === 'Width' && arg.item.Visible === true) {
						dataService.checkMaxBidderWidth(arg.item, dataService.getList());
					}
					if (field === 'Visible') {
						dataService.updateBidderMessage(dataService.MaxBidderNum, dataService.BidderWidth, dataService.getList(), item);
						dataService.visibleBidderNumChange();
					}
				}
			}

			function processCheckboxCellChanged(items, field, isRefreshGrid, selectedItem) {
				var hasChanged = false;
				var list = dataService.getList();
				_.each(items, function (item) {
					if (field === 'Visible') {
						if (currentConfig.isPrint) {
							dataService.updateBidderMessage(dataService.MaxBidderNum, dataService.BidderWidth, dataService.getList(), item);
						}
						commonService.highlightColumnVisible(item);
						commonService.onCellChangeCallBack(item);
						hasChanged = true;
					}
					if (field === 'IsDeviationRef') {
						commonService.highlightColumnDevRef(item, list);
						hasChanged = true;
					}

					if (field === 'IsHighlightChanges') {
						commonService.highlightColumnChanged(item);
						hasChanged = true;
					}

					if (field === 'ApplyReqChangesToQuote') {
						hasChanged = true;
					}
				});
				if (hasChanged && isRefreshGrid) {
					platformGridAPI.grids.invalidate($scope.gridId);
				}
				if (field === 'Visible') {
					if (selectedItem && !selectedItem[field]) {
						selectedItem.IsCountInTarget = false;
					}
					var dataView = platformGridAPI.grids.element('id', $scope.gridId).dataView;
					var eventScope = currentConfig.isPrint ? 'Scope_Compare_Print_Setting' : 'Scope_Compare_Setting';
					commonHelperService.fireEvent(eventScope, 'onCompareBidderVisibleItemChanged', _.filter(dataView.getRows(), {Visible: true}));
				}
			}

			function createIdealQuote() {
				dataService.columnParentType = true; // 'create base rfq'
				var baseInfo = commonService.getBaseRfqInfo();
				var rfqHeaderId = baseInfo.baseRfqId;
				if (!angular.isFunction(dataService.getIdealQuote)) {
					return;
				}
				var idealQuote = dataService.getIdealQuote();
				var getIdealQuote = !idealQuote;
				let compareType = currentConfig.isItem ? 1 : 2;// item : boq
				createIdealQuoteDialogService.getQuotesByRfqHeaderId(rfqHeaderId, getIdealQuote, compareType).then(function (response) {
					var data = response.data;

					if (data.IdealQuote) {
						if (data.BusinessPartner) {
							var lookupData = {
								BusinessPartner: data.BusinessPartner,
								Quote: [data.IdealQuote]
							};
							basicsLookupdataLookupDescriptorService.attachData(lookupData);
						}
						if (angular.isFunction(dataService.createNewItem)) {
							data.IdealQuote.IsIdealBidder = true;
							dataService.createNewItem(data.IdealQuote);
						}
						return;
					}

					if (data.NonIdealQuotes && angular.isArray(data.NonIdealQuotes)) {
						if (data.NonIdealQuotes.length > 2) {
							basicsLookupdataLookupDescriptorService.removeData('SimpleQuote');
							basicsLookupdataLookupDescriptorService.attachData({SimpleQuote: data.NonIdealQuotes});
							var modalOptions = {
								headerText: $translate.instant('procurement.pricecomparison.createIdealQuoteDialog.title2'),
								templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/templates/create-ideal-quote-dialog.html',
								backdrop: false,
								windowClass: 'form-modal-dialog',
								nonIdealQuotes: data.NonIdealQuotes,
								rfqHeaderId: rfqHeaderId,
								getIdealQuote: getIdealQuote, // boolean, whether need to create a new compare column item
								createIdealQuote: createIdealQuoteDialogService.createIdealQuote,
								createNewCompareColumnItem: dataService.createNewItem,
								idealBidderDataType: currentConfig.isItem ? 1 : 2,// item : boq
								idealQuote: idealQuote
							};
							platformModalService.showDialog(modalOptions).then(function (data) {
								if (data && data.result === 'delete') {
									let parent = $scope.$parent;
									while (parent && !angular.isFunction(parent.$close)) {
										parent = parent.$parent;
									}
									parent.$close({isDelete: true});
								}
							});
						} else {
							// show dialog to inform the use that there is no quote is found.
							platformModalService.showMsgBox('procurement.pricecomparison.createIdealQuoteDialog.informDialogBody', '', 'info');
						}
					}
				});

			}

			function onGrandTotalRankSortingChanged(args) {
				if ($scope.disabledOrder !== args.checked) {
					$scope.disabledOrder = args.checked;
					$scope.tools.update();
					$scope.tools.refresh();
					$timeout(function () {
						$scope.$digest();
					}, 50);
				}
				compareService.setGrandTotalRankSortingCheckedState(args.origin === commonService.constant.compareSection.UI ? 'ui' : 'print', args.checked);
			}

			$scope.$on('$destroy', function () {
				compareService.onGrandTotalRankSortingChanged.unregister(onGrandTotalRankSortingChanged);
			});
		}
	]);

	angular.module(moduleName).controller('procurementPriceComparisonQuoteRowController', [
		'_',
		'$scope',
		'$timeout',
		'$translate',
		'platformGridAPI',
		'basicsCommonDialogGridControllerService',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonHeaderCheckHelperService',
		'procurementPriceComparisonCommonHelperService',
		'procurementPriceComparisonSettingConfiguration',
		function (_,
			$scope,
			$timeout,
			$translate,
			platformGridAPI,
			basicsCommonDialogGridControllerService,
			commonService,
			headerCheckHelperService,
			commonHelperService,
			settingConfiguration) {

			var currentConfig = settingConfiguration.getCurrentConfig();
			var configure = currentConfig.quoteCompareField;
			var dataService = configure.dataService;
			var parentService = currentConfig.parentService;
			var columnDef = {
				getStandardConfigForListView: function () {
					return {
						columns: [
							{
								id: 'fieldName',
								field: 'FieldName',
								name: 'Field Name',
								name$tr$: 'procurement.pricecomparison.compareConfigFieldsFieldName',
								width: 120
							},
							{
								id: 'Description',
								formatter: 'description',
								name: 'User label name',
								name$tr$: 'cloud.desktop.formConfigCustomerLabelName',
								field: 'UserLabelName',
								width: 150,
								editor: 'description',
								focusable: true,
								hidden: false
							},
							{
								id: 'Visible',
								field: 'Visible',
								name: 'Visible',
								name$tr$: 'procurement.pricecomparison.compareConfigColumnsVisible',
								formatter: 'boolean',
								editor: 'boolean',
								width: 150,
								headerChkbox: true
							},
							{
								id: 'isSorting',
								field: 'IsSorting',
								name: 'Sorting',
								name$tr$: 'procurement.pricecomparison.isSorting',
								editor: 'boolean',
								formatter: 'boolean',
								width: 100
							}
						]
					};
				}
			};
			var gridConfig = {
				initCalled: false,
				columns: [],
				grouping: false,
				uuid: configure.gridId,
				cellChangeCallBack: onCellChangeCallBack
			};

			var toolbarItems = [
				{
					id: 't105',
					sort: 40,
					caption: $translate.instant('procurement.pricecomparison.moveUp'),
					iconClass: commonService.icons.toolBars.moveUp,
					type: 'item',
					fn: dataService.moveUp
				},
				{
					id: 't106',
					sort: 50,
					caption: $translate.instant('procurement.pricecomparison.moveDown'),
					iconClass: commonService.icons.toolBars.moveDown,
					type: 'item',
					fn: dataService.moveDown
				},
				{
					id: 'd3',
					sort: 70,
					type: 'divider'
				}
			];

			$scope.setTools = function (tools) {
				$scope.tools = commonService.getTools(tools, toolbarItems);
			};
			$scope.removeToolByClass = angular.noop;

			function onCellChangeCallBack(arg) {
				var columns = arg.grid.getColumns(), field = columns[arg.cell].field, item = arg.item;
				processCheckboxCellChanged([item], field, true);
			}

			function processCheckboxCellChanged(items, field) {
				if (field === 'IsSorting' || field === 'Visible') {
					var grandTotal = _.find(items, {Field: commonService.quoteCompareFields.grandTotalRank});
					if (grandTotal && !grandTotal.Visible) {
						grandTotal.IsSorting = false;
					}
					var checked = grandTotal ? grandTotal.IsSorting : false;
					dataService.setDataReadOnly(items);
					parentService.onGrandTotalRankSortingChanged.fire({
						origin: commonService.constant.compareSection.UI,
						checked: checked
					});
					if (angular.isFunction($scope.updateHeaderCheckState)) {
						$scope.updateHeaderCheckState();
					}
				}

			}

			basicsCommonDialogGridControllerService.initListController($scope, columnDef, dataService, null, gridConfig);

			function onValueColumnVisibleChanged(lineValueChecked, horizontalChecked, tryTimes) {
				if (!horizontalChecked || lineValueChecked) {
					headerCheckHelperService.enabledHeaderCheckBox(gridConfig.uuid, ['Visible'], true, tryTimes);

					var items = dataService.getList();
					dataService.setDataReadOnly(items, true);
					var grandRow = _.find(items, {Field: commonService.quoteCompareFields.grandTotalRank}),
						enabledSorting = !!(grandRow && grandRow.Visible);
					if (enabledSorting) {
						headerCheckHelperService.enabledHeaderCheckBox(gridConfig.uuid, ['isSorting'], false, tryTimes);
					}
				} else {
					headerCheckHelperService.disabledHeaderCheckBox(gridConfig.uuid, ['Visible', 'isSorting'], true, tryTimes);
				}
			}

			parentService.onLineValueColumnVisibleChanged.register(onValueColumnVisibleChanged);

			headerCheckHelperService.configForQuoteRows($scope, {
				completeFn: function (items, field) {
					var targetItems = _.filter(items, function (item) {
						return !commonHelperService.isDataPropReadonly(item, field);
					});
					processCheckboxCellChanged(targetItems, field);
				}
			});

			// when controller initialized, refresh to show grid (height) correctly, then load data.
			$timeout(function () {
				dataService.load().then(function () {
					onValueColumnVisibleChanged(parentService.isLineValueColumnVisible(), parentService.isVerticalCompareRows(), 10);
				});
			});

			function loadFinish() {
				var gids = settingConfiguration.getGids();
				commonService.registerLoadFinish.fire({
					value: gids.quoteCompareField
				});
				platformGridAPI.events.unregister(configure.gridId, 'onRowCountChanged', loadFinish);
			}

			platformGridAPI.events.register(configure.gridId, 'onRowCountChanged', loadFinish);
			$scope.$on('$destroy', function () {
				parentService.onLineValueColumnVisibleChanged.unregister(onValueColumnVisibleChanged);
			});
		}
	]);

	angular.module(moduleName).controller('procurementPriceComparisonBillingSchemaRowController', [
		'$scope',
		'$timeout',
		'$translate',
		'platformGridAPI',
		'basicsCommonDialogGridControllerService',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonHeaderCheckHelperService',
		'procurementPriceComparisonSettingConfiguration',
		function (
			$scope,
			$timeout,
			$translate,
			platformGridAPI,
			basicsCommonDialogGridControllerService,
			commonService,
			checkHelperService,
			settingConfiguration) {

			var currentConfig = settingConfiguration.getCurrentConfig();
			var configure = currentConfig.billingSchemaField;
			var dataService = configure.dataService;
			var parentService = currentConfig.parentService;
			var columnDef = {
				getStandardConfigForListView: function () {
					return {
						columns: [
							{
								id: 'fieldName',
								field: 'FieldName',
								name: 'Field Name',
								name$tr$: 'procurement.pricecomparison.compareConfigFieldsFieldName',
								width: 120
							},
							{
								id: 'Description',
								formatter: 'description',
								name: 'User label name',
								name$tr$: 'cloud.desktop.formConfigCustomerLabelName',
								field: 'UserLabelName',
								width: 150,
								editor: 'description',
								focusable: true,
								hidden: false
							},
							{
								id: 'Visible',
								field: 'Visible',
								name: 'Visible',
								name$tr$: 'procurement.pricecomparison.compareConfigColumnsVisible',
								formatter: 'boolean',
								editor: 'boolean',
								width: 150,
								headerChkbox: true
							},
							{
								id: 'islive',
								field: 'IsLive',
								name: 'Is Live',
								name$tr$: 'basics.customize.islive',
								formatter: 'boolean',
								editor: null,
								width: 150
							}
						]
					};
				}
			};
			var gridConfig = {
				initCalled: false,
				columns: [],
				grouping: false,
				uuid: configure.gridId
			};
			var toolbarItems = [
				{
					id: 't105',
					sort: 40,
					caption: $translate.instant('procurement.pricecomparison.moveUp'),
					iconClass: commonService.icons.toolBars.moveUp,
					type: 'item',
					fn: dataService.moveUp
				},
				{
					id: 't106',
					sort: 50,
					caption: $translate.instant('procurement.pricecomparison.moveDown'),
					iconClass: commonService.icons.toolBars.moveDown,
					type: 'item',
					fn: dataService.moveDown
				},
				{
					id: 'd3',
					sort: 70,
					type: 'divider'
				}
			];

			$scope.setTools = function (tools) {
				$scope.tools = commonService.getTools(tools, toolbarItems);
			};
			$scope.removeToolByClass = angular.noop;
			$scope.service = dataService;
			$scope.service.isFinalShowInTotal = parentService.isFinalShowInTotal();
			basicsCommonDialogGridControllerService.initListController($scope, columnDef, dataService, null, gridConfig);

			function onValueColumnVisibleChanged(lineValueChecked, horizontalChecked, tryTimes) {
				if (!horizontalChecked || lineValueChecked) {
					checkHelperService.enabledHeaderCheckBox(gridConfig.uuid, ['Visible'], true, tryTimes);
				} else {
					checkHelperService.disabledHeaderCheckBox(gridConfig.uuid, ['Visible'], true, tryTimes);
				}
			}

			parentService.onLineValueColumnVisibleChanged.register(onValueColumnVisibleChanged);

			// when controller initialized, refresh to show grid (height) correctly, then load data.
			$timeout(function () {
				dataService.load().then(function () {
					onValueColumnVisibleChanged(parentService.isLineValueColumnVisible(), parentService.isVerticalCompareRows(), 10);
				});
			});

			function loadFinish() {
				var gids = settingConfiguration.getGids();
				commonService.registerLoadFinish.fire({
					value: gids.billingSchemaField
				});
				platformGridAPI.events.unregister(configure.gridId, 'onRowCountChanged', loadFinish);
			}

			platformGridAPI.events.register(configure.gridId, 'onRowCountChanged', loadFinish);
			$scope.$on('$destroy', function () {
				parentService.onLineValueColumnVisibleChanged.unregister(onValueColumnVisibleChanged);
			});
		}
	]);

	angular.module(moduleName).controller('procurementPriceComparisonRowController', [
		'_',
		'$scope',
		'$timeout',
		'$translate',
		'platformGridAPI',
		'platformModalService',
		'basicsCommonDialogGridControllerService',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonCommonHelperService',
		'procurementPriceComparisonHeaderCheckHelperService',
		'procurementPriceComparisonSettingConfiguration',
		function (_,
			$scope,
			$timeout,
			$translate,
			platformGridAPI,
			platformModalService,
			basicsCommonDialogGridControllerService,
			commonService,
			commonHelperService,
			headerCheckHelperService,
			settingConfiguration) {

			var currentConfig = settingConfiguration.getCurrentConfig();
			var configure = currentConfig.compareField;
			var dataService = configure.dataService;
			var parentService = currentConfig.parentService;

			var columnDef = {
				getStandardConfigForListView: function () {
					return {
						columns: [
							{
								id: 'fieldName',
								field: 'FieldName',
								name: 'Field Name',
								name$tr$: 'procurement.pricecomparison.compareConfigFieldsFieldName'
							},
							{
								id: 'Description',
								formatter: 'description',
								name: 'User label name',
								name$tr$: 'cloud.desktop.formConfigCustomerLabelName',
								field: 'UserLabelName',
								width: 150,
								editor: 'description',
								focusable: true,
								hidden: false
							},
							{
								id: 'Visible',
								field: 'Visible',
								name: 'Visible',
								name$tr$: 'procurement.pricecomparison.compareConfigColumnsVisible',
								formatter: 'boolean',
								editor: 'boolean',
								headerChkbox: true
							},
							{
								id: 'showInSummary',
								field: 'ShowInSummary',
								name: 'Show In Summary',
								name$tr$: 'procurement.pricecomparison.compareConfigFieldsShowInSummary',
								formatter: 'boolean',
								editor: 'boolean',
								headerChkbox: true
							},
							{
								id: 'leadingField',
								field: 'IsLeading',
								name: 'Leading Field',
								name$tr$: 'procurement.pricecomparison.compareConfigFieldsLeadingField',
								formatter: 'boolean',
								editor: 'boolean'
							},
							{
								id: 'allowEdit',
								field: 'AllowEdit',
								name: 'Allow Edit',
								name$tr$: 'procurement.pricecomparison.compareConfigFieldsAllowEdit',
								formatter: 'boolean',
								editor: 'boolean',
								headerChkbox: true
							},
							{
								id: 'conditionalFormat',
								field: 'ConditionalFormat',
								name: 'Conditional Format',
								width: 500,
								name$tr$: 'procurement.pricecomparison.compareConfigFieldsConditionalFormat'

							},
							{
								id: 'deviationField',
								field: 'DeviationField',
								name: 'Deviation Field',
								name$tr$: 'procurement.pricecomparison.deviationField',
								formatter: 'boolean',
								editor: 'boolean',
								width: 100,
								headerChkbox: true
							},
							{
								id: 'deviationPercent',
								field: 'DeviationPercent',
								name: 'Deviation Percent',
								name$tr$: 'procurement.pricecomparison.deviationPercent',
								formatter: 'percent',
								editor: 'percent',
								width: 100,
								regex: '(^[+]?\\d*$)|(^(?:[+]?[\\d]*(?:[,\\.]{0,1}\\d+)*)([,\\.][\\d]{0,2})$)'
							},
							{
								id: 'deviationReference',
								field: 'DeviationReference',
								name: 'Deviation Reference',
								name$tr$: 'procurement.pricecomparison.deviationReference',
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'DeviationReference',
									displayMember: 'DescriptionInfo.Translated'
								},
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										filterKey: 'price-comparison-item-evaluation-filter'
										// showClearButton: true
									},
									directive: 'deviation-reference-combobox'
								},
								width: 100
							}
						]
					};
				}
			};
			var gridConfig = {
				initCalled: false,
				columns: [],
				grouping: false,
				uuid: configure.gridId,
				cellChangeCallBack: function (args) {
					// only one leading field can be checked
					var columns = platformGridAPI.columns.configuration($scope.gridId).visible;
					var objColumn = columns[args.cell];
					processCheckboxCellChanged([args.item], objColumn.field, true, args.item.Field);
				}
			};
			var toolbarItems = [
				{
					id: 't105',
					sort: 40,
					caption: $translate.instant('procurement.pricecomparison.moveUp'),
					iconClass: commonService.icons.toolBars.moveUp,
					type: 'item',
					fn: dataService.moveUp
				},
				{
					id: 't106',
					sort: 50,
					caption: $translate.instant('procurement.pricecomparison.moveDown'),
					iconClass: commonService.icons.toolBars.moveDown,
					type: 'item',
					fn: dataService.moveDown
				},
				{
					id: 't106',
					sort: 60,
					caption: $translate.instant('cloud.common.toolbarSetting'),
					iconClass: commonService.icons.toolBars.settings,
					type: 'item',
					fn: showStyleFormatterDialog
				},
				{
					id: 'd3',
					sort: 70,
					type: 'divider'
				}
			];

			$scope.setTools = function (tools) {
				$scope.tools = commonService.getTools(tools, toolbarItems);
			};
			$scope.removeToolByClass = angular.noop;
			$scope.service = dataService;
			$scope.service.isVerticalCompareRows = parentService.isVerticalCompareRows();
			$scope.service.isLineValueColumn = parentService.isLineValueColumnVisible();
			$scope.service.isBoq = currentConfig.isBoq;
			if($scope.service.isBoq){
				$scope.service.isCalculateAsPerAdjustedQuantity = parentService.isCalculateAsPerAdjustedQuantity();
			}

			$scope.onVerticalCompareRowsChanged = function () {
				if (!$scope.service.isVerticalCompareRows) {
					if ($scope.service.isLineValueColumn === true) {
						$scope.service.isLineValueColumn = false;
					}
				} else {
					$scope.service.isLineValueColumn = true;
				}
				parentService.onLineValueColumnVisibleChanged.fire($scope.service.isLineValueColumn, $scope.service.isVerticalCompareRows);
				parentService.onVerticalCompareRowsChanged.fire($scope.service.isVerticalCompareRows);
			};

			$scope.onLineValueColumnChanged = function () {
				parentService.onLineValueColumnVisibleChanged.fire($scope.service.isLineValueColumn, $scope.service.isVerticalCompareRows);
			};

			basicsCommonDialogGridControllerService.initListController($scope, columnDef, dataService, null, gridConfig);
			headerCheckHelperService.configForCompareRows($scope, {
				completeFn: function (items, field) {
					var targetItems = _.filter(items, function (item) {
						return !commonHelperService.isDataPropReadonly(item, field);
					});
					processCheckboxCellChanged(targetItems, field, true);
				}
			});

			function processCheckboxCellChanged(items, field, isRefreshGrid, itemField) {
				var hasChanged = false;
				var dataView = platformGridAPI.grids.element('id', $scope.gridId).dataView;
				var allItems = dataView.getItems();
				var percentage = _.find(allItems, {Field: commonService.itemCompareFields.percentage});
				_.each(items, function (item) {
					if (field === 'IsLeading') {
						allItems.map(function (item) {
							item[field] = false;
						});
						item[field] = true;
						hasChanged = true;
					}
					if (field === 'DeviationField') {
						commonService.highlightRowCellChanged(item, dataService.isDeviationColumn, percentage);
						if (item.Field === commonService.itemCompareFields.absoluteDifference) {
							percentage.DeviationField = item.DeviationField;
							percentage.DeviationPercent = item.DeviationPercent;
							percentage.DeviationReference = item.DeviationReference;
						}
						hasChanged = true;
					}
				});

				if (itemField === commonService.itemCompareFields.absoluteDifference &&
					(field === 'DeviationField' || field === 'DeviationPercent' || field === 'DeviationReference')) {
					dataService.setPercentDeviation(allItems);
					hasChanged = true;
				}
				if (hasChanged && isRefreshGrid) {
					platformGridAPI.grids.invalidate($scope.gridId);
				}

				if (field === 'Visible') {
					commonHelperService.fireEvent('Scope_Compare_Setting', 'onCompareFieldVisibleItemChanged', dataView.getRows());
				}

				if (field === 'UserLabelName') {
					commonHelperService.fireEvent('Scope_Compare_Setting', 'CompareFieldUserLabelNameChanged', items[0]);
				}
			}

			// when controller initialized, refresh to show grid (height) correctly, then load data.
			$timeout(function () {
				dataService.load().then(function () {
					commonService.registerLoadFinish.fire({
						value: settingConfiguration.getGids().compareField
					});
				});
			});

			var onHighlightChanged = function (eventInfo) {
				if (eventInfo.eventName === 'ColumnHighlightChanged') {
					dataService.isDeviationColumn = eventInfo.value;
					var list = dataService.getList();
					commonService.onHighlightChanged(eventInfo, list, configure.deviationFields);
					dataService.gridRefresh();
				}
			};
			commonService.onHighlightSelectedChanged.register(onHighlightChanged);

			commonHelperService.registerEvent('Scope_Compare_Setting', 'GridLayoutCompareFieldUserLabelNameChanged', compareFieldUserLabelNameChanged);

			$scope.$on('$destroy', function () {
				commonService.onHighlightSelectedChanged.unregister(onHighlightChanged);
				dataService.isDeviationColumn = false;
				commonHelperService.unregisterEvent('Scope_Compare_Setting', 'GridLayoutCompareFieldUserLabelNameChanged', compareFieldUserLabelNameChanged);
			});

			function showStyleFormatterDialog() {
				var selectedItem = dataService.getSelected();
				if (!dataService.isSelection(selectedItem) || _.isEmpty(selectedItem)) {
					return commonService.showInfoDialog('procurement.pricecomparison.noItemSelected');
				}
				var formatterDialogScope = $scope.$new(true);
				formatterDialogScope.conditionalFormat = selectedItem ? selectedItem.ConditionalFormat : ''; // pass the text to controller scope
				formatterDialogScope.onOK = function () {
					$scope.$close({isOK: true, data: {}});
				};

				platformModalService.showDialog({
					templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/partials/price-comparison-formatter.html',
					backdrop: false,
					width: '640px',
					resizeable: true,
					scope: formatterDialogScope
				}).then(function (result) {
					if (result.isOK) {
						selectedItem.ConditionalFormat = result.data;
						platformGridAPI.rows.refreshRow({gridId: $scope.gridId, item: selectedItem});
					}
				});
			}

			function compareFieldUserLabelNameChanged(item) {
				let items = dataService.getList();
				var target = _.find(items, {Field: item.field});
				if (target) {
					target.UserLabelName = item.userLabelName;
					dataService.gridRefresh();
				}
			}
		}
	]);

})(angular);