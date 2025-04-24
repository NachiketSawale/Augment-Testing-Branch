/**
 * Created by uestuenel on 11.07.2016.
 */

(function (angular) {
	/* global globals */
	'use strict';

	function basicsWorkflowMailActionEditorGridsDirective(basicsWorkflowActionEditorService, platformGridAPI,
	                                                      platformCreateUuid, basicsWorkflowEditModes, $translate, basicsWorkflowGlobalContextUtil) {
		return {
			restrict: 'A',
			require: 'ngModel',
			scope: true,
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/mail-action-editor-grids.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						/* is avalable
						 scope.input = {};
						 scope.input.radioGroupOpt
						 scope.codeMirrorOptions
						 */

						var action = {};
						var parameter = '';

						scope.input.editorModeReceivers = '1';
						scope.input.editorModeCC = '1';
						scope.input.editorModeBCC = '1';
						scope.input.editorModeAtt = '1';
						scope.input.editorModeReplay = '1';
						scope.input.editorModeHtml = '1';

						//receivers
						scope.gridId = platformCreateUuid();
						scope.gridData = {
							state: scope.gridId
						};
						setGrid('gridId');
						scope.tools = setToolbar('gridId');

						//cc
						scope.gridIdCC = platformCreateUuid();
						scope.gridDataCC = {
							state: scope.gridIdCC
						};
						setGrid('gridIdCC');
						scope.toolsCC = setToolbar('gridIdCC');

						//bcc
						scope.gridIdBCC = platformCreateUuid();
						scope.gridDataBCC = {
							state: scope.gridIdBCC
						};
						setGrid('gridIdBCC');
						scope.toolsBCC = setToolbar('gridIdBCC');

						//att
						scope.gridIdAtt = platformCreateUuid();
						scope.gridDataAtt = {
							state: scope.gridIdAtt
						};
						setGrid('gridIdAtt');
						scope.toolsAtt = setToolbar('gridIdAtt');

						//reply to list
						scope.gridIdR2L = platformCreateUuid();
						scope.gridDataR2L = {
							state: scope.gridIdR2L
						};
						setGrid('gridIdR2L');
						scope.toolsR2L = setToolbar('gridIdR2L');

						function setSimpleGridItemsData(valueInput, keyName, gridColumns) {
							var actionInputItem = _.find(valueInput, {key: keyName});
							var gridContent;
							if (actionInputItem && actionInputItem.value) {
								gridContent = basicsWorkflowActionEditorService.getSimpleGridDataFormat(actionInputItem.value.trim().split(';'), gridColumns);
							}
							return gridContent;
						}

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var gridContentColumns = setSimpleGridItemsData(action.input, 'Receivers', 'key');
								var gridContentCC = setSimpleGridItemsData(action.input, 'CC', 'key');
								var gridContentBCC = setSimpleGridItemsData(action.input, 'BCC', 'key');
								var gridContentAtt = setSimpleGridItemsData(action.input, 'Attachements', 'key');
								var gridContentR2L = setSimpleGridItemsData(action.input, 'ReplyToList', 'key');

								return {
									contentCC: gridContentCC,
									contentBCC: gridContentBCC,
									contentAtt: gridContentAtt,
									contentreplay: gridContentR2L,
									gridContentColumns: gridContentColumns

								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							if (ngModelCtrl.$viewValue) {

								//Codemirrors
								scope.input.rec = basicsWorkflowActionEditorService.setGridDataFormat(ngModelCtrl.$viewValue.gridContentColumns);
								scope.input.cc = basicsWorkflowActionEditorService.setGridDataFormat(ngModelCtrl.$viewValue.contentCC);
								scope.input.bcc = basicsWorkflowActionEditorService.setGridDataFormat(ngModelCtrl.$viewValue.contentBCC);
								scope.input.att = basicsWorkflowActionEditorService.setGridDataFormat(ngModelCtrl.$viewValue.contentAtt);
								scope.input.replay = basicsWorkflowActionEditorService.setGridDataFormat(ngModelCtrl.$viewValue.contentreplay);

								//grids
								platformGridAPI.items.data(scope.gridId, ngModelCtrl.$viewValue.gridContentColumns ? ngModelCtrl.$viewValue.gridContentColumns : []);
								platformGridAPI.items.data(scope.gridIdCC, ngModelCtrl.$viewValue.contentCC ? ngModelCtrl.$viewValue.contentCC : []);
								platformGridAPI.items.data(scope.gridIdBCC, ngModelCtrl.$viewValue.contentBCC ? ngModelCtrl.$viewValue.contentBCC : []);
								platformGridAPI.items.data(scope.gridIdAtt, ngModelCtrl.$viewValue.contentAtt ? ngModelCtrl.$viewValue.contentAtt : []);
								platformGridAPI.items.data(scope.gridIdR2L, ngModelCtrl.$viewValue.contentreplay ? ngModelCtrl.$viewValue.contentreplay : []);

								//input radiobuttons
								scope.input.editorModeReceivers = initEditorMode(ngModelCtrl.$viewValue.gridContentColumns) ? '2' : '1';
								scope.input.editorModeReplay = initEditorMode(ngModelCtrl.$viewValue.contentreplay) ? '2' : '1';
								scope.input.editorModeAtt = initEditorMode(ngModelCtrl.$viewValue.contentAtt) ? '2' : '1';
								scope.input.editorModeBCC = initEditorMode(ngModelCtrl.$viewValue.contentBCC) ? '2' : '1';
								scope.input.editorModeCC = initEditorMode(ngModelCtrl.$viewValue.contentCC) ? '2' : '1';

							}
						};

						function initEditorMode(name) {
							var toReturn = false;
							if (name && name[0] && name[0].key !== '' && name[0].key.toString().indexOf('{{') > -1) {
								toReturn = true;
							}
							return toReturn;
						}

						ngModelCtrl.$parsers.push(function (value) {
							switch (parameter) {
								case 'rec':
									basicsWorkflowActionEditorService.setEditorInput(value.rec, 'Receivers', action);
									break;
								case 'cc':
									basicsWorkflowActionEditorService.setEditorInput(value.cc, 'CC', action);
									break;
								case 'bcc':
									basicsWorkflowActionEditorService.setEditorInput(value.bcc, 'BCC', action);
									break;
								case 'att':
									basicsWorkflowActionEditorService.setEditorInput(value.att, 'Attachements', action);
									break;
								case 'replay':
									basicsWorkflowActionEditorService.setEditorInput(value.replay, 'ReplyToList', action);
									break;
								default:
									basicsWorkflowActionEditorService.setEditorInput(value.rec, 'Receivers', action);
									basicsWorkflowActionEditorService.setEditorInput(value.cc, 'CC', action);
									basicsWorkflowActionEditorService.setEditorInput(value.bcc, 'BCC', action);
									basicsWorkflowActionEditorService.setEditorInput(value.att, 'Attachements', action);
									basicsWorkflowActionEditorService.setEditorInput(value.replay, 'ReplyToList', action);
							}

							return action;
						});

						function setToolbar(gridname) {
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
										var rowItem = {
											id: -1,
											key: '',
											value: ''
										};

										platformGridAPI.rows.add({gridId: scope[gridname], item: rowItem});
										platformGridAPI.rows.scrollIntoViewByItem(scope[gridname], rowItem);
									}
								},
									{
										id: 'delete',
										caption: 'cloud.common.toolbarDelete',
										iconClass: 'tlb-icons ico-rec-delete',
										type: 'item',
										fn: function () {
											var selItem = platformGridAPI.rows.selection({gridId: scope[gridname]});

											platformGridAPI.rows.delete({
												gridId: scope[gridname],
												item: selItem
											});

											platformGridAPI.grids.refresh(scope[gridname], true);
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

						function setGrid(gridname) {
							if (!platformGridAPI.grids.exist(scope[gridname])) {
								var gridConfig = {
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
									id: scope[gridname],
									options: {
										tree: false,
										indicator: true,
										idProperty: 'id'
									}
								};
								platformGridAPI.grids.config(gridConfig);
							}
						}

						function onChangeGridContent() {
							parameter = 'rec';

							ngModelCtrl.$setViewValue({
								rec: basicsWorkflowActionEditorService.setGridDataFormat(platformGridAPI.items.data(scope.gridId))
							});
						}

						function onChangeGridContentCC() {
							parameter = 'cc';

							ngModelCtrl.$setViewValue({
								cc: basicsWorkflowActionEditorService.setGridDataFormat(platformGridAPI.items.data(scope.gridIdCC))
							});
						}

						function onChangeGridContentBCC() {
							parameter = 'bcc';

							ngModelCtrl.$setViewValue({
								bcc: basicsWorkflowActionEditorService.setGridDataFormat(platformGridAPI.items.data(scope.gridIdBCC))
							});
						}

						function onChangeGridContentAtt() {
							parameter = 'att';

							ngModelCtrl.$setViewValue({
								att: basicsWorkflowActionEditorService.setGridDataFormat(platformGridAPI.items.data(scope.gridIdAtt))
							});
						}

						function onChangeGridContentReplay() {
							parameter = 'replay';

							ngModelCtrl.$setViewValue({
								replay: basicsWorkflowActionEditorService.setGridDataFormat(platformGridAPI.items.data(scope.gridIdR2L))
							});
						}

						function saveNgModel() {
							var receivers = scope.input.editorModeReceivers === '2' ? scope.input.rec : basicsWorkflowActionEditorService.setGridDataFormat(platformGridAPI.items.data(scope.gridId));
							var cc = scope.input.editorModeCC === '2' ? scope.input.cc : basicsWorkflowActionEditorService.setGridDataFormat(platformGridAPI.items.data(scope.gridIdCC));
							var bcc = scope.input.editorModeBCC === '2' ? scope.input.bcc : basicsWorkflowActionEditorService.setGridDataFormat(platformGridAPI.items.data(scope.gridIdBCC));
							var att = scope.input.editorModeAtt === '2' ? scope.input.att : basicsWorkflowActionEditorService.setGridDataFormat(platformGridAPI.items.data(scope.gridIdAtt));
							var replay = scope.input.editorModeReplay === '2' ? scope.input.replay : basicsWorkflowActionEditorService.setGridDataFormat(platformGridAPI.items.data(scope.gridIdR2L));

							ngModelCtrl.$setViewValue({
								rec: receivers,
								cc: cc,
								bcc: bcc,
								att: att,
								replay: replay
							});
						}

						function watchfn(newVal, oldVal) {
							if (newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('input.rec', watchfn);
						scope.$watch('input.cc', watchfn);
						scope.$watch('input.bcc', watchfn);
						scope.$watch('input.att', watchfn);
						scope.$watch('input.replay', watchfn);

						platformGridAPI.events.register(scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);
						platformGridAPI.events.register(scope.gridId, 'onCellChange', onChangeGridContent);

						platformGridAPI.events.register(scope.gridIdCC, 'onSelectedRowsChanged', onChangeGridContentCC);
						platformGridAPI.events.register(scope.gridIdCC, 'onCellChange', onChangeGridContentCC);

						platformGridAPI.events.register(scope.gridIdBCC, 'onSelectedRowsChanged', onChangeGridContentBCC);
						platformGridAPI.events.register(scope.gridIdBCC, 'onCellChange', onChangeGridContentBCC);

						platformGridAPI.events.register(scope.gridIdAtt, 'onSelectedRowsChanged', onChangeGridContentAtt);
						platformGridAPI.events.register(scope.gridIdAtt, 'onCellChange', onChangeGridContentAtt);

						platformGridAPI.events.register(scope.gridIdR2L, 'onSelectedRowsChanged', onChangeGridContentReplay);
						platformGridAPI.events.register(scope.gridIdR2L, 'onCellChange', onChangeGridContentReplay);

						scope.$on('$destroy', function () {
							platformGridAPI.events.unregister(scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);
							platformGridAPI.events.unregister(scope.gridId, 'onCellChange', onChangeGridContent);
							platformGridAPI.grids.unregister(scope.gridId);

							platformGridAPI.events.unregister(scope.gridIdCC, 'onSelectedRowsChanged', onChangeGridContentCC);
							platformGridAPI.events.unregister(scope.gridIdCC, 'onCellChange', onChangeGridContentCC);
							platformGridAPI.grids.unregister(scope.gridIdCC);

							platformGridAPI.events.unregister(scope.gridIdBCC, 'onSelectedRowsChanged', onChangeGridContentBCC);
							platformGridAPI.events.unregister(scope.gridIdBCC, 'onCellChange', onChangeGridContentBCC);
							platformGridAPI.grids.unregister(scope.gridIdBCC);

							platformGridAPI.events.unregister(scope.gridIdAtt, 'onSelectedRowsChanged', onChangeGridContentAtt);
							platformGridAPI.events.unregister(scope.gridIdAtt, 'onCellChange', onChangeGridContentAtt);
							platformGridAPI.grids.unregister(scope.gridIdAtt);

							platformGridAPI.events.unregister(scope.gridIdR2L, 'onSelectedRowsChanged', onChangeGridContentReplay);
							platformGridAPI.events.unregister(scope.gridIdR2L, 'onCellChange', onChangeGridContentReplay);
							platformGridAPI.grids.unregister(scope.gridIdR2L);
						});
					}
				};
			}
		};
	}

	basicsWorkflowMailActionEditorGridsDirective.$inject = ['basicsWorkflowActionEditorService', 'platformGridAPI',
		'platformCreateUuid', 'basicsWorkflowEditModes', '$translate', 'basicsWorkflowGlobalContextUtil'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowMailActionEditorGridsDirective', basicsWorkflowMailActionEditorGridsDirective);

})(angular);

