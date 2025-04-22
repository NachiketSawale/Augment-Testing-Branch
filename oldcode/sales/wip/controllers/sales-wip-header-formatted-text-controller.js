/**
 * $Id: $
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';


	var moduleName = 'sales.wip';

	angular.module(moduleName).controller('salesWipHeaderFormattedTextController',
		['globals', '$scope', '_', '$injector', '$translate', 'salesCommonHeaderTextControllerService', 'salesWipHeaderFormattedTextDataService', 'platformGridControllerService', 'salesWipHeaderFormattedTextValidationService', 'salesWipHeaderTextUIStandardService', '$sce', 'platformGridAPI', 'basicsCommonTextFormatConstant', 'salesWipService', 'platformToolbarService', '$timeout', 'procurementContextService',
			function (globals, $scope, _, $injector, $translate, salesCommonHeaderTextControllerService, salesWipHeaderFormattedTextDataService, gridControllerService, validationService, gridColumns, $sce, platformGridAPI, basicsCommonTextFormatConstant, salesWipService, platformToolbarService, timeout, procurementContextService) {

				var gridConfig = { initCalled: false, columns: [] };
				gridControllerService.initListController($scope, gridColumns, salesWipHeaderFormattedTextDataService, validationService, gridConfig);

				salesCommonHeaderTextControllerService.initFormattedTextController($scope, salesWipHeaderFormattedTextDataService);

				$scope.trustAsHtml = $sce.trustAsHtml;
				$scope.currentItem = salesWipHeaderFormattedTextDataService.getSelected();
				var textFormat = $scope.getContentValue('textFormat');

				$scope.onTextChanged = function onTextChanged() {
					salesWipHeaderFormattedTextDataService.onTextChanged();
				};

				// inactive current editor, then the current row can be selected.
				$scope.commitEdit = function commitEdit() {
					platformGridAPI.grids.commitEdit($scope.gridId);
				};

				$scope.textEditorOptions = {
					options: {
						subtype: 'remark'
					},
					validationMethod: function (/* model, value */) {
					},
					actAsCellEditor: false
				};

				// update changes to currentItem
				var selectedChanged = function selectedChanged(e, item) {
					$scope.currentItem = item && item.Id ? item : { ContentString: '', PlainText: '' };
					$scope.rt$readonly = !item;

					// refresh after header text selection changed.
					timeout(function () {
						$scope.$apply();
					}, 0);
				};

				$scope.onChange = function onChange() {

					if ((textFormat === basicsCommonTextFormatConstant.specification && !$scope.textareaEditable) ||
						(textFormat === basicsCommonTextFormatConstant.html && $scope.rt$readonly) ||
						!$scope.currentItem) {
						return;
					}

					salesWipHeaderFormattedTextDataService.markItemAsModified($scope.currentItem);

					if (textFormat === basicsCommonTextFormatConstant.specification) {
						$scope.currentItem.keepOriginalContentString = false;
						$scope.currentItem.keepOriginalPlainText = false;
					} else if (textFormat === basicsCommonTextFormatConstant.html) {
						$scope.currentItem.keepOriginalPlainText = false;
					}

					// toggle create button
					salesWipHeaderFormattedTextDataService.toggleCreateButton(true);
				};

				var salesHeaderChanged = function salesHeaderChanged(e, item) {
					if (item && (!item.ConfigurationFk || item.ConfigurationFk <= 0)) {
						salesWipHeaderFormattedTextDataService.toggleCreateButton(false);
					} else {
						salesWipHeaderFormattedTextDataService.toggleCreateButton(true);
					}
				};

				selectedChanged(null, $scope.currentItem);

				// Add Text button
				var toolbarItems = platformToolbarService.getTools($scope.getContainerUUID());

				function updateTools() {
					$scope.addTools(toolbarItems);
					$scope.tools.update();
				}

				$scope.languageObjectsArray = [];

				function updateTextModuleButton(e, args) {
					if (!args || !args.entity) {
						return;
					}

					var entity = args.entity;
					// Format fk 1 to choose option of header formatted text option only (Used for select text button only)
					entity.TextFormatFk = 1;
					var textModuleList = args.textModuleList;
					args.textModuleList = args.textModuleList || [];

					var index = _.findIndex(toolbarItems, { 'id': 'selectLanguageDDLBtn' });
					if (toolbarItems !== null && toolbarItems !== undefined && index > -1) {
						toolbarItems.splice(index, 1);
					}
					if ($scope.languageObjectsArray) {
						$scope.languageObjectsArray.length = 0;
					}

					_.forEach(textModuleList, function (item) {
						var isData = _.find($scope.languageObjectsArray, { id: item.Id });
						if (isData === undefined || isData === null) {
							if ((item.TextFormatFk && item.TextFormatFk === textFormat && (item.TextFormatFk === entity.TextFormatFk || entity.TextFormatFk === basicsCommonTextFormatConstant.specificationNhtml)) ||
								(!item.TextFormatFk && (entity.TextFormatFk === textFormat || entity.TextFormatFk === basicsCommonTextFormatConstant.specificationNhtml) && ((textFormat === basicsCommonTextFormatConstant.specification && item.BasBlobsFk) ||
									(textFormat === basicsCommonTextFormatConstant.html && !item.BasBlobsFk && item.BasClobsFk))) || (entity.IsProject && item.TextFormatFk === textFormat)) {
								$scope.languageObjectsArray.push({
									caption: item.DescriptionInfo.Translated,
									id: item.Id,
									type: 'item',
									fn: function () {
										salesWipHeaderFormattedTextDataService.setTextMoudleValue(item.Id)
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
							let selected = salesWipHeaderFormattedTextDataService.getSelected();
							return !selected;
						}
					};
					toolbarItems.push(tools);
					updateTools();
				}

				let replaceBtnPermission = {};
				let uuid = '7001204d7fb04cf48d8771c8971cc1e5';
				let moduleOperate = $scope.getContentValue('moduleName');
				replaceBtnPermission[uuid] = 2;
				let replaceBtn = {
					id: 'replacementBtn',
					caption: $translate.instant('procurement.common.replaceDialog.replaceBtn'),
					type: 'item',
					iconClass: 'tlb-icons ico-replace',
					permission: replaceBtnPermission,
					disabled: function () {
						let selected = salesWipHeaderFormattedTextDataService.getSelected();
						return !selected;
					},
					fn: function () {
						let sourceText = null;
						let templateUrl = null;
						let queryItemId = null;

						if (moduleOperate === 'procurement.rfq.requisition') {
							let mainService = procurementContextService.getMainService();
							let mainEntity = mainService.getSelected();
							queryItemId = (mainEntity && mainEntity.ReqHeaderFk) || null;
						} else {
							let leadingService = $injector.get('salesWipService');
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
							moduleName: 'sales.wip',
							data: {
								queryItemId: queryItemId,
								source: sourceText,
								textFormat: textFormat
							}
						};

						$injector.get('platformModalService').showDialog(modalOptions).then(function (result) {
							if (result && result.hasReplaced) {

								if (textFormat === basicsCommonTextFormatConstant.specification) {
									$scope.currentItem.ContentString = result.replaced;
									$scope.currentItem.keepOriginalContentString = false;
									salesWipHeaderFormattedTextDataService.markItemAsModified($scope.currentItem);
								} else if (textFormat === basicsCommonTextFormatConstant.html) {
									$scope.currentItem.PlainText = result.replaced;
									$scope.currentItem.keepOriginalPlainText = false;
									salesWipHeaderFormattedTextDataService.markItemAsModified($scope.currentItem);
								}
							}
						});
					}
				};
				toolbarItems.push(replaceBtn);
				updateTools();
				// end text button


				salesWipHeaderFormattedTextDataService.registerSelectionChanged(selectedChanged);
				salesWipHeaderFormattedTextDataService.salesHeaderTextTypeChange.register(updateTextModuleButton);
				salesWipService.registerSelectionChanged(salesHeaderChanged);

				$scope.$on('$destroy', function () {
					salesWipHeaderFormattedTextDataService.unregisterSelectionChanged(selectedChanged);
					salesWipHeaderFormattedTextDataService.salesHeaderTextTypeChange.unregister(updateTextModuleButton);
					salesWipService.unregisterSelectionChanged(salesHeaderChanged);
				});

				var insertTextHandler = $injector.get('basicsCommonTextEditorInsertTextService').getHandler({
					textFormat: textFormat,
					elementName: textFormat === basicsCommonTextFormatConstant.specification ? 'textareaHeaderText' :
						(textFormat === basicsCommonTextFormatConstant.html ? 'headerTextArea' : '')
				});

				function updateContents(data) {
					if (!insertTextHandler || !data || !data.entity) {
						return;
					}
					// whether readonly
					if (textFormat === basicsCommonTextFormatConstant.specification && $scope.textareaEditable && data.ContentString) {
						insertTextHandler.insertText(data.entity, data.ContentString);
						data.entity.keepOriginalContentString = false;
						data.entity.keepOriginalPlainText = false;
						salesWipHeaderFormattedTextDataService.markItemAsModified(data.entity);
					} else if (textFormat === basicsCommonTextFormatConstant.html && !$scope.rt$readonly && data.PlainText) {
						insertTextHandler.insertText(data.entity, data.PlainText);
						data.entity.keepOriginalPlainText = false;
						salesWipHeaderFormattedTextDataService.markItemAsModified(data.entity);
					}
				}
			}
		]);
})();
