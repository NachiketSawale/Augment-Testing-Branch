(function (angular) {
	/* global globals, Platform */
	'use strict';

	function DebugService(_, $http, $q, basicsWorkflowTemplateService, basicsWorkflowClientActionService, platformModuleStateService, basicsWorkflowInstanceService, platformDialogService, basicsWorkflowDtoService, platformObjectHelper) {

		var state = platformModuleStateService.state('basics.workflow');
		var self = this;
		var actionEvent = new Platform.Messenger();

		self.startDebugCurrent = function startDebugCurrent() {
			return self.startDebug(state.selectedMainEntity, state.selectedTemplateVersion, state.selectedMainEntity.EntityId !== '0');
		};

		self.startDebug = function startDebug(template, version, hasCallingEntity) {

			function start(identification) {
				return $http({
					method: 'POST', url: globals.webApiBaseUrl + 'basics/workflow/instance/debug/createcontext',
					data: {
						TemplateId: template.Id, VersionId: version.Id, Identification: identification, JsonContext: ''
					}
				}).then(function (response) {
					var context = angular.fromJson(response.data);
					_.each(version.context, function (item) {
						context[item.key] = item.value;
					});

					return self.nextAction(version, version.WorkflowAction, context);
				});
			}

			if (hasCallingEntity) {
				state.debugInfo = {
					template: template, version: version, identification: {}
				};
				return platformDialogService.showDialog({
					bodyTemplateUrl: globals.appBaseUrl + 'basics.workflow/templates/dialogs/workflow-start-debug-dialog.html',
					headerTextKey: 'basics.workflow.start.idDialog.header',
					backdrop: false,
					width: '200px',
					height: '250px',
					buttons: [{
						id: 'cancel'
					}, {
						id: 'ok'
					}]
				}).then(function (result) {
					if (result.ok) {
						return start(state.debugInfo.identification[0]);
					}
				}, function () {
					state.debugCanceled = true;
					return $q.reject();
				});
			} else {
				return start(null);
			}
		};

		self.nextAction = function nextAction(templateVersion, currentAction, context) {
			currentAction.context = context;
			var nxAction;
			var openActions = [];
			var clientAction = basicsWorkflowClientActionService.getAction(currentAction.actionId);
			var currentTask = basicsWorkflowTemplateService.copyAction(currentAction);
			let executePromise = currentTask.executeCondition ? executeConditionEvaluation(currentTask.executeCondition, context) : $q.when(true);
			return executePromise.then(function (executeResult) {
				let evaluatedExecuteCondition = executeResult === 'true' || executeResult === '' ? true : executeResult === 'false' ? false : executeResult;
				if (currentAction.actionId === 'E0000000000000000000000000000000' && executeResult) {
					nxAction = findInTree(templateVersion.WorkflowAction, currentAction.input[0].value);
					return $q.when({
						context: context, action: nxAction, openActions: openActions
					});
				} else {
					if (clientAction) {
						if (evaluatedExecuteCondition) {
							return $http({
								method: 'POST', url: globals.webApiBaseUrl + 'basics/workflow/actions/codeTranslations', data: {
									input: currentTask.input[0].value,
									language: ''
								}
							}).then(function (response) {
								currentTask.input[0].value = response.data.output;
								basicsWorkflowDtoService.extendObject(currentTask);
								currentTask.Context = context;
								currentTask.IsContextLoaded = true;
								basicsWorkflowInstanceService.prepareTask(currentTask);
								return basicsWorkflowClientActionService.executeTask(currentTask, context).then(function (response) {
									if (response && response.data && response.data.context.Context) {
										response.data.context = _.merge(response.data.context, response.data.context.Context);
										delete response.data.context.Context;
									}
									if (currentAction.context.Context) {
										delete currentAction.context.Context;
									}
									return executeActionResponseFactory(currentAction)(response);
								});
							});
						} else {
							var actionContext = currentAction.context;
							if (currentAction.context.SkippedActions) {
								currentAction.context.SkippedActions.push(`Action ${currentAction.Description} skipped with execute Condition ${currentAction.ExecuteCondition}`);
							} else {
								currentAction.context.SkippedActions = [`Action ${currentAction.Description} skipped with execute Condition ${currentAction.ExecuteCondition}`];
							}
							return executeActionResponseFactory(currentAction)({
								data: {
									task: currentAction, context: actionContext, result: currentAction.Result || 'true'
								}
							});
						}
					} else {
						return $http({
							method: 'POST', url: globals.webApiBaseUrl + 'basics/workflow/actions/debug', data: {
								wfAction: angular.toJson(basicsWorkflowTemplateService.copyAction(currentAction, false)),
								context: angular.toJson(context)
							}
						}).then(executeActionResponseFactory(currentAction));
					}
				}
			});
		};

		function executeConditionEvaluation(expression, context) {
			return $http({
				method: 'POST', url: globals.webApiBaseUrl + 'basics/workflow/actions/executeCondition', data: {
					executeCondition: expression,
					context: angular.toJson(context)
				}
			}).then(function (response) {
				return response.data.result.toLowerCase() === 'true';
			});
		}

		self.nextActionFromCurrent = function nextActionFromCurrent() {
			return self.nextAction(state.selectedTemplateVersion, state.currentWorkflowAction, state.debugContext);
		};

		self.registerActionEvent = function (callback) {
			actionEvent.register(callback);
		};

		self.unregisterActionEvent = function (callback) {
			actionEvent.unregister(callback);
		};

		function executeActionResponseFactory(currentAction) {
			return function (response) {
				var context = currentAction.context;
				var result = currentAction.result ? currentAction.result : currentAction.context.Result;
				var nextAction = currentAction;
				if (platformObjectHelper.isSet(response)) {
					if (angular.isObject(response)) {
						if (response.actionEvent) {
							switch (response.actionEvent) {
								case basicsWorkflowClientActionService.actionEvent.stop:
									actionEvent.fire();
									return;
							}
						}

						context = angular.fromJson(response.data.context);
						result = platformObjectHelper.isSet(response.data.result) ? response.data.result : null;
					}
					if (currentAction.transitions.length <= 1) {
						nextAction = currentAction.transitions[0].workflowAction;
					} else {
						var currentTrans = _.find(currentAction.transitions, function (item) {
							return item.parameter.toUpperCase() === result.toString().toUpperCase();
						});
						if (currentTrans) {
							nextAction = currentTrans.workflowAction;
						} else {
							nextAction = currentAction.transitions[0].workflowAction;
						}
					}
				}

				basicsWorkflowDtoService.extendObject(nextAction);
				setTimeout(function () {
					let formatedContext = jQuery('#formatedContext');
					formatedContext.scrollTop( formatedContext.prop('scrollHeight'));
				}, 0);
				return {
					context: context, action: nextAction
				};
			};
		}

		function findInTree(action, code) {
			var actionCode = action.code;
			var result = null;
			if (actionCode === code) {
				return action;
			}
			if (!action.transitions) {
				return null;
			}
			for (var i = 0; _.isNil(result) && i < action.transitions.length; i++) {
				result = findInTree(action.transitions[i].workflowAction, code);
			}

			return result;
		}
	}

	DebugService.$inject = ['_', '$http', '$q', 'basicsWorkflowTemplateService', 'basicsWorkflowClientActionService', 'platformModuleStateService', 'basicsWorkflowInstanceService', 'platformModalService', 'basicsWorkflowDtoService', 'platformObjectHelper'];
	angular.module('basics.workflow').service('basicsWorkflowDebugService', DebugService);

})(angular);
