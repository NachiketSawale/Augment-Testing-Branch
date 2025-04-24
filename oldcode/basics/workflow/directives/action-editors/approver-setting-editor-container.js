/**
 * Created by pel on 10.08.2020.
 */

(function (angular) {
	/* global globals, jQuery, $ */
	'use strict';

	function basicsWorkflowApproverSettingContainer(_, basicsWorkflowEditModes, basicsWorkflowActionEditorService, basicsWorkflowClerkRoleService, $translate, $compile, $templateCache) {
		return {
			restrict: 'A',
			require: 'ngModel',
			templateUrl: globals.appBaseUrl + 'basics.workflow/templates/action-editors/approver-setting-editor.html',
			compile: function () {
				return {
					pre: function (scope, iElement, attr, ngModelCtrl) {
						var action = {},
							parameters = {
								isRoleBase: 'IsRoleBase',
								level: 'Level',
								approvers: 'Approvers',
								output: 'OutApprovers'
							};

						scope.input = {};
						scope.output = {};
						scope.inputOpen = true;
						scope.outputOpen = true;
						scope.codeMirrorOptions = basicsWorkflowActionEditorService.setCodeMirrorOptions(true);

						scope.input.Approvers = {};

						scope.input.clerkRoleUrl = 'ClerkRole/list';

						scope.selectOptionsStatusId = {
							displayMember: 'DescriptionInfo.Translated',
							valueMember: 'Id',
							items: [],
							service: basicsWorkflowClerkRoleService,
							serviceMethod: 'getItems',
							serviceReload: true
						};

						scope.isParallelOptions = {
							ctrlId: 'isParallel',
							labelText: $translate.instant('basics.workflow.action.customEditor.isParallel')
						};

						scope.OnApprKeyPressCount = function ($event) {
							if ($event.keyCode < 48 || $event.keyCode > 57) {
								$event.preventDefault();
							}
						};
						scope.OnApprKeyUp = function () {
							getApprovalUi(scope, $compile, $templateCache);
							saveNgModel();
						};
						scope.OnApprAddItem = function (level) {
							var levelAttr = 'Level' + level;
							var nodeCount = scope.input.Approvers[levelAttr].Nodes.length;
							var itemNodeDivId = '#itemNode' + level;
							var itemNodeDiv = angular.element(itemNodeDivId);
							var htmlUrl = 'basics.workflow/approve-role-item-ui.html';
							if (scope.input.isRoleBase === 1) {
								htmlUrl = 'basics.workflow/approve-clerk-item-ui.html';
							}
							var html = $templateCache.get(htmlUrl);
							while (html.indexOf('{{approve_level}}') > -1) {
								html = html.replace('{{approve_level}}', level)
									.replace('{{node_count}}', nodeCount);
							}
							itemNodeDiv.append($compile(html)(scope));

							var newNode = {};
							newNode.itemId = 0;
							scope.input.Approvers[levelAttr].Nodes.push(newNode);
							saveNgModel();

						};

						scope.removeItem = function (level) {
							var levelAttr = 'Level' + level;
							var itemDivId = 'input.Approvers.Level' + level;
							var itemCount = angular.element(document).find(jQuery($('div[id^=' + '\'' + itemDivId + '\'' + ']'))).length;
							if (itemCount > 1) {
								jQuery($('div[id^=' + '\'' + itemDivId + '\'' + ']')).last().remove();
								scope.input.Approvers[levelAttr].Nodes.pop();
								saveNgModel();
							}
						};

						scope.deleteRole = function (levelCount, nodeDivId, deleteNode) {
							var levelAttr = 'Level' + levelCount;
							var nodeInt = parseInt(deleteNode);
							scope.input.Approvers[levelAttr].Nodes[nodeInt].itemId = null;
							saveNgModel();
						};

						scope.onSelectChanged = function () {
							saveNgModel();
						};

						scope.onClerkBaseChanged = function (/*type*/) {
							scope.input.Approvers = '';
							scope.input.level = 1;
							angular.element('#div_approve').html('');
							saveNgModel();
							getApprovalUi(scope, $compile, $templateCache);
						};

						scope.onParallelChanged = function (level) {
							var levelAttr = 'Level' + level;
							var itemDivId = 'input.Approvers.Level' + level;
							var itemCount = angular.element(document).find(jQuery($('div[id^=' + '\'' + itemDivId + '\'' + ']'))).length;
							while (itemCount > 1) {
								jQuery($('div[id^=' + '\'' + itemDivId + '\'' + ']')).last().remove();
								scope.input.Approvers[levelAttr].Nodes.pop();
								itemCount--;
							}
							saveNgModel();
						};

						scope.canDeleteButton = function (level) {
							var levelAttr = 'Level' + level;
							var levelObj = scope.input.Approvers[levelAttr];
							var nodeCount = scope.input.Approvers[levelAttr].Nodes.length;
							var nodes = [];
							for (var j = 0; j < nodeCount; j++) {
								var nodeItem = levelObj.Nodes[j];
								if (nodeItem !== undefined && nodeItem !== null && nodeItem.itemId !== null) {
									nodes.push(nodeItem);
								}
							}
							return nodes.length > 1;
						};

						function getDataFromAction(key) {
							var param = basicsWorkflowActionEditorService.getEditorInput(key, action);
							return param ? param.value : '';
						}

						ngModelCtrl.$formatters.push(function (value) {
							action = value;
							if (action) {
								var outputProperty = basicsWorkflowActionEditorService.getEditorOutput(parameters.output, action);

								return {
									isRoleBase: getDataFromAction(parameters.isRoleBase),
									level: getDataFromAction(parameters.level),
									approvers: getDataFromAction(parameters.approvers),
									outputValue: outputProperty ? outputProperty.value : ''
								};
							}
							return '';
						});

						ngModelCtrl.$render = function () {
							if (ngModelCtrl.$viewValue.isRoleBase !== '' && ngModelCtrl.$viewValue.isRoleBase !== undefined) {
								scope.input.isRoleBase = parseInt(ngModelCtrl.$viewValue.isRoleBase);
							} else {
								scope.input.isRoleBase = '2';
							}
							scope.input.level = parseInt(ngModelCtrl.$viewValue.level) ? parseInt(ngModelCtrl.$viewValue.level) : 1;

							if (ngModelCtrl.$viewValue.approvers !== '') {
								var approvers = basicsWorkflowActionEditorService.tryGetObjectFromJson(ngModelCtrl.$viewValue.approvers);
								scope.input.Approvers = revomeUselessApprovers(approvers);
								saveNgModel();
							} else {
								scope.input.Approvers = '';
							}

							getApprovalUi(scope, $compile, $templateCache);

							//output param
							scope.output.property = ngModelCtrl.$viewValue.outputValue;
						};

						ngModelCtrl.$parsers.push(function (value) {
							basicsWorkflowActionEditorService.setEditorInput(value.clerkId, parameters.clerk, action);
							basicsWorkflowActionEditorService.setEditorInput(value.level, parameters.level, action);
							basicsWorkflowActionEditorService.setEditorInput(value.isRoleBase, parameters.isRoleBase, action);
							basicsWorkflowActionEditorService.setEditorInput(value.approvers, parameters.approvers, action);
							basicsWorkflowActionEditorService.setEditorOutput(value.output, parameters.output, action);

							return action;
						});

						function revomeUselessApprovers(approvers) {
							var level = scope.input.level;
							var newApprovers = {};
							for (var i = 0; i < level; i++) {
								var atrr = 'Level' + (i + 1);
								var levelObj = approvers[atrr];
								if (levelObj !== null && levelObj !== undefined) {

									var nodeCount = levelObj.Nodes.length;
									var nodes = [];
									for (var j = 0; j < nodeCount; j++) {
										var nodeItem = levelObj.Nodes[j];
										if (nodeItem !== undefined && nodeItem !== null && nodeItem.itemId !== null) {
											nodes.push(nodeItem);
										}
									}
									levelObj.Nodes = nodes;
									newApprovers[atrr] = levelObj;
								}

							}
							return newApprovers;
						}

						function getApprovalUi(scope, $compile, $templateCache) {
							if (scope.input.Approvers === '') {
								scope.input.Approvers = {};
								scope.input.Approvers.Level1 = {};
								var node = {};
								node.itemId = 0;
								scope.input.Approvers.Level1.Nodes = [node];
								scope.input.Approvers.Level1.isParallel = false;
							}
							var levelCount = scope.input.level;
							if (levelCount !== '') {

								var existLevel = angular.element(document).find(jQuery($('div[id^="Alevel"]'))).length;
								if (existLevel > levelCount) {
									var diff = existLevel - levelCount;
									while (diff > 0) {
										jQuery($('div[id^="Alevel"]')).last().remove();
										diff--;
									}
								} else {
									var elem = angular.element('#div_approve');
									var htmlUrl = 'basics.workflow/approve-header-ui.html';
									var html = $templateCache.get(htmlUrl);

									for (var i = existLevel; i < levelCount; i++) {
										var template = html;
										while (template.indexOf('{{approve_level}}') > -1) {
											template = template.replace('{{approve_level}}', i + 1)
												.replace('{{node_count}}', 0);
										}
										elem.append($compile(template)(scope));
										if (existLevel !== 0) {
											var level = 'Level' + (i + 1);
											scope.input.Approvers[level] = {};
											scope.input.Approvers[level].isParallel = false;
											if (scope.input.Approvers[level].Nodes === undefined) {
												var newNode = {};
												newNode.itemId = 0;
												scope.input.Approvers[level].Nodes = [];
												scope.input.Approvers[level].Nodes.push(newNode);

											}
										}
										addNodeUi(i + 1);
									}
								}
							}
						}

						function addNodeUi(level) {
							var itemNodeDivId = '#itemNode' + level;
							var itemNodDiv = angular.element(itemNodeDivId);
							var htmlUrl = 'basics.workflow/approve-role-item-ui.html';
							if (scope.input.isRoleBase === 1) {
								htmlUrl = 'basics.workflow/approve-clerk-item-ui.html';
							}
							var html = $templateCache.get(htmlUrl);
							var curLevel = 'Level' + level;
							if (scope.input.Approvers !== '' && scope.input.Approvers[curLevel] !== undefined) {
								var existNodeCount = scope.input.Approvers[curLevel].Nodes.length;
								if (existNodeCount === 0) {
									existNodeCount = 1;
								}
								for (var i = 0; i < existNodeCount; i++) {
									var template = html;
									while (template.indexOf('{{approve_level}}') > -1) {
										template = template.replace('{{approve_level}}', level)
											.replace('{{node_count}}', i);
									}
									itemNodDiv.append($compile(template)(scope));
								}
							}
						}

						function saveNgModel() {
							//save content from codemirror or selecteditem
							var isRoleBase = scope.input.isRoleBase;
							var level = scope.input.level;
							var approvers = scope.input.Approvers;
							var jsonValue = angular.toJson(approvers);

							ngModelCtrl.$setViewValue({
								isRoleBase: isRoleBase,
								level: level,
								approvers: jsonValue,
								output: scope.output.property
							});
						}

						function watchfn(newVal, oldVal) {
							if (!_.isUndefined(newVal) && !_.isUndefined(oldVal) && newVal !== oldVal) {
								saveNgModel();
							}
						}

						scope.$watch('input.isRoleBase', watchfn);
						scope.$watch('input.level', watchfn);
						scope.$watch('output.property', watchfn);
						scope.$watch('input.Approvers', watchfn, true);

					}
				};
			}
		};
	}

	basicsWorkflowApproverSettingContainer.$inject = ['_', 'basicsWorkflowEditModes', 'basicsWorkflowActionEditorService', 'basicsWorkflowClerkRoleService', '$translate', '$compile', '$templateCache'];

	angular.module('basics.workflow')
		.directive('basicsWorkflowApproverSettingContainer', basicsWorkflowApproverSettingContainer)
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.actionEditors.push(
				{
					actionId: 'efbc09fdde474850854c482060774360',
					directive: 'basicsWorkflowApproverSettingContainer',
					prio: null,
					tools: []
				}
			);
		}]);

})(angular);
