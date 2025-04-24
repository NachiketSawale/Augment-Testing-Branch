/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	angular.module('model.main')
		.directive('modelMainIncludePropertiesActionEditorContainer', ['_', 'platformCreateUuid',
			'basicsWorkflowGlobalContextUtil', 'basicsWorkflowActionEditorService', 'platformGridAPI', '$log',
			'basicsWorkflowFilterChainUtilitiesService',
			function workflowDirective(_, platformCreateUuid, basicsWorkflowGlobalContextUtil,
			                           basicsWorkflowActionEditorService, platformGridAPI, $log,
			                           basicsWorkflowFilterChainUtilitiesService) {
				return {
					restrict: 'A',
					templateUrl: globals.appBaseUrl + 'model.main/templates/workflow-editors/model-main-include-properties-action-editor.html',
					compile: function () {
						return {
							pre: function (scope) {
								var propertyKeysParam = 'PropertyKeys';

								basicsWorkflowFilterChainUtilitiesService.initializeFilterChainAction(scope, {});

								_.assign(scope.input, {
									propKeys: (function initializePropKeys () {
										var rawValue = basicsWorkflowActionEditorService.getEditorInput(propertyKeysParam, scope.action).value;
										if (_.isString(rawValue) && !_.isEmpty(rawValue)) {
											try {
												var result = JSON.parse(rawValue);
												if (_.isArray(result)) {
													result.forEach(function (item, index) {
														item.id = index;
													});
													return result;
												}
											} catch (ex) {
												$log.error(ex);
											}
										}
										return [];
									})()
								});

								scope.$watch('input.propKeys', function (newValue, oldValue) {
									if (!angular.equals(newValue, oldValue)) {
										basicsWorkflowActionEditorService.setEditorInput(JSON.stringify(newValue), propertyKeysParam, scope.action);
									}
								}, true);

								scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

								//accordion
								scope.inputOpen = true;
								scope.outputOpen = true;

								scope.gridId = platformCreateUuid();
								scope.gridDataPropKeys = {
									state: scope.gridId
								};
								if (!platformGridAPI.grids.exist(scope.gridId)) {
									var gridConfig = {
										columns: [{
											id: 'pk',
											field: 'PropertyKeyFk',
											editor: 'lookup',
											editorOptions: {
												directive: 'model-main-property-key-dialog'
											},
											formatter: 'lookup',
											formatterOptions: {
												lookupType: 'PropertyKey',
												displayMember: 'PropertyName',
												version: 3
											},
											width: 140,
											sortable: true,
											name$tr$: 'basics.workflow.action.customEditor.model.propKey'
										}, {
											id: 'alias',
											field: 'Alias',
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
											keyboard: {
												enter: true
											},
											name$tr$: 'basics.workflow.action.customEditor.model.propKeyAlias'
										}],
										data: [],
										id: scope.gridId,
										options: {
											tree: false,
											indicator: true,
											idProperty: 'id'
										}
									};
									platformGridAPI.grids.config(gridConfig);
								}
								scope.toolsPropKeys = {
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
												PropertyKeyFk: null,
												Alias: ''
											};

											platformGridAPI.rows.add({gridId: scope.gridId, item: rowItem});
											platformGridAPI.rows.scrollIntoViewByItem(scope.gridId, rowItem);
										}
									}, {
										id: 'delete',
										caption: 'cloud.common.toolbarDelete',
										iconClass: 'tlb-icons ico-rec-delete',
										type: 'item',
										fn: function () {
											var selItem = platformGridAPI.rows.selection({gridId: scope.gridId});

											platformGridAPI.rows.delete({
												gridId: scope.gridId,
												item: selItem
											});

											platformGridAPI.grids.refresh(scope.gridId, true);
										}
									}],
									update: function () {
										this.version++;
									},
									refresh: function () {
										this.refreshVersion++;
									}
								};

								platformGridAPI.items.data(scope.gridId, scope.input.propKeys);
							}
						};
					}
				};
			}])
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: '07f733f94735448b828a4461e8c44dc9',
					directive: 'modelMainIncludePropertiesActionEditorContainer',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
