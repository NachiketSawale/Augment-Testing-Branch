/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';


	var moduleName = 'sales.contract';

	angular.module(moduleName).controller('salesContractHeaderFormattedTextController',
		['globals', '$scope', '_', '$translate', '$injector', 'salesCommonHeaderTextControllerService', 'salesContractHeaderFormattedTextDataService', 'platformGridControllerService', 'salesContractHeaderFormattedTextValidationService', 'salesContractHeaderTextUIStandardService', '$sce', 'platformGridAPI', 'basicsCommonTextFormatConstant', 'salesContractService', 'procurementContextService', 'platformToolbarService',
			'salesCommonHeaderTextValidationService',
			function (globals, $scope, _, $translate, $injector, salesCommonHeaderTextControllerService, salesContractHeaderFormattedTextDataService, gridControllerService, validationService, gridColumns, $sce, platformGridAPI, basicsCommonTextFormatConstant, salesContractService, procurementContextService, platformToolbarService,
			          salesCommonHeaderTextValidationService) {

				var gridConfig = {initCalled: false, columns: []};
				gridControllerService.initListController($scope, gridColumns, salesContractHeaderFormattedTextDataService, validationService, gridConfig);

				salesCommonHeaderTextControllerService.initFormattedTextController($scope, salesContractHeaderFormattedTextDataService);

				$scope.trustAsHtml = $sce.trustAsHtml;
				$scope.currentItem = salesContractHeaderFormattedTextDataService.getSelected();
				var textFormat = $scope.getContentValue('textFormat');

				$scope.onTextChanged = function onTextChanged() {
					salesContractHeaderFormattedTextDataService.onTextChanged();
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
					$scope.currentItem = item && item.Id ? item : {ContentString: '', PlainText: ''};
					$scope.rt$readonly = !item;
				};

				$scope.onChange = function onChange() {

					if ((textFormat === basicsCommonTextFormatConstant.specification && !$scope.textareaEditable) ||
						(textFormat === basicsCommonTextFormatConstant.html && $scope.rt$readonly) ||
						!$scope.currentItem) {
						return;
					}

					salesContractHeaderFormattedTextDataService.markItemAsModified($scope.currentItem);

					if (textFormat === basicsCommonTextFormatConstant.specification) {
						$scope.currentItem.keepOriginalContentString = false;
						$scope.currentItem.keepOriginalPlainText = false;
					} else if (textFormat === basicsCommonTextFormatConstant.html) {
						$scope.currentItem.keepOriginalPlainText = false;
					}

					// toggle create button
					salesContractHeaderFormattedTextDataService.toggleCreateButton(true);
				};

				var salesHeaderChanged = function salesHeaderChanged(e, item) {
					if (!item.ConfigurationFk || item.ConfigurationFk <= 0) {
						salesContractHeaderFormattedTextDataService.toggleCreateButton(false);
					} else {
						salesContractHeaderFormattedTextDataService.toggleCreateButton(true);
					}
				};

				selectedChanged(null, $scope.currentItem);

				function basTextModuleTypeChanged(entity, newValue){
					validationService.validateBasTextModuleTypeFk(entity, newValue,'BasTextModuleTypeFk');
				}
				salesCommonHeaderTextValidationService.onPrcTextTypeChanged.register(basTextModuleTypeChanged);

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
										salesContractHeaderFormattedTextDataService.setTextMoudleValue(item.Id)
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
							let selected = salesContractHeaderFormattedTextDataService.getSelected();
							return !selected;
						}
					};
					toolbarItems.push(tools);
					updateTools();
				}

				let replaceBtnPermission = {};
				let uuid = '34d0a7ece4f34f2091f7ba6c622ff04d';
				let moduleOperate = $scope.getContentValue('moduleName');
				replaceBtnPermission[uuid] = 2;
				let replaceBtn = {
					id: 'replacementBtn',
					caption: $translate.instant('procurement.common.replaceDialog.replaceBtn'),
					type: 'item',
					iconClass: 'tlb-icons ico-replace',
					permission: replaceBtnPermission,
					disabled: function () {
						let selected = salesContractHeaderFormattedTextDataService.getSelected();
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
							let leadingService = $injector.get('salesContractService');
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
							moduleName: 'sales.contract',
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
									salesContractHeaderFormattedTextDataService.markItemAsModified($scope.currentItem);
								} else if (textFormat === basicsCommonTextFormatConstant.html) {
									$scope.currentItem.PlainText = result.replaced;
									$scope.currentItem.keepOriginalPlainText = false;
									salesContractHeaderFormattedTextDataService.markItemAsModified($scope.currentItem);
								}
							}
						});
					}
				};
				toolbarItems.push(replaceBtn);
				updateTools();
				// end text button

				salesContractHeaderFormattedTextDataService.registerSelectionChanged(selectedChanged);
				salesContractHeaderFormattedTextDataService.salesHeaderTextTypeChange.register(updateTextModuleButton);
				salesContractService.registerSelectionChanged(salesHeaderChanged);

				$scope.$on('$destroy', function () {
					salesContractHeaderFormattedTextDataService.unregisterSelectionChanged(selectedChanged);
					salesContractHeaderFormattedTextDataService.salesHeaderTextTypeChange.unregister(updateTextModuleButton);
					salesContractService.unregisterSelectionChanged(salesHeaderChanged);
					salesCommonHeaderTextValidationService.onPrcTextTypeChanged.unregister(basTextModuleTypeChanged);
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
						salesContractHeaderFormattedTextDataService.markItemAsModified(data.entity);
					} else if (textFormat === basicsCommonTextFormatConstant.html && !$scope.rt$readonly && data.PlainText) {
						insertTextHandler.insertText(data.entity, data.PlainText);
						data.entity.keepOriginalPlainText = false;
						salesContractHeaderFormattedTextDataService.markItemAsModified(data.entity);
					}
				}
			}
		]);
})();
