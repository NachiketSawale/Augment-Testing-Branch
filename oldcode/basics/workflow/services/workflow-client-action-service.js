/* global angular */
(function(angular) {
	'use strict';

	/**
	 * @typedef  {Object} basics.workflow.basicsWorkflowClientActionService
	 * @property  {function} getAction,
	 * @property {function} addAction,
	 * @property {function} executeTask,
	 */

	/**
	 * @typedef {Object} basics.workflow.action
	 * @property  {string} id,
	 * @property {Array} input,
	 * @property {Array} output,
	 * @property {String} description,
	 * @property {int} actionType,
	 * @property {function} execute
	 */

	/**
	 * Returns the basicsWorkflowClientActionService.
	 * @returns {basics.workflow.basicsWorkflowClientActionService} basicsWorkflowClientActionService
	 *
	 */

	function clientActionService($q, _, platformDialogService, basicsWorkflowPreProcessorService, $interval, $injector, genericWizardUseCaseConfigService, basicsWorkflowActionEditorService) {
		var clientActions = {};

		var actionEvent = {
			stop: 'stop'
		};

		/**
		 * Returns if it is a valid action.
		 * @param {basics.workflow.action} action
		 * @returns {Boolean} Is it a valid action?
		 */
		function checkAction(action) {
			return action.hasOwnProperty('Id') && action.hasOwnProperty('Input') && action.hasOwnProperty('Output') && action.hasOwnProperty('Description') && action.hasOwnProperty('ActionType') && angular.isArray(action.Input) && angular.isArray(action.Output) && angular.isFunction(action.Execute);
		}

		/**
		 * Returns if the action already exists.
		 * @param {basics.workflow.action | String} action
		 * @returns {Boolean} Is it a valid action?
		 */
		function checkActionExists(action) {
			if (angular.isObject(action)) {
				return clientActions.hasOwnProperty(action.Id);
			} else if (angular.isString(action)) {
				return clientActions.hasOwnProperty(action);
			}
			return false;
		}

		/**
		 * Adds a new action to the service. This action can be used in a workflow. To check if the action is already
		 * exists the id is used.
		 * @param {basics.workflow.action } action
		 */
		function addAction(action) {
			var actionAdded = !(checkActionExists(action)) && checkAction(action);

			clientActions[action.Id] = action;

			return actionAdded;
		}

		/**
		 * Returns the action when it exists otherwise undefined.
		 * @param {String} id
		 * @returns {basics.workflow.action} action
		 *
		 */
		function getAction(id) {
			if (clientActions.hasOwnProperty(id)) {
				return clientActions[id];
			}
			return undefined;
		}

		/**
		 * Returns the action when it exists otherwise undefined.
		 * @returns {Array} action array
		 *
		 */
		function getAllActions() {
			var result = [];

			for (var name in clientActions) {
				if (clientActions.hasOwnProperty(name)) {
					result.push(clientActions[name]);
				}
			}
			return _.orderBy(result, ['Description']);
		}

		/**
		 * Executes an action.
		 * @param {object} task
		 * @param {fn} closeDiagFn
		 * @returns   {object} resultContext
		 */
		function executeTask(task, closeDiagFn) {

			if (task.Action.hasOwnProperty('execute') && angular.isFunction(task.Action.execute)) {
				return task.Action.execute(task);
			} else if (task.Action.IsGenericWizard) {
				var wizardId = basicsWorkflowActionEditorService.getEditorInput('GenericWizardInstanceId', task).value;
				var followTemplateId = basicsWorkflowActionEditorService.getEditorInput('WorkflowTemplateId', task).value;
				var genericWizardService = $injector.get('genericWizardService');
				return genericWizardService.getWizardInstanceById(wizardId).then(function(wizardConfig) {
					var config = genericWizardUseCaseConfigService.getUseCaseConfiguration(wizardConfig.Instance.WizardConfiGuuid);
					if (config && config.startEntity) {
						var entityId = basicsWorkflowActionEditorService.getEditorInput('EntityId', task).value;
						config[config.startEntity] = entityId;
						wizardConfig[config.startEntity] = entityId;
						wizardConfig.startEntity = config.startEntity;
						wizardConfig.followTemplateId = followTemplateId;

						//Adding default button as cancel to trigger cancel functionality when enter is pressed
						config.defaultButton = 'cancel';
						config.showCancelButton = true;
					}

					return genericWizardService.canActivate({ genWizConfig: wizardConfig }, task).then(function() {
						return genericWizardService.openWizard(_.merge({
							InstanceId: wizardId, task: task
						}, config));
					});
				});
			} else if (task.Action.IsModuleWizard) {
				let moduleWizardId = basicsWorkflowActionEditorService.getEditorInput('ModuleWizardInstanceId', task).value;
				let moduleId = basicsWorkflowActionEditorService.getEditorInput('ModuleId', task).value;
				let entity = basicsWorkflowActionEditorService.getEditorInput('Entity', task).value;
				let wizardGuid = basicsWorkflowActionEditorService.getEditorInput('WizardGuid', task).value;
				let moduleInternalName = basicsWorkflowActionEditorService.getEditorInput('ModuleInternalName', task).value;

				let wizardSidebarService = $injector.get('basicsConfigWizardSidebarService');
				wizardSidebarService.invokeModuleWizardRegister(moduleInternalName);
				let wizard = wizardSidebarService.getWizardSetupDataMap().get(wizardGuid);
				let wizardContextService = $injector.get('basicsWorkflowWizardContextService');
				wizardContextService.addContext({
					moduleWizardId: moduleWizardId,
					moduleId: moduleId,
					entity: JSON.parse(entity),
					wizardGuid: wizardGuid,
					moduleInternalName: moduleInternalName,
					resultPromise: null
				});
				return wizardSidebarService.invoke(wizard, { isTriggeredByWorkflow: true }).then(function(wizardEvent) {
					if (task.output[0].value) {
						_.set(task.Context, task.output[0].value, wizardContextService.getResultAndReset());
					}
					return { data: { context: task.Context }, cancel: wizardEvent ? wizardEvent.cancel : false };
				});
			} else {
				task = basicsWorkflowPreProcessorService.replacePropertyByInput('Description', 'title')(task);
				task = basicsWorkflowPreProcessorService.replacePropertyByInput('Comment', 'subtitle')(task);
				var title = _.find(task.input, { key: 'Title' });
				if (title) {
					title = title.value;
				}
				var subTitle = _.find(task.input, { key: 'Subtitle' });
				if (subTitle) {
					subTitle = subTitle.value;
				}
				var diagConfig = _.find(task.input, { key: 'DialogConfig' });
				if (diagConfig) {
					if (angular.isString(diagConfig.value)) {
						try {
							diagConfig = angular.fromJson(diagConfig.value);
						} catch (e) {
							diagConfig = {};
						}
					} else {
						diagConfig = diagConfig.value;
					}
				} else {
					diagConfig = {};
				}

				var modalOptions = {
					templateUrl: 'basics.workflow/clientActionDialog.html',
					backdrop: false,
					width: '285px',
					headerText: title ? title : task.Description,
					subHeaderText: subTitle ? subTitle : task.Comment,
					showOkButton: true,
					showCancelButton: true,
					showCloseButton: true,
					controller: ['$scope', '$modalInstance', '$q', 'basicsWorkflowCommonService', function basicsWorkflowModalController($scope, $modalInstance, $q, basicsWorkflowCommonService) {
						$scope.task = task;
						$scope.isModalDialog = true;
						$scope.isSidebar = false;
						$scope.modalOptions = modalOptions;
						$scope.onOk = function onOk() {
							var promises = _.map(basicsWorkflowCommonService.getFnList(), function(fn) {
								return fn();
							});
							$q.all(promises).then(function() {
								basicsWorkflowCommonService.clearFn();
								$modalInstance.close({
									data: {
										task: $scope.task, context: $scope.task.Context, result: $scope.task.Result || 'true'
									}
								});
							});
						};

						$scope.onCancel = function onCancel() {
							$modalInstance.close({
								data: {
									task: $scope.task, context: $scope.task.Context, result: false
								}, cancel: true
							});
						};

						$scope.onStop = function onTerminate() {
							$modalInstance.close({
								actionEvent: 'stop'
							});
						};
						if (angular.isFunction(closeDiagFn)) {
							var stop = $interval(function() {
								if (closeDiagFn()) {
									$modalInstance.close(false);
									$interval.cancel(stop);
								}
							}, 1500);
						}
						var cancelVisible = _.find($scope.task.input, { key: 'CancelVisible' });
						$scope.modalOptions.showCancelButton = isVisible(cancelVisible, true);

						var stopVisible = _.find($scope.task.input, { key: 'StopVisible' });
						$scope.modalOptions.showCloseButton = isVisible(stopVisible, false);

						function isVisible(expr, defValue) {
							return !!expr && !!expr.value ? $scope.$eval(expr.value) : defValue;
						}
					}]
				};
				modalOptions = _.merge(modalOptions, diagConfig);

				return platformDialogService.showDialog(modalOptions);
			}

		}

		return {
			getAllActions: getAllActions,
			getAction: getAction,
			addAction: addAction,
			executeTask: executeTask,
			actionEvent: actionEvent
		};
	}

	clientActionService.$inject = ['$q', '_', 'platformDialogService', 'basicsWorkflowPreProcessorService', '$interval', '$injector', 'genericWizardUseCaseConfigService', 'basicsWorkflowActionEditorService'];

	angular.module('basics.workflow').factory('basicsWorkflowClientActionService', clientActionService);

})(angular);