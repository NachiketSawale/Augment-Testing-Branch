/**
 * $Id: sales-wip-header-text-controller.js
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';


	/**
	 * @ngdoc controller
	 * @name sales.wip.salesWipHeaderTextController
	 * @description controller for header text
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('sales.wip').controller('salesWipHeaderTextController',
		['globals', '$scope', '_', '$translate', '$injector', 'salesCommonHeaderTextControllerService', 'salesWipHeaderTextDataService', 'platformGridControllerService', 'salesWipHeaderTextValidationService', 'salesWipHeaderTextUIStandardService', '$sce', 'platformGridAPI', 'basicsCommonTextFormatConstant', 'salesWipService', 'platformToolbarService', 'procurementContextService',
			function (globals, $scope, _, $translate, $injector, salesCommonHeaderTextControllerService, salesWipHeaderTextDataService, gridControllerService, validationService, gridColumns, $sce, platformGridAPI, basicsCommonTextFormatConstant, salesWipService, platformToolbarService, procurementContextService) {

				var gridConfig = { initCalled: false, columns: [] };
				var textFormat = $scope.getContentValue('textFormat');

				gridControllerService.initListController($scope, gridColumns, salesWipHeaderTextDataService, validationService, gridConfig);

				salesCommonHeaderTextControllerService.initPlainTextController($scope, salesWipHeaderTextDataService);

				$scope.trustAsHtml = $sce.trustAsHtml;
				$scope.currentItem = salesWipHeaderTextDataService.getSelected();

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

				$scope.onChange = function onChange() {

					if ((textFormat === basicsCommonTextFormatConstant.specification && !$scope.textareaEditable) ||
						(textFormat === basicsCommonTextFormatConstant.html && $scope.rt$readonly) ||
						!$scope.currentItem) {
						return;
					}

					salesWipHeaderTextDataService.markItemAsModified($scope.currentItem);

					if (textFormat === basicsCommonTextFormatConstant.specification) {
						$scope.currentItem.keepOriginalContentString = false;
					} else if (textFormat === basicsCommonTextFormatConstant.html) {
						$scope.currentItem.keepOriginalPlainText = false;
						$scope.currentItem.keepOriginalContentString = false;
					}

					// toggle create button
					salesWipHeaderTextDataService.toggleCreateButton(true);
				};

				// update changes to currentItem
				var selectedChanged = function selectedChanged(e, item) {
					$scope.currentItem = item && item.Id ? item : { ContentString: '', PlainText: '' };
					$scope.rt$readonly = !item;
				};

				var salesHeaderChanged = function salesHeaderChanged(e, item) {
					if (item && (!item.ConfigurationFk || item.ConfigurationFk <= 0)) {
						salesWipHeaderTextDataService.toggleCreateButton(false);
					} else {
						salesWipHeaderTextDataService.toggleCreateButton(true);
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
					// Format fk 2 to choose option of header text option only (Used for select text button only)
					entity.TextFormatFk = 2;
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
								// if (entity.TextFormatFk === 2) {
								$scope.languageObjectsArray.push({
									caption: item.DescriptionInfo.Translated,
									id: item.Id,
									type: 'item',
									fn: function () {
										salesWipHeaderTextDataService.setTextMoudleValue(item.Id)
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
							let selected = salesWipHeaderTextDataService.getSelected();
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
						let selected = salesWipHeaderTextDataService.getSelected();
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
									salesWipHeaderTextDataService.markItemAsModified($scope.currentItem);
								} else if (textFormat === basicsCommonTextFormatConstant.html) {
									$scope.currentItem.PlainText = result.replaced;
									$scope.currentItem.keepOriginalPlainText = false;
									salesWipHeaderTextDataService.markItemAsModified($scope.currentItem);
								}
							}
						});
					}
				};
				toolbarItems.push(replaceBtn);
				updateTools();
				// end text button

				salesWipHeaderTextDataService.registerSelectionChanged(selectedChanged);
				salesWipHeaderTextDataService.salesHeaderTextTypeChange.register(updateTextModuleButton);
				salesWipService.registerSelectionChanged(salesHeaderChanged);

				$scope.$on('$destroy', function () {
					salesWipHeaderTextDataService.unregisterSelectionChanged(selectedChanged);
					salesWipHeaderTextDataService.salesHeaderTextTypeChange.unregister(updateTextModuleButton);
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
						salesWipHeaderTextDataService.markItemAsModified(data.entity);
					} else if (textFormat === basicsCommonTextFormatConstant.html && !$scope.rt$readonly && data.PlainText) {
						insertTextHandler.insertText(data.entity, data.PlainText);
						data.entity.keepOriginalPlainText = false;
						data.entity.keepOriginalContentString = false;
						salesWipHeaderTextDataService.markItemAsModified(data.entity);
					}
				}
			}
		]);
})();
