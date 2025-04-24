// / <reference path="../_references.js" />
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,$ */
	/**
	 * @ngdoc controller
	 * @name procurementCommonHeaderTextController
	 * @require $scope, $translate, $filter, platformGridControllerBase, messengerService, procurementCommonHeaderTextDataService, procurementCommonHeaderTextDataService, moduleMessenger, procurementCommonHeaderTextColumns, lookupDataService, slickGridEditors, procurementCommonHeaderTextValidationService
	 * @description controller for header text
	 */
	angular.module('procurement.common').controller('procurementCommonHeaderTextController',
		['$translate', '$http', '$scope', '$sce', '_', 'procurementContextService', 'platformGridControllerService', 'procurementCommonHeaderTextNewDataService',
			'procurementCommonHeaderTextValidationService', 'procurementCommonHeaderTextUIStandardService', 'platformGridAPI',
			'procurementCommonHelperService', '$timeout', 'basicsLookupdataLookupDescriptorService', 'platformToolbarService',
			'basicsCommonTextFormatConstant', 'basicsCommonTextEditorInsertTextService', 'basicsCommonVariableService', 'platformPermissionService',
			'globals',
			'platformModalService',
			'$timeout',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($translate, $http, $scope, $sce, _, moduleContext, gridControllerService, dataServiceFactory,
				validationService, gridColumns, platformGridAPI, procurementCommonHelperService, timeout, basicsLookupdataLookupDescriptorService, platformToolbarService,
				basicsCommonTextFormatConstant, basicsCommonTextEditorInsertTextService, basicsCommonVariableService, platformPermissionService,
				globals,
				platformModalService,
				$timeout) {

				var gridConfig = {initCalled: false, columns: []},
					dataService = dataServiceFactory.getService(moduleContext.getMainService());
				var textFormat = $scope.getContentValue('textFormat');
				let moduleOperate = $scope.getContentValue('moduleName');
				let arrowKeyCodes = [37, 38, 39, 40];

				validationService = validationService(dataService);
				gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

				$scope.trustAsHtml = $sce.trustAsHtml;
				$scope.currentItem = dataService.getSelected();
				// init $scope.textareaEditable and $scope.rt$readonly .
				setContainerReadonlyOrEditable();
				// update changes to currentItem
				var selectedChanged = function selectedChanged(e, item) {
					$scope.currentItem = item;
					if (!item || !item.Id) {
						$scope.currentItem =
							{
								ContentString: '',
								PlainText: ''
							};
					}

					setContainerReadonlyOrEditable(item);

					// refresh after header text selection changed.
					timeout(function () {
						$scope.$apply();
					}, 0);
				};
				selectedChanged(null, $scope.currentItem);

				$scope.onChange = function onChange() {

					if ((textFormat === basicsCommonTextFormatConstant.specification && !$scope.textareaEditable) ||
						(textFormat === basicsCommonTextFormatConstant.html && $scope.rt$readonly) ||
						!$scope.currentItem) {
						return;
					}
					dataService.markItemAsModified($scope.currentItem);

					if (textFormat === basicsCommonTextFormatConstant.specification) {
						$scope.currentItem.keepOriginalContentString = false;
					} else if (textFormat === basicsCommonTextFormatConstant.html) {
						$scope.currentItem.keepOriginalPlainText = false;
					}
				};
				// inactive current editor, then the current row can be selected.
				$scope.commitEdit = function commitEdit() {
					if ($scope.textareaEditable) {
						platformGridAPI.grids.commitEdit($scope.gridId);
					}
				};

				dataService.registerListLoaded(registerSelectionClear);

				function registerSelectionClear() {
					setContainerReadonlyOrEditable();
				}

				$scope.textEditorOptions = {
					options: {
						subtype: 'remark'
					},
					validationMethod: function (/* model, value */) {
					},
					actAsCellEditor: false
				};

				var toolbarItems = platformToolbarService.getTools($scope.getContainerUUID());

				function updateTools() {
					$scope.setTools({
						showImages: true,
						showTitles: true,
						cssClass: 'tools',
						items: toolbarItems
					});
				}

				$scope.languageObjectsArray = [];

				function updateTextModuleButton(e, args) {
					if (!args || !args.entity) {
						setContainerReadonlyOrEditable(null);
						return;
					}

					args.textModuleList = args.textModuleList || [];

					var entity = args.entity;
					var textModuleList = args.textModuleList;
					var index = _.findIndex(toolbarItems, {'id': 'selectLanguageDDLBtn'});
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
									(textFormat === basicsCommonTextFormatConstant.html && !item.BasBlobsFk && item.BasClobsFk)))||(entity.IsProject&&item.TextFormatFk === textFormat)) {
								$scope.languageObjectsArray.push({
									caption: item.DescriptionInfo.Translated,
									id: item.Id,
									type: 'item',
									fn: function () {
										dataService.setTextMoudleValue(item.Id)
											.then(function (data) {
												updateContents(data);
											});
									}
								});
							}
						}
					});
					var tools =
						{
							id: 'selectLanguageDDLBtn',
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
								let selected = dataService.getSelected();
								return !selected || !dataService.getParentStatus();
							}
						};
					toolbarItems.push(tools);
					updateTools();
					setContainerReadonlyOrEditable(entity);
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
						let selected = dataService.getSelected();
						return !selected || (selected.TextFormatFk !== textFormat && selected.TextFormatFk !== basicsCommonTextFormatConstant.specificationNhtml) || !dataService.getParentStatus();
					},
					fn: function () {
						let sourceText = null;
						let templateUrl = null;
						let queryItemId = null;

						if (moduleOperate === 'procurement.rfq.requisition') {
							let mainService = moduleContext.getMainService();
							let mainEntity = mainService.getSelected(); // main entity = rfq requisition entity
							queryItemId = (mainEntity && mainEntity.ReqHeaderFk) || null;
						} else {
							let leadingService = moduleContext.getLeadingService();
							let leadingEntity = leadingService.getSelected();
							queryItemId = (leadingEntity && leadingEntity.Id) || null;
						}

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
								queryItemId: queryItemId,
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

				if(moduleContext.getModuleName() === 'procurement.rfq'){
					//remove create delete button
					var removeItems = ['create', 'delete'];
					$scope.tools.items = _.filter($scope.tools.items, function (item) {
						return item && removeItems.indexOf(item.id) === -1;
					});
				}

				dataService.registerSelectionChanged(selectedChanged);
				dataService.prcHeaderTextTypeChange.register(updateTextModuleButton);
				var editorClass = '.cid_' + $scope.gridId + ' .wysiwyg-editor';
				$(editorClass).click($scope.commitEdit);

				// binding module readOnly handler
				var moduleReadOnlyStatusHandler = new procurementCommonHelperService.ModuleStatusHandler();
				moduleReadOnlyStatusHandler.bindGridReadOnlyListener($scope.gridId); // bind listener
				dataService.filterRegistered = false;
				dataService.registerFilters();
				dataService.getTextModulesByTextModuleType();

				$scope.$on('$destroy', function () {
					moduleReadOnlyStatusHandler.unbindGridReadOnlyListener($scope.gridId); // unbind listener
					dataService.unregisterSelectionChanged(selectedChanged);
					dataService.prcHeaderTextTypeChange.unregister(updateTextModuleButton);
					dataService.unregisterListLoaded(registerSelectionClear);
				});

				var insertTextHandler = basicsCommonTextEditorInsertTextService.getHandler({
					textFormat: textFormat,
					elementName: textFormat === basicsCommonTextFormatConstant.specification ? 'textareaHeaderText' :
						(textFormat === basicsCommonTextFormatConstant.html ? 'headerTextArea' : ''),
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
					// whether readonly
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
					var status = dataService.getParentStatus();
					var specification = basicsCommonTextFormatConstant.specification;
					var html = basicsCommonTextFormatConstant.html;
					var specNHtml = basicsCommonTextFormatConstant.specificationNhtml;
					let hasWritePermission = platformPermissionService.hasWrite($scope.getContainerUUID());
					$scope.textareaEditable = !!(entity && status && (entity.TextFormatFk === specification || entity.TextFormatFk === specNHtml) && textFormat === specification&& !moduleContext.isReadOnly&&hasWritePermission);
					$scope.rt$readonly = !(entity && status && (entity.TextFormatFk === html || entity.TextFormatFk === specNHtml) && textFormat === html && !moduleContext.isReadOnly&&hasWritePermission);
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
			}
		]);
})(angular);
