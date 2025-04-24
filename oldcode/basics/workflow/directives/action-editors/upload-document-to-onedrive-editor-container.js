/**
 * Created by chd on 12.30.2021.
 */

(function (angular) {
	/* global globals, _ */
	'use strict';

	function basicsWorkflowUploadDoc2OneDriveEditorDirective(basicsWorkflowActionEditorService, platformGridAPI, basicsWorkflowEditModes,
		platformCreateUuid, $translate, basicsWorkflowGlobalContextUtil) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/upload-document-to-onedrive-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						let action = {};

						//accordion
						scope.inputOpen = true;
						scope.outputOpen = true;

						scope.model = {};
						scope.input = {};
						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);
						scope.output = {};

						// access right radio-buttons
						scope.input.accessRightRadioGroupOpt = {
							displayMember: 'description',
							valueMember: 'value',
							cssMember: 'cssClass',
							items: [
								{
									value: 1,
									description: $translate.instant('basics.workflow.action.customEditor.oneDrive.anyoneLink'),
									cssClass: 'spaceToUp'
								},
								{
									value: 2,
									description: $translate.instant('basics.workflow.action.customEditor.oneDrive.organizationLink'),
									cssClass: 'spaceToUp'
								},
								{
									value: 3,
									description: $translate.instant('basics.workflow.action.customEditor.oneDrive.specificPeople'),
									cssClass: 'spaceToUp'
								}
							]
						};

						// Mode radio-buttons
						scope.input.editorMode = basicsWorkflowEditModes.default;
						scope.input.editorModeOld = basicsWorkflowEditModes.default;
						scope.input.editorModeNew = basicsWorkflowEditModes.default;
						scope.input.editorModeProject = basicsWorkflowEditModes.default;
						scope.input.peopleRadioGroupOpt = {
							displayMember: 'description',
							valueMember: 'value',
							cssMember: 'cssClass',
							items: [
								{
									value: 1,
									description: $translate.instant('basics.workflow.modalDialogs.defaultRadio'),
									cssClass: 'pull-left spaceToUp'
								},
								{
									value: 2,
									description: $translate.instant('basics.workflow.modalDialogs.expertRadio'),
									cssClass: 'pull-left margin-left-ld'
								}
							]
						};

						scope.isGenerateShareLink = {
							ctrlId: 'isGenerateShareLink',
							labelText: $translate.instant('basics.workflow.action.customEditor.oneDrive.shareLink')
						};

						scope.allowEdit = {
							ctrlId: 'allowEdit',
							labelText: $translate.instant('basics.workflow.action.customEditor.oneDrive.allowEdit')
						};

						// peoples
						scope.gridId = platformCreateUuid();
						scope.gridData = {
							state: scope.gridId
						};
						setGrid('gridId');
						scope.tools = setToolbar('gridId');

						function setGrid(gridName) {
							if (!platformGridAPI.grids.exist(scope[gridName])) {
								let gridConfig = {
									columns: [
										{
											id: 'key',
											field: 'key',
											formatter: 'remark',
											editor: 'directive',
											editorOptions: {
												directive: 'basics-workflow-grid-script-editor-directive',
												lineNumbers: false,
												lint: false,
												showHint: false,
												fixedGutter: false,
												gutters: [],
												hintOptions: {
													get globalScope() {
														return basicsWorkflowGlobalContextUtil.getAutoCompleteContext();
													}
												}
											},
											name: 'Key',
											sortable: true,
											keyboard: {
												enter: true
											},
											width: 200
										}
									],
									data: [],
									id: scope[gridName],
									options: {
										tree: false,
										indicator: true,
										idProperty: 'id'
									}
								};
								platformGridAPI.grids.config(gridConfig);
							}
						}

						function setToolbar(gridName) {
							return {
								showImages: true,
								showTitles: true,
								cssClass: 'tools',
								items: [{
									id: 'add',
									caption: 'cloud.common.toolbarInsert',
									iconClass: 'tlb-icons ico-rec-new',
									type: 'item',
									fn: function () {
										let rowItem = {
											id: -1,
											key: '',
											value: ''
										};

										platformGridAPI.rows.add({gridId: scope[gridName], item: rowItem});
										platformGridAPI.rows.scrollIntoViewByItem(scope[gridName], rowItem);
									}
								},
									{
										id: 'delete',
										caption: 'cloud.common.toolbarDelete',
										iconClass: 'tlb-icons ico-rec-delete',
										type: 'item',
										fn: function () {
											let selItem = platformGridAPI.rows.selection({gridId: scope[gridName]});

											platformGridAPI.rows.delete({
												gridId: scope[gridName],
												item: selItem
											});

											platformGridAPI.grids.refresh(scope[gridName], true);
										}
									}],
								update: function () {
									this.version++;
								},
								refresh: function () {
									this.refreshVersion++;
								}
							};
						}

						scope.onRadioGroupOptChanged = function changeRadioGroupOpt(radioValue, model) {
							scope.input[model] = parseInt(radioValue);
						};

						function getDataFromAction(key) {
							let param = _.find(action.input, {key: key});

							return param ? param.value : '';
						}

						function setSimpleGridItemsData(valueInput, keyName, gridColumns) {
							let actionInputItem = _.find(valueInput, {key: keyName});
							let gridContent;
							if (actionInputItem && actionInputItem.value) {
								gridContent = basicsWorkflowActionEditorService.getSimpleGridDataFormat(actionInputItem.value.trim().split(';'), gridColumns);
							}
							return gridContent;
						}

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								let result = basicsWorkflowActionEditorService.getEditorOutput('Result', action);
								let gridContentColumns = setSimpleGridItemsData(action.input, 'Peoples', 'key');

								return {
									archiveIds: getDataFromAction('ArchiveIds'),
									isGenerateShareLink: getDataFromAction('IsGenerateShareLink'),
									accessRightMode: getDataFromAction('AccessRightMode') || '1',
									gridContentColumns: gridContentColumns,
									allowEditing: getDataFromAction('AllowEditing'),
									result: result ? result.value : '',
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							if (ngModelCtrl.$viewValue) {
								scope.input.archiveIds = ngModelCtrl.$viewValue.archiveIds;
								scope.model.isGenerateShareLink = ngModelCtrl.$viewValue.isGenerateShareLink;
								scope.input.accessRightMode = ngModelCtrl.$viewValue.accessRightMode;
								scope.model.allowEditing = ngModelCtrl.$viewValue.allowEditing;
								scope.output.result = ngModelCtrl.$viewValue.result;

								scope.input.peoples = basicsWorkflowActionEditorService.setGridDataFormat(ngModelCtrl.$viewValue.gridContentColumns);
								platformGridAPI.items.data(scope.gridId, ngModelCtrl.$viewValue.gridContentColumns ? ngModelCtrl.$viewValue.gridContentColumns : []);
								scope.input.editorMode = initEditorMode(ngModelCtrl.$viewValue.gridContentColumns) ? 2 : 1;
							}
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.archiveIds, 'ArchiveIds', action);
							basicsWorkflowActionEditorService.setEditorInput(value.isGenerateShareLink, 'IsGenerateShareLink', action);
							basicsWorkflowActionEditorService.setEditorInput(value.accessRightMode, 'AccessRightMode', action);
							basicsWorkflowActionEditorService.setEditorInput(value.peoples, 'Peoples', action);
							basicsWorkflowActionEditorService.setEditorInput(value.allowEditing, 'AllowEditing', action);
							basicsWorkflowActionEditorService.setEditorOutput(value.result, 'Result', action);
							return action;
						});

						function initEditorMode(name) {
							let toReturn = false;
							if (name && name[0] && name[0].key !== '' && name[0].key.toString().indexOf('{{') > -1) {
								toReturn = true;
							}
							return toReturn;
						}

						function saveNgModel() {
							let peoples = scope.input.editorMode === 2 ? scope.input.peoples : basicsWorkflowActionEditorService.setGridDataFormat(platformGridAPI.items.data(scope.gridId));

							ngModelCtrl.$setViewValue({
								archiveIds: scope.input.archiveIds,
								isGenerateShareLink: scope.model.isGenerateShareLink,
								accessRightMode: scope.input.accessRightMode,
								peoples: peoples,
								allowEditing: scope.model.allowEditing,
								result: scope.output.result
							});
						}

						scope.changeCheckbox = function () {
							saveNgModel();
						};

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						function onChangeGridContent() {
							ngModelCtrl.$setViewValue({
								peoples: basicsWorkflowActionEditorService.setGridDataFormat(platformGridAPI.items.data(scope.gridId))
							});

							saveNgModel();
						}

						scope.$watch('input.archiveIds', watchfn);
						scope.$watch('input.accessRightMode', watchfn);
						scope.$watch('input.editorMode', watchfn);
						scope.$watch('input.peoples', watchfn);
						scope.$watch('model.isGenerateShareLink', watchfn);
						scope.$watch('model.allowEditing', watchfn);
						scope.$watch('output.result', watchfn);

						platformGridAPI.events.register(scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);
						platformGridAPI.events.register(scope.gridId, 'onCellChange', onChangeGridContent);
					}
				};
			}
		};
	}

	basicsWorkflowUploadDoc2OneDriveEditorDirective.$inject = ['basicsWorkflowActionEditorService', 'platformGridAPI', 'basicsWorkflowEditModes',
		'platformCreateUuid', '$translate', 'basicsWorkflowGlobalContextUtil'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowUploadDoc2OneDriveEditorDirective', basicsWorkflowUploadDoc2OneDriveEditorDirective)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '81033c4c51854c6aac2b168b9043e84c',
					directive: 'basicsWorkflowUploadDoc2OneDriveEditorDirective',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
