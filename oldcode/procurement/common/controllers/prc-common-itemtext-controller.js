(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name procurementCommonItemTextController
	 * @require $rootScope, $scope, $translate, $filter, platformGridControllerBase, messengerService, reqHeaderDataService, procurementCommonHeaderTextDataService, moduleMessenger, procurementCommonHeaderTextColumns, lookupDataService, slickGridEditors, procurementCommonHeaderTextValidationService
	 * @description controller for header text
	 */
	angular.module('procurement.common').controller('procurementCommonItemTextController',
		['$scope', '$sce', 'procurementContextService', 'platformGridControllerService', 'procurementCommonItemTextNewDataService',
			'procurementCommonItemTextValidationService', 'procurementCommonItemTextUIStandardService', 'procurementCommonPrcItemDataService', 'platformGridAPI',
			'procurementCommonHelperService', 'basicsCommonTextFormatConstant', 'basicsCommonTextEditorInsertTextService', 'basicsCommonVariableService',
			'platformToolbarService', '$translate', '_',
			'globals',
			'platformModalService',
			'$timeout',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, $sce, moduleContext, gridControllerService, dataServiceFactory, validationService, gridColumns, procurementCommonPrcItemDataService, platformGridAPI,
				procurementCommonHelperService, basicsCommonTextFormatConstant, basicsCommonTextEditorInsertTextService, basicsCommonVariableService,
				platformToolbarService, $translate, _,
				globals,
				platformModalService,
				$timeout) {

				var gridConfig = {initCalled: false, columns: []},
					dataService = dataServiceFactory.getService(moduleContext.getItemDataService()),
					parentService = moduleContext.getItemDataService();
				var textFormat = $scope.getContentValue('textFormat');
				let moduleOperate = $scope.getContentValue('moduleName');
				let arrowKeyCodes = [37, 38, 39, 40];

				var selectedChangedSetEntityID = function selectedChangedSetEntityID(e, item) {
					if (item && $scope.selectedEntityID !== item.Id) {
						platformGridAPI.rows.selection({
							gridId: $scope.gridId,
							rows: [item]
						});
						$scope.selectedEntityID = item.Id;
					}
				};
				dataService.registerSelectionChanged(selectedChangedSetEntityID);

				validationService = validationService(dataService);
				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				$scope.trustAsHtml = $sce.trustAsHtml;
				$scope.currentItem = dataService.getSelected();
				$scope.setContainerReadonlyOrEditable = setContainerReadonlyOrEditable;
				var toolbarItems = platformToolbarService.getTools($scope.getContainerUUID());

				setContainerReadonlyOrEditable();
				// update changes to currentItem
				var selectedChanged = function selectedChanged(e, item) {
					$scope.currentItem = item;

					if (!item || !item.Id) {
						$scope.currentItem = {ContentString: '', PlainText: ''};
					}
					setContainerReadonlyOrEditable();
					$scope.$root.safeApply();
					let prcItem = dataService.parentService().getSelected();
					if(prcItem) {
						let itemTypeFk = prcItem.BasItemTypeFk;
						updateToolByItemType(itemTypeFk);
						let itemList = dataService.getList();
						_.forEach(itemList, (item) => {
							dataService.readonlyFieldsByItemType(item, itemTypeFk);
						});
					}
				};

				$scope.languageObjectsArray = [];

				function updateTextModuleButton(e, args) {
					if (!args || !args.entity) {
						setContainerReadonlyOrEditable(null);
						return;
					}

					args.textModuleList = args.textModuleList || [];

					var entity = args.entity;
					var textModuleList = args.textModuleList;
					var index = _.findIndex(toolbarItems, {'id': 'selectLanguageItemDDLBtn'});
					if (toolbarItems !== null && toolbarItems !== undefined && index > -1) {
						toolbarItems.splice(index, 1);
					}
					if ($scope.languageObjectsArray) {
						$scope.languageObjectsArray.length = 0;
					}

					_.forEach(textModuleList, function (item) {
						var isData = _.find($scope.languageObjectsArray, {id: item.Id});
						if (isData === undefined || isData === null) {
							if ((item.TextFormatFk && item.TextFormatFk === textFormat && (item.TextFormatFk === entity.TextFormatFk || entity.TextFormatFk === basicsCommonTextFormatConstant.specificationNhtml)) ||
								(!item.TextFormatFk && (entity.TextFormatFk === textFormat || entity.TextFormatFk === basicsCommonTextFormatConstant.specificationNhtml) && ((textFormat === basicsCommonTextFormatConstant.specification && item.BasBlobsFk) ||
									(textFormat === basicsCommonTextFormatConstant.html && !item.BasBlobsFk && item.BasClobsFk)))) {
								$scope.languageObjectsArray.push({
									caption: item.DescriptionInfo.Translated,
									id: item.Id,
									type: 'item',
									fn: function () {
										dataService.setTextMoudleValue(item)
											.then(function (data) {
												data.entity = entity;
												updateContents(data);
											});
									}
								});
							}
						}
					});
					var tools =
						{
							id: 'selectLanguageItemDDLBtn',
							caption: $translate.instant('procurement.common.dropDownSelect'),
							type: 'dropdown-btn',
							iconClass: 'tlb-icons ico-view-ods',
							list: {
								showImages: false,
								cssClass: 'dropdown-menu-right',
								items: [{
									type: 'sublist',
									list: {
										items: $scope.languageObjectsArray
									}
								}]
							},
							disabled: function () {
								let prcItem = dataService.parentService().getSelected();
								if(prcItem) {
									if(prcItem.BasItemTypeFk === 7){
										return true;
									}
								}
								return !dataService.getSelected();
							}
						};
					toolbarItems.push(tools);
					updateTools();
					setContainerReadonlyOrEditable(entity);
				}


				dataService.updateToolsEvent.register(ItemTypeChange);


				function ItemTypeChange() {
					$scope.parentItem =[];
					var parentSelectedItem = dataService.parentService().getSelected();
					if(!_.isNil(parentSelectedItem)) {
						let itemTypeFk = parentSelectedItem.BasItemTypeFk;
						updateToolByItemType(itemTypeFk);
						let itemList = dataService.getList();
						_.forEach(itemList,(item)=>{
							dataService.readonlyFieldsByItemType(item,itemTypeFk,dataService.getItemName());
						});
						var textAreaElement = $('#ui-layout-east').find('.ql-editor');
						if(parentSelectedItem.BasItemTypeFk===7) {
							$scope.rt$readonly = true;
							angular.element(textAreaElement).prop('contentEditable', false);
						}
					}
				}

				function updateToolByItemType(itemTypeFk){
					var tools = $scope.tools;
					if(tools) {
						_.forEach($scope.tools.items, (item) => {
							if (item.id === 'create' || item.id === 'delete' || item.id==='selectLanguageItemDDLBtn') {
								if (itemTypeFk === 7) {
									item.disabled = true;
								} else {
									item.disabled = false;
								}
							}
						});
						$scope.tools.update();
					}
				}

				let replaceBtnPermission = {};
				let uuid = $scope.getContainerUUID();
				replaceBtnPermission[uuid] = 2;
				let replaceBtn = {
					id: 'replacementBtn',
					caption: $translate.instant('procurement.common.replaceDialog.replaceBtn'),
					type: 'item',
					iconClass: 'tlb-icons ico-replace',
					permission: replaceBtnPermission,
					disabled: function () {
						var parentSelectedItem = dataService.parentService().getSelected();
						if(parentSelectedItem) {
							if (parentSelectedItem.BasItemTypeFk === 7) {
								return true;
							}
						}
						let selected = dataService.getSelected();
						return !selected || (selected.TextFormatFk !== textFormat && selected.TextFormatFk !== basicsCommonTextFormatConstant.specificationNhtml);
					},
					fn: function () {
						let leadingService = moduleContext.getLeadingService();
						let leadingEntity = leadingService.getSelected();
						let sourceText = null;
						let templateUrl = null;
						if (textFormat === basicsCommonTextFormatConstant.specification) {
							sourceText = $scope.currentItem.ContentString;
							templateUrl = 'procurement.common/templates/prc-common-text-replacement-html-dialog.html';
						} else if (textFormat === basicsCommonTextFormatConstant.html) {
							sourceText = $scope.currentItem.PlainText;
							templateUrl = 'procurement.common/templates/prc-common-text-replacement-plain-text-dialog.html';
						} else {
							return;
						}
						let modalOptions = {
							templateUrl: globals.appBaseUrl + templateUrl,
							width: '1200px',
							resizeable: false,
							moduleName: moduleOperate,
							data: {
								queryItemId: (leadingEntity && leadingEntity.Id) || null,
								source: sourceText,
								textFormat: textFormat
							}
						};

						platformModalService.showDialog(modalOptions).then(function (result) {
							if (result && result.hasReplaced) {

								if (textFormat === basicsCommonTextFormatConstant.specification) {
									$scope.currentItem.ContentString = result.replaced;
									$scope.currentItem.keepOriginalContentString = false;
									dataService.markItemAsModified($scope.currentItem);
								} else if (textFormat === basicsCommonTextFormatConstant.html) {
									$scope.currentItem.PlainText = result.replaced;
									$scope.currentItem.keepOriginalPlainText = false;
									dataService.markItemAsModified($scope.currentItem);
								}
							}
						});
					}
				};
				toolbarItems.push(replaceBtn);
				updateTools();

				$scope.onChange = function onChange() {
					if ((textFormat === basicsCommonTextFormatConstant.specification && !$scope.textareaEditable) ||
						(textFormat === basicsCommonTextFormatConstant.html && $scope.rt$readonly) ||
						!$scope.currentItem) {
						return;
					}

					dataService.markCurrentItemAsModified();

					if (textFormat === basicsCommonTextFormatConstant.specification) {
						$scope.currentItem.keepOriginalContentString = false;
					} else if (textFormat === basicsCommonTextFormatConstant.html) {
						$scope.currentItem.keepOriginalPlainText = false;
					}
				};

				selectedChanged(null, $scope.currentItem);

				// inactive current editor, then the current row can be selected.
				$scope.commitEdit = function commitEdit() {
					if ($scope.textareaEditable) {
						platformGridAPI.grids.commitEdit($scope.gridId);
					}
				};

				dataService.registerSelectionChanged(selectedChanged);
				parentService.registerSelectionChanged(selectedChanged);

				// binding module readOnly handler
				var moduleReadOnlyStatusHandler = new procurementCommonHelperService.ModuleStatusHandler();
				moduleReadOnlyStatusHandler.bindGridReadOnlyListener($scope.gridId); // bind listener

				dataService.filterRegistered = false;
				dataService.registerFilters();
				dataService.textTypeChanged.register(updateTextModuleButton);
				dataService.getTextModulesByTextModuleType();
				$scope.$on('$destroy', function () {
					moduleReadOnlyStatusHandler.unbindGridReadOnlyListener($scope.gridId); // unbind listener
					dataService.unregisterSelectionChanged(selectedChanged);
					parentService.unregisterSelectionChanged(selectedChanged);
					dataService.unregisterSelectionChanged(selectedChangedSetEntityID);
				});

				var insertTextHandler = basicsCommonTextEditorInsertTextService.getHandler({
					textFormat: textFormat,
					elementName: textFormat === basicsCommonTextFormatConstant.specification ? 'textareaItemText' :
						(textFormat === basicsCommonTextFormatConstant.html ? 'itemTextArea' : ''),
					prefix: textFormat === basicsCommonTextFormatConstant.html ? '<<' : null,
					suffix: textFormat === basicsCommonTextFormatConstant.html ? '>>' : null,
					maxSearchLength: textFormat === basicsCommonTextFormatConstant.html ? 300 : null
				});

				var variableHandler = basicsCommonVariableService.getHandler({
					beforeGetting: beforeGettingVariableList,
					afterGetting: afterGettingVariableList
				});

				$scope.editoroptions = {
					variable: {
						current: null,
						visible: true,
						list: []
					},
					language: {
						visible: false,
						list: []
					}
				};

				if (textFormat === basicsCommonTextFormatConstant.html) {
					getVariableList()
						.then(function () {
							$scope.$broadcast('initHTMLEditorToolbar');
						}, function () {
						});

					$scope.onVariableChanged = onVariableChanged;
				} else {
					getVariableList();
				}

				if (textFormat === basicsCommonTextFormatConstant.html) {
					$scope.onKeyDown = onKeyDown;
					$scope.onKeyUp = onKeyUp;
					$scope.onMouseUp = onMouseUp;
				}

				function getVariableList() {
					return variableHandler.getByLanguageId()
						.then(function (list) {
							$scope.editoroptions.variable.list = list;
							$scope.$broadcast('variableListUpdated');
							return list;
						}, function () {
							return []; // TODO chi: right?
						});
				}

				function updateContents(data) {
					if (!insertTextHandler || !data || !data.entity) {
						return;
					}

					if (textFormat === basicsCommonTextFormatConstant.specification && $scope.textareaEditable && data.ContentString) {
						insertTextHandler.insertText(data.entity, data.ContentString);
						data.entity.keepOriginalContentString = false;
						dataService.markItemAsModified(data.entity);
					} else if (textFormat === basicsCommonTextFormatConstant.html && !$scope.rt$readonly && data.PlainText) {
						insertTextHandler.insertText(data.entity, data.PlainText);
						data.entity.keepOriginalPlainText = false;
						dataService.markItemAsModified(data.entity);
					}
				}

				function beforeGettingVariableList() {
					$scope.containerLoading = true;
				}

				function afterGettingVariableList() {
					$scope.containerLoading = false;
				}

				function onVariableChanged(variableId, itemOptions) {
					if (variableId > 0 && itemOptions && itemOptions.value) {
						var item = itemOptions.value;
						var entity = dataService.getSelected();
						if (entity && (entity.TextFormatFk === textFormat || entity.TextFormatFk === basicsCommonTextFormatConstant.specificationNhtml)) {
							insertTextHandler.insertText(entity, item.Code);
							dataService.markItemAsModified(entity);
							if (textFormat === basicsCommonTextFormatConstant.html) {
								entity.keepOriginalPlainText = false;
							} else if (textFormat === basicsCommonTextFormatConstant.specification) {
								entity.keepOriginalContentString = false;
							}
						}
					}
				}

				function setContainerReadonlyOrEditable(entity) {
					entity = entity || dataService.getSelected();
					var specification = basicsCommonTextFormatConstant.specification;
					var html = basicsCommonTextFormatConstant.html;
					var specNHtml = basicsCommonTextFormatConstant.specificationNhtml;
					$scope.textareaEditable = !!(entity && (entity.TextFormatFk === specification || entity.TextFormatFk === specNHtml) && textFormat === specification && !moduleContext.isReadOnly);
					$scope.rt$readonly = !(entity && (entity.TextFormatFk === html || entity.TextFormatFk === specNHtml) && textFormat === html && !moduleContext.isReadOnly);
					var parentSelectedItem = dataService.parentService().getSelected();
					if(!_.isNil(parentSelectedItem)) {
						if(parentSelectedItem.BasItemTypeFk===7) {
							$scope.rt$readonly = true;
							$scope.textareaEditable = false;
						}
					}
				}

				function updateTools() {
					$scope.setTools({
						showImages: true,
						showTitles: true,
						cssClass: 'tools',
						items: toolbarItems
					});
				}

				function onKeyDown(event) {
					if (event.keyCode === 46) {
						insertTextHandler.setDeleteRange('delete');
					} else if (event.keyCode === 8) {
						insertTextHandler.setDeleteRange('backspace');
					}
				}

				function onKeyUp(event) {
					$timeout(function () {
						if (arrowKeyCodes.indexOf(event.keyCode) > -1) {
							var keyArrow = null;
							if (event.keyCode === 37) {
								keyArrow = 'right';
							}
							else if (event.keyCode === 39) {
								keyArrow = 'left';
							}
							insertTextHandler.setRange(keyArrow);
						}
					});
				}

				function onMouseUp() {
					$timeout(function () {
						insertTextHandler.setRange(null);
					});
				}
			}]);
})(angular);