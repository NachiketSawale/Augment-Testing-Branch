/**
 * Created by shen on 10/21/2022
 */

(function () {
	'use strict';
	let moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectHeaderTextController
	 * @description provides validation methods for project header text entities
	 */
	angular.module(moduleName).controller('projectHeaderTextController',
		['_', '$scope', 'projectCommonHeaderTextControllerService', 'projectHeaderTextDataService', 'platformGridControllerService', 'projectHeaderTextValidationService',
			'projectMainHeaderTextUiStandardService', '$sce', 'platformGridAPI', 'basicsCommonTextFormatConstant', 'projectMainService', 'platformToolbarService', 'basicsCommonTextEditorInsertTextService', '$translate', 'basicsCommonVariableService',
			function (_, $scope, projectCommonHeaderTextControllerService, projectHeaderTextDataService, gridControllerService, validationService, gridColumns, $sce,
				platformGridAPI, basicsCommonTextFormatConstant, projectMainService, platformToolbarService, basicsCommonTextEditorInsertTextService, $translate, basicsCommonVariableService) {

				let gridConfig = {initCalled: false, columns: []};
				gridControllerService.initListController($scope, gridColumns, projectHeaderTextDataService, validationService, gridConfig);

				projectCommonHeaderTextControllerService.initFormattedTextController($scope, projectHeaderTextDataService);

				$scope.trustAsHtml = $sce.trustAsHtml;
				$scope.currentItem = projectHeaderTextDataService.getSelected();
				let textFormat = $scope.getContentValue('textFormat');

				$scope.onTextChanged = function onTextChanged() {
					projectHeaderTextDataService.onTextChanged();
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
				let selectedChanged = function selectedChanged(e, item) {
					$scope.currentItem = item && item.Id ? item : {ContentString: '', PlainText: ''};
					$scope.rt$readonly = !item;
				};

				$scope.onChange = function onChange() {

					if ((textFormat === basicsCommonTextFormatConstant.specification && !$scope.textareaEditable) ||
						(textFormat === basicsCommonTextFormatConstant.html && $scope.rt$readonly) ||
						!$scope.currentItem) {
						return;
					}
					projectHeaderTextDataService.markItemAsModified($scope.currentItem);

					if (textFormat === basicsCommonTextFormatConstant.specification) {
						$scope.currentItem.keepOriginalContentString = false;
					} else if (textFormat === basicsCommonTextFormatConstant.html) {
						$scope.currentItem.keepOriginalPlainText = false;
					}
				};

				let toolbarItems = platformToolbarService.getTools($scope.getContainerUUID());
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
					console.log({e,args});

					args.textModuleList = args.textModuleList || [];

					let entity = args.entity;
					let textModuleList = args.textModuleList;
					let index = _.findIndex(toolbarItems, {'id': 'selectLanguageDDLBtn'});
					if (toolbarItems !== null && toolbarItems !== undefined && index > -1) {
						toolbarItems.splice(index, 1);
					}

					if ($scope.languageObjectsArray) {
						$scope.languageObjectsArray.length = 0;
					}

					_.forEach(textModuleList, function (item) {
						let isData = _.find($scope.languageObjectsArray, {id: item.Id});
						if (isData === undefined || isData === null) {
							if ((item.TextFormatFk && item.TextFormatFk === textFormat && (item.TextFormatFk === entity.TextFormatFk || entity.TextFormatFk === basicsCommonTextFormatConstant.specificationNhtml)) ||
								(!item.TextFormatFk && (entity.TextFormatFk === textFormat || entity.TextFormatFk === basicsCommonTextFormatConstant.specificationNhtml) && ((textFormat === basicsCommonTextFormatConstant.specification && item.BasBlobsFk) ||
									(textFormat === basicsCommonTextFormatConstant.html && !item.BasBlobsFk && item.BasClobsFk)))) {
								$scope.languageObjectsArray.push({
									caption: item.DescriptionInfo.Description,
									id: item.Id,
									type: 'item',
									fn: function () {
										projectHeaderTextDataService.setTextMoudleValue(item.Id)
											.then(function (data) {
												updateContents(data);
											});
									}
								});
							}
						}
					});

					let tools =
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
								let selected = projectHeaderTextDataService.getSelected();
								return !selected;
							}
						};
					toolbarItems.push(tools);
					updateTools();
				}

				updateTools();

				projectHeaderTextDataService.registerSelectionChanged(selectedChanged);
				projectHeaderTextDataService.prjHeaderTextTypeChange.register(updateTextModuleButton);
				let editorClass = '.cid_' + $scope.gridId + ' .wysiwyg-editor';
				$(editorClass).click($scope.commitEdit);


				$scope.$on('$destroy', function () {
					projectHeaderTextDataService.unregisterSelectionChanged(selectedChanged);
					projectHeaderTextDataService.prjHeaderTextTypeChange.unregister(updateTextModuleButton);
				});
				let letiableHandler = basicsCommonVariableService.getHandler({
					beforeGetting: beforeGettingVariableList,
					afterGetting: afterGettingVariableList
				});
				projectHeaderTextDataService.prjHeaderTextTypeChange.fire(null, {});

				let insertTextHandler = basicsCommonTextEditorInsertTextService.getHandler({
					textFormat: textFormat,
					elementName: textFormat === basicsCommonTextFormatConstant.specification ? 'textareaHeaderText' :
						(textFormat === basicsCommonTextFormatConstant.html ? 'headerTextArea' : '')
				});



				$scope.editoroptions = {
					letiable: {
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

				function getVariableList() {
					return letiableHandler.getByLanguageId()
						.then(function (list) {
							$scope.editoroptions.letiable.list = list;
							$scope.$broadcast('letiableListUpdated');
							return list;
						}, function () {
							return []; // TODO chi: right?
						});
				}

				function beforeGettingVariableList() {
					$scope.containerLoading = true;
				}

				function afterGettingVariableList() {
					$scope.containerLoading = false;
				}

				function updateContents(data) {
					if (!insertTextHandler || !data || !data.entity) {
						return;
					}
					// whether readonly
					if (textFormat === basicsCommonTextFormatConstant.specification && $scope.textareaEditable && data.ContentString) {
						insertTextHandler.insertText(data.entity, data.ContentString);
						data.entity.keepOriginalContentString = false;
						projectHeaderTextDataService.markItemAsModified(data.entity);
					} else if (textFormat === basicsCommonTextFormatConstant.html && !$scope.rt$readonly && data.PlainText) {
						insertTextHandler.insertText(data.entity, data.PlainText);
						data.entity.keepOriginalPlainText = false;
						projectHeaderTextDataService.markItemAsModified(data.entity);
					}
				}

				function onVariableChanged(letiableId, itemOptions) {
					if (letiableId > 0 && itemOptions && itemOptions.value) {
						let item = itemOptions.value;
						let entity = projectHeaderTextDataService.getSelected();
						if (entity && (entity.TextFormatFk === textFormat || entity.TextFormatFk === basicsCommonTextFormatConstant.specificationNhtml)) {
							insertTextHandler.insertText(entity, item.Code);
							projectHeaderTextDataService.markItemAsModified(entity);
							if (textFormat === basicsCommonTextFormatConstant.html) {
								entity.keepOriginalPlainText = false;
							} else if (textFormat === basicsCommonTextFormatConstant.specification) {
								entity.keepOriginalContentString = false;
							}
						}
					}
				}
				let projectHeaderChanged = function projectHeaderChanged(e, item) {
					projectHeaderTextDataService.toggleCreateButton(true);
				};

				selectedChanged(null, $scope.currentItem);

				projectHeaderTextDataService.registerSelectionChanged(selectedChanged);
				projectMainService.registerSelectionChanged(projectHeaderChanged);

				$scope.$on('$destroy', function () {
					projectHeaderTextDataService.unregisterSelectionChanged(selectedChanged);
					projectMainService.unregisterSelectionChanged(projectHeaderChanged);
				});
			}
		]);
})();
