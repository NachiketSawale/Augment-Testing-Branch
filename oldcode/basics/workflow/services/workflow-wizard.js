/*globals angular */

(function (angular) {
	'use strict';

	var moduleName = 'basics.workflow';
	var runWorkflowWizardConfig = {
		serviceName: 'basicsWorkflowWizard',
		wizardGuid: 'b33407a3003f42e9b86f1f13616b47cb',
		methodName: 'runWizard',
		canActivate: true
	};

	var moduleMap = {};

	basicsWorkflowWizard.$inject = ['basicsWorkflowInstanceService', 'platformModuleStateService',
		'platformNavBarService', '$state', 'platformModalService', 'basicsWorkflowModuleUtilService', '$q', 'basicsWorkflowValidationService'];
	configWizard.$inject = ['basicsConfigWizardSidebarService'];
	angular.module(moduleName).factory(runWorkflowWizardConfig.serviceName, basicsWorkflowWizard)
		.run(configWizard);

	function configWizard(basicsConfigWizardSidebarService) {
		basicsConfigWizardSidebarService.registerWizard([
			runWorkflowWizardConfig
		]);

		_.each(globals.modules, function (m) {
			moduleMap[m.replace('.', '')] = m;
		});
	}

	function basicsWorkflowWizard(basicsWorkflowInstanceService, platformModuleStateService, platformNavBarService, $state, platformModalService, basicsWorkflowModuleUtilService, $q, basicsWorkflowValidationService) {
		var service = {};

		function runWizard(params) {
			var modalOptions = {
				templateUrl: globals.appBaseUrl + 'basics.workflow/templates/wizard-body-template.html',
				backdrop: false,
				controller: ['$scope', '$modalInstance', '$timeout', function ($scope, $modalInstance, $timeout) {
					$scope.close = $modalInstance.close;
					$scope.onOk = function onOk() {
						$modalInstance.close(true);
					};
					$scope.message = [];//'started';
					var promisList = [];

					var idList = basicsWorkflowModuleUtilService.getCurrentSelectedList(params.GridUuid);
					if (params.TemplateId) {
						if (_.isEmpty(idList)) {
							startWorkflowForItem();
						} else if (params.StartOneWorkflowForAllSelectedEntites === '1' || params.StartOneWorkflowForAllSelectedEntites === 'true') {
							startWorkflowForItem(); 										//start One Workflow Bulk/Selected Entites
						} else {
							_.forEach(idList, startWorkflowForItem);
						}

						$q.all(promisList).then(function (responeList) {
							var failed = _.filter(responeList, function (r) {
								return r.Status !== 2 && r.Status !== 4;
							});
							if (failed.length === 0) {
								$timeout($scope.close, 2000);
								if (!basicsWorkflowValidationService.evaluateDisableRefresh(responeList)) {
									basicsWorkflowModuleUtilService.refreshCurrentSelection();
								}
							}
						});
					} else {
						$scope.message.push({ message: 'basics.workflow.wizard.statusText.missingTemplate' });
					}

					function startWorkflowForItem(item) {

						var booleanStartOneWorkflowForAllSelectedEntites = !params.StartOneWorkflowForAllSelectedEntites || params.StartOneWorkflowForAllSelectedEntites === '0' || params.StartOneWorkflowForAllSelectedEntites === 'false';

						function startWorkflowParametersValue() {
							if (booleanStartOneWorkflowForAllSelectedEntites) {
								return {																//start One Workflow Bulk/Selected Entites
									templateId: params.TemplateId,
									itemEntityId: item,
									context: params.Context
								};
							} else {
								return {																//start One Workflow One Entity
									templateId: params.TemplateId,
									itemEntityId: '0',
									context: angular.toJson({ EntityIdList: idList })
								};
							}
						}

						// var startedMessage = booleanStartOneWorkflowForAllSelectedEntites ? { Id: item, message: 'started' } : {Id: idList, message: 'one workflow for selected (' + idList.length.toString() + ') entites has started'};
						var startedMessage = booleanStartOneWorkflowForAllSelectedEntites ? {
							Id: item,
							message: 'started'
						} : {
							Id: idList.length.toString(),
							message: 'one workflow for selected (' + idList.length.toString() + ') entites has started'
						};
						var entityForMessage = booleanStartOneWorkflowForAllSelectedEntites ? { Id: item } : { Id: idList };
						$scope.message.push(startedMessage);

						var paramValues = startWorkflowParametersValue();
						promisList.push(basicsWorkflowInstanceService.startWorkflow(paramValues.templateId, paramValues.itemEntityId, paramValues.context).then(function (response) {
							var messageItem = !paramValues.context ? _.find($scope.message, entityForMessage) : _.find($scope.message, entityForMessage.length);
							messageItem.message = 'basics.workflow.wizard.statusText.' + response.Status;
							if (response.Status !== 2 && response.Status !== 4) {
								var context = angular.fromJson(response.Context);
								if (context.hasOwnProperty('Exception') || context.hasOwnProperty('ValidationException')) {
									messageItem.error = '';
									var exception = context.Exception || context.ValidationException;
									if (!_.isNil(exception.Message)) {
										messageItem.error += exception.Message;
									}
									if (exception.hasOwnProperty('ErrorMessage')) {
										if (messageItem.error.length === 0) {
											messageItem.error += exception.ErrorMessage;
										} else {
											messageItem.error += ' (' + exception.ErrorMessage + ')';
										}
									}
								} else {
									messageItem.error = 'An unexpected error occurred!';
								}
							}
							return response;

						}, function (response) {
							var messageItem = !paramValues.context ? _.find($scope.message, entityForMessage) : _.find($scope.message, entityForMessage.length);
							messageItem.message = response;
							return response;
						}));
					}
				}]
			};

			platformModalService.showDialog(modalOptions);
		}

		service[runWorkflowWizardConfig.methodName] = runWizard;
		return service;
	}

})(angular);
