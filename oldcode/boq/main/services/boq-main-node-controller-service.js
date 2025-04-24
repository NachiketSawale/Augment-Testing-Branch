/**
 * Created by bh on 19.12.2014.
 */
(function () {
	/* global globals, Platform:false,  _ */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainNodeControllerService
	 * @function
	 *
	 * @description
	 * boqMainNodeControllerService is the service to initialize the mentioned controller.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('boqMainNodeControllerService', ['$q', '$http', '$injector', '$timeout', 'boqMainCrbService', 'boqMainOenService', 'boqMainChangeService', 'loadingIndicatorExtendServiceFactory', 'boqMainPropertiesDialogService',
		'platformDragdropService', 'platformPermissionService', 'platformRuntimeDataService', 'boqMainCopyOptionsProviderService', 'boqMainReadonlyProcessor', 'platformContextMenuItems', 'platformModuleNavigationService', 'boqMainGoToEstimateService', 'platformDialogService',
		function ($q, $http, $injector, $timeout, boqMainCrbService, boqMainOenService, boqMainChangeService, loadingIndicatorExtendServiceFactory, boqMainPropertiesDialogService, platformDragdropService, platformPermissionService,
			platformRuntimeDataService, boqMainCopyOptionsProviderService, boqMainReadonlyProcessor, platformContextMenuItems, platformModuleNavigationService, boqMainGoToEstimateService, platformDialogService) {

			// The instance of the main service - to be filled with functionality below
			var service = {};
			service.priceLabelAdjusted = new Platform.Messenger();
			/**
			 * @ngdoc function
			 * @name initBoqNodeController
			 * @function
			 * @methodOf boqMainNodeControllerService
			 * @description This function handles the initialization of the boq node controller in whose context it is called
			 */
			service.initBoqNodeController = function initBoqNodeController($scope, boqMainService, platformNavBarService, platformGridControllerService, cloudDesktopHotKeyService, boqMainValidationServiceProvider, $filter, boqMainClipboardService, boqMainCommonService, boqMainStandardConfigurationService, boqMainTranslationService, platformModalService, $translate, platformGridAPI) {

				cloudDesktopHotKeyService.registerHotkeyjson('boq.main/content/json/hotkey.json', moduleName);

				// Flag to handle readonly mode for this controller.
				// Can be set by externally given boqNodeControllerOptions that's 'transported' via $scope or by the readOnly mode coming from the boqMainService
				var readOnlyMode = boqMainService.getReadOnly();

				var allowedDragActions = [];

				function initializeDragAndDropActions() {

					allowedDragActions.length = 0;

					allowedDragActions.push(platformDragdropService.actions.copy);
					if ((angular.isUndefined($scope.boqNodeControllerOptions) || ($scope.boqNodeControllerOptions === null) || !$scope.boqNodeControllerOptions.readOnly) &&
						!_.isEmpty(boqMainService.getContainerUUID()) && platformPermissionService.hasWrite(boqMainService.getContainerUUID().toLowerCase())) {
						allowedDragActions.push(platformDragdropService.actions.move);
					}
				}

				initializeDragAndDropActions();

				var myGridConfig = {
					initCalled: false,
					lazyInit: true,
					columns: [],
					// Below code is commented as few calculation related to OC fields are not working with server side bulk editor.
					/* bulkEditorSettings: {
						serverSideBulkProcessing: true,
						skipEntitiesToProcess: true
					}, */
					parentProp: 'BoqItemFk',
					childProp: 'BoqItems',
					type: 'boqitem',
					dragDropService: boqMainClipboardService,
					property: 'Reference',
					allowedDragActions: allowedDragActions,
					defaultSortComparer: boqMainService.compareBoqItemsByReferences,
					cellChangeCallBack: function cellChangeCallBack(arg) {
						if (angular.isDefined(arg) && (arg !== null) && angular.isDefined(arg.grid) && (arg.grid !== null) &&
							angular.isDefined(arg.grid.getColumns) && (arg.grid.getColumns !== null) && angular.isDefined(arg.cell) &&
							(arg.cell !== null) && angular.isDefined(arg.item) && (arg.item !== null)) {

							var column = arg.grid.getColumns()[arg.cell];
							var item = arg.item;

							// Special case 'Reference'
							// There is a synchronous and asynchronous validator defined for this column. The asynchronous one terminates after the cellChange event is fired,
							// and therefore the apply of the value isn't done already. So we postpone the handling of changes done to this column in the grid to a special callback
							// that is fired when the apply of the value is done (-> $$postApplyValue: the '$$' prefix usually denotes a function not meant for public use,
							// but after asking Kris about my problems with asynchronous validation in the grid he allowed me to use it for it currently seems to be the only way
							// to get around the problems).

							if ((column.field === 'Reference') && angular.isDefined(column.$$postApplyValue) && _.isFunction(column.$$postApplyValue)) {
								return;
							}

							if (boqMainService.isCrbBoq()) {
								$injector.get('boqMainCrbBoqItemService').propertyChanged(boqMainService, item, column.field);
							}
							else if (boqMainService.isOenBoq()) {
								$injector.get('boqMainOenService').propertyChanged(item, column.field);
							}
							boqMainChangeService.reactOnChangeOfBoqItem(item, column.field, boqMainService, boqMainCommonService);
							boqMainService.boqItemEdited.fire(column.field, item[column.field]);
						}
					},
					enableCopyPasteExcel: !boqMainService.isCopySource
				};

				// add filter radio/check for boq
				if (_.isFunction(boqMainService.getGridConfig)) {
					myGridConfig = angular.extend(boqMainService.getGridConfig(), myGridConfig);
				}

				var boqMainElementValidationService = boqMainValidationServiceProvider ? boqMainValidationServiceProvider.getInstance(boqMainService) : null;
				boqMainStandardConfigurationService.setCurrentBoqMainService(boqMainService);

				let boqMainExtendConfigurationService = boqMainService.getCommonDynamicConfigurationService();
				boqMainExtendConfigurationService.setConfigurationServiceAndValidationService(boqMainStandardConfigurationService, boqMainElementValidationService);

				var adjustGridColumns = function() {
					function setLabel(gridColumnsArray, boqStructure, propertyName, defaultLabel) {
						const label = (boqStructure && boqStructure[`Name${propertyName}`]) ? boqStructure[`Name${propertyName}`] : defaultLabel;
						const columnId = propertyName.toLowerCase();

						const gridColumnObject = _.find(gridColumnsArray, {id: columnId}); // Search in gridColumnsArray for grid column object given by columnId
						if (gridColumnObject) {
							gridColumnObject.name     = label;
							gridColumnObject.toolTip  = label;
							gridColumnObject.name$tr$ = label;
						}
					}

					function addCurrencyToPriceColumns(columns, currency) {
						function setPriceLabel(column, currency) {
							column.name     = _.replace(column.name, column.currency, '');
							column.currency = currency ? ` (${currency})` : '';
							column.name    += column.currency;
							column.toolTip  = column.name;
						}

						// Adds the currency to the price columns
						const moneyColumns = ['priceoc','finalpriceoc','correctionoc','costoc','vobdirectcostperunitoc','discountoc','discountedpriceoc','extraincrementoc','finaldiscountoc','itemtotaloc','lumpsumpriceoc','preescalationoc'];
						_.forEach(_.filter(columns, function(col) { return moneyColumns.includes(col.id+'oc'); }), function(col) { // money colum <=> company currency
							setPriceLabel(col, currency.Company);
							if(col.id === 'price' ){
								service.priceLabelAdjusted.fire( currency.Company);
							}
						});
						_.forEach(_.filter(columns, function(col) { return moneyColumns.includes(col.id); }), function(col) { // money oc colum <=> BOQ currency
							setPriceLabel(col, currency.BoqHeader);
						});
					}

					function createMiscellaneousSplitQuantityPropertyFormatter(columns, propertyName) {
						var column = _.find(columns, {'field': propertyName});
						if (column) {
							if (!column.formatterOptions) {
								column.formatterOptions = {};
							}

							column.formatterOptions.imageSelector = {
								select: (boqItem) => {
									return boqItem.MiscellaneousSplitQuantityProperties && boqItem.MiscellaneousSplitQuantityProperties.includes(propertyName) ? 'control-icons ico-asterisk-blue' : null;
								},
								selectTooltip: () => $translate.instant('boq.main.miscellaneousSplitQuantityProperties')
							};
						}
					}

					function createMiscellaneousPrjChangePropertyFormatter(columns) {
						var column = _.find(columns, {'field':'PrjChangeFk'});
						if (column) {
							if (!column.formatterOptions) {
								column.formatterOptions = {};
							}

							column.formatterOptions.imageSelector = {
								select: (boqItem) => {
									return boqItem.HasMiscellaneousPrjChange ? 'control-icons ico-asterisk-blue' : null;
								},
								selectTooltip: () => $translate.instant('boq.main.miscellaneousPrjChangesInBidBoqs')
							};
						}
					}

					function getCurrencyAsync() {
						var ret = {Company: '', BoqHeader: ''};
						var boqHeaderId = boqMainService.getSelectedBoqHeader();
						var callingContext = boqMainService.getCallingContext();

						if (boqHeaderId > 0 && !(callingContext && callingContext.WicBoq)) {
							return $http.get(globals.webApiBaseUrl + 'boq/main/header/currency?boqHeaderId=' + boqHeaderId).then(function (result) {
								if (result.data) {
									ret = result.data;
								}
								return ret;
							});
						} else {
							return $q.when(ret);
						}
					}

					onSelectedBoqItemChanged(); // Refresh toolbar buttons for the boq structure information may have changed

					// Hint: Be aware to only call this method after createGrid of platformGridApi has been called so you can be sure that
					// the instance object in platformGridApi is defined.

					if (!platformGridAPI.grids.exist($scope.gridId)) {
						return;
					}

					// Refresh dynamic columns
					boqMainExtendConfigurationService.fireRefreshConfigLayout();

					getCurrencyAsync().then(function(result) {
						var columnsConfiguration = platformGridAPI.columns.configuration($scope.gridId);
						if (angular.isUndefined(columnsConfiguration) || (columnsConfiguration === null)) {
							return;
						}

						var columns = columnsConfiguration.current;
						if (angular.isUndefined(columns) || (columns === null)) {
							return;
						}

						var boqStructure = boqMainService.getStructure();

						// Set label of certain columns to values given by boq property settings
						setLabel(columns, boqStructure, 'Urb1', $translate.instant('boq.main.Urb1'));
						setLabel(columns, boqStructure, 'Urb2', $translate.instant('boq.main.Urb2'));
						setLabel(columns, boqStructure, 'Urb3', $translate.instant('boq.main.Urb3'));
						setLabel(columns, boqStructure, 'Urb4', $translate.instant('boq.main.Urb4'));
						setLabel(columns, boqStructure, 'Urb5', $translate.instant('boq.main.Urb5'));
						setLabel(columns, boqStructure, 'Urb6', $translate.instant('boq.main.Urb6'));
						setLabel(columns, boqStructure, 'Userdefined1', $translate.instant('cloud.common.entityUserDefined') + ' 1');
						setLabel(columns, boqStructure, 'Userdefined2', $translate.instant('cloud.common.entityUserDefined') + ' 2');
						setLabel(columns, boqStructure, 'Userdefined3', $translate.instant('cloud.common.entityUserDefined') + ' 3');
						setLabel(columns, boqStructure, 'Userdefined4', $translate.instant('cloud.common.entityUserDefined') + ' 4');
						setLabel(columns, boqStructure, 'Userdefined5', $translate.instant('cloud.common.entityUserDefined') + ' 5');

						$injector.get('boqMainCrbBoqItemService').adjustGridColumns(boqMainService, columns);

						addCurrencyToPriceColumns(columns, result);

						createMiscellaneousPrjChangePropertyFormatter(columns);
						createMiscellaneousSplitQuantityPropertyFormatter(columns, 'PrjLocationFk');
						createMiscellaneousSplitQuantityPropertyFormatter(columns, 'MdcControllingUnitFk');
						createMiscellaneousSplitQuantityPropertyFormatter(columns, 'PrcStructureFk');
						createMiscellaneousSplitQuantityPropertyFormatter(columns, 'DeliveryDate');
						_.forEach(_.filter(columns, (col) => _.startsWith(col.field, 'costgroup_')), function (col) {
							createMiscellaneousSplitQuantityPropertyFormatter(columns, col.field);
						});

						// Depending on the currently active bill-to mode we leave or remove the columns for the ProjectBillToFk
						let billToModes = $injector.get('billToModes');
						if(boqMainService.getCallingContextType() !== 'Project' || boqMainService.getCurrentBillToMode() !== billToModes.quantityOrItemBased) {
							_.remove(columns, {'field':'ProjectBillToFk'});
							// _.remove(columns, {'field':'ProjectBillToFk-Description'});
						}

						platformGridAPI.columns.configuration($scope.gridId, columns);
						platformGridAPI.grids.refresh(        $scope.gridId);
						platformGridAPI.grids.invalidate(     $scope.gridId);
					});
				};

				// init Dynamic User Defined price Columns
				if(!boqMainService.getDynamicUserDefinedColumnsService()) {
					var boqMainDynamicUserDefinedColumnConfigurationService = $injector.get('boqMainDynamicUserDefinedColumnService').getService(boqMainStandardConfigurationService, boqMainValidationServiceProvider, boqMainService, boqMainExtendConfigurationService);
					if (boqMainDynamicUserDefinedColumnConfigurationService) {
						boqMainService.setDynamicUserDefinedColumnsService(boqMainDynamicUserDefinedColumnConfigurationService);
					}
				}

				platformGridControllerService.initListController($scope, boqMainExtendConfigurationService, boqMainService, boqMainElementValidationService, myGridConfig);

				loadingIndicatorExtendServiceFactory.createService($scope, 500, null, boqMainService.startActionEvent, boqMainService.endActionEvent);

				boqMainExtendConfigurationService.applyToScope($scope);

				var grid = platformGridAPI.grids.element('id', $scope.gridId);
				grid.options.asyncEditorLoading = true; // Ensures the correct setting of the focus on a grid cell after the creation of a new BOQ item. Fix for ALM task 145729.

				// ToDo BH: Generally setting the grid readonly is done by the editable property in the grid options. One could think of doing this in the platformGridControllerService itself,
				// ToDO BH: by handing over a specific setting in the gridConfig, but currently it's handled here explicitly.
				if (angular.isDefined($scope.boqNodeControllerOptions) && ($scope.boqNodeControllerOptions !== null) && $scope.boqNodeControllerOptions.readOnly) {
					grid.options.editable = false;
					readOnlyMode = true;
				}

				$scope.footerOptions = {
					rowHeight: 20,
					template: '<span id="boqElementCount"></span>'
				};

				$scope.contextMenuOptions = {
					template: '<ul class="contextMenu_2" style="display:none; position:absolute"><b>Set priority:</b><li data="Low">Low</li><li data="Medium">Medium</li><li data="High">High</li></ul>',
					clickHandler: function () {
					}
				};

				var usedHotKeys = [
					{callbackId: 'addRecord', callback: $scope.createNewByContext},
					{callbackId: 'deleteRecord', callback: $scope.delete},
					{callbackId: 'expandNode', callback: $scope.expandSelected},
					{callbackId: 'collapseNode', callback: $scope.collapseSelected}
				];

				cloudDesktopHotKeyService.registerBulk(usedHotKeys);

				// region cut, copy, paste and drag functionality

				var getSelectedItems = function getSelectedItems() {
					var grid = platformGridAPI.grids.element('id', $scope.gridId);
					var selectedItems = [];

					if (angular.isDefined(grid) && grid !== null && angular.isDefined(grid.instance) && grid.instance !== null) {
						var gridInstance = grid.instance;
						var selectedRows = gridInstance.getSelectedRows();
						for (var i = 0; i < selectedRows.length; i++) {
							selectedItems.push(gridInstance.getDataItem(selectedRows[i]));
						}
					}

					return selectedItems;
				};

				function getPastedData(text) {

					if (!_.isString(text) || text.length === 0) {
						return null;
					}

					let pastedDataArray = text.split(/\r?\n/);
					// trim trailing CR if present
					if (pastedDataArray[pastedDataArray.length - 1] === '') {
						pastedDataArray.pop();
					}

					pastedDataArray = _.map(pastedDataArray, function (item) {
						let formattedItem = item.replace(',', '.');
						let floatingNumber = parseFloat(formattedItem);
						let canBeConvertedToNumber = !_.isNaN(floatingNumber) && _.isNumber(floatingNumber);
						if (!canBeConvertedToNumber) {
							console.log('Clipboard entry [' + formattedItem + '] could not be converted into a number!');
						}
						return canBeConvertedToNumber ? floatingNumber : null;
					});

					// Remove 'null' entries
					pastedDataArray = _.filter(pastedDataArray, function (entry) {
						return _.isNumber(entry);
					});

					return pastedDataArray;
				}

				function prepareDataForClipboardPaste(pastedData) {
					var element = platformGridAPI.grids.element('id', $scope.gridId);
					var grid = element.instance;
					// let range = grid.selectedRange;
					// let rowIndex = grid.getActiveCell() ? grid.getActiveCell().row : range.fromRow;
					// let colIndex = grid.getActiveCell() ? grid.getActiveCell().cell : range.fromCell;
					// Currently we only work with the "UnitRate" (aka "Price") column
					let selectedColumn = _.find(grid.getColumns(), function (column) {
						return column.field === 'Price';
					});

					if (!_.isObject(selectedColumn)) {
						throw new Error('Unit Rate column not found -> maybe it is not displayed');
					}

					// let fieldName = grid.getColumns()[colIndex].field;
					let selectedEntities = getSelectedItems();

					// If there is only one entity selected but have more than one value to paste
					// we expand the selected entities up to the amount of the given pasted values
					// and also take possibly sibling items into the selectedEntities pool.
					if (_.isArray(selectedEntities) && selectedEntities.length === 1) {
						let selectedItem = selectedEntities[0];
						let parentItem = _.isObject(selectedItem) ? boqMainCommonService.isDivision(selectedItem) ? selectedItem : boqMainService.getParentOf(selectedItem) : null;
						let siblings = _.isObject(parentItem) ? _.filter(parentItem.BoqItems, function (childItem) {
							return boqMainCommonService.isItem(childItem);
						}) : null;
						let startIndex = (selectedItem !== parentItem) ? _.findIndex(siblings, {Id: selectedItem.Id}) : 0;
						let numberOfPastedData = _.isArray(pastedData) ? pastedData.length : 0;
						if (numberOfPastedData > 1 && _.isArray(siblings) && siblings.length > 1) {
							let endIndex = startIndex + numberOfPastedData;
							selectedEntities = siblings.slice(startIndex, endIndex);
						}
					}

					if (_.isEmpty(selectedEntities)) {
						return null;
					}

					/*
						selectedColumn --> column propertied
						copyValue --> the value of the cell
					 */
					let configDataForPaste = {
						selectedColumn: selectedColumn,
						valuesToBePasted: pastedData,
						entities: selectedEntities, // For Bulk Editor Enhancement
						gridId: $scope.gridId, // For Bulk Editor Enhancement
						type: 'pasteValue'
					};

					return configDataForPaste;
				}

				function startLocalBulkEditor(headlessOption) {
					let element = platformGridAPI.grids.element('id', $scope.gridId);
					let grid = element.instance;
					let gridColumns = grid.getColumns();
					let activeCol = 0;
					let platformBulkEditorBaseService = $injector.get('platformBulkEditorBaseService');
					if (grid.getActiveCell()) {
						activeCol = grid.getActiveCell().cell;
					}
					$scope.selectedColumn = gridColumns[activeCol];
					platformBulkEditorBaseService.startBulkEditor(boqMainService, boqMainExtendConfigurationService, boqMainElementValidationService, $scope, myGridConfig, gridColumns, headlessOption);
				}

				// TODO:$scope.setTools method doesn't implement 'enabled' and 'disabled' now.
				$scope.canPaste = false;

				$scope.cut = function () {
					boqMainClipboardService.cut(getSelectedItems(), 'boqitem', boqMainService);
					boqMainService.gridRefresh();
				};

				$scope.copy = function () {
					boqMainClipboardService.copy(getSelectedItems(), 'boqitem', boqMainService);
				};

				$scope.paste = function () {
					if (!boqMainClipboardService.canPaste('boqitem', boqMainService.getSelected(), boqMainService, true)) {
						return;
					}

					boqMainClipboardService.paste(
						boqMainService.getSelected(),
						'boqitem',
						function (type, copyAndPasteEstimateOrAssembly) {
							if (type === 'boqitem') {
								boqMainService.gridRefresh();
								if(!copyAndPasteEstimateOrAssembly) {
									platformDialogService.showInfoBox('boq.main.CopyAndPasteEstimateOrAssembly');
								}
							}
						},
						boqMainService);
				};

				$scope.pasteFromClipboard = function () {
					if (navigator.clipboard) {
						navigator.clipboard.readText().then(function (text) {

							// Determine and convert pasted data from clipboard
							let pastedData = getPastedData(text);

							if (_.isEmpty(pastedData)) {
								return;
							}

							// Prepare the pasted data and gather information from the grid
							// to be able to do the proper paste bulk operation.
							let configForPaste = prepareDataForClipboardPaste(pastedData);

							if (!_.isObject(configForPaste)) {
								return;
							}

							// Start the headless paste bulk operation
							startLocalBulkEditor(configForPaste);
						});
					}
					boqMainService.gridRefresh();
				};

				var clipboardStateChanged = function () {
					$scope.canPaste = boqMainClipboardService.getClipboard().type === 'boqitem';
				};
				boqMainClipboardService.clipboardStateChanged.register(clipboardStateChanged);

				function initClipboardState() {
					clipboardStateChanged();
				}

				// todo does not really work due to outstanding save refactoring !
				var onPostError = function (response) {

					var message = response.data.Exception.Message;
					var modalOptions = {
						headerText: 'Post to server failed',
						bodyText: message + ' - Retry ?',
						showYesButton: true,
						showNoButton: true,
						showCancelButton: true,
						iconClass: 'ico-warning'
					};

					platformModalService.showDialog(modalOptions).then(function (result) {
						if (result.yes) {
							boqMainService.saveBoqItems();
							// todo retry with response
							// boqMainService.saveBoqItems(result.data);
						} else if (result.no) {
							boqMainService.cancelUpdate();
						}
					});

				};
				boqMainService.onPostError.register(onPostError);

				var onCreationError = function (response) {
					if (!_.isEmpty(response) && angular.isString(response)) {

						var modalOptions = {
							headerText: 'Creation failed',
							bodyText: response,
							showOkButton: true,
							iconClass: 'tlb-icons ico-error',
							windowClass: 'error-box'
						};

						platformModalService.showDialog(modalOptions);

					} else if (response.data) {
						platformModalService.showErrorDialog(response.data);
					} else {
						platformModalService.showErrorDialog(response);
					}
				};

				var refreshAndInvalidateGrid = function refreshAndInvalidateGrid() {
					platformGridAPI.grids.refresh($scope.gridId);
					platformGridAPI.grids.invalidate($scope.gridId);
				};

				// React on calculation of item
				var onBoqItemPriceChanged = function (item) {
					if (item) {
						refreshAndInvalidateGrid();
					}
				};

				// React on state change of item
				var onBoqItemStateChanged = function (item) {
					if (item) {
						var myItem = boqMainService.getBoqItemById(item.Id);
						boqMainCommonService.insertImages(myItem);
						refreshAndInvalidateGrid();
					}
				};

				var refreshGrid = function refreshGrid() {
					adjustGridColumns();
				};

				var onSelectedBoqItemChanged = function onSelectedBoqItemChanged() {

					var selectedBoqItem = boqMainService.getSelected();

					if (selectedBoqItem && !_.isEmpty(selectedBoqItem) && !boqMainCommonService.isSurchargeItem4(selectedBoqItem)) {
						platformRuntimeDataService.readonly(selectedBoqItem, [{
							field: 'Rule',
							readonly: true
						}, {field: 'Param', readonly: true}]);
					}

					initializeDragAndDropActions();

					if ($scope.tools && !boqMainService.isCopySource) {
						angular.forEach($scope.tools.items, function (item) {
							if (item.id === 'boqNewByContext') {
								item.disabled = boqMainService.isOenBoq() || !boqMainService.createNewByContext(false);
							} else if (item.id === 'boqInsert') {
								item.disabled = !boqMainService.createNewItem(false);
							} else if (item.id === 'boqNewDivision') {
								item.disabled = !boqMainService.createNewDivision(false);
							} else if (item.id === 'boqNewSubdivision') {
								item.disabled = !boqMainService.createNewSubDivision(false);
							}
						});

						$scope.tools.update();
					}
				};

				function onListLoaded() {
					var rootBoqItem = boqMainService.getRootBoqItem();
					adjustGridColumns();

					if (rootBoqItem) {
						// Reads extended transient properties
						const qtoHeaderParam = boqMainService.getModule()?.name==='qto.main' ? '&qtoHeaderId='+boqMainService.parentService()?.getSelected()?.Id : '';
						$http.get(globals.webApiBaseUrl + 'boq/main/extendedtransientproperties' + '?boqHeaderId='+rootBoqItem.BoqHeaderFk + qtoHeaderParam).then(function(result) {
							_.forEach(result.data, function(transientBoqItem) {
								let boqItem = boqMainService.getBoqItemById(transientBoqItem.Id);
								if (boqItem) {
									boqItem.WicNumber             = transientBoqItem.WicNumber;
									boqItem.OrdQuantity           = transientBoqItem.OrdQuantity;
									boqItem.PrevQuantity          = transientBoqItem.PrevQuantity;
									boqItem.ExtraPrevious         = transientBoqItem.ExtraPrevious;
									boqItem.ExtraTotal            = transientBoqItem.ExtraTotal;
									boqItem.TotalQuantityAccepted = transientBoqItem.TotalQuantityAccepted;
									boqItem.PrevRejectedQuantity  = transientBoqItem.PrevRejectedQuantity;
									boqItem.InstalledQuantity     = transientBoqItem.InstalledQuantity;
									boqItem.TotalIQAccepted       = transientBoqItem.TotalIQAccepted;
									boqItem.ExWipQuantity         = transientBoqItem.ExWipQuantity;
									boqItem.ExWipIsFinalQuantity  = transientBoqItem.ExWipIsFinalQuantity;
									boqItem.ExWipExpectedRevenue  = transientBoqItem.ExWipExpectedRevenue;
									boqItem.ProjectBillToFk       = transientBoqItem.ProjectBillToFk;
									boqItem.PrjCharacter          = transientBoqItem.PrjCharacter;
									boqItem.WorkContent           = transientBoqItem.WorkContent;

									// extended Transient Qto Properties to qto boq
									if (_.isFunction(boqMainService.extendedTransientPropertiesInQtoBoq)) {
										boqMainService.extendedTransientPropertiesInQtoBoq(boqItem, transientBoqItem);
									}
								}
							});
							boqMainService.calcTotalPriceAndHoursForBoq(); // boqMainService.initInstalledValues(boqItem);

							boqMainService.gridRefresh();
						});

						// Reads miscellaneous split quantity properties
						$http.get(globals.webApiBaseUrl + 'boq/main/miscellaneoussplitquantities?boqHeaderId=' + rootBoqItem.BoqHeaderFk).then(function(result) {
							_.forEach(result.data, function(miscellaneousSplitQuantity) {
								let boqItem = boqMainService.getBoqItemById(miscellaneousSplitQuantity.Id);
								if (boqItem) {
									boqItem.MiscellaneousSplitQuantityProperties = miscellaneousSplitQuantity.Properties;
								}
							});

							boqMainService.gridRefresh();
						});

						// Reads miscellaneous project changes
						if ('Project' === boqMainService.getCallingContextType()) {
							$http.get(globals.webApiBaseUrl + 'boq/main/miscellaneousprojectchanges?prjBoqHeaderId=' + rootBoqItem.BoqHeaderFk).then(function(result) {
								_.forEach(result.data, function(miscellaneousPrjChange) {
									let boqItem = boqMainService.getBoqItemById(miscellaneousPrjChange);
									if (boqItem) {
										boqItem.HasMiscellaneousPrjChange = true;
										platformRuntimeDataService.readonly(   boqItem, [{field:'PrjChangeFk', readonly:true}]);
										platformRuntimeDataService.hideContent(boqItem, ['PrjChangeStatusFk'], true);
									}
								});

								boqMainService.gridRefresh();
							});
						}
					}
				}

				function onGridRenderCompleted() {

					// This event is fired very often. We only need to know it once the container has been created and the
					// grid has been rendered first. So we immediately unregister from this event here to avoid unneccessary
					// handling of this notification.
					platformGridAPI.events.unregister($scope.gridId, 'onRenderCompleted', onGridRenderCompleted);

					// Expand the first level of the grid
					onListLoaded();
				}

				boqMainService.creationError.register(onCreationError);
				boqMainService.boqItemPriceChanged.register(onBoqItemPriceChanged);
				boqMainService.boqItemStateChanged.register(onBoqItemStateChanged);
				boqMainService.boqItemCreateSucceeded.register(onBoqItemCreateSucceeded);
				boqMainService.registerSelectionChanged(onSelectedBoqItemChanged);
				boqMainService.registerListLoaded(onListLoaded);
				if(!boqMainService.isCopySource) {
					boqMainService.registerLookupFilters();
				}
				platformGridAPI.events.register($scope.gridId, 'onRenderCompleted', onGridRenderCompleted);

				var selectedBoqHeaderChanged = function selectedBoqHeaderChanged() {
					refreshGrid();
				};

				function onBoqItemCreateSucceeded() {
					// bre:
					// This is a workaround for the not fired event 'SelectionChanged' which ensures that the toolbar states are updated.
					// It must be called with a delay, the created BOQ item is already selected.
					$timeout(function() {
						onSelectedBoqItemChanged();
					});
				}

				boqMainService.selectedBoqHeaderChanged.register(selectedBoqHeaderChanged);
				boqMainService.boqStructureReloaded.register(adjustGridColumns);

				// endregion

				var setCellEditable = function (e, args) {
					return boqMainReadonlyProcessor.setCellEditable(args.item, args.column.field, boqMainService, readOnlyMode);
				};
				platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);

				boqMainService.addUsingContainer($scope.gridId);

				function onGridClick() {
					$injector.get('estimateParamComplexLookupCommonService').setCurrentGridContent($scope.getContentValue('permission') || $scope.gridId, boqMainService);
				}
				platformGridAPI.events.register($scope.gridId, 'onClick', onGridClick);

				function onGridConfigChanged() {
					// bre: Without that call the currency info at the price columns get lost. The call of function 'addCurrencyToPriceColumns' would be enough, but the code would be too complicated then.
					adjustGridColumns();
				}
				platformGridAPI.events.register($scope.gridId, 'onGridConfigChanged', onGridConfigChanged);

				// TODO-CostGroup:Add costGroupService
				if (!boqMainService.costGroupService) {
					boqMainService.costGroupService = $injector.get('boqMainCostGroupFactory').createService(boqMainService);
				}
				boqMainService.costGroupService.registerCellChangedEvent($scope.gridId);

				function costGroupLoaded(costGroupCatalogs) {
					$injector.get('basicsCostGroupAssignmentService').addCostGroupColumns($scope.gridId, boqMainExtendConfigurationService, costGroupCatalogs, boqMainService, boqMainElementValidationService);
				}

				// boqMainService.onCostGroupCatalogsLoaded.register(costGroupLoaded);

				/* refresh the columns configuration when controller is created */
				if (boqMainService.costGroupCatalogs) {
					costGroupLoaded(boqMainService.costGroupCatalogs);
				}

				/* Fixed issue #131899:The Source Boq container will affect Boq Structure container price condition column */
				if (boqMainService.getContainerUUID()) {
					$injector.get('basicsMaterialPriceConditionDataServiceNew').setCurrtBoqMainSerivce(boqMainService);
					$injector.get('basicsMaterialPriceConditionDataServiceNew').setSCurrtBoqContainerScope($scope);
				}

				// unregister boq service messenger
				$scope.$on('$destroy', function () {
					boqMainService.removeUsingContainer($scope.gridId);

					cloudDesktopHotKeyService.unregisterBulk(usedHotKeys);

					if (boqMainService.isCrbBoq()) {
						$injector.get('boqMainCrbLicenseService').logoutLicenseService();
					}

					boqMainClipboardService.clipboardStateChanged.unregister(clipboardStateChanged);
					boqMainService.onPostError.unregister(onPostError);
					boqMainService.creationError.unregister(onCreationError);
					boqMainService.boqItemPriceChanged.unregister(onBoqItemPriceChanged);
					boqMainService.boqItemStateChanged.unregister(onBoqItemStateChanged);
					boqMainService.boqItemCreateSucceeded.unregister(onBoqItemCreateSucceeded);
					boqMainService.selectedBoqHeaderChanged.unregister(selectedBoqHeaderChanged);
					boqMainService.boqStructureReloaded.unregister(adjustGridColumns);
					boqMainService.unregisterSelectionChanged(onSelectedBoqItemChanged);
					boqMainService.unregisterListLoaded(onListLoaded);
					boqMainService.unregisterSelectionChanged(updateNewToolCaptions);
					if (_.isFunction(boqMainService.setDetailsParamReminder)) {
						boqMainService.setDetailsParamReminder(null);
					}
					platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
					platformGridAPI.events.unregister($scope.gridId, 'onClick', onGridClick);
					platformGridAPI.events.unregister($scope.gridId, 'onGridConfigChanged', onGridConfigChanged);
					// boqMainService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
					/* Fixed issue #131899:The Source Boq container will affect Boq Structure container price condition column */
					if (boqMainService.getContainerUUID()) {
						$injector.get('basicsMaterialPriceConditionDataServiceNew').setCurrtBoqMainSerivce(null);
						$injector.get('basicsMaterialPriceConditionDataServiceNew').setSCurrtBoqContainerScope(null);
					}

					boqMainClipboardService.resetActivePasteCounter(); // To make sure that no pending paste calls block further paste calls.
				});

				// region DocumentProperties
				$scope.showDocumentProperties = function () {
					// Open Document Properties Modal Window
					if (boqMainService.getSelectedBoqHeader() > 0) {

						boqMainPropertiesDialogService.showDialog(boqMainService, null, null);
					} else {
						// warning
						platformModalService.showDialog({
							headerTextKey: 'boq.main.navDocumentProperties',
							bodyTextKey: 'boq.main.DocumentPropertiesNoBoq',
							iconClass: 'ico-warning'
						});
					}
				};
				// endregion

				// Functions creating and deleting boqItems
				$scope.createNewItem = boqMainService.createNewItem;
				$scope.createNewDivision = boqMainService.createNewDivision;
				$scope.createNewSubDivision = boqMainService.createNewSubDivision;
				$scope.createNewByContext = boqMainService.createNewByContext;
				$scope.crbCreateNewPosGroup = boqMainService.crbCreateNewPosGroup;
				$scope.crbCreateNewPosSubGroup = boqMainService.crbCreateNewPosSubGroup;

				$scope.delete = boqMainService.delete;

				var showBoqCopyButton = _.isObject($scope.boqNodeControllerOptions) && _.isBoolean($scope.boqNodeControllerOptions.showBoqCopyButton) ? $scope.boqNodeControllerOptions.showBoqCopyButton : null;

				var tools = [];
				let parentService = boqMainService.parentService();
				let isProcurementQuote = _.isObject(parentService) ? parentService.getServiceName() === 'procurementQuoteRequisitionDataService' : false;

				if (!readOnlyMode) {
					tools.push(Object.assign({
						id: 'boqNewByContext',
						caption: $translate.instant('cloud.common.toolbarNewByContext'),
						type: 'item',
						iconClass: 'tlb-icons ico-new',
						fn: $scope.createNewByContext
					}, platformContextMenuItems.setContextGroupNew()));

					tools.push({
						id: 'boqInsert',
						caption: $translate.instant('cloud.common.toolbarInsert'),
						type: 'item',
						iconClass: 'tlb-icons ico-rec-new',
						fn: $scope.createNewItem
					});
					tools.push(Object.assign({
						id: 'boqNewDivision',
						caption: $translate.instant('cloud.common.toolbarNewDivision'),
						type: 'item',
						iconClass: 'tlb-icons ico-fld-ins-below',
						fn: $scope.createNewDivision
					}, platformContextMenuItems.setContextGroupNew()));

					tools.push(
						Object.assign({
							id: 'boqNewSubdivision',
							caption: $translate.instant('cloud.common.toolbarNewSubdivision'),
							type: 'item',
							iconClass: 'tlb-icons ico-sub-fld-new',
							fn: $scope.createNewSubDivision
						}, platformContextMenuItems.setContextGroupNew()));

					tools.push({
						id: 'boqCut',
						caption: $translate.instant('cloud.common.toolbarCut'),
						type: 'item',
						iconClass: 'tlb-icons ico-cut',
						fn: $scope.cut,
						disabled: function () {
							return _.isEmpty(boqMainService.getSelected());
						}
					});
					if (isProcurementQuote) {
						tools.push({
							id: 'boqPasteFromClipboard',
							caption: $translate.instant('boq.main.pasteFromClipboard'),
							type: 'item',
							iconClass: 'tlb-icons ico-clipboard-paste',
							fn: $scope.pasteFromClipboard,
							disabled: function () {
								return _.isEmpty(boqMainService.getSelected());
							}
						});
					}
				}

				tools.push({
					id: 'boqCopy',
					caption: $translate.instant('cloud.common.toolbarCopy'),
					type: 'item',
					iconClass: 'tlb-icons ico-copy',
					fn: $scope.copy,
					disabled: function () {
						return _.isEmpty(boqMainService.getSelected());
					}
				});

				if (!readOnlyMode) {
					tools.push({
						id: 'boqPaste',
						caption: $translate.instant('cloud.common.toolbarPasteSelectedItem'),
						type: 'item',
						iconClass: 'tlb-icons ico-paste',
						fn: $scope.paste,
						disabled: function () {
							return _.isEmpty(boqMainService.getSelected());
						}
					});
				}

				tools.push({
					id: 'boqDocumentProperties',
					caption: $translate.instant('cloud.common.documentProperties'),
					type: 'item',
					iconClass: 'tlb-icons ico-settings-doc',
					fn: $scope.showDocumentProperties,
					disabled: false
				});

				if (!boqMainService.isCopySource) {
					tools.push({
						id: 'boqCopyOptions',
						caption: $translate.instant('boq.main.copyOptions'),
						type: 'item',
						iconClass: 'tlb-icons ico-copy-settings',
						fn: function () {
							return boqMainCopyOptionsProviderService.start(boqMainService);
						},
						disabled: function () {
							return boqMainCopyOptionsProviderService.isDisabled(boqMainService);
						}
					});
				}

				if ('Project' === boqMainService.getCallingContextType()) {
					tools.push({
						id: 'boqGoToEstimate',
						caption: $translate.instant('boq.main.goToEstimate'),
						type: 'item',
						iconClass: 'tlb-icons ico-goto',
						fn: function () {
							var postData = {
								ProjectId: boqMainService.getSelectedProjectId(),
								BoqHeaderId: boqMainService.getSelected().BoqHeaderFk,
								BoqItemId: boqMainService.getSelected().Id,
							};

							$http.post(globals.webApiBaseUrl + 'estimate/main/header/getfilteredlist', postData).then(function (response) {
								if(response.data.length > 1)
								{
									return boqMainGoToEstimateService.start();
								}
								else if(response.data.length === 1)
								{
									var selectedEstimateHeader = response.data[0];
									selectedEstimateHeader.ProjectId = boqMainService.getSelectedProjectId();
									var selectedBoqItem = boqMainService.getSelected();
									platformModuleNavigationService.navigate({moduleName: 'estimate.main-line-item-from-boq'}, selectedEstimateHeader, selectedBoqItem);
								}
								else
								{
									platformDialogService.showInfoBox('boq.main.noEstimateLineItemData');
								}
							});
						},
						disabled: false
					});
				}

				// CRB, OENORM and GAEB get different captions for the new tool buttons.
				var updateNewToolCaptions = function () {
					function setCaption(tooId, caption) {
						const tool = _.find($scope.tools.items, {'id': tooId});
						if (tool) {
							tool.caption = $translate.instant('cloud.common.' + caption);
						}
					}

					if (!$scope.tools || boqMainService.isCopySource) {
						return;
					}

					if (boqMainService.isOenBoq()) {
						boqMainOenService.updateNewToolCaptions($scope, boqMainService);
					} else if (!boqMainService.isCrbBoq()) {
						setCaption('boqNewByContext', 'toolbarNewByContext');
						setCaption('boqInsert', 'toolbarInsert');
						setCaption('boqNewDivision', 'toolbarNewDivision');
						setCaption('boqNewSubdivision', 'toolbarNewSubdivision');
					}
					// CRB code are implemented with additional features in 'boqMainCrbService.initCrbTools'

					$scope.tools.update();

				};
				boqMainService.registerForBoqChanged($scope, updateNewToolCaptions);
				boqMainService.registerSelectionChanged(updateNewToolCaptions);

				boqMainCrbService.initCrbTools($scope, boqMainService);

				platformGridControllerService.addTools(tools);

				// Make sure the 'boqCopy' button is removed and stays removed if neccessary
				if (readOnlyMode && $scope.tools && $scope.tools.items) {
					$scope.tools.items = _.filter($scope.tools.items, function (item) {
						return item && !['create', 'createChild', 'delete', 't14'].includes(item.id);
					});

					if (!_.isBoolean(showBoqCopyButton) || !showBoqCopyButton) {
						$scope.tools.items = _.filter($scope.tools.items, function (item) {
							return item && item.id !== 'boqCopy';
						});
					}
				}

				// The clipboard dropdown tool again is reactivated. But the paste function is disabled because of possible unexpected behaviour (missing validation).
				if ($scope.tools) {
					let clipboardTool199 = _.find($scope.tools.items, {id:'t199'});
					if (clipboardTool199) {
						let clipboardToolPaste = _.find(clipboardTool199.list.items, {id:'exportPaste'});
						clipboardToolPaste.tooltip  = $translate.instant('boq.main.pasteFromClipboardToBoqItemDisabled');
						clipboardToolPaste.disabled = true;
					}
				}

				initClipboardState();

				// Reload the structure for the currently loaded boq header if there is one
				boqMainService.reloadStructureForCurrentHeader();

				// Initial expansion of boq structure if boq is already loaded when creating the boq structure container
				onListLoaded();
			};

			return service;
		}]);
})();
